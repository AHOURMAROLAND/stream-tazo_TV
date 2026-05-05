export default function ServerList({ channels, activeId, onSelect }) {
  if (!channels || !channels.length) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => onSelect(ch)}
          className={`
            px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 border
            ${activeId === ch.id
              ? 'bg-tazo-accent text-tazo-bg border-tazo-accent font-bold'
              : 'bg-tazo-card text-tazo-muted border-tazo-border hover:border-tazo-accent hover:text-tazo-accent'
            }
          `}
        >
          {ch.server_name_en || `Server ${ch.id}`}
        </button>
      ))}
    </div>
  )
}
