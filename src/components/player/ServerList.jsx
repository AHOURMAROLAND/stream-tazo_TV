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
                transition-all duration-200 border
                ${isActive
                  ? 'border-tazo-accent/50 text-tazo-bg font-bold'
                  : 'bg-tazo-surface border-tazo-border text-tazo-muted2 hover:border-tazo-accent/40 hover:text-tazo-text'
                }
              `}
            >
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-br from-tazo-accent to-tazo-accent2" />
              )}
              <span className={`
                relative w-5 h-5 rounded-lg flex items-center justify-center
                text-[10px] font-bold border flex-shrink-0
                ${isActive
                  ? 'border-tazo-bg/30 text-tazo-bg/80 bg-tazo-bg/10'
                  : 'border-tazo-border text-tazo-muted'
                }
              `}>
                {i + 1}
              </span>
              <span className="relative">
                {ch.server_name_en || `Server ${i + 1}`}
              </span>
              {isActive && (
                <span className="relative w-1.5 h-1.5 rounded-full bg-tazo-bg/60 animate-pulse-live" />
              )}
            </button>
          )
        })}
      </div>

      {/* Keyboard hint */}
      <p className="text-tazo-muted text-[11px] font-mono flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-tazo-surface border border-tazo-border text-tazo-muted2 text-[10px]">1</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-tazo-surface border border-tazo-border text-tazo-muted2 text-[10px]">2</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-tazo-surface border border-tazo-border text-tazo-muted2 text-[10px]">3</kbd>
        <span className="ml-1">pour changer de serveur</span>
      </p>
    </div>
  )
}
