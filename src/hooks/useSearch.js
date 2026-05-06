import { useState, useMemo } from 'react'

export default function useSearch(matches) {
  const [query, setQuery]   = useState('')
  const [league, setLeague] = useState('all')

  const leagues = useMemo(() => {
    const map = new Map()
    matches.forEach((m) => {
      if (m.league_en && !map.has(m.league_en)) {
        map.set(m.league_en, m.league_logo || null)
      }
    })
    const entries = [{ name: 'all', logo: null }]
    map.forEach((logo, name) => entries.push({ name, logo }))
    return entries
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
