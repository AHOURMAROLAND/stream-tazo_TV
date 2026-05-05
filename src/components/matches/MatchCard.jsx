import { useNavigate } from 'react-router-dom'
import { formatTime } from '../../utils/time'
import MatchBadge from './MatchBadge'
import useAppStore from '../../store/useAppStore'

export default function MatchCard({ match }) {
  const navigate = useNavigate()
  const timezone = useAppStore((s) => s.timezone)

  const {
    id, status, has_channels,
    home_en, away_en,
    home_logo, away_logo,
    league_en, score, time,
  } = match

  const isLive    = parseInt(status) === 1
  const hasStream = parseInt(has_channels) === 1
  const displayTime = formatTime(time, timezone)

  const scores = score && score !== '-'
    ? score.split(' - ')
    : ['-', '-']

  return (
    <div
      onClick={() => hasStream && navigate(`/match/${id}`)}
      className={`
        relative bg-tazo-card border rounded-xl p-4
        transition-all duration-300 group
        ${hasStream
          ? 'border-tazo-border hover:border-tazo-accent cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-tazo-accent/10'
          : 'border-tazo-border opacity-60 cursor-default'
        }
        ${isLive ? 'border-tazo-red/30 shadow-sm shadow-tazo-red/10' : ''}
      `}
    >
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-tazo-red via-tazo-accent to-tazo-red rounded-t-xl" />
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-tazo-muted text-xs font-mono truncate max-w-[60%]">
          {league_en}
        </span>
        <MatchBadge status={status} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <TeamSide name={home_en} logo={home_logo} />

        <div className="flex flex-col items-center min-w-[60px]">
          {isLive || parseInt(status) === 2 ? (
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl text-tazo-text tracking-wider">
                {scores[0]}
              </span>
              <span className="text-tazo-muted font-mono text-sm">-</span>
              <span className="font-display text-2xl text-tazo-text tracking-wider">
                {scores[1]}
              </span>
            </div>
          ) : (
            <span className="font-mono text-lg text-tazo-accent font-medium">
              {displayTime}
            </span>
          )}
          {hasStream && (
            <span className="text-[10px] text-tazo-muted mt-1 group-hover:text-tazo-accent transition-colors">
              {isLive ? 'Regarder' : 'Stream dispo'}
            </span>
          )}
        </div>

        <TeamSide name={away_en} logo={away_logo} reverse />
      </div>
    </div>
  )
}

function TeamSide({ name, logo }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="w-11 h-11 rounded-full bg-tazo-surface flex items-center justify-center overflow-hidden border border-tazo-border">
        <img
          src={`https://cdn.kora-api.space/uploads/team/${logo}`}
          alt={name}
          className="w-9 h-9 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      <span className="text-xs text-tazo-text text-center font-medium leading-tight max-w-[80px] truncate">
        {name}
      </span>
    </div>
  )
}
