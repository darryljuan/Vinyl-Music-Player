import Link from 'next/link'
import { useMusicLibrary } from '../hooks/useMusicLibrary'
import { usePlayer } from '../hooks/PlayerContext'
import AlbumCard from '../components/AlbumCard'
import { LoadingGrid, NoMusicFoundState } from '../components/States'

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-100">{title}</h2>
        {href && (
          <Link href={href} className="text-xs font-medium text-amber-500 hover:text-amber-400">
            See all
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

export default function Home() {
  const { albums, isLoading, isEmpty } = useMusicLibrary()
  const { recentlyPlayed, favouriteAlbums } = usePlayer()

  if (isLoading) return <LoadingGrid />
  if (isEmpty) return <NoMusicFoundState />

  const favAlbums = albums.filter(a => favouriteAlbums.has(a.id))
  const recentAlbumIds = new Set(recentlyPlayed.map(t => `${t.albumArtist ?? t.artist}::${t.album}`.toLowerCase()))
  const recentAlbums = albums.filter(a => recentAlbumIds.has(`${a.artist}::${a.name}`.toLowerCase())).slice(0, 10)

  return (
    <div>
      {recentAlbums.length > 0 && (
        <Section title="Recently Played">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentAlbums.map(a => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        </Section>
      )}

      {favAlbums.length > 0 && (
        <Section title="Favourite Albums" href="/albums">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favAlbums.slice(0, 10).map(a => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Your Collection" href="/albums">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {albums.slice(0, 15).map(a => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      </Section>
    </div>
  )
}
