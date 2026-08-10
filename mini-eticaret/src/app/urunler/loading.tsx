export default function UrunlerLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-paper-raised" />
      <div className="mt-6 h-8 w-72 animate-pulse rounded-full bg-paper-raised" />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-paper-raised"
          />
        ))}
      </div>
    </div>
  );
}
