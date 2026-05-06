import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import VideoPlayer from '../components/player/VideoPlayer'
import ServerList from '../components/player/ServerList'
import MatchBadge from '../components/matches/MatchBadge'
import MatchInfo from '../components/matches/MatchInfo'
import Commentary from '../components/matches/Commentary'
import MatchStats from '../components/matches/MatchStats'
import TeamStatsPanel from '../components/matches/TeamStatsPanel'
import FavoriteButton from '../components/ui/FavoriteButton'
import { IconSignal, IconStar } from '../components/ui/Icons'
import useMatch from '../hooks/useMatch'
import { MatchPageSkeleton } from '../components/ui/Skeleton'
import useAutoSwitch from '../hooks/useAutoSwitch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import useCommentary from '../hooks/useCommentary'
import useMatchStats from '../hooks/useMatchStats'
import useFavorites from '../hooks/useFavorites'
import useTeamFavorites from '../hooks/useTeamFavorites'
import useAppStore from '../store/useAppStore'

export default function Match() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { match, loading, error } = useMatch(id)

  const [activeChannel, setActiveChannel] = useState(null)
  const [streamUrl, setStreamUrl]         = useState(null)
  const [switchMsg, setSwitchMsg]         = useState(null)
  const [iframeReady, setIframeReady]     = useState(false)
  const [selectedTeam, setSelectedTeam]   = useState(null)

  const { isFavorite, toggleFavorite }   = useFavorites()
  const { isTeamFav, toggleTeam }        = useTeamFavorites()
  const { setMiniPlayer, clearMiniPlayer } = useAppStore()

  // Refs to capture latest values inside cleanup without stale closures
  const streamRef = useRef(null)
  const matchRef  = useRef(null)

  const isLive     = match ? parseInt(match.status) === 1 : false
  const isFinished = match ? parseInt(match.status) === 2 : false

  // Keep matchRef up-to-date
  useEffect(() => { if (match) matchRef.current = match }, [match])

  // Clear any existing mini-player when entering this Match page
  useEffect(() => {
    clearMiniPlayer()
  }, [])

  // On unmount: if a live stream was active, trigger mini-player
  useEffect(() => {
    return () => {
      const m   = matchRef.current
      const url = streamRef.current
      if (url && m && parseInt(m.status) === 1) {
        setMiniPlayer({
          matchId:  m.id,
          src:      url,
          homeName: m.home_en,
          awayName: m.away_en,
          homeLogo: `https://cdn.kora-api.space/uploads/team/${m.home_logo}`,
          awayLogo: `https://cdn.kora-api.space/uploads/team/${m.away_logo}`,
          score:    m.score,
          isLive:   true,
        })
      }
    }
  }, [])

  useDocumentTitle(match)

  const { events, loading: commLoading } = useCommentary(
    match?.api_matche_id,
    isLive
  )

  const { stats, ratings, loading: statsLoading } = useMatchStats(
    match?.api_matche_id,
    isFinished
  )

  // Preconnect to all channel domains
  useEffect(() => {
    if (!match?.channels?.length) return
    match.channels.forEach((ch) => {
      const url = ch.mobile_link || ch.link
      if (!url) return
      try {
        const { origin } = new URL(url)
        if (document.querySelector(`link[href="${origin}"]`)) return
        const link = document.createElement('link')
        link.rel  = 'preconnect'
        link.href = origin
        document.head.appendChild(link)
      } catch (_) {}
    })
  }, [match?.channels])

  // Auto-select first channel
  useEffect(() => {
    if (match?.channels?.length && !activeChannel) {
      handleSelectServer(match.channels[0])
    }
  }, [match])

  const handleSelectServer = (channel) => {
    const url = channel.mobile_link || channel.link || null
    streamRef.current = url        // keep latest url for mini-player cleanup
    setActiveChannel(channel)
    setStreamUrl(url)
    setSwitchMsg(null)
    setIframeReady(false)
  }

  const handleStreamError = () => {
    setSwitchMsg('Stream indisponible — passage au serveur suivant...')
  }

  const handleAutoSwitch = (nextChannel) => {
    setSwitchMsg(`Auto-switch → ${nextChannel.server_name_en}`)
    setTimeout(() => setSwitchMsg(null), 3000)
    handleSelectServer(nextChannel)
  }

  useAutoSwitch(streamUrl, match?.channels, activeChannel, handleAutoSwitch, iframeReady)
  useKeyboardShortcuts(match?.channels, activeChannel, handleSelectServer)

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-tazo-bg">
        <div className="ambient-top" />
        <Header />
        <MatchPageSkeleton />
        <Footer />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────
  // Only show error if we have NO match data at all
  if (error && !match) {
    return (
      <div className="min-h-screen flex flex-col bg-tazo-bg">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-tazo-red/10 border border-tazo-red/20 flex items-center justify-center">
              <span className="text-tazo-red font-mono text-sm">404</span>
            </div>
            <p className="text-tazo-red font-mono text-sm">Match introuvable</p>
            <button
              onClick={() => navigate(-1)}
              className="text-tazo-muted2 hover:text-tazo-accent text-xs font-mono transition-colors"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If no match data and no error — still loading
  if (!match) return null

  const scores = match.score && match.score !== '-'
    ? match.score.split(' - ')
    : ['-', '-']

  return (
    <div className="min-h-screen flex flex-col bg-tazo-bg">
      <div className="ambient-top" />
      <Header />

      <main className="relative flex-1 z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="motion-fade flex items-center gap-2 text-tazo-muted2 hover:text-tazo-accent text-sm font-mono mb-8 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Retour aux matchs
        </button>

        {/* Match hero card */}
        <div className="motion-enter relative overflow-hidden rounded-3xl mb-6"
             style={{ animationDelay: '0.06s' }}>
          <div className="absolute inset-0 bg-tazo-card" />
          <div className="absolute inset-0 bg-gradient-to-br from-tazo-card2 to-transparent" />
          {isLive && (
            <>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tazo-red to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-tazo-red/8 to-transparent" />
            </>
          )}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          <div className={`absolute inset-0 rounded-3xl border ${isLive ? 'border-tazo-red/20' : 'border-tazo-border/60'}`} />

          <div className="relative p-6 sm:p-8">
            {/* League + badge + favorite */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={`https://cdn.kora-api.space/uploads/league/${match.league_logo}`}
                    alt={match.league_en}
                    className="w-10 h-10 object-contain"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                <span className="text-tazo-muted2 text-sm font-mono">{match.league_en}</span>
              </div>
              <div className="flex items-center gap-2">
                <MatchBadge status={match.status} />
                <FavoriteButton
                  isFav={isFavorite(match.id)}
                  onClick={() => toggleFavorite(match)}
                />
              </div>
            </div>

            {/* Teams + score */}
            <div className="flex items-center justify-between gap-4 sm:gap-8">
              <TeamBlock
                name={match.home_en}
                logo={match.home_logo}
                isFav={isTeamFav(match.home_en)}
                onFav={(e) => { e.stopPropagation(); toggleTeam({ name: match.home_en, logo: match.home_logo }) }}
                onClick={() => setSelectedTeam({ name: match.home_en, logo: match.home_logo })}
              />

              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                {isLive || isFinished ? (
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <span className="font-display text-4xl sm:text-5xl lg:text-7xl text-tazo-text leading-none tracking-wider">
                      {scores[0]}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-tazo-muted font-mono text-base sm:text-lg">:</span>
                      {isLive && (
                        <span className="text-[9px] font-mono text-tazo-red tracking-widest uppercase animate-pulse">Live</span>
                      )}
                      {isFinished && (
                        <span className="text-[9px] font-mono text-tazo-muted tracking-widest uppercase">FT</span>
                      )}
                    </div>
                    <span className="font-display text-4xl sm:text-5xl lg:text-7xl text-tazo-text leading-none tracking-wider">
                      {scores[1]}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-2xl sm:text-3xl lg:text-4xl text-tazo-accent font-medium tracking-wider">
                      {match.time}
                    </span>
                    <span className="text-[10px] font-mono text-tazo-muted tracking-widest uppercase">Kick-off</span>
                  </div>
                )}
                <span className="text-tazo-muted text-xs font-mono">{match.date}</span>
              </div>

              <TeamBlock
                name={match.away_en}
                logo={match.away_logo}
                isFav={isTeamFav(match.away_en)}
                onFav={(e) => { e.stopPropagation(); toggleTeam({ name: match.away_en, logo: match.away_logo }) }}
                onClick={() => setSelectedTeam({ name: match.away_en, logo: match.away_logo })}
              />
            </div>
          </div>
        </div>

        {/* Player section — always visible regardless of match status */}
        {match.channels && match.channels.length > 0 && (
          <div className="rounded-3xl border border-tazo-border/60 bg-tazo-card">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-tazo-accent/60" />
                  <h2 className="font-display text-2xl text-tazo-text tracking-wider">
                    {isFinished ? 'REPLAY / RÉSUMÉ' : 'SERVEURS'}
                  </h2>
                  <span className="text-xs font-mono text-tazo-muted2 px-2 py-0.5 rounded-full border border-tazo-border bg-tazo-surface/50">
                    {match.channels.length}
                  </span>
                </div>
                {switchMsg && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tazo-orange/10 border border-tazo-orange/20 animate-fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-tazo-orange animate-pulse" />
                    <span className="text-tazo-orange text-[11px] font-mono">{switchMsg}</span>
                  </div>
                )}
              </div>

              {isFinished && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-tazo-muted/10 border border-tazo-border/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-tazo-muted2" />
                  <span className="text-tazo-muted2 text-xs font-mono">
                    Match terminé — les streams peuvent afficher un résumé ou être indisponibles
                  </span>
                </div>
              )}

              <ServerList
                channels={match.channels}
                activeId={activeChannel?.id}
                onSelect={handleSelectServer}
              />

              <div className="mt-6">
                <VideoPlayer
                  src={streamUrl}
                  onStreamError={handleStreamError}
                  onReady={setIframeReady}
                />
              </div>
            </div>
          </div>
        )}

        {/* No stream / no channels */}
        {(!match.channels || match.channels.length === 0) && (
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-tazo-card" />
            <div className="absolute inset-0 rounded-3xl border border-tazo-border/40" />
            <div className="relative p-8 flex flex-col items-center gap-4 text-center">
              {isFinished ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-tazo-muted/10 border border-tazo-border flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-tazo-muted2">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-display text-xl text-tazo-text tracking-wider mb-1">MATCH TERMINÉ</p>
                    <p className="text-tazo-muted2 text-sm font-mono">
                      Score final : <span className="text-tazo-accent font-bold">{match.score}</span>
                    </p>
                    <p className="text-tazo-muted text-xs font-mono mt-1">Aucun replay disponible</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-tazo-surface border border-tazo-border flex items-center justify-center">
                    <IconSignal className="w-5 h-5 text-tazo-muted2" />
                  </div>
                  <p className="text-tazo-muted2 font-mono text-sm">Aucun stream disponible pour ce match</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Commentary — live or finished */}
        {(isLive || isFinished) && (
          <div className="motion-fade" style={{ animationDelay: '0.22s' }}>
            <Commentary events={events} loading={commLoading} />
          </div>
        )}

        {/* Stats — always shown for finished matches */}
        {isFinished && (
          <div className="motion-fade" style={{ animationDelay: '0.28s' }}>
            <MatchStats match={match} stats={stats} ratings={ratings} loading={statsLoading} />
          </div>
        )}

        {/* Match info */}
        <div className="motion-fade" style={{ animationDelay: '0.34s' }}>
          <MatchInfo match={match} />
        </div>

      </main>
      <Footer />

      {/* Team stats modal */}
      {selectedTeam && (
        <TeamStatsPanel
          teamName={selectedTeam.name}
          teamLogo={selectedTeam.logo}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  )
}

function TeamBlock({ name, logo, onClick, isFav, onFav }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-3 flex-1 min-w-0 cursor-pointer group"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-tazo-accent/5 blur-lg group-hover:bg-tazo-accent/15 transition-all" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-tazo-surface border border-tazo-border/60 group-hover:border-tazo-accent/50 flex items-center justify-center overflow-hidden transition-colors">
          <img
            src={`https://cdn.kora-api.space/uploads/team/${logo}`}
            alt={name}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        {/* Favorite team button */}
        <button
          onClick={onFav}
          className={`
            absolute -top-2 -right-2 w-6 h-6 rounded-full border
            flex items-center justify-center transition-all duration-200
            ${isFav
              ? 'bg-tazo-orange border-tazo-orange text-tazo-bg shadow-lg shadow-tazo-orange/30'
              : 'bg-tazo-card border-tazo-border text-tazo-muted hover:border-tazo-orange hover:text-tazo-orange'
            }
          `}
          title={isFav ? 'Retirer des équipes favorites' : 'Ajouter aux équipes favorites'}
        >
          <IconStar className="w-3 h-3" filled={isFav} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span className="font-body font-semibold text-tazo-text text-center text-xs sm:text-sm lg:text-base leading-tight max-w-[90px] sm:max-w-[130px] group-hover:text-tazo-accent transition-colors">
          {name}
        </span>
        <span className="text-[9px] font-mono text-tazo-muted tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          Voir stats
        </span>
      </div>
    </div>
  )
}
