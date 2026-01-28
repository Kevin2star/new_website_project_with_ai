"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products, type ProductCategory } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function ProductGrid() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") as ProductCategory | null;

  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  const categories: (ProductCategory | "All")[] = ["All", "Carbon", "Graphite"];

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive =
            cat === "All" ? !categoryFilter : categoryFilter === cat;
          const href =
            cat === "All" ? "/products" : `/products?category=${cat}`;

          return (
            <Link
              key={cat}
              href={href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground"
              )}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  product.category === "Carbon"
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                )}
              >
                {product.category}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold leading-tight group-hover:text-accent">
              {product.name}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {product.summary}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              View details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
