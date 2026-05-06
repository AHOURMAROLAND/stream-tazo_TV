export default function LeagueFilter({ leagues, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {leagues.map((lg) => (
        <button
          key={lg}
          onClick={() => onChange(lg)}
          className={`
            px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 border whitespace-nowrap
            ${active === lg
              ? 'bg-tazo-accent text-tazo-bg border-tazo-accent font-bold'
              : 'bg-tazo-card text-tazo-muted border-tazo-border hover:border-tazo-accent/50 hover:text-tazo-accent'
            }
          `}
        >
          {lg === 'all' ? 'Toutes' : lg}
        </button>
      ))}
    </div>
  )
}
