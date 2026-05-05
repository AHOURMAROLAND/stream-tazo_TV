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

  const isLive     = parseInt(status) === 1
  const isFinished = parseInt(status) === 2
  const hasStream  = parseInt(has_channels) === 1
  const displayTime = formatTime(time, timezone)

  const scores = score && score !== '-'
    ? score.split(' - ')
    : ['-', '-']

  return (
    <div
      onClick={() => hasStream && navigate(`/match/${id}`)}
      className={`
        relative overflow-hidden rounded-2xl
        transition-all duration-300
        ${hasStream ? 'cursor-pointer card-hover' : 'opacity-50 cursor-default'}
      `}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 bg-gradient-to-br from-tazo-card2/50 to-transparent" />

      {/* Live top glow bar */}
      {isLive && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tazo-red to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-tazo-red/5 to-transparent" />
        </>
      )}

      {/* Hover accent glow */}
      {hasStream && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-tazo-accent/3 to-transparent pointer-events-none" />
      )}

      {/* Border */}
      <div className={`absolute inset-0 rounded-2xl border transition-colors duration-300 ${
        isLive
          ? 'border-tazo-red/25'
          : hasStream
            ? 'border-tazo-border hover:border-tazo-accent/40'
            : 'border-tazo-border/50'
      }`} />

      {/* Content */}
      <div className="relative p-4">

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1 h-3 rounded-full bg-tazo-accent/40 flex-shrink-0" />
            <span className="text-tazo-muted2 text-[11px] font-mono truncate">
              {league_en}
            </span>
          </div>
          <MatchBadge status={status} />
        </div>

        {/* Teams row */}
        <div className="flex items-center gap-3">

          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://cdn.kora-api.space/uploads/team/${home_logo}`}
                  alt={home_en}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.replaceWith(Object.assign(document.createElement('div'), {
                      className: 'w-10 h-10 flex items-center justify-center',
                      innerHTML: `<span style="font-size:18px">⚽</span>`
                    }))
                  }}
                />
              </div>
            </div>
            <span className="text-[11px] text-tazo-text text-center font-medium leading-tight w-full truncate px-1">
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

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden">
              <img
                src={`https://cdn.kora-api.space/uploads/team/${away_logo}`}
                alt={away_en}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.replaceWith(Object.assign(document.createElement('div'), {
                    className: 'w-10 h-10 flex items-center justify-center',
                    innerHTML: `<span style="font-size:18px">⚽</span>`
                  }))
                }}
              />
            </div>
            <span className="text-[11px] text-tazo-text text-center font-medium leading-tight w-full truncate px-1">
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
