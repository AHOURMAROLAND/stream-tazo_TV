import { useNavigate } from 'react-router-dom'
import MatchCard from './MatchCard'
import useFavorites from '../../hooks/useFavorites'
import useTeamFavorites from '../../hooks/useTeamFavorites'
import { IconStar } from '../ui/Icons'

function TeamFavCard({ team, onRemove }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-tazo-card border border-tazo-border/60 p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={`https://cdn.kora-api.space/uploads/team/${team.logo}`}
          alt={team.name}
          className="w-10 h-10 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      <span className="text-tazo-text text-sm font-medium flex-1 truncate">{team.name}</span>
      <button
        onClick={() => onRemove(team.name)}
        className="w-7 h-7 rounded-full bg-tazo-orange/20 border border-tazo-orange text-tazo-orange flex items-center justify-center flex-shrink-0 hover:bg-tazo-orange/30 transition-colors"
        title="Retirer des favoris"
      >
        <IconStar className="w-3 h-3" filled />
      </button>
    </div>
  )
}

export default function FavoritesList() {
  const { favorites }              = useFavorites()
  const { teams, toggleTeam }      = useTeamFavorites()

  const hasMatches = favorites.length > 0
  const hasTeams   = teams.length > 0

  if (!hasMatches && !hasTeams) return null

  return (
    <div className="mb-10 space-y-6">

      {/* Favorite matches */}
      {hasMatches && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-4 rounded-full bg-tazo-orange/60" />
            <h2 className="font-display text-xl text-tazo-text tracking-wider flex items-center gap-2">
              <IconStar className="w-4 h-4 text-tazo-orange" filled />
              MATCHS FAVORIS
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
      )}

      {/* Favorite teams */}
      {hasTeams && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-4 rounded-full bg-tazo-accent/60" />
            <h2 className="font-display text-xl text-tazo-text tracking-wider flex items-center gap-2">
              <IconStar className="w-4 h-4 text-tazo-accent" filled />
              ÉQUIPES FAVORITES
            </h2>
            <span className="text-xs font-mono text-tazo-muted2 px-2 py-0.5 rounded-full border border-tazo-border bg-tazo-surface/50">
              {teams.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teams.map((team) => (
              <TeamFavCard
                key={team.name}
                team={team}
                onRemove={(name) => toggleTeam({ name })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
