import { useState, useMemo } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MatchList from '../components/matches/MatchList'
import DateSlider from '../components/matches/DateSlider'
import FavoritesList from '../components/matches/FavoritesList'
import SearchBar from '../components/matches/SearchBar'
import LeagueFilter from '../components/matches/LeagueFilter'
import NotificationBell from '../components/ui/NotificationBell'
import useMatches from '../hooks/useMatches'
import useSearch from '../hooks/useSearch'
import useFavorites from '../hooks/useFavorites'
import useNotifications from '../hooks/useNotifications'
import { getToday } from '../utils/time'

export default function Home() {
  const [date, setDate]       = useState(getToday())
  const [compact, setCompact] = useState(false)
  const { matches, loading, error } = useMatches(date)
  const { query, setQuery, league, setLeague, leagues, filtered } = useSearch(matches)
  const { favorites } = useFavorites()
  const { requestPermission } = useNotifications(matches, favorites)

  const live  = matches.filter((m) => parseInt(m.status) === 1).length
  const total = matches.length

  const liveByLeague = useMemo(() => {
    const map = {}
    matches
      .filter((m) => parseInt(m.status) === 1)
      .forEach((m) => {
        if (m.league_en) map[m.league_en] = (map[m.league_en] || 0) + 1
      })
    return map
  }, [matches])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="ambient-top" />
      <Header />

      <main className="relative flex-1 z-10">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-tazo-border/30">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tazo-bg pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="motion-left flex items-center gap-2 mb-2">
                  <div className="h-px w-8 bg-tazo-accent/60" />
                  <span className="text-tazo-accent text-[10px] font-mono tracking-[0.3em] uppercase">Football Live</span>
                </div>
                <h1 className="motion-enter font-display text-4xl sm:text-5xl lg:text-6xl text-tazo-text tracking-[0.08em] leading-none"
                    style={{ animationDelay: '0.08s' }}>
                  MATCHS DU <span className="shimmer-text">JOUR</span>
                </h1>
                {!loading && total > 0 && (
                  <p className="motion-fade text-tazo-muted2 text-sm font-mono mt-2"
                     style={{ animationDelay: '0.18s' }}>
                    {total} match{total > 1 ? 's' : ''} programmés
                    {live > 0 && <span className="ml-2 text-tazo-red">· {live} en direct</span>}
                  </p>
                )}
              </div>

              <div className="motion-fade flex items-center gap-3" style={{ animationDelay: '0.14s' }}>
                {/* Live counter */}
                {live > 0 && (
                  <div className="motion-scale flex items-center gap-3 px-4 py-3 rounded-2xl bg-tazo-red/10 border border-tazo-red/20"
                       style={{ animationDelay: '0.22s' }}>
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

                {/* Notification bell */}
                <NotificationBell onRequest={requestPermission} />

                {/* View toggle */}
                <button
                  onClick={() => setCompact((v) => !v)}
                  title={compact ? 'Vue grille' : 'Vue liste'}
                  className="w-10 h-10 rounded-xl bg-tazo-card border border-tazo-border hover:border-tazo-accent/50 flex items-center justify-center text-tazo-muted2 hover:text-tazo-accent transition-all"
                >
                  {compact ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                      <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <FavoritesList />

          <div className="flex flex-col gap-3 mb-8">
            <DateSlider activeDate={date} onChange={setDate} />
            {/* Search + League filter — same row on desktop */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SearchBar query={query} onChange={setQuery} />
              </div>
              {!loading && leagues.length > 1 && (
                <div className="sm:w-72 lg:w-80 flex-shrink-0">
                  <LeagueFilter
                    leagues={leagues}
                    active={league}
                    onChange={setLeague}
                    liveByLeague={liveByLeague}
                  />
                </div>
              )}
            </div>
          </div>

          <MatchList
            matches={filtered}
            loading={loading}
            error={error}
            compact={compact}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
