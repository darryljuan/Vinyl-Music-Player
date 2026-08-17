import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { FaSearch } from 'react-icons/fa'
import { useMusicLibrary } from '../hooks/useMusicLibrary'
import { usePlayer } from '../hooks/PlayerContext'

export default function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { tracks, albums, artists } = useMusicLibrary()
  const { playTrack } = usePlayer()
  const router = useRouter()

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return {
      artists: artists.filter(a => a.name.toLowerCase().includes(q)).slice(0, 4),
      albums: albums.filter(a => a.name.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)).slice(0, 4),
      tracks: tracks.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)).slice(0, 6),
    }
  }, [query, tracks, albums, artists])

  const hasResults = results && (results.artists.length || results.albums.length || results.tracks.length)

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900 px-4 py-2">
        <FaSearch className="text-stone-500" size={13} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search your music"
          className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none"
        />
      </div>

      {focused && query.trim() && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-2xl">
          {!hasResults && (
            <div className="px-4 py-3 text-sm text-stone-500">No matches for &ldquo;{query}&rdquo;</div>
          )}

          {results!.artists.length > 0 && (
            <div className="border-b border-stone-800 py-2">
              <div className="px-4 pb-1 text-xs uppercase tracking-wide text-stone-600">Artists</div>
              {results!.artists.map(a => (
                <button
                  key={a.id}
                  onClick={() => router.push(`/artists/${a.id}`)}
                  className="block w-full px-4 py-1.5 text-left text-sm text-stone-200 hover:bg-stone-800"
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}

          {results!.albums.length > 0 && (
            <div className="border-b border-stone-800 py-2">
              <div className="px-4 pb-1 text-xs uppercase tracking-wide text-stone-600">Albums</div>
              {results!.albums.map(a => (
                <button
                  key={a.id}
                  onClick={() => router.push(`/albums/${a.id}`)}
                  className="block w-full truncate px-4 py-1.5 text-left text-sm text-stone-200 hover:bg-stone-800"
                >
                  {a.name} <span className="text-stone-500">— {a.artist}</span>
                </button>
              ))}
            </div>
          )}

          {results!.tracks.length > 0 && (
            <div className="py-2">
              <div className="px-4 pb-1 text-xs uppercase tracking-wide text-stone-600">Songs</div>
              {results!.tracks.map(t => (
                <button
                  key={t.id}
                  onClick={() => playTrack(t, results!.tracks)}
                  className="block w-full truncate px-4 py-1.5 text-left text-sm text-stone-200 hover:bg-stone-800"
                >
                  {t.title} <span className="text-stone-500">— {t.artist}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
