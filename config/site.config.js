module.exports = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'My Vinyl',

  // Recognised audio file extensions.
  audioExtensions: ['.mp3', '.m4a', '.flac', '.wav', '.ogg', '.aac'],

  // Filenames (case-insensitive) checked for album artwork inside each album folder.
  coverFileNames: ['cover.jpg', 'cover.jpeg', 'cover.png', 'cover.webp', 'folder.jpg', 'folder.jpeg', 'folder.png'],

  // How many "Recently Played" entries to keep in localStorage.
  recentlyPlayedLimit: 75,
}
