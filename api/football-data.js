export default function handler(req, res) {
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'APIFOOTBALL_KEY manquante. Configurez cette variable d\'environnement.' 
    });
  }
}