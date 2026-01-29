# DY Carbon Phase 1 — 구현 로드맵 (Step-by-Step)

**목적**: PRD·FLOW·기존 문서/소스 분석을 바탕으로, **Supabase SDK** 및 **Google OAuth** 중심의 실제 구현 단계를 정리한 로드맵.

**기준 문서**: `docs/PRD.md`, `docs/FLOW.md`, `supabase/migrations/0001_initial_schema_rls.sql`, `types/*`, `lib/supabase/*`, `app/api/auth/callback`, `app/(auth)/login`, `.env.example`

---

## 0. 현재 상태 요약

| 영역 | 상태 | 비고 |
|------|------|------|
| Supabase 패키지 | 미설치 | `@supabase/supabase-js`, `@supabase/ssr` 필요 |
| `lib/supabase/*` | 스텁 | `client.ts`, `server.ts`, `middleware.ts` 구현 없음 |
| Google OAuth | 미구현 | 로그인 페이지는 UI만, `setTimeout` 모의 |
| `/api/auth/callback` | TODO | 리다이렉트만, Supabase 연동 없음 |
| 인증 훅/Provider | 스텁 | `use-auth`, `auth-provider`, `login-button` 비어 있음 |
| Products/Inquiries API | TODO | 빈 응답 반환 |
| Server Actions | 스텁 | `auth`, `products`, `inquiries`, `ai` 미구현 |
| Middleware | `proxy.ts`만 사용 | `middleware.ts` 없음, 세션 갱신 미적용 |
| DB | 마이그레이션·타입 완료 | `users`(id=auth.uid), `products`, `inquiries`, RLS 적용 |

**RLS 핵심**: `users.id = auth.uid()` 사용. OAuth 콜백에서 `public.users` upsert 시 **동일 ID**로 저장해야 함. `users` INSERT/UPDATE는 서비스 역할로 수행(RLS bypass).

---

## Phase 0: 환경 준비

### Step 0.1 패키지 설치

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- `@supabase/supabase-js`: Supabase 클라이언트 및 Auth API.
- `@supabase/ssr`: Next.js App Router용 **쿠키 기반 세션** (Server/Middleware/Route Handler). `auth-helpers-nextjs` 대체 패키지.

### Step 0.2 환경 변수

`.env.local`에 다음 설정 (`.env.example`과 동일):

```env
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `NEXT_PUBLIC_APP_URL`: OAuth `redirectTo` 및 콜백 URL base로 사용.

### Step 0.3 Supabase Dashboard 설정

1. **Authentication → Providers → Google**
   - Enable.
   - Google Cloud Console에서 OAuth 2.0 Client ID/Secret 발급.
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`

2. **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:3000` (개발) / 프로덕션 도메인.
   - **Redirect URLs**:  
     `http://localhost:3000/**`, `https://<production>/**`  
     (콜백 전용 경로 `/api/auth/callback` 포함하도록 와일드카드 허용)

---

## Phase 1: Supabase 클라이언트 계층

### Step 1.1 브라우저 클라이언트 — `lib/supabase/client.ts`

- `@supabase/ssr`의 `createBrowserClient` 사용.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 전달.
- `createBrowserClient`는 **쿠키를 사용하지 않음**. 브라우저에서 로그인/로그아웃·세션 조회용.

```ts
// createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### Step 1.2 서버 클라이언트 — `lib/supabase/server.ts`

- `createServerClient` 사용.
- `cookies()` from `next/headers`로 쿠키 읽기/쓰기.
- Server Components, Server Actions, Route Handlers에서 사용.
- **`Database` 제네릭** 적용해 `types/database` 타입 연동.

### Step 1.3 서비스 역할 클라이언트 (서버 전용)

- **옵션 A**: `lib/supabase/server.ts` 내 `createServerClient`와 별도로, `SUPABASE_SERVICE_ROLE_KEY`로 생성하는 **admin 클라이언트** 함수 export.
- **옵션 B**: `/api/auth/callback` 내부에서만 `createClient(url, service_role_key)` 사용.

**용도**: `public.users` upsert. RLS가 `users` INSERT/UPDATE를 막으므로 서비스 역할로 bypass.

### Step 1.4 미들웨어 클라이언트 — `lib/supabase/middleware.ts`

- `createServerClient` 사용.
- `NextRequest`/`NextResponse`로 쿠키 접근.
- **세션 갱신** 목적 (토큰 리프레시).  
  Supabase 권장: 매 요청마다 `supabase.auth.getUser()` 호출 후 쿠키 업데이트.

---

## Phase 2: Google OAuth 플로우

### Step 2.1 로그인 페이지 — `app/(auth)/login/page.tsx`

1. `createBrowserClient()`로 Supabase 인스턴스 생성.
2. **Google 로그인**:  
   `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/api/auth/callback` } })`  
   - `origin`: `window.location.origin` 또는 `process.env.NEXT_PUBLIC_APP_URL`.
3. `redirectTo`가 **앱 도메인** (`/api/auth/callback`)이어야 Supabase가 PKCE 후 해당 URL로 리다이렉트.
4. 로딩 중 버튼 비활성화, 에러 시 사용자 안내 (예: 토스트/배너).

### Step 2.2 OAuth 콜백 — `app/api/auth/callback/route.ts`

1. **Route Handler**에서 `createServerClient`(또는 `@supabase/ssr`의 Route Handler용 헬퍼)로 **코드 교환 + 쿠키 설정**.
   - `GET` 요청의 `request.url`에 `?code=...` 포함 (PKCE).
   - `supabase.auth.exchangeCodeForSession(code)` 호출 후 쿠키에 세션 저장.
2. **에러 처리**: 교환 실패 시 `/login?error=...` 등으로 리다이렉트, 로그 출력.
3. **`public.users` upsert** (서비스 역할 클라이언트):
   - `id`: `session.user.id` (즉 `auth.uid()`와 동일).
   - `google_id`: `session.user.app_metadata.provider_id` 또는 `user.identities?.[0]?.id` (Google `sub`).
   - `email`: `session.user.email` (nullable).
   - `name`: `session.user.user_metadata?.full_name` ?? `user_metadata?.name` (nullable).
   - `ON CONFLICT (google_id) DO UPDATE` 또는 `(id)` 기준 upsert (스키마에 맞게).
4. upsert 후 **리다이렉트**: `/` 또는 `/products` (FLOW: 로그인 완료 → 제품 리스트 등).

### Step 2.3 로그아웃

- **클라이언트**: `createBrowserClient().auth.signOut()`.
- **서버에서 로그아웃** 필요 시: 서버용 클라이언트로 `signOut` 후 쿠키 삭제 처리 (헬퍼 참고).

---

## Phase 3: 미들웨어 및 세션 갱신

### Step 3.1 `middleware.ts` 추가 및 `proxy` 정리

- **파일**: 프로젝트 루트 `middleware.ts` (Next.js 규칙).
- `lib/supabase/middleware`에서 `createServerClient`로 인스턴스 생성.
- 매 요청:
  1. `supabase.auth.getUser()` 호출.
  2. 필요 시 토큰 갱신 후 **쿠키 업데이트** (`NextResponse`에 set).
- **Matcher**:  
  `/((?!api|_next/static|_next/image|favicon.ico).*)`  
  (기존 `proxy` config와 동일해도 무방. API 중 `/api/auth/callback`은 Supabase가 리다이렉트하는 대상이므로 보통 matcher에서 제외하지 않아도 됨. 필요 시 예외 추가.)

### Step 3.2 보호 라우트 (선택)

- **대상**: `/my-page`, `/inquiry` (FLOW: 로그인 사용자만 접근).
- **방법**:  
  - middleware에서 `getUser()` 결과가 없으면 `/login`으로 리다이렉트,  
  - 또는 `app/(dashboard)/layout.tsx`에서 서버 클라이언트로 세션 체크 후 `redirect('/login')` (현재 TODO 상태).
- **공개 유지**: `/`, `/products`, `/products/[id]`, `/login`.

---

## Phase 4: 인증 상태 UI 연동

### Step 4.1 `useAuth` 훅 — `hooks/use-auth.ts`

- `createBrowserClient()`로 `supabase` 생성.
- `supabase.auth.onAuthStateChange` 또는 `getSession()`으로 `user` / `session` 구독.
- 반환: `{ user, session, isLoading, error, signOut }`.
- `signOut` 내부에서 `supabase.auth.signOut()` 호출.

### Step 4.2 `AuthProvider` — `components/providers/auth-provider.tsx`

- `useAuth` 결과를 Context로 제공.
- `app/layout.tsx`에서 `AuthProvider`로 앱 감싸기.

### Step 4.3 `LoginButton` / `UserMenu` — `components/domain/auth/*`

- **비로그인**: `LoginButton` → `/login` 링크 또는 클릭 시 `signInWithOAuth` (이미 로그인 페이지에서 처리한다면 링크만으로 충분).
- **로그인**: `UserMenu` — 사용자 이메일/이름, **로그아웃** 버튼 (`signOut` 호출).

### Step 4.4 `Header` 수정 — `components/common/Header.tsx`

- `useAuth`(또는 Auth Context) 사용.
- 로그인 시 `UserMenu`, 비로그인 시 `LoginButton` 렌더링.
- `/login`으로의 단순 링크는 유지.

### Step 4.5 로그인 페이지 통합

- 실제 `signInWithOAuth` 호출로 기존 `setTimeout` 제거.
- 로딩/에러 상태 유지.

---

## Phase 5: 데이터 계층 (Products · Inquiries · AI)

FLOW 및 01-prd-flow: **products 읽기 전용**, **inquiry create → AI generate → inquiry update** 순서 고정.

### Step 5.1 제품 조회

- **Server**: `lib/supabase/server`로 `from('products').select('*')` (또는 `products` 테이블 타입에 맞게).
- **RLS**: `products_select_authenticated` → 인증된 사용자만 SELECT.
- **구현 위치**:
  - **Option A**: `app/actions/products.ts`의 Server Action `getProducts` / `getProductById`.
  - **Option B**: `app/api/products/route.ts` 및 `app/products/[id]`용 데이터 fetch (서버 클라이언트 사용).
- **페이지**: `app/products/page.tsx`, `app/products/[id]/page.tsx`에서 사용.  
  `ProductList` / `ProductDetail` 등 기존 도메인 컴포넌트 연동.

### Step 5.2 문의 생성·목록·삭제

- **create**:  
  - `user_id`: `auth.uid()` (서버에서 `getUser()` 후 사용).  
  - `product_id`: `products` 존재 여부 검증 후 사용.  
  - `content`: 필수.  
  - `ai_response`: `null`로 INSERT (FLOW 1단계).
- **list**: `user_id = auth.uid()` 조건으로 SELECT.  
  마이페이지용 `InquiryListItem` 형태로 변환 (preview 등).
- **delete**: `id` + `user_id = auth.uid()` 조건.  
  RLS `inquiries_delete_own`과 일치하도록 구현.

**구현 위치**:  
- **우선**: Server Actions (`app/actions/inquiries.ts`).  
- API Route (`app/api/inquiries/route.ts`, `app/api/inquiries/[id]/route.ts`)는 Server Action을 호출하거나, 직접 Supabase 호출로 대체 가능.

### Step 5.3 AI 응답 생성 및 문의 업데이트

1. **AI 생성**: `lib/ai/client` (OpenAI 또는 Gemini)로 문의 `content` + 제품 컨텍스트 입력 → `ai_response` 문자열 반환.
2. **흐름**:  
   - 문의 **INSERT** (이미 생성된 `inquiry_id` 사용) → **AI 호출** → **UPDATE** `inquiries SET ai_response = ? WHERE id = ? AND user_id = auth.uid()`.
3. **실패 시**:  
   - INSERT된 문의는 유지.  
   - UI에 실패 메시지 + 재시도(같은 `inquiry_id`로 UPDATE) 제공 (FLOW 및 01-prd-flow).

**구현 위치**:  
- `app/actions/ai.ts` 또는 `app/api/ai/route.ts`에서 AI 호출.  
- `app/actions/inquiries.ts`에서 `updateInquiryAiResponse(id, ai_response)` 등으로 UPDATE.

### Step 5.4 페이지·훅 연동

- **문의 작성**: `app/inquiry/page.tsx` + `InquiryForm` ( product_id from `?product=` ).  
  폼 제출 → create → AI → update 흐름 호출.
- **마이페이지**: `app/(dashboard)/my-page/page.tsx`에서 문의 목록 fetch (Server Action 또는 API), `InquiryList` / `InquiryItem`에 전달.  
  삭제 시 `delete` Action 호출 후 목록 갱신.
- **훅**: `use-products`, `use-inquiries`, `use-ai`는 클라이언트에서 위 Server Actions 또는 API를 호출하는 래퍼로 구현.

---

## Phase 6: 마무리 및 검증

### Step 6.1 에러·로딩·빈 상태

- **에러**:  
  - API/Action 실패 시 사용자 메시지 (배너/토스트).  
  - `error.tsx` / `global-error.tsx` 활용 (03-standards).
- **로딩**:  
  - `loading.tsx`, 스켈레톤 등 (02-style-ui).  
  - 문의 제출 시 로딩 스피너.
- **빈 상태**:  
  - 마이페이지 문의 없음, 제품 없음 등 (02-style-ui).

### Step 6.2 데모 시나리오 검증 (Phase 1 완료 기준)

다음 흐름을 **5분 이내**에 안정적으로 시연:

1. **로그인** → Google OAuth → 콜백 → `users` upsert → 리다이렉트.
2. **제품 리스트** → **제품 상세** → **문의하기** (`/inquiry?product=:id`).
3. **문의 작성** → AI 응답 생성 → 문의+AI 응답 저장.
4. **마이페이지**에서 목록 확인 → **삭제** 후 반영.

### Step 6.3 env·문서 정리

- `.env.example`에 필요한 변수 명시 (이미 반영된 부분 유지).
- `docs/history`에 “Supabase + Google OAuth 연동” 등 변경 이력 추가 (04-history-logging).

---

## 구현 순서 요약 (권장)

| 순서 | 단계 | 설명 |
|------|------|------|
| 1 | Phase 0 | 패키지, env, Supabase Dashboard (Google OAuth, URL) |
| 2 | Phase 1 | `lib/supabase` client / server / middleware / service-role |
| 3 | Phase 2 | 로그인 페이지 `signInWithOAuth`, `/api/auth/callback` (코드 교환 + `users` upsert) |
| 4 | Phase 3 | `middleware.ts` 세션 갱신, (선택) 보호 라우트 |
| 5 | Phase 4 | `useAuth`, `AuthProvider`, `Header`, `LoginButton` / `UserMenu`, 로그인 페이지 연동 |
| 6 | Phase 5 | Products 읽기 → Inquiries CRUD + AI generate/update → 페이지·훅 연동 |
| 7 | Phase 6 | 에러/로딩/빈 상태, 데모 시나리오 검증, 문서화 |

---

## 참고

- **Supabase Auth (Next.js)**: [Auth Helpers / Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) (최신에는 `@supabase/ssr` 기준으로 안내).
- **Google OAuth**: [Social Login (Google)](https://supabase.com/docs/guides/auth/social-login/auth-google).
- **DB**: `supabase/migrations/0001_initial_schema_rls.sql`, `types/database.ts` / `domain.ts`.  
- **범위**: Phase 1만 구현. 이메일/비밀번호, 관리자 대시보드, 실시간 채팅, 파일 업로드, 문의 상태 관리 등은 PRD상 제외.
