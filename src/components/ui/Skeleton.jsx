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

export function MatchPageSkeleton() {
  return (
    <div className="relative flex-1 z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Back button */}
      <Skeleton className="h-4 w-32 mb-8 rounded-lg" />

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl mb-6 bg-tazo-card border border-tazo-border/60 p-6 sm:p-8">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.025] to-transparent" />

        {/* League + badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-tazo-border" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Teams + score */}
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Home team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Center score */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <Skeleton className="h-14 sm:h-20 w-28 sm:w-36 rounded-2xl" />
            <Skeleton className="h-2.5 w-20" />
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Player section */}
      <div className="relative overflow-hidden rounded-3xl bg-tazo-card border border-tazo-border/60 p-6 sm:p-8">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.025] to-transparent" />

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 rounded-full bg-tazo-border" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-7 rounded-full" />
        </div>

        {/* Server buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[80, 96, 72, 88].map((w, i) => (
            <Skeleton key={i} className={`h-9 w-${w === 80 ? '20' : w === 96 ? '24' : w === 72 ? '[72px]' : '22'} rounded-xl`} style={{ width: `${w}px` }} />
          ))}
        </div>

        {/* Video placeholder */}
        <Skeleton className="w-full aspect-video rounded-2xl" />
      </div>
    </div>
  )
}
