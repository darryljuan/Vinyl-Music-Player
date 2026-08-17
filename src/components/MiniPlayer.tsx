import { FaHeart, FaRegHeart, FaVolumeUp } from 'react-icons/fa'
import { usePlayer } from '../hooks/PlayerContext'
import AlbumArt from './AlbumArt'
import PlayerControls from './PlayerControls'
import { formatDuration } from '../lib/format'

export default function MiniPlayer() {
  const {
    currentTrack,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    favouriteSongs,
    toggleFavouriteSong,
    openFullPlayer,
    error,
  } = usePlayer()

  if (!currentTrack) return null

  const progress = duration ? (currentTime / duration) * 100 : 0
  const isFav = favouriteSongs.has(currentTrack.id)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-800 bg-stone-950/95 backdrop-blur">
      {error && <div className="bg-red-900/60 px-4 py-1 text-center text-xs text-red-200">{error}</div>}

      {/* Seek bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={e => seek(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none bg-stone-800 accent-amber-600"
        style={{ background: `linear-gradient(to right, #c08a35 ${progress}%, #292524 ${progress}%)` }}
        aria-label="Seek"
      />

      <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
        <button onClick={openFullPlayer} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <AlbumArt
            src={currentTrack.artworkUrl}
            album={currentTrack.album}
            artist={currentTrack.artist}
            className="h-11 w-11 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-stone-100">{currentTrack.title}</div>
            <div className="truncate text-xs text-stone-500">{currentTrack.artist}</div>
          </div>
        </button>

        <button
          onClick={() => toggleFavouriteSong(currentTrack.id)}
          aria-label="Toggle favourite"
          className="hidden text-stone-400 transition hover:text-amber-500 sm:block"
        >
          {isFav ? <FaHeart className="text-amber-500" /> : <FaRegHeart />}
        </button>

        <div className="hidden sm:block">
          <PlayerControls size="sm" />
        </div>

        {/* Mobile: compact controls only */}
        <div className="sm:hidden">
          <PlayerControls size="sm" />
        </div>

        <div className="hidden items-center gap-2 text-stone-500 md:flex">
          <FaVolumeUp size={13} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-20 accent-amber-600"
            aria-label="Volume"
          />
          <span className="w-20 text-right text-xs tabular-nums">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
