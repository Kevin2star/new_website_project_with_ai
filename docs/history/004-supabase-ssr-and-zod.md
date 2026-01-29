---
date: 2026-01-29
title: Add Supabase SSR + Zod, implement Foundation utilities
---

## 변경 내용
- `@supabase/supabase-js`, `@supabase/ssr`, `zod` 의존성 추가
- Supabase 클라이언트 헬퍼 구현
  - `lib/supabase/client.ts`: 브라우저용 클라이언트
  - `lib/supabase/server.ts`: Server Components/Actions용 클라이언트(쿠키 연동)
  - `lib/supabase/middleware.ts`: 미들웨어용 클라이언트(응답 쿠키 set)
- 공통 유틸/상수 구현
  - `lib/constants/config.ts`, `lib/constants/routes.ts`
  - `lib/utils/validation.ts`, `lib/utils/format.ts`, `lib/utils/map-db-to-domain.ts`

## 변경 이유
- Phase 1 구현의 기반으로 “서버 안전 데이터 접근(Server Actions/RSC)”과 입력 검증(zod), DB Row→Domain 변환을 표준화하기 위함.
- 이후 Auth/Products/Inquiry 기능에서 중복 없이 공통 유틸을 재사용하기 위함.

## 관련 이슈/에러
- Next.js 16에서 `next/headers`의 `cookies()`가 Promise를 반환하여 `await cookies()`로 수정(`lib/supabase/server.ts`).

