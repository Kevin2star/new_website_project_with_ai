// 제품 상세 컴포넌트

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Product } from "@/types/domain";
import { ProductActions } from "@/components/domain/product/product-actions";

import { routes } from "@/lib/constants/routes";
import { STANDARD_SPECIFICATIONS } from "@/lib/constants/product-specs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProductDetail({ product, currentUserId }: { product: Product; currentUserId?: string }) {
  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <section className="border-b border-border bg-muted/30 py-4">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href={routes.products} className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Header */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href={routes.products}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
                {product.productType && (
                  <Badge variant="secondary">{product.productType}</Badge>
                )}
              </div>
              {product.summary ? (
                <p className="text-muted-foreground">{product.summary}</p>
              ) : (
                <p className="text-muted-foreground">제품 요약 정보가 아직 등록되지 않았습니다.</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <ProductActions product={product} currentUserId={currentUserId} />
              <Button size="lg" className="gap-2" asChild>
                <Link href={routes.inquiry(product.id)}>
                  문의하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column: Description and Applications */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-lg border border-border bg-card p-8">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                {product.description ? (
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    상세 설명이 아직 등록되지 않았습니다.
                  </p>
                )}
              </div>

              {product.applications && product.applications.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-8">
                  <h2 className="mb-3 text-lg font-semibold">Applications</h2>
                  <ul className="space-y-2">
                    {product.applications.map((app, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 text-primary">✓</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-border bg-card p-8">
                  <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, spec]) => {
                      // 표준 스펙 키를 한글 라벨로 변환
                      const standardSpec = STANDARD_SPECIFICATIONS.find((s) => s.key === key);
                      const displayLabel = standardSpec
                        ? `${standardSpec.label}${standardSpec.description ? ` (${standardSpec.description})` : ""}`
                        : key;

                      return (
                        <div key={key} className="border-b border-border pb-3 last:border-0">
                          <dt className="text-sm font-medium text-foreground">{displayLabel}</dt>
                          <dd className="mt-1 text-sm text-muted-foreground">
                            {spec.value} {spec.unit && <span>{spec.unit}</span>}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
