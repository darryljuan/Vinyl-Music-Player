import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaHome, FaCompactDisc, FaUser, FaMusic, FaSearch } from 'react-icons/fa'
import SearchBar from './SearchBar'
import MiniPlayer from './MiniPlayer'
import FullPlayer from './FullPlayer'
import { usePlayer } from '../hooks/PlayerContext'
import siteConfig from '../../config/site.config'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: FaHome },
  { href: '/albums', label: 'Albums', icon: FaCompactDisc },
  { href: '/artists', label: 'Artists', icon: FaUser },
  { href: '/songs', label: 'Songs', icon: FaMusic },
]

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { currentTrack } = usePlayer()

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-56 flex-shrink-0 flex-col border-r border-stone-900 px-4 py-6 md:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brass-500 to-walnut-900 shadow-inner" />
            <span className="font-serif text-lg font-semibold tracking-wide">{siteConfig.title}</span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(item => {
              const active = router.pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    active ? 'bg-stone-900 text-amber-500' : 'text-stone-400 hover:bg-stone-900/60 hover:text-stone-200'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main column */}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-stone-900 bg-stone-950/90 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brass-500 to-walnut-900" />
              <span className="font-serif text-base font-semibold">{siteConfig.title}</span>
            </div>
            <div className="hidden flex-1 md:block">
              <SearchBar />
            </div>
            <Link href="/search" className="text-stone-400 hover:text-stone-200 md:hidden" aria-label="Search">
              <FaSearch size={18} />
            </Link>
          </header>

          <main className={`flex-1 px-4 pt-4 md:px-8 ${currentTrack ? 'pb-32 md:pb-28' : 'pb-20 md:pb-8'}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className={`fixed inset-x-0 z-40 flex justify-around border-t border-stone-900 bg-stone-950/95 py-2 backdrop-blur md:hidden ${
          currentTrack ? 'bottom-[68px]' : 'bottom-0'
        }`}
      >
        {NAV_ITEMS.map(item => {
          const active = router.pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] ${
                active ? 'text-amber-500' : 'text-stone-500'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <MiniPlayer />
      <FullPlayer />
    </div>
  )
}
