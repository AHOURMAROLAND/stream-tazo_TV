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

export const fetchTeamStats = async (teamName, leagueName = '') => {
  const search = await axios.get(`${BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`)
  const teams  = search.data?.teams || []

  if (teams.length === 0) return null

  // 1. Essayer de trouver une correspondance exacte sur le nom
  let team = teams.find((t) => 
    t.strTeam?.toLowerCase() === teamName.toLowerCase() || 
    t.strTeamAlternate?.toLowerCase().includes(teamName.toLowerCase())
  )

  // 2. Si on a la ligue, essayer de filtrer par ligue pour éviter les homonymes (ex: Al-Nassr KSA vs UAE)
  if (leagueName) {
    const leagueLower = leagueName.toLowerCase()
    const filtered = teams.filter((t) => 
      t.strLeague?.toLowerCase().includes(leagueLower) || 
      t.strLeague2?.toLowerCase().includes(leagueLower) ||
      t.strLeague3?.toLowerCase().includes(leagueLower)
    )
    if (filtered.length > 0) {
      // Parmi ceux de la ligue, on prend le meilleur match de nom
      const bestMatchInLeague = filtered.find((t) => t.strTeam?.toLowerCase() === teamName.toLowerCase())
      team = bestMatchInLeague || filtered[0]
    }
  }

  // 3. Fallback sur le premier résultat si rien de mieux
  if (!team) team = teams[0]

  const events = await axios.get(`${BASE}/eventslast.php?id=${team.idTeam}`)
  return {
    team,
    lastResults: events.data?.results || [],
  }
}
