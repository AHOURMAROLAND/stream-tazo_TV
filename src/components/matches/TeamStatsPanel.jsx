import useTeamStats from '../../hooks/useTeamStats'
import useTeamFavorites from '../../hooks/useTeamFavorites'
import { IconStar, IconClose } from '../ui/Icons'

export default function TeamStatsPanel({ teamName, teamLogo, leagueName, onClose }) {
  const { data, loading } = useTeamStats(teamName, leagueName)
  const { isTeamFav, toggleTeam } = useTeamFavorites()
  const isFav = isTeamFav(teamName)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-tazo-surface border border-tazo-border rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-tazo-border/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-tazo-card border border-tazo-border/60 flex items-center justify-center overflow-hidden">
              <img
                src={`https://cdn.kora-api.space/uploads/team/${teamLogo}`}
                alt={teamName}
                className="w-9 h-9 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div>
              <h3 className="font-display text-lg text-tazo-text tracking-wide">{teamName}</h3>
              {data?.team?.strCountry && (
                <p className="text-tazo-muted2 text-xs font-mono">{data.team.strCountry}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTeam({ name: teamName, logo: teamLogo })}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all
                ${isFav
                  ? 'bg-tazo-orange/20 border-tazo-orange text-tazo-orange'
                  : 'bg-tazo-card border-tazo-border text-tazo-muted hover:border-tazo-orange hover:text-tazo-orange'
                }
              `}
            >
              <IconStar className="w-3 h-3" filled={isFav} />
              {isFav ? 'Favori' : 'Favori'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-tazo-card border border-tazo-border text-tazo-muted hover:text-tazo-accent flex items-center justify-center transition-colors"
            >
              <IconClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5">
          {loading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-tazo-card rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && data?.team && (
            <div className="space-y-5">
              {/* Team info grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Fondé en',  value: data.team.intFormedYear },
                  { label: 'Stade',     value: data.team.strStadium },
                  { label: 'Capacité',  value: data.team.intStadiumCapacity
                      ? Number(data.team.intStadiumCapacity).toLocaleString()
                      : null },
                  { label: 'Ligue',     value: data.team.strLeague },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label} className="bg-tazo-card border border-tazo-border/60 rounded-2xl p-3">
                    <p className="text-tazo-muted text-[10px] font-mono tracking-wider uppercase mb-1">{row.label}</p>
                    <p className="text-tazo-text text-xs font-medium">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Last results */}
              {data.lastResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 rounded-full bg-tazo-accent/50" />
                    <h4 className="font-display text-base text-tazo-text tracking-wider">DERNIERS RÉSULTATS</h4>
                  </div>
                  <div className="space-y-2">
                    {data.lastResults.slice(0, 5).map((ev, i) => {
                      const homeScore = parseInt(ev.intHomeScore)
                      const awayScore = parseInt(ev.intAwayScore)
                      const isHome    = ev.strHomeTeam === teamName
                      const won  = isHome ? homeScore > awayScore : awayScore > homeScore
                      const draw = homeScore === awayScore

                      return (
                        <div key={i} className="flex items-center gap-3 bg-tazo-card border border-tazo-border/60 rounded-xl px-3 py-2.5">
                          <span className="text-tazo-muted text-[10px] font-mono w-16 flex-shrink-0">{ev.dateEvent}</span>
                          <span className="text-tazo-text text-xs font-medium flex-1 truncate text-center">
                            {ev.strHomeTeam} — {ev.strAwayTeam}
                          </span>
                          <span className="font-mono text-xs font-bold text-tazo-text flex-shrink-0">
                            {ev.intHomeScore} - {ev.intAwayScore}
                          </span>
                          <span className={`
                            w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0
                            ${draw ? 'bg-tazo-muted/20 text-tazo-muted'
                              : won  ? 'bg-tazo-green/20 text-tazo-green'
                              : 'bg-tazo-red/20 text-tazo-red'
                            }
                          `}>
                            {draw ? 'N' : won ? 'V' : 'D'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !data && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-tazo-surface border border-tazo-border flex items-center justify-center">
                <IconClose className="w-5 h-5 text-tazo-muted" />
              </div>
              <p className="text-tazo-muted2 text-sm font-mono">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
