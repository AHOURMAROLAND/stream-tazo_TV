import { useMemo } from 'react'
import dayjs from 'dayjs'

// Returns expiry state for a finished match
// A match "expires" 30 minutes after its scheduled end time
// end_stream field from kora API gives the expected end time
export default function useMatchExpiry(match) {
  return useMemo(() => {
    if (!match) return { isExpired: false, expiresAt: null, minutesLeft: null }

    const isFinished = parseInt(match.status) === 2
    if (!isFinished) return { isExpired: false, expiresAt: null, minutesLeft: null }

    // Use end_stream if available, otherwise estimate: date + time + 2h + 30min buffer
    let expiresAt
    if (match.end_stream) {
      expiresAt = dayjs(match.end_stream).add(30, 'minute')
    } else {
      // Fallback: kickoff + 2h30 (90min match + 30min buffer)
      expiresAt = dayjs(`${match.date} ${match.time}`).add(150, 'minute')
    }

    const now        = dayjs()
    const isExpired  = now.isAfter(expiresAt)
    const minutesLeft = isExpired ? 0 : expiresAt.diff(now, 'minute')

    return { isExpired, expiresAt, minutesLeft }
  }, [match?.id, match?.status, match?.end_stream])
}
