import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// TODO: 실제 제품 데이터는 Supabase에서 가져오도록 구현 필요
function getProductById(id: string) {
  void id;
  // 임시로 null 반환
  return null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <section className="border-b border-border bg-muted/30 py-4">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground"
            >
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Product {id}</span>
          </nav>
        </div>
      </section>

      {/* Product Header */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Product {id}
              </h1>
            </div>
            <Button size="lg" className="gap-2" asChild>
              <Link href={`/inquiry?product=${id}`}>
                Inquire About This Product
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-muted-foreground">
              Product details will be implemented here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
