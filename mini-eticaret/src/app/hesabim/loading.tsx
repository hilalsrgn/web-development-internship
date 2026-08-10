export default function HesabimLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-paper-raised" />
      <div className="mt-8 space-y-3">
        <div className="h-16 animate-pulse rounded-2xl bg-paper-raised" />
        <div className="h-16 animate-pulse rounded-2xl bg-paper-raised" />
        <div className="h-16 animate-pulse rounded-2xl bg-paper-raised" />
      </div>
    </div>
  );
}
