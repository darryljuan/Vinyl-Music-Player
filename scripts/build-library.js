#!/usr/bin/env node
/**
 * Scans public/music/ and writes public/library.json — a static manifest
 * of every track, grouped into albums and artists.
 *
 * Runs automatically before `npm run dev` and `npm run build` (see
 * package.json "predev"/"prebuild"). Convention:
 *
 *   public/music/<Artist>/<Album>/<NN - Title>.mp3
 *   public/music/<Artist>/<Album>/cover.jpg   (optional)
 *
 * Metadata comes entirely from folder/file names — no ID3 parsing, no
 * network calls, so this stays fast and dependency-free.
 */
const fs = require('fs')
const path = require('path')
const siteConfig = require('../config/site.config')

const MUSIC_DIR = path.join(__dirname, '..', 'public', 'music')
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'library.json')

function isAudioFile(name) {
  return siteConfig.audioExtensions.includes(path.extname(name).toLowerCase())
}

function titleCase(s) {
  return s.replace(/[_-]+/g, ' ').trim()
}

function parseFileName(fileName) {
  const base = path.basename(fileName, path.extname(fileName))
  const match = base.match(/^(\d{1,3})[\s._-]+(.*)$/)
  if (match) {
    return { trackNumber: parseInt(match[1], 10), title: titleCase(match[2]) }
  }
  return { trackNumber: undefined, title: titleCase(base) }
}

function findCoverImage(dirAbsPath, relDirSegments) {
  let entries = []
  try {
    entries = fs.readdirSync(dirAbsPath)
  } catch {
    return undefined
  }
  const lowerNames = entries.map(e => e.toLowerCase())
  for (const candidate of siteConfig.coverFileNames) {
    const idx = lowerNames.indexOf(candidate)
    if (idx !== -1) {
      const segments = [...relDirSegments, entries[idx]].map(encodeURIComponent)
      return `/music/${segments.join('/')}`
    }
  }
  return undefined
}

function slug(...parts) {
  return parts
    .join('::')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function walk(dirAbsPath, relSegments, tracks) {
  let entries
  try {
    entries = fs.readdirSync(dirAbsPath, { withFileTypes: true })
  } catch {
    return
  }

  const files = entries.filter(e => e.isFile() && isAudioFile(e.name))
  const folders = entries.filter(e => e.isDirectory())

  for (const file of files) {
    const relDir = relSegments
    const artist = relDir[0] ? titleCase(relDir[0]) : 'Unknown Artist'
    const album = relDir[1] ? titleCase(relDir[1]) : relDir[0] ? titleCase(relDir[0]) : 'Unknown Album'
    const { trackNumber, title } = parseFileName(file.name)
    const pathSegments = [...relDir, file.name].map(encodeURIComponent)
    const stat = fs.statSync(path.join(dirAbsPath, file.name))

    tracks.push({
      id: slug(...relDir, file.name),
      title,
      artist,
      album,
      albumArtist: artist,
      trackNumber,
      fileName: file.name,
      path: `/music/${pathSegments.join('/')}`,
      artworkUrl: findCoverImage(dirAbsPath, relDir),
      size: stat.size,
    })
  }

  for (const folder of folders) {
    walk(path.join(dirAbsPath, folder.name), [...relSegments, folder.name], tracks)
  }
}

function groupIntoAlbums(tracks) {
  const map = new Map()
  for (const track of tracks) {
    const id = slug(track.albumArtist, track.album)
    if (!map.has(id)) {
      map.set(id, { id, name: track.album, artist: track.albumArtist, artworkUrl: track.artworkUrl, tracks: [] })
    }
    const album = map.get(id)
    album.tracks.push(track)
    if (!album.artworkUrl && track.artworkUrl) album.artworkUrl = track.artworkUrl
  }
  const albums = Array.from(map.values())
  for (const album of albums) {
    album.tracks.sort((a, b) => (a.trackNumber ?? 999) - (b.trackNumber ?? 999) || a.title.localeCompare(b.title))
  }
  return albums.sort((a, b) => a.name.localeCompare(b.name))
}

function groupIntoArtists(albums) {
  const map = new Map()
  for (const album of albums) {
    const id = slug(album.artist)
    if (!map.has(id)) map.set(id, { id, name: album.artist, albumCount: 0, albums: [] })
    const artist = map.get(id)
    artist.albums.push(album)
    artist.albumCount = artist.albums.length
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

function main() {
  if (!fs.existsSync(MUSIC_DIR)) {
    fs.mkdirSync(MUSIC_DIR, { recursive: true })
  }

  const tracks = []
  walk(MUSIC_DIR, [], tracks)
  const albums = groupIntoAlbums(tracks)
  const artists = groupIntoArtists(albums)

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ tracks, albums, artists, generatedAt: Date.now() }))
  console.log(`[my-vinyl] library.json: ${tracks.length} tracks, ${albums.length} albums, ${artists.length} artists`)
}

main()
