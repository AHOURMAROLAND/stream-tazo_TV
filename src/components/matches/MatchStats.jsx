export default function MatchStats({ stats, ratings, loading }) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl mt-6">
        <div className="absolute inset-0 bg-tazo-card" />
        <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
        <div className="relative p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-tazo-surface/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats && !ratings.length) return null

  const statRows = stats ? [
    { label: 'Tirs',           home: stats.intHomeShots,   away: stats.intAwayShots   },
    { label: 'Corners',        home: stats.intHomeCorners, away: stats.intAwayCorners },
    { label: 'Cartons jaunes', home: stats.intHomeYellow,  away: stats.intAwayYellow  },
    { label: 'Cartons rouges', home: stats.intHomeRed,     away: stats.intAwayRed     },
  ].filter((r) => r.home != null && r.away != null) : []

  return (
    <div className="mt-6 space-y-4">

      {/* Stats bars */}
      {statRows.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-tazo-card" />
          <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
          <div className="relative">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-tazo-border/40">
              <div className="w-1 h-5 rounded-full bg-tazo-accent/50" />
              <h3 className="font-display text-xl text-tazo-text tracking-wider">STATISTIQUES</h3>
            </div>
            <div className="divide-y divide-tazo-border/30">
              {statRows.map((row) => {
                const h   = parseInt(row.home) || 0
                const a   = parseInt(row.away) || 0
                const tot = h + a
                const pct = tot ? Math.round((h / tot) * 100) : 50
                return (
                  <div key={row.label} className="px-6 py-4">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-tazo-accent font-bold w-8">{row.home ?? '—'}</span>
                      <span className="text-tazo-muted2 tracking-wider">{row.label}</span>
                      <span className="text-tazo-text font-bold w-8 text-right">{row.away ?? '—'}</span>
                    </div>
                    <div className="h-1.5 bg-tazo-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-tazo-accent to-tazo-accent2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Player ratings */}
      {ratings.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-tazo-card" />
          <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
          <div className="relative">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-tazo-border/40">
              <div className="w-1 h-5 rounded-full bg-tazo-orange/50" />
              <h3 className="font-display text-xl text-tazo-text tracking-wider">NOTES JOUEURS</h3>
            </div>
            <div className="divide-y divide-tazo-border/30 max-h-64 overflow-y-auto">
              {ratings.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-tazo-muted text-[10px] font-mono w-6 flex-shrink-0">
                      {p.strPositionShort || '—'}
                    </span>
                    <span className="text-tazo-text text-sm font-medium truncate">
                      {p.strPlayer}
                    </span>
                  </div>
                  {p.intRating && (
                    <span className={`
                      font-mono text-sm font-bold px-2.5 py-1 rounded-xl flex-shrink-0
                      ${parseFloat(p.intRating) >= 7
                        ? 'text-tazo-green bg-tazo-green/10 border border-tazo-green/20'
                        : parseFloat(p.intRating) >= 5
                          ? 'text-tazo-orange bg-tazo-orange/10 border border-tazo-orange/20'
                          : 'text-tazo-red bg-tazo-red/10 border border-tazo-red/20'
                      }
                    `}>
                      {p.intRating}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
