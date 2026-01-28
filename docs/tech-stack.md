# 🛠️ 기술 스택 명세서

## DY Carbon 프로젝트 기술 스택 및 설계 원칙

---

## 1. 핵심 프레임워크

### Next.js 15+ (App Router)
- **버전**: 16.1.6+
- **사용 목적**: 
  - Server Components와 Client Components 분리
  - Server Actions를 통한 데이터 변경 처리
  - 파일 기반 라우팅 및 라우트 그룹 활용
- **주요 기능**:
  - App Router 기반 라우팅
  - Server Actions (API Routes 대체 가능)
  - 미들웨어를 통한 인증 체크
  - 자동 코드 스플리팅 및 최적화

---

## 2. UI 라이브러리

### shadcn/ui
- **목적**: 재사용 가능한 UI 컴포넌트 라이브러리
- **위치**: `components/ui/`
- **주요 컴포넌트**:
  - `Button`: 버튼 컴포넌트
  - `Card`: 카드 레이아웃
  - `Input`, `Textarea`: 폼 입력 요소
  - `Badge`: 태그/카테고리 표시
  - `Dialog`: 모달 다이얼로그
- **설계 원칙**:
  - Headless UI 기반으로 커스터마이징 용이
  - Tailwind CSS로 스타일링
  - 접근성(A11y) 고려

### Lucide React
- **목적**: 아이콘 라이브러리
- **사용 예시**:
  - 네비게이션 아이콘
  - 제품 카테고리 아이콘
  - 사용자 메뉴 아이콘

### Tailwind CSS
- **버전**: 4.x
- **목적**: 유틸리티 기반 CSS 프레임워크
- **설정**: `tailwind.config.ts`
- **커스터마이징**:
  - 디자인 시스템 색상 정의
  - 반응형 브레이크포인트 설정

---

## 3. 백엔드 및 데이터베이스

### Supabase
- **목적**: BaaS (Backend as a Service)
- **주요 기능**:
  - PostgreSQL 데이터베이스
  - 인증 (Google OAuth)
  - Row Level Security (RLS)
  - 실시간 구독 (Phase 2 확장용)

#### Supabase 클라이언트 구조
```
lib/supabase/
├── client.ts      # 브라우저용 클라이언트 (클라이언트 컴포넌트)
├── server.ts      # 서버용 클라이언트 (Server Components/Actions)
└── middleware.ts  # 미들웨어용 클라이언트 (인증 체크)
```

- **설계 원칙**:
  - 환경별 인스턴스 분리로 보안 강화
  - Singleton 패턴으로 인스턴스 재사용
  - 타입 안정성을 위한 자동 생성 타입 활용

---

## 4. AI 통합

### AI Provider (OpenAI 또는 Google Gemini)
- **목적**: 문의 내용 기반 AI 응답 생성
- **구현 위치**: `lib/ai/client.ts`
- **기능**:
  - 문의 텍스트 분석
  - 제품 컨텍스트 기반 응답 생성
  - 응답 결과 저장

---

## 5. 타입 안정성

### TypeScript
- **버전**: 5.x
- **설정**: `tsconfig.json`
- **타입 구조**:
  ```
  types/
  ├── database.ts  # Supabase 자동 생성 타입
  ├── domain.ts     # 도메인 모델 타입
  ├── api.ts        # API 인터페이스 타입
  └── index.ts      # 타입 재export
  ```

---

## 6. 유틸리티 라이브러리

### clsx & tailwind-merge
- **목적**: className 조합 및 Tailwind 클래스 충돌 해결
- **위치**: `lib/utils/cn.ts`
- **사용 예시**:
  ```typescript
  import { cn } from '@/lib/utils/cn'
  <div className={cn('base-class', condition && 'conditional-class')} />
  ```

### zod (예정)
- **목적**: 런타임 타입 검증
- **사용 위치**: 
  - 폼 유효성 검사
  - API 요청/응답 검증
  - Server Actions 입력 검증

---

## 7. 컴포넌트 설계 원칙

### 계층 구조
```
components/
├── ui/              # 재사용 가능한 기본 UI (shadcn/ui)
├── domain/          # 비즈니스 로직 포함 도메인 컴포넌트
│   ├── auth/        # 인증 관련
│   ├── product/     # 제품 관련
│   ├── inquiry/     # 문의 관련
│   └── layout/      # 레이아웃 관련
└── providers/       # Context Providers
```

### 컴포넌트 분리 원칙
1. **UI 컴포넌트 (`ui/`)**:
   - 비즈니스 로직 없음
   - Props 기반 동작
   - 재사용 가능한 범용 컴포넌트

2. **도메인 컴포넌트 (`domain/`)**:
   - 비즈니스 로직 포함
   - 데이터 페칭 및 상태 관리
   - 도메인별 특화 기능

3. **Providers (`providers/`)**:
   - 전역 상태 관리
   - Context API 활용
   - 인증 상태 등 공유 데이터

---

## 8. 데이터 페칭 전략

### Server Components (기본)
- **사용 시나리오**: 
  - 제품 리스트 조회
  - 제품 상세 정보
  - 초기 데이터 로딩
- **장점**: 
  - 서버에서 직접 DB 접근
  - 클라이언트 번들 크기 감소
  - SEO 최적화

### Server Actions
- **사용 시나리오**:
  - 문의 작성
  - 문의 삭제
  - AI 응답 생성 및 저장
- **위치**: `app/actions/`
- **장점**:
  - API Routes 대비 간단한 구현
  - 타입 안정성
  - 자동 에러 처리

### Custom Hooks (클라이언트)
- **사용 시나리오**:
  - 실시간 데이터 업데이트
  - 클라이언트 사이드 상태 관리
  - 폼 상태 관리
- **위치**: `hooks/`

---

## 9. 인증 전략

### Google OAuth (Supabase Auth)
- **구현 위치**: 
  - `app/(auth)/login/page.tsx`
  - `app/api/auth/callback/route.ts`
  - `lib/supabase/*`
- **플로우**:
  1. 사용자가 Google 로그인 버튼 클릭
  2. Supabase Auth를 통한 OAuth 인증
  3. 콜백에서 사용자 정보 저장
  4. 세션 관리 (Supabase 자동 처리)

### 미들웨어 보호
- **위치**: `middleware.ts`
- **보호 대상**:
  - `/my-page` (대시보드 라우트 그룹)
  - 기타 인증 필요 페이지
- **동작**: 인증되지 않은 사용자는 로그인 페이지로 리다이렉트

---

## 10. 스타일링 전략

### Tailwind CSS
- **설정**: `tailwind.config.ts`
- **커스터마이징**:
  - 디자인 토큰 정의 (색상, 간격, 폰트)
  - 다크 모드 지원 (Phase 2)
- **컴포넌트 스타일링**:
  - 유틸리티 클래스 우선
  - `@apply` 지시어 최소화
  - 컴포넌트별 스타일 파일 분리 (필요시)

---

## 11. 환경 변수 관리

### 환경 변수 구조
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider
OPENAI_API_KEY=
# 또는
GOOGLE_AI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

### 관리 원칙
- `.env.local`: 로컬 개발 환경 (gitignore)
- `.env.example`: 환경 변수 템플릿 (버전 관리)
- `NEXT_PUBLIC_*`: 클라이언트 노출 변수
- 비공개 키: 서버 전용

---

## 12. 코드 품질 및 도구

### ESLint
- **설정**: `eslint.config.mjs`
- **규칙**: Next.js 권장 설정

### TypeScript
- **strict 모드**: 활성화
- **경로 별칭**: `@/*` 사용

---

## 13. 확장성 고려사항

### Phase 2 대비 구조
1. **도메인별 폴더 분리**: 기능 추가 시 독립적 확장
2. **컴포넌트 재사용성**: UI 컴포넌트의 범용성 유지
3. **타입 시스템**: 확장 가능한 타입 구조
4. **서버 액션 모듈화**: 도메인별 액션 파일 분리

### 성능 최적화
- Server Components 활용
- 이미지 최적화 (next/image)
- 코드 스플리팅 (자동)
- 캐싱 전략 (Phase 2)

---

## 14. 개발 워크플로우

### 의존성 관리
- **패키지 매니저**: pnpm
- **설치 예정 패키지**:
  ```json
  {
    "@supabase/supabase-js": "^2.x",
    "@supabase/auth-helpers-nextjs": "^0.x",
    "shadcn/ui": "npx shadcn-ui@latest init",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "zod": "^3.x"
  }
  ```

### 개발 서버
```bash
pnpm dev
```

---

## 15. 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**작성일**: 2026-01-28  
**버전**: 1.0.0
