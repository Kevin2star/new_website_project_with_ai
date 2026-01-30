"use client";

import type { Product } from "@/types/domain";
import { ProductEditDialog } from "./product-edit-dialog";
import { ProductDeleteDialog } from "./product-delete-dialog";

interface ProductActionsProps {
  product: Product;
  currentUserId?: string;
}

export function ProductActions({ product, currentUserId }: ProductActionsProps) {
  // 로그인하지 않았거나 소유자가 아닌 경우 표시하지 않음
  if (!currentUserId || product.createdBy !== currentUserId) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <ProductEditDialog product={product} />
      <ProductDeleteDialog productId={product.id} productName={product.name} />
    </div>
  );
}
