export default function ServerList({ channels, activeId, onSelect }) {
  if (!channels || !channels.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {channels.map((ch, i) => {
        const isActive = activeId === ch.id
        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch)}
            className={`
              relative overflow-hidden px-4 py-2.5 rounded-xl text-sm font-mono
              transition-all duration-200 border group
              ${isActive
                ? 'border-tazo-accent/50 text-tazo-bg font-bold'
                : 'bg-tazo-surface border-tazo-border text-tazo-muted2 hover:border-tazo-accent/40 hover:text-tazo-text'
              }
            `}
          >
            {isActive && (
              <span className="absolute inset-0 bg-gradient-to-br from-tazo-accent to-tazo-accent2" />
            )}
            <span className="relative flex items-center gap-2">
              <span className={`text-[10px] ${isActive ? 'text-tazo-bg/70' : 'text-tazo-muted'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {ch.server_name_en || `Server ${i + 1}`}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-tazo-bg/60 animate-pulse-live" />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
