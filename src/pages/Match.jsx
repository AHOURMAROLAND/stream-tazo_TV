import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import VideoPlayer from '../components/player/VideoPlayer'
import ServerList from '../components/player/ServerList'
import MatchBadge from '../components/matches/MatchBadge'
import useMatch from '../hooks/useMatch'

export default function Match() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { match, loading, error } = useMatch(id)
  const [activeChannel, setActiveChannel] = useState(null)
  const [streamUrl, setStreamUrl]         = useState(null)

  const handleSelectServer = (channel) => {
    setActiveChannel(channel)
    setStreamUrl(channel.link || channel.mobile_link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-tazo-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-tazo-red font-mono">Match introuvable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-tazo-muted hover:text-tazo-accent text-sm font-mono mb-6 transition-colors"
        >
          &larr; Retour
        </button>

        <div className="bg-tazo-card border border-tazo-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-tazo-muted text-sm font-mono">{match.league_en}</span>
            <MatchBadge status={match.status} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <TeamBlock name={match.home_en} logo={match.home_logo} />

            <div className="flex flex-col items-center">
              {parseInt(match.status) !== 0 ? (
                <span className="font-display text-5xl text-tazo-text tracking-widest">
                  {match.score}
                </span>
              ) : (
                <span className="font-mono text-2xl text-tazo-accent">
                  {match.time}
                </span>
              )}
              <span className="text-tazo-muted text-xs font-mono mt-1">{match.date}</span>
            </div>

            <TeamBlock name={match.away_en} logo={match.away_logo} />
          </div>
        </div>

        {match.channels && match.channels.length > 0 && (
          <div className="bg-tazo-card border border-tazo-border rounded-xl p-6">
            <h2 className="font-display text-xl text-tazo-text tracking-wider mb-4">
              SERVEURS DISPONIBLES
            </h2>
            <ServerList
              channels={match.channels}
              activeId={activeChannel?.id}
              onSelect={handleSelectServer}
            />
            {streamUrl && (
              <div className="mt-6">
                <VideoPlayer src={streamUrl} />
              </div>
            )}
            {!streamUrl && (
              <p className="text-tazo-muted text-sm font-mono mt-4">
                Selectionnez un serveur pour lancer le stream
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function TeamBlock({ name, logo }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1">
      <div className="w-16 h-16 rounded-full bg-tazo-surface border border-tazo-border flex items-center justify-center overflow-hidden">
        <img
          src={`https://cdn.kora-api.space/uploads/team/${logo}`}
          alt={name}
          className="w-14 h-14 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      <span className="font-body font-semibold text-tazo-text text-center text-sm max-w-[120px]">
        {name}
      </span>
    </div>
  )
}
