import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import VideoPlayer from '../components/player/VideoPlayer'
import ServerList from '../components/player/ServerList'
import MatchBadge from '../components/matches/MatchBadge'
import useMatch from '../hooks/useMatch'

export default function Match() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { match, loading, error } = useMatch(id)
  const [activeChannel, setActiveChannel] = useState(null)
  const [streamUrl, setStreamUrl]         = useState(null)

  const handleSelectServer = (channel) => {
    setActiveChannel(channel)
    setStreamUrl(channel.link || channel.mobile_link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-tazo-bg">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-tazo-border" />
              <div className="absolute inset-0 rounded-full border-2 border-tazo-accent border-t-transparent animate-spin" />
            </div>
            <span className="text-tazo-muted2 text-xs font-mono tracking-widest uppercase">Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex flex-col bg-tazo-bg">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-tazo-red/10 border border-tazo-red/20 flex items-center justify-center">
              <span className="text-tazo-red text-2xl">404</span>
            </div>
            <p className="text-tazo-red font-mono text-sm">Match introuvable</p>
            <button onClick={() => navigate(-1)} className="text-tazo-muted2 hover:text-tazo-accent text-xs font-mono transition-colors">
              ← Retour
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isLive     = parseInt(match.status) === 1
  const isFinished = parseInt(match.status) === 2
  const scores     = match.score && match.score !== '-' ? match.score.split(' - ') : ['-', '-']

  return (
    <div className="min-h-screen flex flex-col bg-tazo-bg">
      <div className="ambient-top" />
      <Header />

      <main className="relative flex-1 z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-tazo-muted2 hover:text-tazo-accent text-sm font-mono mb-8 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Retour aux matchs
        </button>

        {/* Match hero card */}
        <div className="relative overflow-hidden rounded-3xl mb-6">
          {/* Background */}
          <div className="absolute inset-0 bg-tazo-card" />
          <div className="absolute inset-0 bg-gradient-to-br from-tazo-card2 to-transparent" />

          {/* Live top bar */}
          {isLive && (
            <>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-tazo-red to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-tazo-red/8 to-transparent" />
            </>
          )}

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Border */}
          <div className={`absolute inset-0 rounded-3xl border ${isLive ? 'border-tazo-red/20' : 'border-tazo-border/60'}`} />

          <div className="relative p-6 sm:p-8">
            {/* League + badge */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-tazo-accent/50" />
                <span className="text-tazo-muted2 text-sm font-mono">{match.league_en}</span>
              </div>
              <MatchBadge status={match.status} />
            </div>

            {/* Teams + score */}
            <div className="flex items-center justify-between gap-4 sm:gap-8">

              {/* Home */}
              <TeamBlock name={match.home_en} logo={match.home_logo} />

              {/* Center */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                {isLive || isFinished ? (
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-display text-5xl sm:text-7xl text-tazo-text leading-none tracking-wider">
                      {scores[0]}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-tazo-muted font-mono text-lg">:</span>
                      {isLive && (
                        <span className="text-[9px] font-mono text-tazo-red tracking-widest uppercase animate-pulse">
                          Live
                        </span>
                      )}
                    </div>
                    <span className="font-display text-5xl sm:text-7xl text-tazo-text leading-none tracking-wider">
                      {scores[1]}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-3xl sm:text-4xl text-tazo-accent font-medium tracking-wider">
                      {match.time}
                    </span>
                    <span className="text-[10px] font-mono text-tazo-muted tracking-widest uppercase">
                      Kick-off
                    </span>
                  </div>
                )}
                <span className="text-tazo-muted text-xs font-mono">{match.date}</span>
              </div>

              {/* Away */}
              <TeamBlock name={match.away_en} logo={match.away_logo} />
            </div>
          </div>
        </div>

        {/* Player section */}
        {match.channels && match.channels.length > 0 ? (
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-tazo-card" />
            <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-full bg-tazo-accent/60" />
                <h2 className="font-display text-2xl text-tazo-text tracking-wider">
                  SERVEURS DISPONIBLES
                </h2>
                <span className="text-xs font-mono text-tazo-muted2 px-2 py-0.5 rounded-full border border-tazo-border bg-tazo-surface/50">
                  {match.channels.length}
                </span>
              </div>

              <ServerList
                channels={match.channels}
                activeId={activeChannel?.id}
                onSelect={handleSelectServer}
              />

              {streamUrl ? (
                <div className="mt-6">
                  <VideoPlayer src={streamUrl} />
                </div>
              ) : (
                <div className="mt-6 aspect-video rounded-2xl bg-tazo-surface/50 border border-tazo-border/40 border-dashed flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-tazo-surface border border-tazo-border flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-tazo-muted2">
                      <polygon points="5,3 19,12 5,21" fill="currentColor" opacity="0.6"/>
                    </svg>
                  </div>
                  <p className="text-tazo-muted2 text-sm font-mono">
                    Sélectionnez un serveur pour lancer le stream
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-tazo-border/40 border-dashed p-12 flex flex-col items-center gap-3">
            <span className="text-3xl">📡</span>
            <p className="text-tazo-muted2 font-mono text-sm">Aucun stream disponible pour ce match</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function TeamBlock({ name, logo }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-tazo-accent/5 blur-lg" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden">
          <img
            src={`https://cdn.kora-api.space/uploads/team/${logo}`}
            alt={name}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      </div>
      <span className="font-body font-semibold text-tazo-text text-center text-sm sm:text-base leading-tight max-w-[120px]">
        {name}
      </span>
    </div>
  )
}
