# 서비스 흐름도

> 참고: 기존 문서 경로 `docs/FLOW.md`는 **루트 `FLOW.md`로 통합**되었습니다.  
> 이후 FLOW의 단일 소스 오브 트루스는 이 파일입니다.

---

## 사용자 여정 및 로직 흐름 (Sequence Diagram)

sequenceDiagram
    autonumber
    actor U as User
    participant W as Web App (Next.js)
    participant A as Auth (Google OAuth / Supabase Auth)
    participant P as Product Service (DB Read)
    participant I as Inquiry Service (DB Write)
    participant AI as AI Provider (OpenAI/Gemini)
    participant DB as Database (Postgres)

    U->>W: 접속 (메인)
    W-->>U: 메인 화면/제품 탐색 CTA

    U->>W: 로그인 버튼 클릭
    W->>A: Google OAuth 로그인 요청
    A-->>W: 인증 성공 (user identity)
    W->>DB: User upsert (google_id/email/name)
    DB-->>W: User 저장 완료
    W-->>U: 로그인 완료 / 제품 리스트로 이동

    U->>W: 제품 리스트 조회
    W->>P: 제품 목록 요청
    P->>DB: SELECT Products (read-only)
    DB-->>P: Products
    P-->>W: Products
    W-->>U: 제품 리스트 렌더

    U->>W: 제품 상세 진입
    W->>P: 제품 상세 요청(product_id)
    P->>DB: SELECT Product by id
    DB-->>P: Product
    P-->>W: Product
    W-->>U: 제품 상세 렌더 + "문의하기"

    U->>W: 문의 텍스트 작성/전송
    W->>I: Inquiry 생성 요청(user_id, product_id, content)
    I->>DB: INSERT Inquiry (ai_response=null)
    DB-->>I: Inquiry(id) 생성됨
    I-->>W: Inquiry 생성 결과(id)

    W->>AI: AI 응답 생성(content + product context)
    AI-->>W: ai_response

    W->>I: Inquiry 업데이트 요청(id, ai_response)
    I->>DB: UPDATE Inquiry SET ai_response=...
    DB-->>I: 저장 완료
    I-->>W: 업데이트 완료

    W-->>U: AI 응답 표시 + 저장 완료 상태

    U->>W: 마이페이지 진입
    W->>I: 내 문의 목록 요청(user_id)
    I->>DB: SELECT Inquiry WHERE user_id=...
    DB-->>I: Inquiries
    I-->>W: Inquiries
    W-->>U: 문의 목록 렌더

    U->>W: 문의 삭제
    W->>I: Inquiry 삭제 요청(inquiry_id)
    I->>DB: DELETE FROM Inquiry WHERE id=...
    DB-->>I: 삭제 완료
    I-->>W: 삭제 완료
    W-->>U: 목록에서 제거

---

## 서비스 아키텍처 및 페이지 구조 (Flowchart)

flowchart TB
    %% ---------- Client / Pages ----------
    subgraph C[Client (Browser)]
        H[Header / Nav]
        F[Footer]
        P0[/ (Main)\n서비스 소개 + 제품 리스트 이동 버튼/]
        P1[/login\nGoogle Social Login/]
        P2[/products\n제품 리스트(카드)/]
        P3[/products/:id\n제품 상세 + 문의하기 버튼/]
        P4[/inquiry?product=:id\n문의 작성 + AI 응답 표시/]
        P5[/my-page\n내 문의 목록 + 삭제/]
    end

    %% ---------- App / Server ----------
    subgraph S[App Server (Next.js App Router)]
        MW[Auth Middleware\n(세션/보호 라우팅)]
        API1[(API: products.read)]
        API2[(API: inquiry.create)]
        API3[(API: inquiry.list)]
        API4[(API: inquiry.delete)]
        API5[(API: ai.generate)]
    end

    %% ---------- External / Data ----------
    subgraph X[External Services]
        GA[Google OAuth]
        AIP[AI Provider\n(OpenAI/Gemini)]
    end

    subgraph D[Data Layer]
        AUTH[(Auth: Supabase Auth)]
        DB[(DB: Postgres)]
        T1[(users)]
        T2[(products)]
        T3[(inquiries)]
    end

    %% ---------- Page navigation ----------
    P0 --> P2
    P0 --> P1
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P2 --> P5

    %% ---------- Auth ----------
    P1 --> GA --> AUTH
    AUTH --> MW

    %% ---------- Products read-only ----------
    P2 --> API1 --> DB --> T2
    P3 --> API1

    %% ---------- Inquiry + AI ----------
    P4 --> API2 --> DB --> T3
    P4 --> API5 --> AIP --> API5
    API5 --> API2
    P5 --> API3 --> DB --> T3
    P5 --> API4 --> DB --> T3

    %% ---------- User record ----------
    AUTH --> DB --> T1

    %% UI layout elements (optional linkage)
    H --- P0
    H --- P2
    H --- P3
    H --- P4
    H --- P5
    F --- P0
    F --- P2
    F --- P3
    F --- P4
    F --- P5

---

## 오류 처리 원칙 (Error Handling)

- 정상 사용자 여정(메인→로그인→제품→문의→마이페이지)은 그대로 유지한다.
- 예상치 못한 오류(렌더링/서버 오류 등)는 별도 라우트를 추가하지 않고, Next.js App Router의 에러 바운더리(`app/error.tsx`, `app/global-error.tsx`)로 오류 화면을 표시한다.
- 오류 화면에는:
  - 오류 원인 요약(가능하면 에러 메시지/코드)
  - 메인 화면으로 돌아가기 버튼
  - (선택) 다시 시도 버튼
  을 제공한다.

