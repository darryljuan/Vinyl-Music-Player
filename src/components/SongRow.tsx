import { FaHeart, FaRegHeart, FaPlay, FaEllipsisH } from 'react-icons/fa'
import { useState } from 'react'
import { usePlayer } from '../hooks/PlayerContext'
import { formatDuration } from '../lib/format'
import type { Track } from '../types/music'

export default function SongRow({
  track,
  index,
  queueContext,
  showAlbum = false,
}: {
  track: Track
  index?: number
  queueContext: Track[]
  showAlbum?: boolean
}) {
  const { playTrack, currentTrack, isPlaying, favouriteSongs, toggleFavouriteSong, addToQueue, playNextInQueue } =
    usePlayer()
  const [menuOpen, setMenuOpen] = useState(false)
  const isCurrent = currentTrack?.id === track.id
  const isFav = favouriteSongs.has(track.id)

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-stone-900 ${
        isCurrent ? 'text-amber-500' : 'text-stone-200'
      }`}
    >
      <button
        onClick={() => playTrack(track, queueContext)}
        className="flex w-6 flex-shrink-0 items-center justify-center text-stone-500 group-hover:text-stone-200"
        aria-label={`Play ${track.title}`}
      >
        {isCurrent && isPlaying ? (
          <span className="flex h-3 items-end gap-0.5">
            <span className="h-full w-0.5 animate-pulse bg-amber-500" />
            <span className="h-2 w-0.5 animate-pulse bg-amber-500" />
            <span className="h-1.5 w-0.5 animate-pulse bg-amber-500" />
          </span>
        ) : index !== undefined ? (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <FaPlay className="hidden group-hover:block" size={10} />
          </>
        ) : (
          <FaPlay size={10} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate">{track.title}</div>
        <div className="truncate text-xs text-stone-500">
          {track.artist}
          {showAlbum ? ` · ${track.album}` : ''}
        </div>
      </div>

      <button
        onClick={() => toggleFavouriteSong(track.id)}
        aria-label="Toggle favourite"
        className="hidden text-stone-500 hover:text-amber-500 sm:block"
      >
        {isFav ? <FaHeart className="text-amber-500" size={13} /> : <FaRegHeart size={13} />}
      </button>

      <span className="w-10 flex-shrink-0 text-right text-xs tabular-nums text-stone-500">
        {formatDuration(track.duration)}
      </span>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(o => !o)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          aria-label="More options"
          className="text-stone-500 hover:text-stone-200"
        >
          <FaEllipsisH size={13} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-stone-800 bg-stone-900 shadow-xl">
            <button
              onClick={() => playNextInQueue(track)}
              className="block w-full px-3 py-2 text-left text-xs text-stone-200 hover:bg-stone-800"
            >
              Play next
            </button>
            <button
              onClick={() => addToQueue(track)}
              className="block w-full px-3 py-2 text-left text-xs text-stone-200 hover:bg-stone-800"
            >
              Add to queue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
