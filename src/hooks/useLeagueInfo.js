import { useState, useEffect } from 'react'
import { fetchLeagueInfo } from '../api/sportsDbApi'

export default function useLeagueInfo(leagueName) {
  const [league, setLeague] = useState(null)

  useEffect(() => {
    if (!leagueName) return
    fetchLeagueInfo(leagueName)
      .then(setLeague)
      .catch(() => {})
  }, [leagueName])

  return league
}
