import { useNavigate } from 'react-router-dom'
import { formatTime } from '../../utils/time'
import MatchBadge from './MatchBadge'
import FavoriteButton from '../ui/FavoriteButton'
import useFavorites from '../../hooks/useFavorites'
import useTeamFavorites from '../../hooks/useTeamFavorites'
import useAppStore from '../../store/useAppStore'
import { IconStar } from '../ui/Icons'

export default function MatchCard({ match, compact = false }) {
  const navigate = useNavigate()
  const timezone = useAppStore((s) => s.timezone)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isTeamFav, toggleTeam } = useTeamFavorites()

  const {
    id, status, has_channels,
    home_en, away_en,
    home_logo, away_logo,
    league_en, league_logo, score, time,
  } = match

  const isLive     = parseInt(status) === 1
  const isFinished = parseInt(status) === 2
  const hasStream  = parseInt(has_channels) === 1
  const displayTime = formatTime(time, timezone)

  const scores = score && score !== '-'
    ? score.split(' - ')
    : ['-', '-']

  // ── Compact / list mode ────────────────────────────────────────
  if (compact) {
    return (
      <div
        onClick={() => hasStream && navigate(`/match/${id}`)}
        className={`
          flex items-center justify-between rounded-xl px-4 py-3
          border transition-all duration-200
          ${hasStream
            ? 'bg-tazo-card border-tazo-border hover:border-tazo-accent/50 cursor-pointer hover:bg-tazo-card2'
            : 'bg-tazo-card/50 border-tazo-border/40 opacity-60 cursor-default'
          }
          ${isLive ? 'border-tazo-red/25' : ''}
        `}
      >
        {/* Home */}
        <div className="flex items-center gap-2 w-[35%] min-w-0">
          <div className="w-6 h-6 rounded-lg bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={`https://cdn.kora-api.space/uploads/team/${home_logo}`}
              alt={home_en}
              className="w-5 h-5 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <span className="text-xs font-medium text-tazo-text truncate">{home_en}</span>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-0.5 min-w-[90px]">
          {isLive || isFinished ? (
            <span className="font-mono text-sm font-bold text-tazo-text tracking-wider">
              {scores[0]} : {scores[1]}
            </span>
          ) : (
            <span className="font-mono text-sm text-tazo-accent">{displayTime}</span>
          )}
          <MatchBadge status={status} />
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 w-[35%] min-w-0 justify-end">
          <span className="text-xs font-medium text-tazo-text truncate">{away_en}</span>
          <div className="w-6 h-6 rounded-lg bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={`https://cdn.kora-api.space/uploads/team/${away_logo}`}
              alt={away_en}
              className="w-5 h-5 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <FavoriteButton
            isFav={isFavorite(id)}
            onClick={() => toggleFavorite(match)}
          />
        </div>
      </div>
    )
  }

  // ── Card / grid mode ───────────────────────────────────────────
  return (
    <div
      onClick={() => hasStream && navigate(`/match/${id}`)}
      className={`
        relative overflow-hidden rounded-2xl
        transition-all duration-300
        ${hasStream ? 'cursor-pointer card-hover' : 'opacity-50 cursor-default'}
        ${isLive && hasStream ? 'card-live-border' : ''}
      `}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 bg-gradient-to-br from-tazo-card2/50 to-transparent" />

      {/* Live top bar */}
      {isLive && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tazo-red to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-tazo-red/5 to-transparent" />
        </>
      )}

      {/* Border */}
      <div className={`absolute inset-0 rounded-2xl border transition-colors duration-300 ${
        isLive
          ? 'border-tazo-red/25'
          : hasStream
            ? 'border-tazo-border hover:border-tazo-accent/40'
            : 'border-tazo-border/50'
      }`} />

      <div className="relative p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            {league_logo ? (
              <div className="w-9 h-9 rounded-xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={`https://cdn.kora-api.space/uploads/league/${league_logo}`}
                  alt={league_en}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.target.parentElement.style.display = 'none' }}
                />
              </div>
            ) : (
              <div className="w-1 h-3 rounded-full bg-tazo-accent/40 flex-shrink-0" />
            )}
            <span className="text-tazo-muted2 text-xs font-medium truncate">
              {league_en}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <MatchBadge status={status} />
            <FavoriteButton
              isFav={isFavorite(id)}
              onClick={() => toggleFavorite(match)}
            />
          </div>
        </div>

        {/* Teams row */}
        <div className="flex items-center gap-3">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden transition-colors duration-300">
                <img
                  src={`https://cdn.kora-api.space/uploads/team/${home_logo}`}
                  alt={home_en}
                  className="w-12 h-12 object-contain"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleTeam({ name: home_en, logo: home_logo }) }}
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                  ${isTeamFav(home_en)
                    ? 'bg-tazo-orange border-tazo-orange text-tazo-bg'
                    : 'bg-tazo-card border-tazo-border text-tazo-muted hover:border-tazo-orange hover:text-tazo-orange'
                  }`}
                title={isTeamFav(home_en) ? 'Retirer des favoris équipe' : 'Ajouter équipe aux favoris'}
              >
                <IconStar className="w-2.5 h-2.5" filled={isTeamFav(home_en)} />
              </button>
            </div>
            <span className="text-xs text-tazo-text text-center font-semibold leading-tight w-full truncate px-1">
              {home_en}
            </span>
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            {isLive || isFinished ? (
              <div className="flex items-center gap-1.5 bg-tazo-surface/80 rounded-xl px-3 py-1.5 border border-tazo-border/60">
                <span className="font-display text-2xl text-tazo-text leading-none tracking-wider">
                  {scores[0]}
                </span>
                <span className="text-tazo-muted font-mono text-xs">:</span>
                <span className="font-display text-2xl text-tazo-text leading-none tracking-wider">
                  {scores[1]}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-base text-tazo-accent font-medium tracking-wider">
                  {displayTime}
                </span>
                <span className="text-tazo-muted text-[9px] font-mono tracking-widest uppercase">
                  Kick-off
                </span>
              </div>
            )}
            {hasStream && (
              <span className={`text-[9px] font-mono tracking-wider uppercase mt-0.5 ${
                isLive ? 'text-tazo-red' : 'text-tazo-muted2'
              }`}>
                {isLive ? '▶ Watch' : 'Stream'}
              </span>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden transition-colors duration-300">
                <img
                  src={`https://cdn.kora-api.space/uploads/team/${away_logo}`}
                  alt={away_en}
                  className="w-12 h-12 object-contain"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleTeam({ name: away_en, logo: away_logo }) }}
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                  ${isTeamFav(away_en)
                    ? 'bg-tazo-orange border-tazo-orange text-tazo-bg'
                    : 'bg-tazo-card border-tazo-border text-tazo-muted hover:border-tazo-orange hover:text-tazo-orange'
                  }`}
                title={isTeamFav(away_en) ? 'Retirer des favoris équipe' : 'Ajouter équipe aux favoris'}
              >
                <IconStar className="w-2.5 h-2.5" filled={isTeamFav(away_en)} />
              </button>
            </div>
            <span className="text-xs text-tazo-text text-center font-semibold leading-tight w-full truncate px-1">
              {away_en}
            </span>
          </div>
        </div>

        {/* Bottom stream hint */}
        {hasStream && (
          <div className={`mt-3 pt-3 border-t flex items-center justify-center gap-1.5 ${
            isLive ? 'border-tazo-red/15' : 'border-tazo-border/40'
          }`}>
            <div className={`w-1 h-1 rounded-full ${isLive ? 'bg-tazo-red animate-pulse-live' : 'bg-tazo-accent/50'}`} />
            <span className={`text-[10px] font-mono tracking-wider ${
              isLive ? 'text-tazo-red/80' : 'text-tazo-muted2'
            }`}>
              {isLive ? 'En direct maintenant' : 'Stream disponible'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
