## 003 - DB 스키마 및 타입 정의 (Supabase Phase 1)

### 날짜 / 맥락
- **날짜**: 2026-01-29 (KST)
- **맥락**: PRD/FLOW·실제 UI 분석 기반 Supabase DB 스키마 설계 확정 후, SQL 마이그레이션 및 타입 반영

### 변경 내용

#### 1. Supabase 마이그레이션 (`supabase/migrations/0001_initial_schema_rls.sql`)
- **테이블**
  - `users`: id(= auth.uid()), google_id, email, name, created_at, updated_at. OAuth 콜백에서 upsert.
  - `products`: id, name, category(Carbon/Graphite), summary, description, created_at. Phase 1 읽기 전용.
  - `inquiries`: id, user_id, product_id, content, ai_response, created_at, updated_at.
- **관계**: users 1:N inquiries, products 1:N inquiries. inquiries.user_id → users.id (CASCADE), inquiries.product_id → products.id (RESTRICT).
- **RLS**: users 본인 SELECT; products 인증 사용자 SELECT; inquiries 본인 SELECT/INSERT/UPDATE/DELETE.
- **기타**: `update_updated_at_column()` 트리거로 users·inquiries의 updated_at 자동 갱신. products에는 updated_at 없음.

#### 2. 타입 정의 (`types/`)
- **domain.ts**: `User`, `Product`, `Inquiry`, `ProductCategory`, `InquiryListItem` (camelCase, 앱 사용).
- **database.ts**: `UserRow`, `ProductRow`, `InquiryRow`, `InquiryInsert`, `InquiryUpdate`, `Database` (snake_case, Supabase 클라이언트용).
- **index.ts**: 위 타입 재export.

### 실행 방법
- Supabase Dashboard → SQL Editor에서 `supabase/migrations/0001_initial_schema_rls.sql` 내용 붙여넣어 실행.

### 참고
- 설계 요약: PRD·FLOW·UI 분석 결과를 바탕으로 한 승인 설계안 기준.
- `docs/db-schema.md`는 이전 가이드이며, 마이그레이션·타입은 위 설계를 우선함.
