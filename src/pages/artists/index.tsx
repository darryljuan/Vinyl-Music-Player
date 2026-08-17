import Link from 'next/link'
import { useMusicLibrary } from '../../hooks/useMusicLibrary'
import AlbumArt from '../../components/AlbumArt'
import { LoadingGrid, NoMusicFoundState } from '../../components/States'

export default function ArtistsPage() {
  const { artists, isLoading, isEmpty } = useMusicLibrary()

  if (isLoading) return <LoadingGrid />
  if (isEmpty) return <NoMusicFoundState />

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Artists</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {artists.map(artist => (
          <Link key={artist.id} href={`/artists/${artist.id}`} className="group text-center">
            <div className="mx-auto aspect-square w-full max-w-[140px] overflow-hidden rounded-full shadow-lg">
              <AlbumArt
                src={artist.albums[0]?.artworkUrl}
                album={artist.name}
                artist={artist.name}
                className="h-full w-full transition group-hover:scale-105"
                rounded="rounded-full"
              />
            </div>
            <div className="mt-2 truncate text-sm font-medium text-stone-100">{artist.name}</div>
            <div className="text-xs text-stone-500">
              {artist.albumCount} album{artist.albumCount === 1 ? '' : 's'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
