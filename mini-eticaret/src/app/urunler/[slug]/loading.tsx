export default function UrunDetayLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-paper-raised" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-paper-raised" />
          <div className="h-8 w-64 animate-pulse rounded bg-paper-raised" />
          <div className="h-6 w-32 animate-pulse rounded bg-paper-raised" />
          <div className="h-20 w-full animate-pulse rounded bg-paper-raised" />
        </div>
      </div>
    </div>
  );
}
