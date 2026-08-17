import { useState } from 'react'
import { FaChevronDown, FaHeart, FaRegHeart, FaListUl, FaTimes } from 'react-icons/fa'
import { usePlayer } from '../hooks/PlayerContext'
import Turntable from './VinylPlayer/Turntable'
import PlayerControls from './PlayerControls'
import { formatDuration } from '../lib/format'

export default function FullPlayer() {
  const {
    currentTrack,
    isPlaying,
    isFullPlayerOpen,
    closeFullPlayer,
    currentTime,
    duration,
    seek,
    favouriteSongs,
    toggleFavouriteSong,
    queue,
    removeFromQueue,
  } = usePlayer()
  const [showQueue, setShowQueue] = useState(false)

  if (!isFullPlayerOpen || !currentTrack) return null

  const progress = duration ? (currentTime / duration) * 100 : 0
  const isFav = favouriteSongs.has(currentTrack.id)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-walnut-900 via-stone-950 to-black">
      <div className="flex items-center justify-between px-5 pt-5">
        <button onClick={closeFullPlayer} aria-label="Close player" className="text-stone-400 hover:text-white">
          <FaChevronDown size={20} />
        </button>
        <div className="text-center text-xs uppercase tracking-widest text-stone-500">Now Playing</div>
        <button
          onClick={() => setShowQueue(s => !s)}
          aria-label="Toggle queue"
          className={`transition ${showQueue ? 'text-amber-500' : 'text-stone-400 hover:text-white'}`}
        >
          <FaListUl size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-6">
        {!showQueue ? (
          <>
            <div className="scale-[0.55] sm:scale-75 md:scale-100">
              <Turntable track={currentTrack} isPlaying={isPlaying} />
            </div>

            <div className="w-full max-w-md text-center">
              <h2 className="truncate text-xl font-semibold text-stone-50">{currentTrack.title}</h2>
              <p className="mt-1 truncate text-sm text-stone-400">
                {currentTrack.artist} — {currentTrack.album}
              </p>
            </div>

            <div className="w-full max-w-md">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={e => seek(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-stone-800 accent-amber-600"
                style={{ background: `linear-gradient(to right, #c08a35 ${progress}%, #292524 ${progress}%)` }}
                aria-label="Seek"
              />
              <div className="mt-1 flex justify-between text-xs tabular-nums text-stone-500">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button
                onClick={() => toggleFavouriteSong(currentTrack.id)}
                aria-label="Toggle favourite"
                className="text-stone-400 transition hover:text-amber-500"
              >
                {isFav ? <FaHeart size={20} className="text-amber-500" /> : <FaRegHeart size={20} />}
              </button>
              <PlayerControls size="lg" />
              <div className="w-5" />
            </div>
          </>
        ) : (
          <div className="w-full max-w-lg flex-1 overflow-y-auto pb-8">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-500">
              Up Next ({queue.length})
            </h3>
            <ul className="space-y-1">
              {queue.map((t, i) => (
                <li
                  key={`${t.id}-${i}`}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                    t.id === currentTrack.id ? 'bg-amber-600/10 text-amber-400' : 'text-stone-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="truncate">{t.title}</div>
                    <div className="truncate text-xs text-stone-500">{t.artist}</div>
                  </div>
                  {t.id !== currentTrack.id && (
                    <button onClick={() => removeFromQueue(t.id)} aria-label="Remove from queue" className="text-stone-600 hover:text-red-400">
                      <FaTimes size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
