## 002 - UI Migration & Dependencies (pnpm add 기록)

### 설치 날짜 / 작업자
- **날짜**: 2026-01-28 (KST)
- **작업자**: 시니어 개발자(Hwanhee Lee) & AI 파트너
- **작업 맥락**: v0(= shadcn/ui 스타일) 기반 UI 이식 및 스타일 유틸 정비

### pnpm add로 추가된 라이브러리 목록
아래 목록은 현재 `package.json`의 `dependencies`에 포함된 항목 기준으로 정리했다.

- **`lucide-react`**
- **`clsx`**
- **`tailwind-merge`**
- **`class-variance-authority`**
- **`@radix-ui/react-slot`**
- **`@radix-ui/react-dialog`**
- **`@radix-ui/react-alert-dialog`**

### 각 라이브러리를 설치한 이유
- **`lucide-react`**
  - v0/shadcn UI에서 기본으로 많이 쓰는 아이콘 세트.
  - 버튼/상태 표시/내비게이션 아이콘을 일관된 톤으로 제공하기 위해 채택.

- **`clsx` + `tailwind-merge`**
  - Tailwind 클래스 조합을 안전하게 처리하기 위한 조합.
  - `clsx`: 조건부 className 조합 (truthy 기반)
  - `tailwind-merge`: Tailwind 충돌 클래스 병합(예: `p-2` vs `p-4`)을 자동 정리
  - 결과적으로 v0/shadcn 패턴의 `cn()` 유틸(`lib/utils/cn.ts`)을 구현하기 위해 필요.

- **`class-variance-authority`**
  - v0/shadcn의 버튼/배지 등 “variant/size” 패턴을 타입 안정적으로 구성하기 위해 사용.
  - 예: `components/ui/button.tsx`에서 `cva()`로 `variant`, `size`를 선언하고 `VariantProps<>`로 타입을 연결.

- **Radix UI (`@radix-ui/react-*`)**
  - 접근성(A11y)과 상호작용 품질이 검증된 UI primitive를 사용하기 위함.
  - v0/shadcn UI 구성요소가 내부적으로 Radix primitive에 기대는 경우가 많아, 이식 비용을 줄이고 동작 일관성을 확보.
  - `react-slot`: `asChild` 패턴(컴포넌트 교체)을 안전하게 지원(예: Button에서 Slot 사용).
  - `react-dialog`, `react-alert-dialog`: 모달/확인 다이얼로그 등 기본 UX를 빠르게 구현.

### 발생했던 에러와 해결 과정 요약
- **Tailwind 설정 타입 에러 (빌드 실패)**
  - **증상**: `pnpm build` 시 `./tailwind.config.ts`에서 타입 에러 발생
    - 메시지: `Type '["class"]' is not assignable to type 'DarkModeStrategy | undefined'`
  - **원인**: Tailwind 설정 타입(`Config`) 기준으로 `darkMode: ["class"]` 형태가 허용되지 않음(요구 형태와 불일치).
  - **해결**: `tailwind.config.ts`의 `darkMode`를 문자열 `"class"`로 변경하여 타입을 만족시킴.
    - 현재 설정: `darkMode: "class"`

- **Windows PowerShell에서 `mkdir -p` 실패**
  - **증상**: `mkdir -p docs/history` 실행 시 `명령 구문이 올바르지 않습니다.` 오류
  - **원인**: `-p` 옵션은 bash 계열에서 쓰는 플래그이며, PowerShell 기본 `mkdir`에서는 동일하게 동작하지 않음.
  - **해결**: 아래 중 하나로 대체
    - `mkdir docs\\history`
    - 또는 `New-Item -ItemType Directory -Force docs\\history`

- **(참고) 린트 에러/경고 발생**
  - UI 이식 과정에서 일부 파일에서 린트 경고/에러가 관측됨(예: `@typescript-eslint/no-empty-object-type`, unused vars 등).
  - 이 문서는 “pnpm add로 인한 의존성/이식 작업 맥락” 기록이 목적이므로, 상세 린트 정리는 별도 히스토리/태스크로 분리 권장.

