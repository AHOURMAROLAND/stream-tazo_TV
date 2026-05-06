import axios from 'axios'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'

export const fetchLiveCommentary = async (eventId) => {
  const res = await axios.get(`${BASE}/eventtimeline.php?id=${eventId}`)
  return res.data?.timeline || []
}
