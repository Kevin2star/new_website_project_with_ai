import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowRight, Search, MessageSquare, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
                <span>B2B Industrial Materials</span>
              </div>
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Industrial Carbon & Graphite Products, Simplified
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Browse our comprehensive catalog of carbon and graphite
                materials. Compare specifications, understand applications, and
                submit inquiries with AI-powered assistance.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="gap-2">
                  <Link href="/products">
                    Browse Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Login with Google</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-b border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                How It Works
              </h2>
              <p className="mt-3 text-muted-foreground">
                A streamlined process from product discovery to inquiry
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative rounded-lg border border-border bg-card p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Search className="h-6 w-6 text-accent" />
                </div>
                <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Browse & Understand
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Explore our catalog of industrial carbon and graphite
                  products. Review detailed specifications and applications for
                  each material.
                </p>
              </div>

              <div className="relative rounded-lg border border-border bg-card p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-lg font-semibold">Submit Inquiry</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Describe your specific requirements, usage scenarios, or
                  technical questions. Our system captures all the details you
                  provide.
                </p>
              </div>

              <div className="relative rounded-lg border border-border bg-card p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Get AI Assistance
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Receive instant AI-powered responses to help clarify
                  specifications, suggest alternatives, and guide your
                  procurement decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Section */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Product Categories
              </h2>
              <p className="mt-3 text-muted-foreground">
                Industrial-grade materials for demanding applications
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/products?category=Carbon"
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-colors hover:border-accent/50"
              >
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-semibold">
                    Carbon Products
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    High-performance carbon materials including blocks, brushes,
                    and fiber-reinforced composites for industrial applications.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    View products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/5 transition-transform group-hover:scale-150" />
              </Link>

              <Link
                href="/products?category=Graphite"
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-colors hover:border-accent/50"
              >
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-semibold">
                    Graphite Products
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    Premium graphite electrodes, crucibles, and flexible sheets
                    for metallurgical and thermal management applications.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    View products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/5 transition-transform group-hover:scale-150" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground md:text-3xl">
              Ready to explore our products?
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Start browsing our catalog and submit your first inquiry today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 gap-2"
              asChild
            >
              <Link href="/products">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
