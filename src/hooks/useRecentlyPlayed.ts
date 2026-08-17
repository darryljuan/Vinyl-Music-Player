import { useCallback, useEffect, useState } from 'react'
import siteConfig from '../../config/site.config'
import type { Track } from '../types/music'

const KEY = 'myvinyl:recently-played'

export function useRecentlyPlayed() {
  const [recent, setRecent] = useState<Track[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setRecent(JSON.parse(raw))
    } catch {
      // ignore corrupted storage
    }
  }, [])

  const record = useCallback((track: Track) => {
    setRecent(prev => {
      const next = [track, ...prev.filter(t => t.id !== track.id)].slice(0, siteConfig.recentlyPlayedLimit)
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // storage full or unavailable — non-fatal
      }
      return next
    })
  }, [])

  return { recent, record }
}
