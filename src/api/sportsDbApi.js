import axios from 'axios'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'

export const fetchLeagueInfo = async (leagueName) => {
  const res = await axios.get(`${BASE}/search_all_leagues.php?l=${encodeURIComponent(leagueName)}`)
  return res.data?.countrys?.[0] || null
}

export const fetchTeamInfo = async (teamName) => {
  const res = await axios.get(`${BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`)
  return res.data?.teams?.[0] || null
}

export const fetchMatchStats = async (apiMatchId) => {
  const res = await axios.get(`${BASE}/lookupevent.php?id=${apiMatchId}`)
  return res.data?.events?.[0] || null
}

export const fetchPlayerRatings = async (eventId) => {
  const res = await axios.get(`${BASE}/lookuplineup.php?id=${eventId}`)
  return res.data?.lineup || []
}

export const fetchTeamStats = async (teamName) => {
  const search = await axios.get(`${BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`)
  const team   = search.data?.teams?.[0]
  if (!team) return null

  const events = await axios.get(`${BASE}/eventslast.php?id=${team.idTeam}`)
  return {
    team,
    lastResults: events.data?.results || [],
  }
}
