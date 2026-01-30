-- =============================================================================
-- DY Carbon – Replace Category with Product Type
-- Carbon/Graphite 분류를 제거하고 제조 방식 기반 product_type으로 변경
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 변경 사유 (Why)
-- Carbon과 Graphite는 별개의 카테고리가 아니라 같은 재료의 처리 단계 차이입니다.
-- Carbon이 2500℃ 이상의 고온에서 열처리될 때 Graphite화 하는 과정(Graphitization)을 거칩니다.
-- 따라서 제품을 분류하는 기준은 Carbon/Graphite가 아니라 제조 방식(Molded/Extruded/CIP)이어야 합니다.
-- -----------------------------------------------------------------------------

-- 영향도 평가 (Impact)
-- - category 컬럼은 데이터 보존을 위해 유지 (NOT NULL만 해제)
-- - product_type 컬럼 추가 (Molded, Extruded, CIP (Isotropic))
-- - 기존 category 인덱스 제거 및 product_type 인덱스 추가
-- - 기존 데이터가 있다면 마이그레이션 필요 (NULL 허용으로 안전하게 처리)
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 1. category 컬럼 완화 및 product_type 컬럼 추가
-- -----------------------------------------------------------------------------

-- 더 이상 category 기반 인덱스가 필요 없다면 제거
DROP INDEX IF EXISTS idx_products_category;

-- category 컬럼은 데이터 보존을 위해 유지하되,
-- NOT NULL 제약을 해제하고 기본값을 NULL로 설정한다.
ALTER TABLE public.products
  ALTER COLUMN category DROP NOT NULL,
  ALTER COLUMN category SET DEFAULT NULL;

-- product_type 컬럼 추가
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type text CHECK (product_type IN ('Molded', 'Extruded', 'CIP (Isotropic)'));

-- product_type 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products (product_type);

-- -----------------------------------------------------------------------------
-- 2. 기존 데이터 마이그레이션 (필요시)
-- -----------------------------------------------------------------------------
-- 기존 category 값이 있다면 product_type으로 변환하는 로직
-- 예: UPDATE public.products SET product_type = 'Molded' WHERE category = 'Carbon';
-- 현재는 product_type를 수동으로 관리하므로 이 단계는 선택 사항이다.

-- -----------------------------------------------------------------------------
-- 검증 쿼리 (Verification Query)
-- -----------------------------------------------------------------------------
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'products'
-- ORDER BY ordinal_position;

-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'products' AND schemaname = 'public';

-- -----------------------------------------------------------------------------
-- 원복 SQL (Rollback SQL)
-- -----------------------------------------------------------------------------
-- DROP INDEX IF EXISTS idx_products_product_type;
-- ALTER TABLE public.products DROP COLUMN IF EXISTS product_type;
-- ALTER TABLE public.products
--   ALTER COLUMN category SET NOT NULL,
--   ALTER COLUMN category SET DEFAULT 'Carbon';
-- CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
