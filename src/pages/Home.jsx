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

  const live = matches.filter((m) => parseInt(m.status) === 1).length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-display text-4xl text-tazo-text tracking-widest">
              MATCHS DU JOUR
            </h1>
            {live > 0 && (
              <p className="flex items-center gap-2 text-tazo-red text-sm font-mono mt-1">
                <span className="w-2 h-2 rounded-full bg-tazo-red animate-pulse-live" />
                {live} match{live > 1 ? 's' : ''} en direct
              </p>
            )}
          </div>
        </div>

        <MatchFilter activeDate={date} onChange={setDate} />
        <MatchList matches={matches} loading={loading} error={error} />
      </main>
      <Footer />
    </div>
  )
}
