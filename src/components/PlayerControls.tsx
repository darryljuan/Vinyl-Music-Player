import { FaPlay, FaPause, FaForward, FaBackward, FaRandom, FaRedo } from 'react-icons/fa'
import { usePlayer } from '../hooks/PlayerContext'

export default function PlayerControls({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { isPlaying, togglePlay, playNext, playPrevious, shuffle, toggleShuffle, repeat, cycleRepeat, currentTrack } =
    usePlayer()

  const iconSize = size === 'lg' ? 18 : 14
  const playSize = size === 'lg' ? 22 : 16
  const gap = size === 'lg' ? 'gap-8' : 'gap-5'

  return (
    <div className={`flex items-center justify-center ${gap}`}>
      <button
        onClick={toggleShuffle}
        aria-label="Toggle shuffle"
        className={`transition ${shuffle ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
      >
        <FaRandom size={iconSize} />
      </button>
      <button
        onClick={playPrevious}
        disabled={!currentTrack}
        aria-label="Previous track"
        className="text-stone-300 transition hover:text-white disabled:text-stone-700"
      >
        <FaBackward size={iconSize + 2} />
      </button>
      <button
        onClick={togglePlay}
        disabled={!currentTrack}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="flex items-center justify-center rounded-full bg-amber-600 p-3 text-stone-950 shadow-lg transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-stone-700"
      >
        {isPlaying ? <FaPause size={playSize} /> : <FaPlay size={playSize} className="ml-0.5" />}
      </button>
      <button
        onClick={playNext}
        disabled={!currentTrack}
        aria-label="Next track"
        className="text-stone-300 transition hover:text-white disabled:text-stone-700"
      >
        <FaForward size={iconSize + 2} />
      </button>
      <button
        onClick={cycleRepeat}
        aria-label="Toggle repeat"
        className={`relative transition ${repeat !== 'off' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
      >
        <FaRedo size={iconSize} />
        {repeat === 'one' && (
          <span className="absolute -right-1.5 -top-1.5 text-[9px] font-bold leading-none">1</span>
        )}
      </button>
    </div>
  )
}
