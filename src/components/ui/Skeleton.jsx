export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-tazo-card rounded-lg animate-pulse ${className}`}
    />
  )
}

export function MatchCardSkeleton() {
  return (
    <div className="bg-tazo-card border border-tazo-border rounded-xl p-4 flex flex-col gap-3">
      <Skeleton className="h-3 w-24" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}
