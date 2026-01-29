-- =============================================================================
-- DY Carbon Phase 1 – Initial Schema + RLS
-- Supabase SQL Editor에 붙여넣어 실행할 수 있는 단일 스크립트
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. 함수: updated_at 자동 갱신
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. 테이블: users
-- id = auth.uid() 로 설정하여 RLS/연동. OAuth 콜백에서 INSERT/UPDATE.
-- -----------------------------------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  google_id text NOT NULL UNIQUE,
  email text,
  name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 3. 테이블: products (Phase 1 읽기 전용)
-- -----------------------------------------------------------------------------
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Carbon', 'Graphite')),
  summary text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products (category);

-- -----------------------------------------------------------------------------
-- 4. 테이블: inquiries
-- -----------------------------------------------------------------------------
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  content text NOT NULL,
  ai_response text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiries_user_id ON public.inquiries (user_id);
CREATE INDEX idx_inquiries_product_id ON public.inquiries (product_id);

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5. RLS 활성화
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 6. RLS 정책: users
-- - SELECT: 본인만 (id = auth.uid())
-- - INSERT/UPDATE: OAuth 콜백 등에서 서비스 역할로 수행 → 정책 없음 (bypass)
-- -----------------------------------------------------------------------------
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- -----------------------------------------------------------------------------
-- 7. RLS 정책: products (읽기 전용)
-- - SELECT: 인증된 사용자 (Phase 1)
-- -----------------------------------------------------------------------------
CREATE POLICY "products_select_authenticated"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- 8. RLS 정책: inquiries (본인만 조회/생성/수정/삭제)
-- -----------------------------------------------------------------------------
CREATE POLICY "inquiries_select_own"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "inquiries_insert_own"
  ON public.inquiries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "inquiries_update_own"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "inquiries_delete_own"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
