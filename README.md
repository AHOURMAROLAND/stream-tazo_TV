const API_KEY = process.env.APIFOOTBALL_KEY
  const IS_RAPID_API = API_KEY?.length > 40 || process.env.USE_RAPIDAPI === 'true'