import type { InquiryRow, ProductRow, UserRow } from "@/types/database";
import type { Inquiry, InquiryListItem, Product, User } from "@/types/domain";

import { truncateForPreview } from "@/lib/utils/format";

export function toUser(row: UserRow): User {
  return {
    id: row.id,
    googleId: row.google_id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    summary: row.summary,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function toInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    content: row.content,
    aiResponse: row.ai_response,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toInquiryListItem(row: InquiryRow): InquiryListItem {
  return {
    id: row.id,
    productId: row.product_id,
    createdAt: row.created_at,
    preview: truncateForPreview(row.content),
  };
}
