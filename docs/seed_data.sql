-- =============================================================================
-- DY Carbon Phase 1 – Seed Data
-- Supabase SQL Editor에서 실행 가능한 Seed Data
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. users 테이블 (5명 이상)
-- -----------------------------------------------------------------------------
INSERT INTO public.users (id, google_id, email, name, created_at, updated_at)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'google_123456789012345678901',
    'kim.manager@industrial.co.kr',
    '김철수',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  )
ON CONFLICT (google_id) DO NOTHING;

INSERT INTO public.users (id, google_id, email, name, created_at, updated_at)
VALUES
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'google_234567890123456789012',
    'lee.director@techcorp.kr',
    '이영희',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  )
ON CONFLICT (google_id) DO NOTHING;

INSERT INTO public.users (id, google_id, email, name, created_at, updated_at)
VALUES
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'google_345678901234567890123',
    'park.engineer@materials.kr',
    '박민수',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  )
ON CONFLICT (google_id) DO NOTHING;

INSERT INTO public.users (id, google_id, email, name, created_at, updated_at)
VALUES
  (
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'google_456789012345678901234',
    'choi.procurement@manufacturing.co.kr',
    '최지영',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  )
ON CONFLICT (google_id) DO NOTHING;

INSERT INTO public.users (id, google_id, email, name, created_at, updated_at)
VALUES
  (
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    'google_567890123456789012345',
    'jung.sales@carbonmaterials.kr',
    '정대현',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (google_id) DO NOTHING;

INSERT INTO public.users (id, google_id, email, name, created_at, updated_at)
VALUES
  (
    'f6a7b8c9-d0e1-2345-fabc-456789012345',
    'google_678901234567890123456',
    'yoon.rnd@semiconductor.kr',
    '윤서연',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  )
ON CONFLICT (google_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. products 테이블 (8개 이상)
-- -----------------------------------------------------------------------------
INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    '고온용 등방성 그래파이트 블록',
    'Graphite',
    '고온 환경(2000°C 이상)에서 안정적인 성능을 제공하는 등방성 그래파이트 블록입니다.',
    '반도체 제조 공정, 금속 용해로, 유리 제조 등 고온 산업 환경에서 널리 사용됩니다. 우수한 열전도성과 내열성을 갖추고 있으며, 열팽창 계수가 낮아 치수 안정성이 뛰어납니다. 표준 규격: 300x300x200mm, 400x400x300mm 등 다양한 사이즈 제공 가능합니다.',
    NOW() - INTERVAL '60 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p2b3c4d5-e6f7-8901-bcde-f12345678901',
    '고강도 카본 소재 시트',
    'Carbon',
    '경량이면서도 높은 강도와 내구성을 갖춘 카본 시트 소재입니다.',
    '항공우주, 자동차, 스포츠 용품 등 경량화가 중요한 분야에서 활용됩니다. 인장 강도 3.5GPa 이상, 탄성 계수 230GPa 이상의 우수한 기계적 물성을 보유하고 있습니다. 두께 0.5mm~5mm 범위에서 커스터마이징 가능하며, 표면 처리 옵션도 제공됩니다.',
    NOW() - INTERVAL '55 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p3c4d5e6-f7a8-9012-cdef-123456789012',
    '반도체 공정용 고순도 그래파이트 부품',
    'Graphite',
    '반도체 제조 공정에서 사용되는 고순도 그래파이트 부품입니다.',
    '순도 99.99% 이상의 고순도 그래파이트로 제작되어 반도체 제조 공정의 오염을 최소화합니다. 웨이퍼 가열기, 에피택시 챔버, CVD 장비 등에 사용되며, 미세 입자 발생이 적어 클린룸 환경에 적합합니다. 표준 부품 외 맞춤 제작도 가능합니다.',
    NOW() - INTERVAL '50 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p4d5e6f7-a8b9-0123-defa-234567890123',
    '전기 전도성 카본 펠트',
    'Carbon',
    '우수한 전기 전도성과 내화학성을 갖춘 카본 펠트 소재입니다.',
    '배터리 전극, 연료전지, 전기화학 셀 등에 활용됩니다. 면저항 0.1~10Ω/sq 범위에서 조절 가능하며, 다양한 두께와 밀도 옵션을 제공합니다. 화학적 안정성이 뛰어나 강산, 강알칼리 환경에서도 사용 가능합니다.',
    NOW() - INTERVAL '45 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p5e6f7a8-b9c0-1234-efab-345678901234',
    '내마모 그래파이트 베어링',
    'Graphite',
    '고온, 무윤활 환경에서 사용 가능한 자체 윤활 그래파이트 베어링입니다.',
    '고온 환경(500°C 이상)이나 윤활유 사용이 어려운 환경에서 베어링 소재로 활용됩니다. 자체 윤활 특성으로 유지보수가 적으며, 내마모성이 우수합니다. 표준 사이즈 외 특수 규격 제작도 가능하며, 다양한 산업 분야에 적용됩니다.',
    NOW() - INTERVAL '40 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p6f7a8b9-c0d1-2345-fabc-456789012345',
    '탄소섬유 강화 카본 복합재',
    'Carbon',
    '탄소섬유로 강화된 고성능 카본 복합재 소재입니다.',
    '항공기 구조 부품, 고성능 자동차 부품, 산업용 로봇 암 등 고강도가 요구되는 분야에 사용됩니다. 인장 강도 4.5GPa 이상, 압축 강도 2.8GPa 이상의 우수한 물성을 보유하며, 다양한 섬유 배향 패턴으로 제작 가능합니다.',
    NOW() - INTERVAL '35 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p7a8b9c0-d1e2-3456-abcd-567890123456',
    '고온 가열로용 그래파이트 히터',
    'Graphite',
    '고온 가열로에서 사용되는 그래파이트 히터 요소입니다.',
    '진공 가열로, 분위기 가열로 등에서 2000°C 이상의 고온을 생성하는 히터로 사용됩니다. 우수한 전기 전도성과 내열성을 갖추고 있으며, 균일한 온도 분포를 제공합니다. 전력, 전압, 형상 등 고객 요구사항에 맞춰 제작 가능합니다.',
    NOW() - INTERVAL '30 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p8b9c0d1-e2f3-4567-bcde-678901234567',
    '전자기 차폐용 카본 복합판',
    'Carbon',
    '전자기파 차폐 성능이 우수한 카본 복합판입니다.',
    '전자기 간섭(EMI) 차폐가 필요한 전자 장비, 통신 장비 등에 활용됩니다. 40dB 이상의 차폐 효과를 제공하며, 경량화가 가능합니다. 두께 1mm~10mm 범위에서 제작 가능하며, 표면 처리 및 접착 옵션도 제공됩니다.',
    NOW() - INTERVAL '25 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p9c0d1e2-f3a4-5678-cdef-789012345678',
    '화학 반응기용 내식성 그래파이트 라이닝',
    'Graphite',
    '강산, 강알칼리 환경에서 사용되는 내식성 그래파이트 라이닝입니다.',
    '화학 반응기, 저장 탱크, 배관 등 화학 공정 장비의 내부 라이닝 소재로 사용됩니다. 대부분의 산과 알칼리에 대해 우수한 내식성을 보이며, 열전도성도 우수하여 반응 온도 제어에 유리합니다. 맞춤 제작으로 다양한 형상에 적용 가능합니다.',
    NOW() - INTERVAL '20 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, summary, description, created_at)
VALUES
  (
    'p0d1e2f3-a4b5-6789-defa-890123456789',
    '고온 단열용 카본 블랭킷',
    'Carbon',
    '고온 환경에서 우수한 단열 성능을 제공하는 카본 블랭킷입니다.',
    '고온 가열로, 터빈, 엔진 등 고온 장비의 단열재로 사용됩니다. 1000°C 이상의 고온에서도 안정적인 단열 성능을 유지하며, 경량이면서도 내구성이 뛰어납니다. 두께 10mm~100mm 범위에서 제공되며, 다양한 형상으로 가공 가능합니다.',
    NOW() - INTERVAL '15 days'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. inquiries 테이블 (10건 이상)
-- -----------------------------------------------------------------------------
INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i1a2b3c4-d5e6-7890-abcd-ef1234567890',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    '안녕하세요. 고온용 등방성 그래파이트 블록에 대해 문의드립니다. 현재 유리 제조 공정에서 사용 중인 가열로의 온도가 약 1800°C 정도인데, 이 제품이 적합한지 궁금합니다. 또한 규격 400x400x300mm로 10개 정도 필요할 것 같은데, 납기와 단가를 알려주실 수 있을까요?',
    '안녕하세요. 문의해주신 고온용 등방성 그래파이트 블록은 2000°C 이상의 고온 환경에서도 안정적으로 사용 가능하므로, 1800°C 환경에 충분히 적합합니다. 400x400x300mm 규격 10개 주문 시, 제작 납기는 약 4~6주 소요되며, 단가는 수량과 추가 가공 사양에 따라 달라질 수 있어 정확한 견적을 위해 추가 상담이 필요합니다. 자세한 견적 및 납기 일정은 영업 담당자가 직접 연락드리겠습니다.',
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '27 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i2b3c4d5-e6f7-8901-bcde-f12345678901',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'p2b3c4d5-e6f7-8901-bcde-f12345678901',
    '고강도 카본 소재 시트를 자동차 부품 제작에 사용하려고 합니다. 두께 2mm, 크기 500x500mm로 50장 정도 필요합니다. 인장 강도와 탄성 계수에 대한 상세 스펙 시트를 받을 수 있을까요? 그리고 샘플 제공이 가능한지도 확인 부탁드립니다.',
    '고강도 카본 소재 시트는 자동차 부품 제작에 적합한 소재입니다. 요청하신 두께 2mm, 크기 500x500mm 규격으로 제작 가능하며, 상세 스펙 시트는 이메일로 발송해드리겠습니다. 샘플 제공도 가능하며, 샘플 크기는 100x100mm 정도로 제공 가능합니다. 샘플 요청 시 배송 주소를 알려주시면 1~2주 내 발송해드리겠습니다.',
    NOW() - INTERVAL '23 days',
    NOW() - INTERVAL '22 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i3c4d5e6-f7a8-9012-cdef-123456789012',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'p3c4d5e6-f7a8-9012-cdef-123456789012',
    '반도체 공정용 고순도 그래파이트 부품을 찾고 있습니다. CVD 챔버 내부에 사용할 부품인데, 웨이퍼 지지대 역할을 합니다. 직경 300mm, 두께 50mm 정도의 원형 부품이 필요한데, 맞춤 제작이 가능한가요? 순도와 미세 입자 발생량에 대한 데이터도 필요합니다.',
    '반도체 공정용 고순도 그래파이트 부품의 맞춤 제작이 가능합니다. 직경 300mm, 두께 50mm 원형 부품 제작 시, 순도 99.99% 이상을 보장하며, 미세 입자 발생량은 ISO Class 10 이하 수준입니다. 제작 납기는 약 6~8주 소요되며, 상세 도면과 사용 환경 정보를 주시면 정확한 견적을 제공해드리겠습니다.',
    NOW() - INTERVAL '18 days',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i4d5e6f7-a8b9-0123-defa-234567890123',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'p4d5e6f7-a8b9-0123-defa-234567890123',
    '전기 전도성 카본 펠트를 리튬이온 배터리 전극 소재로 검토 중입니다. 면저항 1Ω/sq 정도가 필요하고, 두께는 0.5mm 정도를 원합니다. 최소 주문 수량과 단가를 알려주세요. 또한 배터리 전극용으로 사용 시 추가로 고려해야 할 사항이 있는지도 궁금합니다.',
    '전기 전도성 카본 펠트는 리튬이온 배터리 전극 소재로 적합합니다. 요청하신 면저항 1Ω/sq, 두께 0.5mm 사양으로 제작 가능하며, 최소 주문 수량은 10㎡입니다. 배터리 전극용으로 사용 시, 전해액과의 호환성 및 사이클 수명 테스트가 권장되며, 필요하시면 관련 테스트 데이터를 제공해드릴 수 있습니다. 상세 견적은 수량에 따라 달라지니 영업 담당자가 연락드리겠습니다.',
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '12 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i5e6f7a8-b9c0-1234-efab-345678901234',
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    'p5e6f7a8-b9c0-1234-efab-345678901234',
    '내마모 그래파이트 베어링에 대해 문의드립니다. 고온 환경(약 600°C)에서 회전체 지지용으로 사용하려고 합니다. 하중은 약 500kg 정도이고, 회전 속도는 100rpm 정도입니다. 이 조건에 적합한지, 그리고 내구성 테스트 데이터가 있는지 확인 부탁드립니다.',
    '내마모 그래파이트 베어링은 요청하신 조건(600°C, 500kg 하중, 100rpm)에 적합합니다. 고온 환경에서 자체 윤활 특성으로 우수한 성능을 발휘하며, 유사 조건에서의 내구성 테스트 데이터를 보유하고 있습니다. 정확한 사양 제안을 위해 베어링 치수와 설치 환경에 대한 추가 정보가 필요합니다. 영업 담당자가 상세 상담을 진행하겠습니다.',
    NOW() - INTERVAL '8 days',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i6f7a8b9-c0d1-2345-fabc-456789012345',
    'f6a7b8c9-d0e1-2345-fabc-456789012345',
    'p6f7a8b9-c0d1-2345-fabc-456789012345',
    '탄소섬유 강화 카본 복합재를 산업용 로봇 암에 적용하려고 합니다. 로봇 암의 길이가 약 1.5m이고, 최대 하중은 50kg 정도입니다. 이 조건에 맞는 두께와 섬유 배향 패턴을 추천해주실 수 있을까요? 또한 제작 납기와 단가도 확인 부탁드립니다.',
    '탄소섬유 강화 카본 복합재는 산업용 로봇 암에 적합한 소재입니다. 1.5m 길이, 50kg 하중 조건을 고려할 때, 두께 3~5mm 정도를 권장하며, 섬유 배향은 0°/90° 크로스 플라이 또는 ±45° 패턴이 적합합니다. 정확한 사양 제안을 위해 상세 도면과 작동 조건을 주시면 구조 해석을 통한 최적 설계를 제안해드리겠습니다. 제작 납기는 수량과 형상에 따라 8~12주 소요됩니다.',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i7a8b9c0-d1e2-3456-abcd-567890123456',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'p7a8b9c0-d1e2-3456-abcd-567890123456',
    '고온 가열로용 그래파이트 히터를 진공 가열로에 사용하려고 합니다. 가열로 내부 크기는 500x500x500mm이고, 목표 온도는 2200°C입니다. 필요한 전력과 히터 형상을 추천해주실 수 있을까요? 그리고 진공 환경에서의 사용 이력이 있는지도 확인 부탁드립니다.',
    '고온 가열로용 그래파이트 히터는 진공 가열로에 적합하며, 진공 환경에서의 사용 이력이 풍부합니다. 500x500x500mm 챔버, 2200°C 목표 온도 조건을 고려할 때, 약 50~80kW 정도의 전력이 필요하며, 히터 형상은 챔버 구조에 따라 다양한 옵션을 제안할 수 있습니다. 상세 도면과 가열 프로파일을 주시면 최적의 히터 설계를 제안해드리겠습니다.',
    NOW() - INTERVAL '2 days',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i8b9c0d1-e2f3-4567-bcde-678901234567',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'p8b9c0d1-e2f3-4567-bcde-678901234567',
    '전자기 차폐용 카본 복합판에 대해 문의드립니다. 통신 장비 케이스 내부에 사용하려고 하는데, 두께 2mm, 크기 300x200mm로 20장 정도 필요합니다. 40dB 이상의 차폐 효과를 보장할 수 있는지, 그리고 접착제와의 호환성도 확인 부탁드립니다.',
    '전자기 차폐용 카본 복합판은 요청하신 사양으로 제작 가능하며, 40dB 이상의 차폐 효과를 보장합니다. 두께 2mm, 크기 300x200mm 규격 20장 주문 시, 제작 납기는 약 3~4주 소요됩니다. 일반적인 에폭시 계열 접착제와 호환성이 우수하며, 필요하시면 추천 접착제 리스트를 제공해드릴 수 있습니다. 상세 견적은 영업 담당자가 연락드리겠습니다.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i9c0d1e2-f3a4-5678-cdef-789012345678',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'p9c0d1e2-f3a4-5678-cdef-789012345678',
    '화학 반응기용 내식성 그래파이트 라이닝을 염산 반응기에 적용하려고 합니다. 반응기 내부 직경 1m, 높이 2m 정도인데, 라이닝 두께와 설치 방법에 대해 상담이 필요합니다. 또한 염산 농도 30% 정도, 온도 80°C 환경에서 사용 가능한지 확인 부탁드립니다.',
    '화학 반응기용 내식성 그래파이트 라이닝은 염산 환경에 우수한 내식성을 보입니다. 30% 염산, 80°C 조건에서도 안정적으로 사용 가능하며, 라이닝 두께는 일반적으로 10~20mm 정도를 권장합니다. 설치 방법은 반응기 형상에 따라 맞춤 제작된 블록을 설치하거나, 시트 형태로 라이닝하는 방식이 가능합니다. 상세 도면을 주시면 최적의 설치 방안을 제안해드리겠습니다.',
    NOW() - INTERVAL '12 hours',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i0d1e2f3-a4b5-6789-defa-890123456789',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'p0d1e2f3-a4b5-6789-defa-890123456789',
    '고온 단열용 카본 블랭킷을 가스 터빈 엔진 단열재로 검토 중입니다. 작동 온도는 약 1200°C이고, 두께 50mm 정도를 원합니다. 열전도율과 단열 성능 데이터를 받을 수 있을까요? 또한 진동 환경에서의 내구성도 확인이 필요합니다.',
    '고온 단열용 카본 블랭킷은 가스 터빈 엔진 단열재로 적합합니다. 1200°C 환경에서 안정적인 단열 성능을 유지하며, 두께 50mm 사양의 열전도율은 약 0.1~0.15 W/m·K 수준입니다. 진동 환경에서의 내구성 테스트 데이터를 보유하고 있으며, 필요하시면 관련 자료를 제공해드릴 수 있습니다. 상세 스펙 시트는 이메일로 발송해드리겠습니다.',
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '5 hours'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i1e2f3a4-b5c6-7890-efab-901234567890',
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    '고온용 등방성 그래파이트 블록을 추가로 문의드립니다. 이전에 문의했던 것과는 다른 용도로, 금속 용해로에 사용하려고 합니다. 온도는 약 1900°C이고, 규격 500x500x400mm로 5개 정도 필요합니다. 금속 용해 환경에서의 사용 사례가 있는지도 확인 부탁드립니다.',
    '고온용 등방성 그래파이트 블록은 금속 용해로에 널리 사용되며, 1900°C 환경에 적합합니다. 규격 500x500x400mm 5개 주문 시, 제작 납기는 약 5~7주 소요됩니다. 금속 용해 환경에서의 사용 사례가 풍부하며, 필요하시면 관련 참고 자료를 제공해드릴 수 있습니다. 상세 견적은 영업 담당자가 연락드리겠습니다.',
    NOW() - INTERVAL '3 hours',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (id, user_id, product_id, content, ai_response, created_at, updated_at)
VALUES
  (
    'i2f3a4b5-c6d7-8901-fabc-012345678901',
    'f6a7b8c9-d0e1-2345-fabc-456789012345',
    'p2b3c4d5-e6f7-8901-bcde-f12345678901',
    '고강도 카본 소재 시트 샘플을 받아서 테스트해봤는데, 품질이 만족스럽습니다. 이제 본격적으로 주문하려고 하는데, 두께 3mm, 크기 1000x500mm로 100장 정도 필요합니다. 대량 주문에 대한 할인 혜택이 있는지, 그리고 납기 일정을 확인 부탁드립니다.',
    '고강도 카본 소재 시트 대량 주문 감사드립니다. 두께 3mm, 크기 1000x500mm 규격 100장 주문 시, 수량 할인을 적용해드릴 수 있습니다. 제작 납기는 약 10~12주 소요되며, 정확한 견적과 할인율은 영업 담당자가 직접 연락드려 상세히 안내해드리겠습니다. 추가 문의사항이 있으시면 언제든지 연락 주세요.',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '30 minutes'
  )
ON CONFLICT (id) DO NOTHING;
