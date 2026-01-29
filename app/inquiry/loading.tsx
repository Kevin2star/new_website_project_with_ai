export default function LoadingInquiry() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6 space-y-6">
          <div className="h-56 animate-pulse rounded-lg border border-border bg-muted" />
          <div className="h-40 animate-pulse rounded-lg border border-border bg-muted" />
        </div>
      </section>
    </main>
  );
}

