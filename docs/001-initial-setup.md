## 001. Initial Setup — 프로젝트 탄생 기록 (Origin Story)

이 문서는 “초기 환경 설정 메모”가 아니라, **DY Carbon이 어떤 문제의식에서 출발했고 왜 이 구조/흐름을 선택했는지**를 남기는 기록이다.  
기능 정의와 흐름의 근거는 반드시 `docs/PRD.md`, `docs/FLOW.md`를 따른다.

---

## 1. 프로젝트 개요 (Project Overview)

DY Carbon은 산업용 카본/그래파이트 제품 정보를 **구조화된 형태로 제공**하고, 사용자가 **제품 이해 → 비교(Phase 2) → 견적 문의**까지 빠르게 도달하도록 돕는 B2B 웹 플랫폼을 목표로 한다. (`docs/PRD.md`의 서비스 목적)

초기 문제의식은 단순했다.

- **기존 방식의 한계**: 전화/이메일 중심의 문의는
  - 제품 정보를 찾아보는 과정과 문의 과정이 분리되어 있고,
  - 사용자는 “어떤 제품을, 어떤 맥락에서 문의했는지”를 다시 설명해야 하며,
  - 서비스는 고객 행동 데이터를 흐름으로 축적하기 어렵다.
- **우리가 해결하려는 핵심**: 제품 탐색과 문의를 **하나의 사용자 흐름**으로 연결해, “정보 탐색 → 행동(문의) → 결과 확인/저장”이 끊기지 않게 만드는 것.

Phase 1은 “완벽한 서비스”를 만드는 단계가 아니다.  
`docs/PRD.md`가 명시하듯, **3일 내에 끝까지 이어지는 사용자 흐름(MVP 완주)**을 목표로 했다.

- Google 로그인
- 제품 리스트/상세(읽기 전용)
- 문의 작성 → AI 응답 확인 → 문의+AI 응답 저장
- 마이페이지에서 내 문의 목록 확인/삭제

이 “완주 가능한 한 줄의 흐름”이 Phase 1의 성공 기준이자, 이후 Phase 2 확장의 발판이다.

---

## 2. 사용자 흐름 중심의 초기 기획 철학

이 프로젝트는 기능을 나열해서 시작하지 않았다. `docs/FLOW.md`에 먼저 합의된 사용자 여정이 있었고, 그 여정이 곧 제품의 뼈대가 되었다.

우리가 고정한 핵심 흐름은 다음과 같다. (FLOW의 Sequence/Flowchart 기준)

- **접속**: 메인에서 서비스 소개와 CTA를 보고 시작한다. (`/`)
- **인증**: Google OAuth로 사용자를 식별한다. (`/login`)
- **정보 탐색**: 제품 리스트를 보고, 제품 상세로 들어간다. (`/products` → `/products/:id`)
- **행동(입력)**: 특정 제품 맥락에서 문의 텍스트를 작성한다. (`/inquiry?product=:id`)
- **결과 확인**: AI가 “문의 텍스트 + 제품 컨텍스트” 기반으로 응답을 생성한다.
- **저장/회수**: 문의와 AI 응답이 저장되고, 마이페이지에서 목록/삭제가 가능하다. (`/my-page`)

특히 `docs/FLOW.md`의 시퀀스는 Phase 1의 품질 기준을 만든다.

- Inquiry는 **먼저 DB에 INSERT (ai_response=null)** 된다.
- 그 다음 AI Provider 호출로 응답을 만든다.
- 마지막으로 동일 Inquiry를 **UPDATE하여 ai_response를 저장**한다.

이 순서를 고정한 이유는 “AI가 실패해도 문의 자체는 남을 수 있고(업무적으로는 오히려 자연스러운 상태), 이후 재시도로 복구 가능해야 한다”는 운영 현실을 Phase 1부터 모델링하기 위해서다. (FLOW의 로직 흐름 근거)

결론적으로, **사용자가 실제로 무엇을 하게 되는가**가 프로젝트의 기준선이 되었고, UI/라우팅/데이터/AI 연동 구조는 그 기준선을 따라 자연스럽게 결정됐다.

---

## 3. 기술 스택 선정 배경 (Tech Stack Decisions)

기술 선택은 유행이나 개인 취향이 아니라, `docs/PRD.md`와 `docs/FLOW.md`가 요구하는 흐름을 **가장 빠르고 안정적으로 구현**하기 위한 수단이었다.

### Frontend Framework

- **Next.js (App Router)**:
  - FLOW에 정의된 페이지 구조(`/`, `/login`, `/products`, `/products/:id`, `/inquiry`, `/my-page`)를 파일 기반 라우팅으로 빠르게 고정할 수 있다.
  - 서버 렌더링/서버 실행 환경을 활용해 “제품 조회(read-only)”, “문의 저장(write)”, “AI 호출” 같은 서버 책임을 자연스럽게 분리할 수 있다. (FLOW의 Web App / App Server 구조)

### Styling / UI 전략

- **Tailwind CSS + shadcn/ui 패턴**:
  - Phase 1은 “완주 가능한 MVP”가 목표이므로, **빠른 프로토타이핑**과 **명확한 정보 위계(카드/폼/상태 UI)**가 우선이다.
  - B2B 톤에서 중요한 “깔끔함/신뢰감/접근성 기본값”을 컴포넌트 단위로 일관되게 유지할 수 있다.

### Backend / Database

- **Supabase (Auth + Postgres)**:
  - PRD의 Phase 1 요구사항인 **Google Social Login 단일 방식**을 빠르게 구현할 수 있다.
  - `users / products / inquiries` 모델을 Postgres로 단순하고 명확하게 운영할 수 있다. (`docs/PRD.md`의 데이터 모델)
  - “내 문의만 조회/삭제” 같은 경계는 RLS 등으로 강제하기 쉬워, Phase 1의 핵심 흐름을 안전하게 지킨다. (FLOW의 Inquiry Service + DB 구조)

### AI 연동 구조

- **AI Provider(OpenAI/Gemini)**:
  - PRD가 정의한 AI의 목적은 “주 기능”이 아니라 **제품 이해를 돕는 보조 도구**이며, “연동 및 결과 저장 구조”를 검증하는 것이다.
  - 그래서 AI는 별도의 기능 섬이 아니라, 문의 흐름의 한 단계로 들어온다:
    - 문의가 먼저 저장되고 → AI가 응답을 만들고 → 그 응답이 문의 레코드에 저장된다. (FLOW Sequence 근거)

---

## 4. 초기 프로젝트 구조와 환경 세팅

초기 세팅은 “일단 만들고 보자”가 아니라, **흐름 → 구조 → 구현** 순서로 정리됐다.

### 라우팅 기준 디렉토리 구조

`docs/FLOW.md`가 고정한 페이지 이동을 그대로 반영해, App Router 기준으로 페이지를 배치했다.

- `app/page.tsx`: `/` 메인
- `app/(auth)/login/page.tsx`: `/login`
- `app/products/page.tsx`: `/products`
- `app/products/[id]/page.tsx`: `/products/:id`
- `app/inquiry/page.tsx`: `/inquiry?product=:id`
- `app/(dashboard)/my-page/page.tsx`: `/my-page`

### 도메인 개념 분리를 위한 기본 폴더 설계

UI와 도메인 로직을 분리해 “Phase 1 완주”와 “Phase 2 확장”을 동시에 준비했다.

- `components/ui/`: 재사용 가능한 기본 UI
- `components/domain/`: product/inquiry/auth/layout 등 도메인 컴포넌트
- `app/actions/`: 인증/제품/문의/AI 등 서버 동작 단위 분리
- `lib/supabase/`, `lib/ai/`: 외부 서비스 클라이언트 계층을 환경별로 분리
- `types/`: DB/도메인/API 타입을 분리해 변화에 대비

### Phase 2 확장을 고려한 최소한의 여백

Phase 1은 스코프를 잠그되(인증/제품 읽기/문의 CRUD/AI 저장), Phase 2에서 고도화될 영역(제품 데이터 구조화, 문의 상태 관리, AI 추천/분석)을 고려해 **도메인 단위 확장**이 가능한 형태를 유지했다. (`docs/PRD.md`의 Phase 2 방향 근거)

---

## 5. 문서 중심 개발 전략

이 프로젝트에서 문서는 “참고 자료”가 아니라 **의사결정의 기준선**이다.

- **`docs/PRD.md`**
  - 무엇을 만들지/만들지 않을지를 정의하는 **기능적 경계선**
  - Phase 1의 목표(완주 가능한 MVP), 스코프 락(인증 방식/CRUD 범위/AI 목적)을 제공

- **`docs/FLOW.md`**
  - 코드보다 먼저 합의된 **사용자 행동과 시스템 흐름의 기준**
  - 페이지 이동과 서비스 아키텍처, 그리고 “INSERT → AI → UPDATE” 시퀀스를 고정

- **`docs/001-initial-setup.md` (이 문서)**
  - 프로젝트가 “어떤 생각에서 시작되었는지”를 남기는 기록
  - 이후 합류한 사람이 “왜 이 구조와 흐름으로 시작했는가?”를 한 번에 이해할 수 있도록 하는 출발점

---

### 작성 메타

- **작성일**: 2026-01-29
- **근거 문서**: `docs/PRD.md`, `docs/FLOW.md`
