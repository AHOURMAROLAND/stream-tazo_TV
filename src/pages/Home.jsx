import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MatchList from '../components/matches/MatchList'
import MatchFilter from '../components/matches/MatchFilter'
import useMatches from '../hooks/useMatches'
import { getToday } from '../utils/time'

export default function Home() {
  const [date, setDate] = useState(getToday())
  const { matches, loading, error } = useMatches(date)

  const live     = matches.filter((m) => parseInt(m.status) === 1).length
  const total    = matches.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ambient background */}
      <div className="ambient-top" />

      <Header />

      <main className="relative flex-1 z-10">
        {/* Hero section */}
        <div className="relative overflow-hidden border-b border-tazo-border/30">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tazo-bg" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px w-8 bg-tazo-accent/60" />
                  <span className="text-tazo-accent text-[10px] font-mono tracking-[0.3em] uppercase">
                    Football Live
                  </span>
                </div>
                <h1 className="font-display text-5xl sm:text-6xl text-tazo-text tracking-[0.08em] leading-none">
                  MATCHS DU{' '}
                  <span className="shimmer-text">JOUR</span>
                </h1>
                {!loading && total > 0 && (
                  <p className="text-tazo-muted2 text-sm font-mono mt-2">
                    {total} match{total > 1 ? 's' : ''} programmés
                    {live > 0 && (
                      <span className="ml-2 text-tazo-red">
                        · {live} en direct
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Live counter */}
              {live > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-tazo-red/10 border border-tazo-red/20 self-start sm:self-auto">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-tazo-red animate-pulse-live" />
                    <div className="absolute inset-0 rounded-full bg-tazo-red/40 animate-ping" />
                  </div>
                  <div>
                    <div className="font-display text-2xl text-tazo-red leading-none">{live}</div>
                    <div className="text-[9px] font-mono text-tazo-red/70 tracking-widest uppercase">Live now</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <MatchFilter activeDate={date} onChange={setDate} />
          <MatchList matches={matches} loading={loading} error={error} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
