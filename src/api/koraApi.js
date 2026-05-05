import axios from 'axios'
import { KORA_BASE } from '../utils/constants'
import { getTimestamp, getToday } from '../utils/time'

const api = axios.create({ baseURL: KORA_BASE })

export const fetchMatches = async (date = getToday(), lang = 'en') => {
  const t = getTimestamp()
  const res = await api.get(`/api/matches/${date}/1?t=${t}`)
  return res.data
}

export const fetchMatch = async (id, lang = 'en') => {
  const t = getTimestamp()
  const res = await api.get(`/api/matche/${id}/${lang}?t=${t}`)
  return res.data
}
