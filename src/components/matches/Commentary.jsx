const EVENT_ICONS = {
  goal:         '⚽',
  yellowcard:   '🟨',
  redcard:      '🟥',
  substitution: '🔄',
  var:          '📺',
  penalty:      '🎯',
  default:      '•',
}

export default function Commentary({ events, loading }) {
  if (loading && !events.length) {
    return (
      <div className="relative overflow-hidden rounded-3xl mt-6">
        <div className="absolute inset-0 bg-tazo-card" />
        <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full bg-tazo-green/40" />
            <h3 className="font-display text-xl text-tazo-text tracking-wider">ÉVÉNEMENTS</h3>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-tazo-surface/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!events.length) return null

  return (
    <div className="relative overflow-hidden rounded-3xl mt-6">
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tazo-border/40">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-tazo-green/60" />
            <h3 className="font-display text-xl text-tazo-text tracking-wider">ÉVÉNEMENTS</h3>
          </div>
          <span className="text-tazo-muted2 text-xs font-mono px-2 py-0.5 rounded-full border border-tazo-border bg-tazo-surface/50">
            {events.length}
          </span>
        </div>

        {/* Events list — newest first */}
        <div className="max-h-72 overflow-y-auto divide-y divide-tazo-border/30">
          {[...events].reverse().map((ev, i) => {
            const type = ev.strType?.toLowerCase().replace(/\s/g, '') || 'default'
            const icon = EVENT_ICONS[type] || EVENT_ICONS.default

            return (
              <div
                key={i}
                className="flex items-start gap-3 px-6 py-3 hover:bg-tazo-surface/30 transition-colors"
              >
                {/* Minute */}
                <span className="font-mono text-tazo-accent text-xs font-bold min-w-[32px] mt-0.5 flex-shrink-0">
                  {ev.strTimeline || ev.intProgress || ''}′
                </span>

                {/* Icon */}
                <span className="text-base leading-none mt-0.5 flex-shrink-0">{icon}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-tazo-text text-xs font-medium leading-snug">
                    {ev.strPlayer || ev.strComment || '—'}
                  </p>
                  {ev.strAssist && (
                    <p className="text-tazo-muted text-[11px] font-mono mt-0.5">
                      Assist : {ev.strAssist}
                    </p>
                  )}
                  {ev.strComment && ev.strPlayer && (
                    <p className="text-tazo-muted2 text-[11px] mt-0.5 leading-snug">
                      {ev.strComment}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
