import { useEffect } from 'react'

export default function useKeyboardShortcuts(channels, activeChannel, onSwitch) {
  useEffect(() => {
    if (!channels || !channels.length) return

    const handleKey = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return

      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= channels.length) {
        const target = channels[num - 1]
        if (target && target.id !== activeChannel?.id) {
          onSwitch(target)
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [channels, activeChannel, onSwitch])
}
