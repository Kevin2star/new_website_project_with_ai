import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getProductById, products } from "@/lib/products";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
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
    <div className="flex min-h-screen flex-col">
      <Header />

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
              <span className="text-foreground">{product.name}</span>
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
                <span
                  className={cn(
                    "mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium",
                    product.category === "Carbon"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {product.name}
                </h1>
              </div>
              <Button size="lg" className="gap-2" asChild>
                <Link href={`/inquiry?product=${product.id}`}>
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
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Description */}
              <div className="lg:col-span-2">
                <h2 className="mb-4 text-xl font-semibold">Description</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                {/* Applications */}
                <div className="mt-10">
                  <h2 className="mb-4 text-xl font-semibold">Applications</h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {product.applications.map((app) => (
                      <li key={app} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                        <span className="text-muted-foreground">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specifications Sidebar */}
              <div>
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
                  <dl className="space-y-4">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <dt className="text-sm text-muted-foreground">
                          {spec.label}
                        </dt>
                        <dd className="text-right text-sm font-medium">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* CTA Card */}
                <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-6">
                  <h3 className="mb-2 font-semibold">
                    Need custom specifications?
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Our team can help you find the right product for your
                    specific requirements.
                  </p>
                  <Button className="w-full gap-2" asChild>
                    <Link href={`/inquiry?product=${product.id}`}>
                      Submit Inquiry
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
