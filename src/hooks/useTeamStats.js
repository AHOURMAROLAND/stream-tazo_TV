import { useState, useEffect } from 'react'
import { fetchTeamStats } from '../api/sportsDbApi'

export default function useTeamStats(teamName) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!teamName) return
    setLoading(true)
    fetchTeamStats(teamName)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [teamName])

  return { data, loading }
}
