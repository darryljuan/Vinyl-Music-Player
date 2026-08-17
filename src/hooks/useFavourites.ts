import { useCallback, useEffect, useState } from 'react'

const SONGS_KEY = 'myvinyl:favourite-songs'
const ALBUMS_KEY = 'myvinyl:favourite-albums'

function load(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function save(key: string, ids: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(ids)))
  } catch {
    // non-fatal
  }
}

export function useFavourites() {
  const [favouriteSongs, setFavouriteSongs] = useState<Set<string>>(new Set())
  const [favouriteAlbums, setFavouriteAlbums] = useState<Set<string>>(new Set())

  useEffect(() => {
    setFavouriteSongs(load(SONGS_KEY))
    setFavouriteAlbums(load(ALBUMS_KEY))
  }, [])

  const toggleSong = useCallback((id: string) => {
    setFavouriteSongs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      save(SONGS_KEY, next)
      return next
    })
  }, [])

  const toggleAlbum = useCallback((id: string) => {
    setFavouriteAlbums(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      save(ALBUMS_KEY, next)
      return next
    })
  }, [])

  return { favouriteSongs, favouriteAlbums, toggleSong, toggleAlbum }
}
