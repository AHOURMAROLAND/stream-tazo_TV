import { useState, useMemo } from 'react'

export default function useSearch(matches) {
  const [query, setQuery]   = useState('')
  const [league, setLeague] = useState('all')

  const leagues = useMemo(() => {
    const all = matches.map((m) => m.league_en).filter(Boolean)
    return ['all', ...new Set(all)]
  }, [matches])

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const matchesQuery =
        !query ||
        m.home_en?.toLowerCase().includes(query.toLowerCase()) ||
        m.away_en?.toLowerCase().includes(query.toLowerCase()) ||
        m.league_en?.toLowerCase().includes(query.toLowerCase())

      const matchesLeague = league === 'all' || m.league_en === league

      return matchesQuery && matchesLeague
    })
  }, [matches, query, league])

  return { query, setQuery, league, setLeague, leagues, filtered }
}
