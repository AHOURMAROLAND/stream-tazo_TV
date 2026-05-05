import { useEffect, useRef } from 'react'

export default function useAutoSwitch(streamUrl, channels, activeChannel, onSwitch) {
  const timerRef   = useRef(null)
  const attemptRef = useRef(0)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (!streamUrl || !channels || channels.length <= 1) return

    clearTimer()

    timerRef.current = setTimeout(() => {
      const currentIndex = channels.findIndex((c) => c.id === activeChannel?.id)
      const nextIndex    = (currentIndex + 1) % channels.length

      if (nextIndex !== currentIndex) {
        attemptRef.current += 1
        onSwitch(channels[nextIndex])
      }
    }, 8000)

    return () => clearTimer()
  }, [streamUrl, activeChannel])

  return { attempt: attemptRef.current }
}
