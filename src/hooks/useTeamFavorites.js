import { useState, useEffect } from 'react'

const KEY = 'tazo_team_favorites'

export default function useTeamFavorites() {
  const [teams, setTeams] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(teams))
  }, [teams])

  const addTeam = (team) => {
    setTeams((prev) =>
      prev.find((t) => t.name === team.name) ? prev : [...prev, team]
    )
  }

  const removeTeam = (name) => {
    setTeams((prev) => prev.filter((t) => t.name !== name))
  }

  const isTeamFav = (name) => teams.some((t) => t.name === name)

  const toggleTeam = (team) => {
    isTeamFav(team.name) ? removeTeam(team.name) : addTeam(team)
  }

  return { teams, toggleTeam, isTeamFav }
}
