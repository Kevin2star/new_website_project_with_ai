// 제품 리스트 컴포넌트

import type { Product } from "@/types/domain";

import { ProductCard } from "@/components/domain/product/product-card";

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
        <h3 className="mb-2 text-lg font-semibold">등록된 제품이 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          현재 조회 가능한 제품이 없습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
