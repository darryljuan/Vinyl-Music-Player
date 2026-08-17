import Link from 'next/link'
import AlbumArt from './AlbumArt'
import type { Album } from '../types/music'

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg shadow-lg transition group-hover:shadow-2xl">
        <AlbumArt src={album.artworkUrl} album={album.name} artist={album.artist} className="h-full w-full transition group-hover:scale-105" />
      </div>
      <div className="mt-2 truncate text-sm font-medium text-stone-100">{album.name}</div>
      <div className="truncate text-xs text-stone-500">
        {album.artist}
        {album.year ? ` · ${album.year}` : ''}
      </div>
    </Link>
  )
}
