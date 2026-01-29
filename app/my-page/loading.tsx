export default function LoadingMyPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-border bg-muted"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

