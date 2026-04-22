const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-border bg-card p-6">
    <div className="mb-4 h-4 w-1/3 rounded bg-muted" />
    <div className="space-y-3">
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-2/3 rounded bg-muted" />
    </div>
  </div>
);

export default SkeletonCard;
