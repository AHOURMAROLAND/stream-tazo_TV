export default function LeagueFilter({ leagues, active, onChange, liveByLeague = {} }) {
  const totalLive = Object.values(liveByLeague).reduce((a, b) => a + b, 0)

  return (
    <div className="flex gap-2 flex-wrap">
      {leagues.map((lg) => {
        const liveCount = lg === 'all' ? totalLive : (liveByLeague[lg] || 0)
        const isActive  = active === lg

        return (
          <button
            key={lg}
            onClick={() => onChange(lg)}
            className={`
              flex items-center gap-1.5
              px-3 py-1.5 rounded-xl text-xs font-mono
              transition-all duration-200 border whitespace-nowrap
              ${isActive
                ? 'bg-tazo-accent text-tazo-bg border-tazo-accent font-bold'
                : 'bg-tazo-card text-tazo-muted border-tazo-border hover:border-tazo-accent/50 hover:text-tazo-accent'
              }
            `}
          >
            {lg === 'all' ? 'Toutes' : lg}

            {liveCount > 0 && (
              <span className={`
                flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none
                ${isActive
                  ? 'bg-tazo-bg/20 text-tazo-bg'
                  : 'bg-tazo-red/15 text-tazo-red border border-tazo-red/20'
                }
              `}>
                <span className="w-1 h-1 rounded-full bg-current animate-pulse shrink-0" />
                {liveCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
