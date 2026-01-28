import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
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
  );
}
