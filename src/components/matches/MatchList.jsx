import MatchCard from './MatchCard'
import { MatchCardSkeleton } from '../ui/Skeleton'

export default function MatchList({ matches, loading, error }) {
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
      <div className="flex items-center justify-center h-40 text-tazo-red font-mono text-sm">
        Erreur : {error}
      </div>
    )
  }

  if (!matches.length) {
    return (
      <div className="flex items-center justify-center h-40 text-tazo-muted font-mono text-sm">
        Aucun match disponible
      </div>
    )
  }

  const live     = matches.filter((m) => parseInt(m.status) === 1)
  const upcoming = matches.filter((m) => parseInt(m.status) === 0)
  const finished = matches.filter((m) => parseInt(m.status) === 2)
  const ordered  = [...live, ...upcoming, ...finished]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ordered.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
