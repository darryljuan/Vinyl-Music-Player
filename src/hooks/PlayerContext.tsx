import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import type { RepeatMode, Track } from '../types/music'
import { useRecentlyPlayed } from './useRecentlyPlayed'
import { useFavourites } from './useFavourites'

type PlayerContextValue = {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  isFullPlayerOpen: boolean
  currentTime: number
  duration: number
  volume: number
  shuffle: boolean
  repeat: RepeatMode
  error: string | null
  favouriteSongs: Set<string>
  favouriteAlbums: Set<string>
  recentlyPlayed: Track[]
  playTrack: (track: Track, contextQueue?: Track[]) => void
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  addToQueue: (track: Track) => void
  playNextInQueue: (track: Track) => void
  removeFromQueue: (id: string) => void
  clearQueue: () => void
  toggleFavouriteSong: (id: string) => void
  toggleFavouriteAlbum: (id: string) => void
  openFullPlayer: () => void
  closeFullPlayer: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullPlayerOpen, setFullPlayerOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.85)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<RepeatMode>('off')
  const [error, setError] = useState<string | null>(null)
  const originalQueueRef = useRef<Track[]>([])

  const { recent, record } = useRecentlyPlayed()
  const { favouriteSongs, favouriteAlbums, toggleSong, toggleAlbum } = useFavourites()

  const currentTrack = queue[queueIndex] ?? null

  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration || 0))
    audio.addEventListener('ended', () => handleEndedRef.current())
    audio.addEventListener('error', () => setError('Unable to play this track. Please try again.'))

    return () => {
      audio.pause()
      audio.src = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playIndex = useCallback((index: number, list: Track[] = queue) => {
    const track = list[index]
    if (!track) return
    setQueueIndex(index)
    setError(null)
    const audio = audioRef.current
    if (audio) {
      audio.src = track.path
      audio.play().catch(() => setError('Unable to play this track. Please try again.'))
    }
    setIsPlaying(true)
    record(track)
  }, [queue, record])

  const playNext = useCallback(() => {
    if (queue.length === 0) return
    if (repeat === 'one') {
      playIndex(queueIndex)
      return
    }
    const nextIndex = queueIndex + 1
    if (nextIndex < queue.length) {
      playIndex(nextIndex)
    } else if (repeat === 'all') {
      playIndex(0)
    } else {
      setIsPlaying(false)
    }
  }, [queue, queueIndex, repeat, playIndex])

  const handleEndedRef = useRef(playNext)
  useEffect(() => {
    handleEndedRef.current = playNext
  }, [playNext])

  const playTrack = useCallback(
    (track: Track, contextQueue?: Track[]) => {
      const baseList = contextQueue && contextQueue.length > 0 ? contextQueue : [track]
      originalQueueRef.current = baseList
      const list = shuffle ? shuffleArray(baseList) : baseList
      const idx = Math.max(
        0,
        list.findIndex(t => t.id === track.id)
      )
      setQueue(list)
      playIndex(idx, list)
    },
    [shuffle, playIndex]
  )

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => setError('Unable to play this track. Please try again.'))
      setIsPlaying(true)
    }
  }, [isPlaying, currentTrack])

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    const prevIndex = queueIndex - 1
    if (prevIndex >= 0) playIndex(prevIndex)
  }, [queueIndex, playIndex])

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const next = !prev
      const base = originalQueueRef.current.length > 0 ? originalQueueRef.current : queue
      const list = next ? shuffleArray(base) : base
      const idx = currentTrack ? Math.max(0, list.findIndex(t => t.id === currentTrack.id)) : 0
      setQueue(list)
      setQueueIndex(idx)
      return next
    })
  }, [queue, currentTrack])

  const cycleRepeat = useCallback(() => {
    setRepeat(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
  }, [])

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track])
    originalQueueRef.current = [...originalQueueRef.current, track]
  }, [])

  const playNextInQueue = useCallback(
    (track: Track) => {
      setQueue(prev => {
        const next = [...prev]
        next.splice(queueIndex + 1, 0, track)
        return next
      })
    },
    [queueIndex]
  )

  const removeFromQueue = useCallback(
    (id: string) => {
      setQueue(prev => prev.filter((t, i) => t.id !== id || i === queueIndex))
    },
    [queueIndex]
  )

  const clearQueue = useCallback(() => {
    if (!currentTrack) {
      setQueue([])
      return
    }
    setQueue([currentTrack])
    setQueueIndex(0)
  }, [currentTrack])

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      isFullPlayerOpen,
      currentTime,
      duration,
      volume,
      shuffle,
      repeat,
      error,
      favouriteSongs,
      favouriteAlbums,
      recentlyPlayed: recent,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      seek,
      setVolume,
      toggleShuffle,
      cycleRepeat,
      addToQueue,
      playNextInQueue,
      removeFromQueue,
      clearQueue,
      toggleFavouriteSong: toggleSong,
      toggleFavouriteAlbum: toggleAlbum,
      openFullPlayer: () => setFullPlayerOpen(true),
      closeFullPlayer: () => setFullPlayerOpen(false),
    }),
    [
      currentTrack,
      queue,
      isPlaying,
      isFullPlayerOpen,
      currentTime,
      duration,
      volume,
      shuffle,
      repeat,
      error,
      favouriteSongs,
      favouriteAlbums,
      recent,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      seek,
      setVolume,
      toggleShuffle,
      cycleRepeat,
      addToQueue,
      playNextInQueue,
      removeFromQueue,
      clearQueue,
      toggleSong,
      toggleAlbum,
    ]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
