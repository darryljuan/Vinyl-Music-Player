export type Track = {
  id: string
  title: string
  artist: string
  album: string
  albumArtist?: string
  trackNumber?: number
  year?: number
  genre?: string
  duration?: number
  artworkUrl?: string
  fileName: string
  path: string // public URL under /music/..., served directly as a static file
  size?: number
}

export type Album = {
  id: string // slug of `${artist}::${album}`
  name: string
  artist: string
  artworkUrl?: string
  year?: number
  tracks: Track[]
}

export type Artist = {
  id: string // slug of artist name
  name: string
  albumCount: number
  albums: Album[]
}

export type RepeatMode = 'off' | 'all' | 'one'

export type PlaybackState = {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  shuffle: boolean
  repeat: RepeatMode
}
