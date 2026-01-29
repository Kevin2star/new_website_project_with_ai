export default function LoadingProducts() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg border border-border bg-muted"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

