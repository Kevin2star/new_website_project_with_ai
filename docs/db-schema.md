# 🗄️ 데이터베이스 설계 가이드

## DY Carbon 프로젝트 데이터베이스 스키마

---

## 1. 개요

### 데이터베이스 플랫폼
- **플랫폼**: Supabase (PostgreSQL)
- **버전**: PostgreSQL 15+
- **보안**: Row Level Security (RLS) 활성화

### 설계 원칙
1. **정규화**: 데이터 중복 최소화
2. **보안**: RLS를 통한 데이터 접근 제어
3. **확장성**: Phase 2 기능 추가를 고려한 구조
4. **타입 안정성**: Supabase 자동 생성 타입 활용

---

## 2. 테이블 구조

### 2.1 `users` 테이블

#### 목적
Google OAuth를 통한 사용자 정보 저장

#### 스키마
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
```

#### 필드 설명
| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| `id` | UUID | 내부 사용자 ID | PRIMARY KEY |
| `google_id` | TEXT | Google OAuth ID | UNIQUE, NOT NULL |
| `name` | TEXT | 사용자 이름 | NOT NULL |
| `email` | TEXT | 이메일 주소 | UNIQUE, NOT NULL |
| `created_at` | TIMESTAMPTZ | 생성 시점 | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | 수정 시점 | DEFAULT NOW() |

#### RLS 정책
```sql
-- 사용자는 자신의 정보만 조회 가능
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

### 2.2 `products` 테이블

#### 목적
제품 정보 저장 (Phase 1: 읽기 전용)

#### 스키마
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Carbon', 'Graphite')),
  summary TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

#### 필드 설명
| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| `id` | UUID | 제품 ID | PRIMARY KEY |
| `name` | TEXT | 제품명 | NOT NULL |
| `category` | TEXT | 카테고리 | NOT NULL, CHECK (Carbon/Graphite) |
| `summary` | 한 줄 요약 | TEXT | NOT NULL |
| `description` | 상세 설명 | TEXT | NULL 허용 |
| `created_at` | TIMESTAMPTZ | 등록 시점 | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | 수정 시점 | DEFAULT NOW() |

#### RLS 정책
```sql
-- 모든 인증된 사용자가 제품 조회 가능 (Phase 1: 읽기 전용)
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Phase 1에서는 관리자만 수정 가능 (추후 구현)
-- CREATE POLICY "Admins can manage products"
--   ON products FOR ALL
--   TO authenticated
--   USING (is_admin(auth.uid()));
```

---

### 2.3 `inquiries` 테이블

#### 목적
사용자 문의 및 AI 응답 저장

#### 스키마
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_inquiries_user_id ON inquiries(user_id);
CREATE INDEX idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
```

#### 필드 설명
| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| `id` | UUID | 문의 ID | PRIMARY KEY |
| `user_id` | UUID | 작성자 ID | NOT NULL, FK → users |
| `product_id` | UUID | 문의 대상 제품 ID | NOT NULL, FK → products |
| `content` | TEXT | 문의 텍스트 | NOT NULL |
| `ai_response` | TEXT | AI 응답 결과 | NULL 허용 (초기 생성 시) |
| `created_at` | TIMESTAMPTZ | 문의 시점 | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | 수정 시점 | DEFAULT NOW() |

#### RLS 정책
```sql
-- 사용자는 자신의 문의만 조회 가능
CREATE POLICY "Users can view own inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 사용자는 자신의 문의만 생성 가능
CREATE POLICY "Users can create own inquiries"
  ON inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 문의만 수정 가능
CREATE POLICY "Users can update own inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 문의만 삭제 가능
CREATE POLICY "Users can delete own inquiries"
  ON inquiries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## 3. 관계형 다이어그램

```
users
  │
  │ 1:N
  │
  └─── inquiries (user_id)
         │
         │ N:1
         │
         └─── products (product_id)
```

### 관계 설명
- **users ↔ inquiries**: 1:N (한 사용자는 여러 문의 작성 가능)
- **products ↔ inquiries**: 1:N (한 제품에 대해 여러 문의 가능)

---

## 4. 트리거 및 함수

### 4.1 `updated_at` 자동 업데이트 트리거

```sql
-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블 트리거
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- products 테이블 트리거
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- inquiries 테이블 트리거
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. 초기 데이터 (Seed Data)

### 5.1 샘플 제품 데이터

```sql
-- Carbon 제품 예시
INSERT INTO products (name, category, summary, description) VALUES
(
  '고강도 카본 블록',
  'Carbon',
  '산업용 고강도 카본 블록으로 내열성과 내구성이 뛰어납니다.',
  '이 제품은 고온 환경에서도 안정적인 성능을 제공하며, 다양한 산업 분야에서 활용됩니다.'
),
(
  '그래파이트 전극',
  'Graphite',
  '전기 전도성이 우수한 그래파이트 전극입니다.',
  '배터리 및 전기화학 분야에서 널리 사용되는 고품질 그래파이트 전극입니다.'
);

-- 추가 샘플 데이터는 Phase 1 구현 시 확장
```

---

## 6. Supabase 설정

### 6.1 RLS 활성화

모든 테이블에 대해 RLS를 활성화해야 합니다:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
```

### 6.2 인증 설정

1. **Supabase Dashboard** → **Authentication** → **Providers**
2. **Google OAuth** 활성화
3. Google Cloud Console에서 OAuth 클라이언트 ID/Secret 설정
4. 콜백 URL 설정: `https://your-project.supabase.co/auth/v1/callback`

---

## 7. 타입 생성

### 7.1 Supabase 타입 자동 생성

```bash
# Supabase CLI 설치 (선택사항)
npm install -g supabase

# 타입 생성
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

또는 Supabase Dashboard에서 직접 SQL을 실행하여 스키마를 생성한 후, 타입을 자동 생성할 수 있습니다.

---

## 8. Phase 2 확장 고려사항

### 8.1 추가 테이블 (예정)

```sql
-- 문의 상태 관리
CREATE TABLE inquiry_status (
  id UUID PRIMARY KEY,
  inquiry_id UUID REFERENCES inquiries(id),
  status TEXT CHECK (status IN ('received', 'reviewing', 'responded')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 산업 태그 (다대다 관계)
CREATE TABLE industries (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE product_industries (
  product_id UUID REFERENCES products(id),
  industry_id UUID REFERENCES industries(id),
  PRIMARY KEY (product_id, industry_id)
);

-- 제품 물성 정보
CREATE TABLE product_properties (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  property_name TEXT NOT NULL,
  property_value TEXT NOT NULL,
  unit TEXT
);
```

### 8.2 인덱스 최적화

Phase 2에서 데이터가 증가하면 추가 인덱스가 필요할 수 있습니다:

```sql
-- 복합 인덱스 예시
CREATE INDEX idx_inquiries_user_product ON inquiries(user_id, product_id);
CREATE INDEX idx_inquiries_created_at_desc ON inquiries(created_at DESC);
```

---

## 9. 마이그레이션 전략

### 9.1 초기 마이그레이션

1. Supabase Dashboard → **SQL Editor**에서 스키마 생성
2. RLS 정책 적용
3. 트리거 생성
4. 샘플 데이터 삽입 (선택사항)

### 9.2 버전 관리

- Supabase 마이그레이션 파일 관리 (선택사항)
- 또는 SQL 스크립트를 프로젝트에 포함

---

## 10. 보안 체크리스트

- [ ] 모든 테이블에 RLS 활성화
- [ ] 인증된 사용자만 데이터 접근 가능하도록 정책 설정
- [ ] 사용자는 자신의 데이터만 수정/삭제 가능
- [ ] 외래 키 제약조건으로 데이터 무결성 보장
- [ ] 민감한 정보는 암호화 고려 (Phase 2)

---

## 11. 참고 자료

- [Supabase PostgreSQL Documentation](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase TypeScript Types](https://supabase.com/docs/reference/javascript/typescript-support)

---

**작성일**: 2026-01-28  
**버전**: 1.0.0
