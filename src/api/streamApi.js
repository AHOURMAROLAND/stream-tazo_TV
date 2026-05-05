import axios from 'axios'
import { MESHIFY_BASE } from '../utils/constants'

const api = axios.create({ baseURL: MESHIFY_BASE })

export const fetchStreamUrl = async (channelId) => {
  const res = await api.post('/v1/channel', {
    channel: channelId,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin':  'https://vip.kora-top.zip',
      'Referer': 'https://vip.kora-top.zip/',
    }
  })
  return res.data
}
