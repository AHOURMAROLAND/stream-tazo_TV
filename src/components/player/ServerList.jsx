export default function ServerList({ channels, activeId, onSelect }) {
  if (!channels || !channels.length) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {channels.map((ch, i) => {
          const isActive = activeId === ch.id
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch)}
              className={`
                relative overflow-hidden flex items-center gap-2.5
                px-4 py-2.5 rounded-xl text-sm font-mono
                border group
                transition-all duration-200
                ${isActive
                  ? 'border-tazo-accent/50 text-tazo-bg font-bold scale-[1.02] shadow-lg shadow-tazo-accent/20'
                  : 'bg-tazo-surface border-tazo-border text-tazo-muted2 hover:border-tazo-accent/40 hover:text-tazo-text hover:scale-[1.01] hover:-translate-y-px'
                }
              `}
              style={{ willChange: 'transform' }}
            >
              {/* Active gradient background */}
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-br from-tazo-accent to-tazo-accent2 motion-fade" />
              )}

              {/* Left accent bar */}
              {isActive && <span className="server-active-bar" />}

              {/* Number badge */}
              <span className={`
                relative w-5 h-5 rounded-lg flex items-center justify-center
                text-[10px] font-bold border flex-shrink-0
                transition-all duration-200
                ${isActive
                  ? 'border-tazo-bg/30 text-tazo-bg/80 bg-tazo-bg/10'
                  : 'border-tazo-border text-tazo-muted group-hover:border-tazo-accent/30 group-hover:text-tazo-accent/70'
                }
              `}>
                {i + 1}
              </span>

              <span className="relative">
                {ch.server_name_en || `Server ${i + 1}`}
              </span>

              {/* Live pulse dot */}
              {isActive && (
                <span className="relative w-1.5 h-1.5 ml-auto">
                  <span className="absolute inset-0 rounded-full bg-tazo-bg/70 animate-pulse-live" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Keyboard hint */}
      <p className="motion-fade text-tazo-muted text-[11px] font-mono flex items-center gap-1.5"
         style={{ animationDelay: '0.3s' }}>
        <kbd className="px-1.5 py-0.5 rounded bg-tazo-surface border border-tazo-border text-tazo-muted2 text-[10px]">1</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-tazo-surface border border-tazo-border text-tazo-muted2 text-[10px]">2</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-tazo-surface border border-tazo-border text-tazo-muted2 text-[10px]">3</kbd>
        <span className="ml-1">pour changer de serveur</span>
      </p>
    </div>
  )
}
