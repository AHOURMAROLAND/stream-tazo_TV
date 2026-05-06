// MatchStats — uses kora match data (always available) + TheSportsDB bonus data when available

function StatBar({ label, home, away }) {
  const h   = parseInt(home) || 0
  const a   = parseInt(away) || 0
  const tot = h + a
  const pct = tot ? Math.round((h / tot) * 100) : 50

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between text-xs font-mono mb-2">
        <span className="text-tazo-accent font-bold w-8">{home ?? '—'}</span>
        <span className="text-tazo-muted2 tracking-wider text-center flex-1">{label}</span>
        <span className="text-tazo-text font-bold w-8 text-right">{away ?? '—'}</span>
      </div>
      <div className="h-1.5 bg-tazo-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-tazo-accent to-tazo-accent2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function MatchStats({ match, stats, ratings, loading }) {
  // Build rows from kora data — always available for finished matches
  const homeScore = parseInt(match?.home_score) || 0
  const awayScore = parseInt(match?.away_score) || 0

  // Kora rows — guaranteed
  const koraRows = [
    { label: 'Buts',  home: homeScore, away: awayScore },
  ]

  // TheSportsDB bonus rows — only when fields are non-null
  const sportsDbRows = stats ? [
    stats.intHomeShots   != null && { label: 'Tirs',           home: stats.intHomeShots,   away: stats.intAwayShots   },
    stats.intHomeCorners != null && { label: 'Corners',        home: stats.intHomeCorners, away: stats.intAwayCorners },
    stats.intHomeYellow  != null && { label: 'Cartons jaunes', home: stats.intHomeYellow,  away: stats.intAwayYellow  },
    stats.intHomeRed     != null && { label: 'Cartons rouges', home: stats.intHomeRed,     away: stats.intAwayRed     },
    stats.intSpectators  != null && { label: 'Spectateurs',    home: stats.intSpectators,  away: null, single: true   },
  ].filter(Boolean) : []

  const allRows = [...koraRows, ...sportsDbRows]

  // Extra info from TheSportsDB
  const hasExtra = stats && (stats.strResult || stats.strVenue || stats.strOfficial)

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl mt-6">
        <div className="absolute inset-0 bg-tazo-card" />
        <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
        <div className="relative p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-tazo-surface/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">

      {/* Stats bars */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-tazo-card" />
        <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
        <div className="relative">
          {/* Header with team names */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-tazo-border/40">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-tazo-accent/50" />
              <h3 className="font-display text-xl text-tazo-text tracking-wider">STATISTIQUES</h3>
            </div>
            {!stats && (
              <span className="text-tazo-muted text-[10px] font-mono px-2 py-0.5 rounded-full border border-tazo-border bg-tazo-surface/50">
                Données kora
              </span>
            )}
          </div>

          {/* Team labels */}
          <div className="flex items-center justify-between px-4 sm:px-6 pt-3 pb-1">
            <span className="text-tazo-accent text-[11px] font-mono font-bold truncate max-w-[35%]">
              {match?.home_en}
            </span>
            <span className="text-tazo-muted text-[10px] font-mono">vs</span>
            <span className="text-tazo-text text-[11px] font-mono font-bold truncate max-w-[35%] text-right">
              {match?.away_en}
            </span>
          </div>

          <div className="divide-y divide-tazo-border/30">
            {allRows.map((row) => (
              row.single ? (
                <div key={row.label} className="px-4 sm:px-6 py-3 flex items-center justify-between">
                  <span className="text-tazo-muted2 text-xs font-mono">{row.label}</span>
                  <span className="text-tazo-text text-xs font-mono font-bold">
                    {Number(row.home).toLocaleString()}
                  </span>
                </div>
              ) : (
                <StatBar key={row.label} label={row.label} home={row.home} away={row.away} />
              )
            ))}
          </div>

          {/* Extra info */}
          {hasExtra && (
            <div className="px-4 sm:px-6 py-4 border-t border-tazo-border/40 space-y-2">
              {stats.strVenue && (
                <div className="flex items-center justify-between">
                  <span className="text-tazo-muted text-[11px] font-mono">Stade</span>
                  <span className="text-tazo-text text-[11px] font-mono">{stats.strVenue}</span>
                </div>
              )}
              {stats.strOfficial && (
                <div className="flex items-center justify-between">
                  <span className="text-tazo-muted text-[11px] font-mono">Arbitre</span>
                  <span className="text-tazo-text text-[11px] font-mono">{stats.strOfficial}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Player ratings — only when TheSportsDB returns them */}
      {ratings && ratings.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-tazo-card" />
          <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
          <div className="relative">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-tazo-border/40">
              <div className="w-1 h-5 rounded-full bg-tazo-orange/50" />
              <h3 className="font-display text-xl text-tazo-text tracking-wider">NOTES JOUEURS</h3>
            </div>
            <div className="divide-y divide-tazo-border/30 max-h-64 overflow-y-auto">
              {ratings.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-4 sm:px-6 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-tazo-muted text-[10px] font-mono w-6 flex-shrink-0">
                      {p.strPositionShort || '—'}
                    </span>
                    <span className="text-tazo-text text-sm font-medium truncate">{p.strPlayer}</span>
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
