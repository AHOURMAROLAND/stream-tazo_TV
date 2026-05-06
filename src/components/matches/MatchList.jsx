import MatchCard from './MatchCard'
import { MatchCardSkeleton } from '../ui/Skeleton'

function SectionLabel({ label, count, accent = false }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-1 h-4 rounded-full ${accent ? 'bg-tazo-red' : 'bg-tazo-border2'}`} />
      <span className="text-xs font-mono font-medium tracking-widest uppercase text-tazo-muted2">
        {label}
      </span>
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
        accent
          ? 'text-tazo-red border-tazo-red/30 bg-tazo-red/10'
          : 'text-tazo-muted border-tazo-border bg-tazo-surface/50'
      }`}>
        {count}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-tazo-border/60 to-transparent" />
    </div>
  )
}

export default function MatchList({ matches, loading, error, compact = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-tazo-red/10 border border-tazo-red/20 flex items-center justify-center">
          <span className="text-tazo-red text-xl">!</span>
        </div>
        <p className="text-tazo-red font-mono text-sm">Erreur : {error}</p>
      </div>
    )
  }

  if (!matches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-tazo-surface border border-tazo-border flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-tazo-muted2 font-mono text-sm">Aucun match trouvé</p>
      </div>
    )
  }

  const live     = matches.filter((m) => parseInt(m.status) === 1)
  const upcoming = matches.filter((m) => parseInt(m.status) === 0)
  const finished = matches.filter((m) => parseInt(m.status) === 2)

  if (compact) {
    const ordered = [...live, ...upcoming, ...finished]
    return (
      <div className="space-y-10">
        {live.length > 0 && (
          <section>
            <SectionLabel label="En direct" count={live.length} accent />
            <div className="flex flex-col gap-2">
              {live.map((m) => <MatchCard key={m.id} match={m} compact />)}
            </div>
          </section>
        )}
        {upcoming.length > 0 && (
          <section>
            <SectionLabel label="À venir" count={upcoming.length} />
            <div className="flex flex-col gap-2">
              {upcoming.map((m) => <MatchCard key={m.id} match={m} compact />)}
            </div>
          </section>
        )}
        {finished.length > 0 && (
          <section>
            <SectionLabel label="Terminés" count={finished.length} />
            <div className="flex flex-col gap-2">
              {finished.map((m) => <MatchCard key={m.id} match={m} compact />)}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {live.length > 0 && (
        <section>
          <SectionLabel label="En direct" count={live.length} accent />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
      {upcoming.length > 0 && (
        <section>
          <SectionLabel label="À venir" count={upcoming.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
      {finished.length > 0 && (
        <section>
          <SectionLabel label="Terminés" count={finished.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {finished.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
