export default function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-tazo-card/80 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}

export function MatchCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-tazo-card border border-tazo-border/50 p-4">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 rounded-full bg-tazo-border" />
          <Skeleton className="h-2.5 w-28" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* Teams */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-2 w-10" />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-3 pt-3 border-t border-tazo-border/40 flex justify-center">
        <Skeleton className="h-2.5 w-28" />
      </div>
    </div>
  )
}
