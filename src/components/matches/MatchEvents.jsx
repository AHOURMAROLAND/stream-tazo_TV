import useMatchEvents from '../../hooks/useMatchEvents'

const EVENT_ICONS = {
  goal:   { icon: '⚽', color: 'text-tazo-green',  bg: 'bg-tazo-green/10',  border: 'border-tazo-green/20'  },
  yellow: { icon: '🟨', color: 'text-tazo-orange', bg: 'bg-tazo-orange/10', border: 'border-tazo-orange/20' },
  red:    { icon: '🟥', color: 'text-tazo-red',    bg: 'bg-tazo-red/10',    border: 'border-tazo-red/20'    },
  sub:    { icon: '🔄', color: 'text-tazo-accent',  bg: 'bg-tazo-accent/10', border: 'border-tazo-accent/20' },
}

export default function MatchEvents({ apiMatchId, isLive, homeName, awayName }) {
  const { events, loading } = useMatchEvents(apiMatchId, isLive)

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-tazo-green/60" />
            <h3 className="font-display text-xl text-tazo-text tracking-wider">
              ÉVÉNEMENTS
            </h3>
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-red/10 border border-tazo-red/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tazo-red animate-pulse-live" />
              <span className="text-tazo-red text-[10px] font-mono tracking-wider">Live</span>
            </div>
          )}
        </div>

        {/* Team headers */}
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-tazo-muted2 text-xs font-mono truncate max-w-[35%]">{homeName}</span>
          <span className="text-tazo-muted text-[10px] font-mono">vs</span>
          <span className="text-tazo-muted2 text-xs font-mono truncate max-w-[35%] text-right">{awayName}</span>
        </div>

        {/* Events list */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {loading && events.length === 0 && (
            <div className="flex flex-col gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-10 rounded-xl bg-tazo-surface/60 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <span className="text-2xl">📋</span>
              <p className="text-tazo-muted text-xs font-mono text-center">
                {isLive ? 'En attente d\'événements...' : 'Aucun événement'}
              </p>
            </div>
          )}

          {events.map((ev, i) => {
            const cfg = EVENT_ICONS[ev.type] || EVENT_ICONS.goal
            const isHome = ev.side === 'home'

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${cfg.bg} ${cfg.border} animate-fade-in`}
              >
                {/* Time */}
                <span className="text-tazo-muted2 text-[11px] font-mono w-8 flex-shrink-0 text-center">
                  {ev.time}
                </span>

                {/* Icon */}
                <span className="text-base flex-shrink-0">{cfg.icon}</span>

                {/* Player info — aligned by team side */}
                <div className={`flex-1 flex ${isHome ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex flex-col ${isHome ? 'items-start' : 'items-end'}`}>
                    <span className={`text-xs font-medium ${cfg.color}`}>
                      {ev.player}
                    </span>
                    {ev.assist && (
                      <span className="text-[10px] text-tazo-muted font-mono">
                        assist: {ev.assist}
                      </span>
                    )}
                  </div>
                </div>

                {/* Side indicator */}
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHome ? 'bg-tazo-accent/60' : 'bg-tazo-orange/60'}`} />
              </div>
            )
          })}
        </div>

        {/* API key notice */}
        {!import.meta.env.VITE_APIFOOTBALL_KEY && (
          <p className="mt-4 text-center text-tazo-muted text-[10px] font-mono">
            Ajoute <code className="text-tazo-accent">VITE_APIFOOTBALL_KEY</code> dans <code className="text-tazo-accent">.env</code> pour les événements live
          </p>
        )}
      </div>
    </div>
  )
}
