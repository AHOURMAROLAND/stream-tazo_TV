import MatchCard from './MatchCard'
import useFavorites from '../../hooks/useFavorites'

export default function FavoritesList() {
  const { favorites } = useFavorites()

  if (!favorites.length) return null

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-4 rounded-full bg-tazo-orange/60" />
        <h2 className="font-display text-xl text-tazo-text tracking-wider flex items-center gap-2">
          <span className="text-tazo-orange">★</span>
          FAVORIS
        </h2>
        <span className="text-xs font-mono text-tazo-muted2 px-2 py-0.5 rounded-full border border-tazo-border bg-tazo-surface/50">
          {favorites.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}
