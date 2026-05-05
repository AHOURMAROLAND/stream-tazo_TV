import { useState } from 'react'
import { fetchStreamUrl } from '../api/streamApi'

export default function useStream() {
  const [streamUrl, setStreamUrl] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const loadStream = async (channelId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStreamUrl(channelId)
      setStreamUrl(data.url || data.stream || data.link || null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { streamUrl, loading, error, loadStream }
}
