export default function LoadingProductDetail() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-muted/30 py-4">
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      </section>

      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-6xl px-6 space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-9 w-96 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 animate-pulse rounded bg-muted" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-40 animate-pulse rounded-lg border border-border bg-muted" />
        </div>
      </section>
    </main>
  );
}

