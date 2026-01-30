// 도메인 모델 타입 (DB 스키마 기준, 앱에서 사용하는 camelCase)

export type ProductType = "Molded" | "Extruded" | "CIP (Isotropic)";

export interface User {
  id: string;
  googleId: string;
  email: string | null;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  value: string;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  productType: ProductType | null;
  summary: string | null;
  description: string | null;
  applications: string[];
  specifications: Record<string, ProductSpecification>;
  createdAt: string;
  createdBy: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  productId: string;
  content: string;
  aiResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 마이페이지 목록용: productId, created_at, content truncate(preview) 등 */
export interface InquiryListItem extends Pick<Inquiry, "id" | "productId" | "createdAt"> {
  /** content 앞부분 잘라서 사용 (DB 컬럼 없음) */
  preview: string;
}
