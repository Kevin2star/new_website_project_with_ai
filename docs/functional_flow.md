# Functional Flow – Data Binding 구현 흐름

**역할**: Senior Full-stack Solution Architect  
**목적**: 데이터 흐름 중심의 실전 로직 구현(Data Binding) 단계 가이드.  
화면 단위가 아니라 **「테이블 페칭 → 상태 관리 → UI 바인딩」** 순서로 쪼개어,  
컨펌하며 단계별 개발을 진행할 수 있도록 번호를 매겨 정리한다.

**원칙**: 데이터 변경은 **Server Actions** 우선. API 라우트는 외부 연동·legacy용으로 한정.

---

## Phase 1: Foundation  
*(공통 유틸리티 및 기본 데이터 연결)*

**관련 패키지**: `@supabase/supabase-js`, `@supabase/ssr`, `zod` (validation)

| # | 데이터 흐름 | 기술적 상세 |
|---|-------------|-------------|
| **1.1** | **Supabase 클라이언트 구성** | `@supabase/supabase-js` + `@supabase/ssr` 설치. `lib/supabase/client.ts`: 브라우저용 `createBrowserClient` (NEXT_PUBLIC_*). `lib/supabase/server.ts`: 서버용 `createServerClient` (cookies, RSC / Server Actions). `lib/supabase/middleware.ts`: 미들웨어용 `createServerClient` (세션 갱신·인증 체크). Next.js App Router는 쿠키 기반 세션 사용. `types/database.ts`의 `Database` 제네릭으로 타입 연동. |
| **1.2** | **환경 변수 및 설정** | `.env.example` 확장 검토, `lib/constants/config.ts`에 `NEXT_PUBLIC_APP_URL`, Supabase URL/Anon Key 참조용 상수(옵션) 정의. AI Provider 키(OPENAI_API_KEY / GOOGLE_AI_API_KEY)는 서버 전용으로만 사용. |
| **1.3** | **라우트 상수** | `lib/constants/routes.ts`에 `/`, `/login`, `/products`, `/products/:id`, `/inquiry`, `/my-page` 등 Phase 1 라우트 상수 정의. 링크/리다이렉트에서 일관 사용. |
| **1.4** | **Row ↔ Domain 변환 유틸** | `lib/utils/map-db-to-domain.ts`(또는 `format` 확장): `UserRow`→`User`, `ProductRow`→`Product`, `InquiryRow`→`Inquiry` / `InquiryListItem` (snake_case→camelCase, `preview` 생성). Server Components·Actions에서 DB 결과 변환 시 재사용. |
| **1.5** | **유효성 검사 유틸** | `lib/utils/validation.ts`: zod 스키마 (문의 `content` 길이/형식, `product_id` UUID 등). Server Actions 입력 검증 및 API 검증에 사용. |
| **1.6** | **포맷 유틸** | `lib/utils/format.ts`: 날짜 포맷(`created_at`→로케일 표시), `content` truncate(미리보기용). 마이페이지·문의 목록 UI에서 사용. |

---

## Phase 2: Core Logic  
*(주요 비즈니스 기능의 Read/Write)*

| # | 데이터 흐름 | 기술적 상세 |
|---|-------------|-------------|
| **2.1** | **Google OAuth 로그인 → Auth 세션** | Login 페이지(`app/(auth)/login/page.tsx`): `'use client'`. `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: callbackUrl })` 호출. Supabase Dashboard에서 Google Provider 설정, Redirect URL에 `NEXT_PUBLIC_APP_URL/api/auth/callback` 등록. |
| **2.2** | **OAuth 콜백 → User upsert** | `app/api/auth/callback/route.ts`: GET. `createServerClient`(middleware 패턴)로 `code` 교환 후 `getUser()`. `users` 테이블 upsert (id=`auth.uid()`, google_id, email, name). **Service Role** 또는 서버 전용 클라이언트로 INSERT/ON CONFLICT UPDATE (RLS bypass). upsert 후 `/` 또는 `/products`로 redirect. |
| **2.3** | **미들웨어 세션 갱신 및 보호 라우팅** | `middleware.ts`(루트): `createServerClient`로 세션 갱신. `/my-page` 등 인증 필요 라우트는 `getUser()` 없으면 `/login` redirect. `/login`, `/api/auth/callback`은 보호 제외. |
| **2.4** | **products 테이블 페칭 → 목록** | **Read**: `app/actions/products.ts`의 `getProducts()`. Server Action에서 `createServerClient`(서버)로 `from('products').select('*').order('created_at', { ascending: false })`. RLS `products_select_authenticated` 적용. Row→Domain 변환 후 `Product[]` 반환. |
| **2.5** | **products 데이터 → 제품 리스트 페이지 바인딩** | `app/products/page.tsx`: RSC. `getProducts()` 호출 후 `ProductList`/`ProductGrid`에 props 전달. `components/domain/product/product-list.tsx`, `product-card.tsx`에서 name, category, summary 등 바인딩. 로딩은 `loading.tsx` 또는 Suspense. |
| **2.6** | **products 단건 페칭 → 상세** | `app/actions/products.ts`의 `getProductById(id)`. `from('products').select('*').eq('id', id).single()`. 없으면 null. `app/products/[id]/page.tsx`: RSC에서 `getProductById` 호출, `notFound()` 또는 `ProductDetail` 바인딩. 문의하기 링크 `/inquiry?product=:id`. |
| **2.7** | **inquiry 생성 (INSERT)** | `app/actions/inquiries.ts`의 `createInquiry({ productId, content })`. Server Action. `getUser()`로 `user_id` 확보, `product_id` 존재 여부 검증(products select). zod로 `content` 검증. `from('inquiries').insert({ user_id, product_id, content, ai_response: null })`. RLS `inquiries_insert_own`. 생성된 `id` 반환. |
| **2.8** | **AI 응답 생성** | `lib/ai/client.ts`: `generateInquiryResponse(content, productContext)`. OpenAI 또는 Gemini API 호출 (서버 전용, API 키 env). `app/actions/ai.ts`: Server Action `generateAIResponse(content, productId)`에서 제품 요약 등 컨텍스트 조회 후 AI 클라이언트 호출, 텍스트 반환. |
| **2.9** | **inquiry 업데이트 (ai_response 저장)** | `app/actions/inquiries.ts`의 `updateInquiryAiResponse(id, aiResponse)`. `from('inquiries').update({ ai_response }).eq('id', id).eq('user_id', auth.uid())`. RLS `inquiries_update_own`. 실패 시 UI에서 재시도 가능하도록 id 유지. |
| **2.10** | **문의 플로우 오케스트레이션** | 전용 Server Action `submitInquiry({ productId, content })`. **FLOW 고정 순서**: (1) `createInquiry` → DB INSERT (ai_response=null) → id 반환, (2) `generateAIResponse(content, productContext)` 호출, (3) 성공 시 `updateInquiryAiResponse(id, aiResponse)` → DB UPDATE. (2) 실패 시에도 (1) Inquiry는 유지; UI에서 재시도 시 동일 id로 (2)(3)만 재실행. 반환: `{ id, aiResponse }` | `{ id, error }`. |
| **2.11** | **문의 작성 폼 → 제출 → 결과 바인딩** | `app/inquiry/page.tsx`: `product` query로 productId 확보. `InquiryForm`(client): 입력·제출 시 `submitInquiry` Server Action 호출. 로딩/성공/실패 상태 관리. 성공 시 `AiResponse`에 `aiResponse` 바인딩; 실패 시 에러 메시지 + 재시도(동일 id로 update). |
| **2.12** | **inquiries 목록 페칭 (본인)** | `app/actions/inquiries.ts`의 `getMyInquiries()`. `from('inquiries').select('*').eq('user_id', auth.uid()).order('created_at', { ascending: false })`. Row→`InquiryListItem` (preview truncate). RLS `inquiries_select_own`. |
| **2.13** | **마이페이지 목록 바인딩** | `app/(dashboard)/my-page/page.tsx`: 로그인 필수. 데이터 소스: (A) RSC에서 `getMyInquiries()` 후 props로 전달, 또는 (B) client에서 `useInquiries` 훅으로 fetch. (A) 우선 권장. `InquiryList` / `InquiryItem`에 바인딩, product 링크, 날짜, preview, 삭제 액션. |
| **2.14** | **inquiry 삭제** | `app/actions/inquiries.ts`의 `deleteInquiry(id)`. `from('inquiries').delete().eq('id', id).eq('user_id', auth.uid())`. RLS `inquiries_delete_own`. 반환: 성공/실패. |
| **2.15** | **마이페이지 삭제 액션 연동** | `InquiryItem`(또는 리스트)에서 삭제 버튼 → `AlertDialog` 확인 후 `deleteInquiry(id)` 호출. 성공 시 목록에서 제거(optimistic update 또는 `getMyInquiries` 재호출). |

---

## Phase 3: Interaction & Feedback  
*(상태 변경, 알림, 에러 핸들링)*

| # | 데이터 흐름 | 기술적 상세 |
|---|-------------|-------------|
| **3.1** | **인증 상태 공유** | `hooks/use-auth.ts`: `lib/supabase/client`(브라우저)로 `auth.getUser()` / `onAuthStateChange` 구독. `AuthProvider`에서 세션·유저 노출. Header 로그인/로그아웃, `UserMenu` 바인딩. |
| **3.2** | **제품 리스트 로딩/에러/빈 상태** | `app/products/page.tsx` 또는 `ProductList`: 로딩 시 `loading.tsx` / Suspense fallback(스켈레톤). `getProducts()` throw 시 `error.tsx` 포획. 빈 배열이면 "등록된 제품이 없습니다" + CTA. |
| **3.3** | **제품 상세 로딩/404** | `app/products/[id]/page.tsx`: `getProductById` null → `notFound()`. `loading.tsx`로 로딩 UI. |
| **3.4** | **문의 폼 로딩/에러/재시도** | `InquiryForm`: 제출 중 비활성화·스피너. AI 실패 시 에러 배너 + "재시도" 버튼. 재시도: `retryInquiryAI(id)` 등으로 (2) `generateAIResponse` + (3) `updateInquiryAiResponse` 순 호출(문의 content/product는 서버에서 id로 조회). 유효성 에러(긴 content 등)는 폼 필드 아래 메시지 표시. |
| **3.5** | **마이페이지 로딩/빈 목록/삭제 확인** | 목록 fetch 중 스켈레톤. 빈 목록: "아직 문의가 없습니다" + 제품 탐색 CTA. 삭제 시 `AlertDialog`로 확인, 삭제 후 목록 갱신 또는 로컬 상태에서 제거. |
| **3.6** | **대시보드 라우트 인증 체크** | `(dashboard)/layout`: 미들웨어에서 이미 `/my-page` 보호. 추가로 layout 내에서 `getUser()` 없으면 redirect 하는 선택 로직 가능. |
| **3.7** | **API 라우트 정리 (선택)** | Phase 1은 Server Actions 우선. `app/api/products`, `inquiries`, `ai` 등은 legacy 또는 외부 연동용으로 유지 시, 내부적으로 동일한 Supabase·AI 로직 재사용. 사용처 없으면 제거 또는 "TODO" 유지. |

---

## 구현 우선순위 요약

1. **Phase 1**  
   1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6  
   (Supabase·설정·라우트·변환·검증·포맷)

2. **Phase 2**  
   2.1 → 2.2 → 2.3 (Auth) → 2.4 → 2.5 → 2.6 (Products) → 2.7 → 2.8 → 2.9 → 2.10 (Inquiry+AI) → 2.11 (문의 페이지) → 2.12 → 2.13 → 2.14 → 2.15 (마이페이지)

3. **Phase 3**  
   3.1 (Auth UI) → 3.2 → 3.3 (Products feedback) → 3.4 (문의 폼 feedback) → 3.5 (마이페이지 feedback) → 3.6 → 3.7

---

## 체크리스트 (컨펌용)

- [ ] **1.1** Supabase 클라이언트 (client / server / middleware)
- [ ] **1.2** 환경 변수·config
- [ ] **1.3** 라우트 상수
- [ ] **1.4** Row ↔ Domain 변환
- [ ] **1.5** Validation (zod)
- [ ] **1.6** Format 유틸
- [ ] **2.1** Google OAuth 로그인
- [ ] **2.2** OAuth 콜백 → User upsert
- [ ] **2.3** 미들웨어 세션·보호
- [ ] **2.4** Products fetch (목록)
- [ ] **2.5** 제품 리스트 페이지 바인딩
- [ ] **2.6** Product 단건 fetch → 상세 바인딩
- [ ] **2.7** Inquiry INSERT
- [ ] **2.8** AI 응답 생성
- [ ] **2.9** Inquiry UPDATE (ai_response)
- [ ] **2.10** 문의 플로우 오케스트레이션
- [ ] **2.11** 문의 폼 → 제출 → 결과 바인딩
- [ ] **2.12** My inquiries fetch
- [ ] **2.13** 마이페이지 목록 바인딩
- [ ] **2.14** Inquiry DELETE
- [ ] **2.15** 마이페이지 삭제 연동
- [ ] **3.1** Auth 상태·Header/UserMenu
- [ ] **3.2** 제품 리스트 로딩/에러/빈 상태
- [ ] **3.3** 제품 상세 로딩/404
- [ ] **3.4** 문의 폼 로딩/에러/재시도
- [ ] **3.5** 마이페이지 로딩/빈/삭제 확인
- [ ] **3.6** 대시보드 인증 체크
- [ ] **3.7** API 라우트 정리 (선택)

---

## 구현 체크리스트 (상세)

각 항목별 **수정/추가할 파일**, **구현 포인트**, **검증 방법**을 정리한다.  
개발 시 체크하며 진행하고, 완료 후 해당 줄을 `- [x]`로 변경한다.

### Phase 1: Foundation

| # | 구현 항목 | 수정/추가 파일 | 구현 포인트 | 검증 |
|---|-----------|----------------|-------------|------|
| **1.1** | Supabase 클라이언트 | `package.json`, `lib/supabase/client.ts`, `server.ts`, `middleware.ts` | `pnpm add @supabase/supabase-js @supabase/ssr`. client: `createBrowserClient` + env. server: `createServerClient`(cookies). middleware: 동일 패턴, `getUser`/세션 갱신. `Database` 제네릭 적용. | 브라우저·서버에서 각각 import 시 에러 없음. middleware에서 `getUser` 호출 가능. |
| **1.2** | 환경 변수·config | `.env.example`, `lib/constants/config.ts` | `NEXT_PUBLIC_APP_URL`, Supabase URL/Key, AI 키 변수 문서화. config에서 필요 시 참조(옵션). | `config` import 시 에러 없음. `.env.local`에 값 설정 시 `process.env` 접근 확인. |
| **1.3** | 라우트 상수 | `lib/constants/routes.ts` | `HOME`, `LOGIN`, `PRODUCTS`, `PRODUCT(id)`, `INQUIRY(productId)`, `MY_PAGE` 등 상수 export. | `Link`/`redirect`에서 `routes.*` 사용 시 동작·타입 확인. |
| **1.4** | Row ↔ Domain 변환 | `lib/utils/map-db-to-domain.ts` 또는 `format` 확장 | `toUser`, `toProduct`, `toInquiry`, `toInquiryListItem`(preview truncate). `*Row` → domain 타입. | 단위 테스트 또는 Action에서 변환 후 `Product` 등 타입 일치 확인. |
| **1.5** | Validation (zod) | `lib/utils/validation.ts`, `package.json` | `pnpm add zod`. `inquiryContentSchema`, `uuidSchema` 등 정의. `parse`/`safeParse`로 검증. | `content` 길이 초과 등으로 `safeParse` 실패 시 에러 폼 반환 확인. |
| **1.6** | Format 유틸 | `lib/utils/format.ts` | `formatDate(iso)`, `truncateForPreview(text, len)`. | 마이페이지·문의 목록 등에서 날짜·preview 출력 확인. |

### Phase 2: Core Logic

| # | 구현 항목 | 수정/추가 파일 | 구현 포인트 | 검증 |
|---|-----------|----------------|-------------|------|
| **2.1** | Google OAuth 로그인 | `app/(auth)/login/page.tsx` | `signInWithOAuth({ provider: 'google', options: { redirectTo } })`. callback URL = `APP_URL/api/auth/callback`. | 로그인 클릭 시 Google consent 화면으로 이동. |
| **2.2** | OAuth 콜백 → User upsert | `app/api/auth/callback/route.ts` | `createServerClient`로 `exchangeCodeForSession`. `getUser()` 후 `users` upsert (id=uid, google_id, email, name). Service Role로 RLS bypass. redirect `/` or `/products`. | 로그인 완료 후 `users` 테이블에 해당 유저 존재. 앱으로 redirect. |
| **2.3** | 미들웨어 세션·보호 | `middleware.ts` (루트) | `createServerClient`로 쿠키 기반 세션 갱신. `/my-page` 등에서 `getUser()` 없으면 `redirect('/login')`. `/login`, `/api/auth/callback` 제외. | 비로그인 시 `/my-page` 접근 → `/login` redirect. |
| **2.4** | Products fetch (목록) | `app/actions/products.ts` | `getProducts()`: `from('products').select('*').order('created_at', { ascending: false })`. Row→Domain 변환 후 `Product[]` 반환. | 로그인 후 제품 목록 Action 호출 시 배열 반환. |
| **2.5** | 제품 리스트 바인딩 | `app/products/page.tsx`, `product-list.tsx`, `product-card.tsx` | RSC에서 `getProducts()` 호출. `ProductList`/`ProductCard`에 props 전달. name, category, summary 표시. `loading.tsx` 또는 Suspense. | `/products`에서 카드 목록 렌더, 로딩 시 스켈레톤. |
| **2.6** | Product 단건 → 상세 | `app/actions/products.ts`, `app/products/[id]/page.tsx`, `product-detail.tsx` | `getProductById(id)`. `single()`. null이면 `notFound()`. `ProductDetail` 바인딩. 문의하기 `Link` → `/inquiry?product=:id`. | `/products/[id]` 접근 시 상세 렌더, 없으면 404. 문의하기 링크 동작. |
| **2.7** | Inquiry INSERT | `app/actions/inquiries.ts` | `createInquiry`: `getUser()`, product 존재 검증, zod `content` 검증. `insert({ user_id, product_id, content, ai_response: null })`. `id` 반환. | 문의 전용 테스트로 insert 후 `inquiries`에 행 추가 확인. |
| **2.8** | AI 응답 생성 | `lib/ai/client.ts`, `app/actions/ai.ts` | `generateInquiryResponse(content, productContext)`. OpenAI/Gemini 호출. `generateAIResponse(content, productId)` Action에서 제품 조회 후 AI 호출. | Mock 또는 실제 키로 Action 호출 시 문자열 반환. |
| **2.9** | Inquiry UPDATE (ai_response) | `app/actions/inquiries.ts` | `updateInquiryAiResponse(id, aiResponse)`. `update({ ai_response }).eq('id', id).eq('user_id', uid)`. | 기존 inquiry에 `ai_response` 저장 후 DB 확인. |
| **2.10** | 문의 플로우 오케스트레이션 | `app/actions/inquiries.ts` 또는 `ai.ts` | `submitInquiry`: (1) `createInquiry` → id, (2) `generateAIResponse`, (3) 성공 시 `updateInquiryAiResponse`. 실패 시 `{ id, error }` 반환. | 문의 제출 → DB에 inquiry 생성 + ai_response 저장. 실패 시 id 유지. |
| **2.11** | 문의 폼 → 제출 → 결과 바인딩 | `app/inquiry/page.tsx`, `inquiry-form.tsx`, `ai-response.tsx` | `searchParams.product`로 productId. `InquiryForm`: `submitInquiry` 호출, 로딩/성공/실패 상태. 성공 시 `AiResponse`에 표시. | 폼 제출 후 AI 응답 표시, 실패 시 에러 메시지. |
| **2.12** | My inquiries fetch | `app/actions/inquiries.ts` | `getMyInquiries()`: `eq('user_id', auth.uid())`, `order('created_at', { ascending: false })`. Row→`InquiryListItem`. | 로그인 유저 기준 목록 반환, preview 포함. |
| **2.13** | 마이페이지 목록 바인딩 | `app/(dashboard)/my-page/page.tsx`, `inquiry-list.tsx`, `inquiry-item.tsx` | RSC에서 `getMyInquiries()` 후 `InquiryList`/`InquiryItem`에 전달. product 링크, 날짜, preview, 삭제 버튼. | `/my-page`에서 본인 문의 목록 표시. |
| **2.14** | Inquiry DELETE | `app/actions/inquiries.ts` | `deleteInquiry(id)`: `delete().eq('id', id).eq('user_id', uid)`. 성공/실패 반환. | 본인 문의 삭제 후 DB에서 제거. 타인 문의 삭제 불가. |
| **2.15** | 마이페이지 삭제 연동 | `inquiry-item.tsx`, `AlertDialog` | 삭제 버튼 → `AlertDialog` 확인 → `deleteInquiry(id)`. 성공 시 목록에서 제거 또는 재fetch. | 삭제 확인 후 목록에서 사라짐. |

### Phase 3: Interaction & Feedback

| # | 구현 항목 | 수정/추가 파일 | 구현 포인트 | 검증 |
|---|-----------|----------------|-------------|------|
| **3.1** | Auth 상태·Header/UserMenu | `hooks/use-auth.ts`, `auth-provider.tsx`, `Header`, `user-menu.tsx`, `login-button.tsx` | `getUser` / `onAuthStateChange` 구독. Provider로 세션·유저 제공. Header에 로그인/로그아웃, `UserMenu` 바인딩. | 로그인 여부에 따라 버튼/메뉴 전환. |
| **3.2** | 제품 리스트 로딩/에러/빈 상태 | `app/products/page.tsx`, `loading.tsx`, `error.tsx`, `product-list` 등 | Suspense fallback·`loading.tsx` 스켈레톤. `getProducts` throw 시 `error.tsx`. 빈 배열 시 "등록된 제품이 없습니다" + CTA. | 로딩/에러/빈 상태 각각 확인. |
| **3.3** | 제품 상세 로딩/404 | `app/products/[id]/page.tsx`, `loading.tsx` | `getProductById` null → `notFound()`. `loading.tsx` 존재. | 존재하지 않는 id → 404. 로딩 시 스켈레톤. |
| **3.4** | 문의 폼 로딩/에러/재시도 | `inquiry-form.tsx` | 제출 중 비활성화·스피너. AI 실패 시 에러 배너 + "재시도". `retryInquiryAI(id)` 구현. 필드별 유효성 에러 표시. | 제출 중 UI 비활성화. 실패 후 재시도로 복구. |
| **3.5** | 마이페이지 로딩/빈/삭제 확인 | `my-page/page.tsx`, `inquiry-list` 등 | 목록 로딩 스켈레톤. 빈 목록: "아직 문의가 없습니다" + CTA. 삭제 `AlertDialog` 확인 후 실행. | 빈 목록·삭제 확인 플로우 확인. |
| **3.6** | 대시보드 인증 체크 | `(dashboard)/layout.tsx` | 미들웨어로 이미 보호. 필요 시 layout 내 `getUser()` 체크 후 redirect. | 비로그인 시 `/my-page` 접근 차단. |
| **3.7** | API 라우트 정리 (선택) | `app/api/products`, `inquiries`, `ai` 등 | Server Actions 사용 시 API는 제거 또는 내부 로직 재사용. | 사용하지 않는 API 제거 또는 TODO 유지. |

### 구현 체크리스트 (체크박스)

```
Phase 1
- [ ] 1.1 Supabase client/server/middleware 구현 및 검증
- [ ] 1.2 env·config 구현 및 검증
- [ ] 1.3 routes 상수 구현 및 검증
- [ ] 1.4 Row↔Domain 변환 구현 및 검증
- [ ] 1.5 zod validation 구현 및 검증
- [ ] 1.6 format 유틸 구현 및 검증

Phase 2
- [ ] 2.1 Google OAuth 로그인 구현 및 검증
- [ ] 2.2 OAuth 콜백 → User upsert 구현 및 검증
- [ ] 2.3 미들웨어 세션·보호 구현 및 검증
- [ ] 2.4 getProducts 구현 및 검증
- [ ] 2.5 제품 리스트 페이지 바인딩 구현 및 검증
- [ ] 2.6 getProductById·상세 바인딩 구현 및 검증
- [ ] 2.7 createInquiry 구현 및 검증
- [ ] 2.8 AI 응답 생성 구현 및 검증
- [ ] 2.9 updateInquiryAiResponse 구현 및 검증
- [ ] 2.10 submitInquiry 오케스트레이션 구현 및 검증
- [ ] 2.11 문의 폼·제출·결과 바인딩 구현 및 검증
- [ ] 2.12 getMyInquiries 구현 및 검증
- [ ] 2.13 마이페이지 목록 바인딩 구현 및 검증
- [ ] 2.14 deleteInquiry 구현 및 검증
- [ ] 2.15 마이페이지 삭제 연동 구현 및 검증

Phase 3
- [ ] 3.1 use-auth·AuthProvider·Header/UserMenu 구현 및 검증
- [ ] 3.2 제품 리스트 로딩/에러/빈 상태 구현 및 검증
- [ ] 3.3 제품 상세 로딩/404 구현 및 검증
- [ ] 3.4 문의 폼 로딩/에러/재시도 구현 및 검증
- [ ] 3.5 마이페이지 로딩/빈/삭제 확인 구현 및 검증
- [ ] 3.6 대시보드 인증 체크 구현 및 검증
- [ ] 3.7 API 라우트 정리 (선택) 구현 및 검증
```

---

**참조**: PRD(`docs/PRD.md`), FLOW(`docs/FLOW.md`), DB 스키마(`docs/db-schema.md`), 마이그레이션(`supabase/migrations/0001_initial_schema_rls.sql`), 시드(`docs/seed_data.sql`).
