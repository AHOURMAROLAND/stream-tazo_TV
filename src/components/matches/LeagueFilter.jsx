const CDN = 'https://cdn.kora-api.space/uploads/league/'

export default function LeagueFilter({ leagues, active, onChange, liveByLeague = {} }) {
  const totalLive = Object.values(liveByLeague).reduce((a, b) => a + b, 0)

  // Build options with live count label
  const options = leagues.map((lg) => {
    const name      = typeof lg === 'string' ? lg : lg.name
    const liveCount = name === 'all' ? totalLive : (liveByLeague[name] || 0)
    const label     = name === 'all'
      ? `Toutes les compétitions${totalLive > 0 ? ` · ${totalLive} live` : ''}`
      : `${name}${liveCount > 0 ? ` · ${liveCount} live` : ''}`
    return { name, label, liveCount }
  })

  const activeLive = active === 'all' ? totalLive : (liveByLeague[active] || 0)

  return (
    <div className="flex items-center gap-3">
      {/* Select dropdown */}
      <div className="relative flex-1">
        <select
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full appearance-none rounded-xl border px-4 py-2.5 pr-10
            text-sm font-medium outline-none cursor-pointer
            transition-all duration-200
            bg-tazo-card text-tazo-text border-tazo-border
            hover:border-tazo-accent/50 focus:border-tazo-accent/70
            ${active !== 'all' ? 'border-tazo-accent/50 text-tazo-accent' : ''}
          `}
        >
          {options.map(({ name, label }) => (
            <option key={name} value={name}>
              {label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tazo-muted2 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Active league logo — shown inside the select area */}
        {active !== 'all' && (() => {
          const activeLg = leagues.find((lg) =>
            (typeof lg === 'string' ? lg : lg.name) === active
          )
          const logo = activeLg && typeof activeLg !== 'string' ? activeLg.logo : null
          return logo ? (
            <img
              src={`${CDN}${logo}`}
              alt={active}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 object-contain pointer-events-none"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : null
        })()}
      </div>

      {/* Live badge for active league */}
      {activeLive > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-tazo-red/10 border border-tazo-red/20 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-tazo-red animate-pulse-live" />
          <span className="text-tazo-red text-xs font-mono font-bold">{activeLive} live</span>
        </div>
      )}

      {/* Reset button — only when a league is selected */}
      {active !== 'all' && (
        <button
          onClick={() => onChange('all')}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-tazo-card border border-tazo-border hover:border-tazo-red/50 hover:text-tazo-red text-tazo-muted2 flex items-center justify-center transition-all"
          title="Voir toutes les compétitions"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  )
}
