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

const normalize = (s) => s?.toLowerCase().replace(/[^a-z0-9]/g, '').trim() || ''

export const fetchTeamStats = async (teamName, leagueName = '') => {
  if (!teamName) return null

  const findBestMatch = (teamsList, targetName, targetLeague) => {
    const normTarget = normalize(targetName)
    const normLeague = normalize(targetLeague)
    
    // Priorité 1 : Match exact du nom ET match de la ligue
    if (targetLeague) {
      const match = teamsList.find(t => 
        normalize(t.strTeam) === normTarget && 
        (normalize(t.strLeague).includes(normLeague) || normalize(t.strLeague2).includes(normLeague))
      )
      if (match) return match
    }

    // Priorité 2 : Match exact du nom
    const exactName = teamsList.find(t => normalize(t.strTeam) === normTarget)
    if (exactName) return exactName

    // Priorité 3 : Match partiel (contient le nom)
    const partialName = teamsList.find(t => normalize(t.strTeam).includes(normTarget) || normTarget.includes(normalize(t.strTeam)))
    if (partialName) return partialName

    return null
  }

  // 1. Première tentative avec le nom tel quel
  let search = await axios.get(`${BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`)
  let teams  = search.data?.teams || []
  let team   = findBestMatch(teams, teamName, leagueName)

  // 2. Si pas de match convaincant et qu'il y a un tiret, on essaie avec un espace
  if (!team && teamName.includes('-')) {
    const altName = teamName.replace(/-/g, ' ')
    search = await axios.get(`${BASE}/searchteams.php?t=${encodeURIComponent(altName)}`)
    const altTeams = search.data?.teams || []
    team = findBestMatch(altTeams, altName, leagueName)
  }

  // 3. Si toujours rien, on essaie de chercher juste la fin du nom (ex: "Al-Nassr" -> "Nassr")
  if (!team && teamName.toLowerCase().startsWith('al-')) {
    const shortName = teamName.substring(3)
    search = await axios.get(`${BASE}/searchteams.php?t=${encodeURIComponent(shortName)}`)
    const shortTeams = search.data?.teams || []
    team = findBestMatch(shortTeams, shortName, leagueName)
  }

  if (!team) return null

  const events = await axios.get(`${BASE}/eventslast.php?id=${team.idTeam}`)
  return {
    team,
    lastResults: events.data?.results || [],
  }
}
