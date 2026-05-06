export default function MatchInfo({ match }) {
  const statusLabel =
    parseInt(match.status) === 1 ? 'En direct' :
    parseInt(match.status) === 2 ? 'Terminé'   : 'À venir'

  const rows = [
    { label: 'Compétition', value: match.league_en },
    { label: 'Date',        value: match.date },
    { label: 'Heure',       value: match.time },
    { label: 'Statut',      value: statusLabel },
    { label: 'Score',       value: match.score !== '-' ? match.score : '—' },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl mt-6">
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />

      <div className="relative">
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-tazo-border/40">
          <div className="w-1 h-4 rounded-full bg-tazo-accent/50" />
          <h3 className="font-display text-lg text-tazo-text tracking-wider">
            INFOS DU MATCH
          </h3>
        </div>

        <div className="divide-y divide-tazo-border/30">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 sm:px-6 py-3">
              <span className="text-tazo-muted text-xs font-mono">{row.label}</span>
              <span className="text-tazo-text text-xs font-mono font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
