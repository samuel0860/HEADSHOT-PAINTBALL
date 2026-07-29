export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return <div className={`skeleton rounded-lg ${height} ${width} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
      <Skeleton height="h-6" width="w-1/2" />
      <Skeleton height="h-10" width="w-3/4" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton height="h-5" width="w-1/4" />
          <Skeleton height="h-5" width="w-1/3" />
          <Skeleton height="h-5" width="w-1/4" />
          <Skeleton height="h-5" width="w-1/6" />
        </div>
      ))}
    </div>
  );
}
