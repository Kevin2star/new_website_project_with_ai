import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getProducts } from "@/app/actions/products";
import { ProductList } from "@/components/domain/product/product-list";
import { routes } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Products
              </h1>
              <p className="mt-2 text-muted-foreground">
                Browse our catalog of industrial carbon and graphite materials
              </p>
            </div>
            <Button asChild>
              <Link href={routes.newProduct}>
                <Plus className="h-4 w-4" />
                새 제품 등록
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductList products={products} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-lg border border-border bg-muted"
        />
      ))}
    </div>
  );
}
