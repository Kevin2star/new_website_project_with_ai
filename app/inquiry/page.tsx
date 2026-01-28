import { Suspense } from "react";

export default function InquiryPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Submit Inquiry
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe your requirements and get instant AI-powered assistance
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <Suspense fallback={<InquiryFormSkeleton />}>
            {/* TODO: InquiryForm 컴포넌트 구현 필요 */}
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="text-muted-foreground">
                Inquiry form will be implemented here.
              </p>
            </div>
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function InquiryFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-lg bg-muted" />
      <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
