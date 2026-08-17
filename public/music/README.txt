Put your music here, organised as:

  public/music/<Artist>/<Album>/<NN - Track Title>.mp3
  public/music/<Artist>/<Album>/cover.jpg   (optional — album art)

Example:
  public/music/Adele/21/01 - Rolling in the Deep.mp3
  public/music/Adele/21/cover.jpg

Track number and title are parsed from the filename (a leading number
followed by a space/dash/underscore, e.g. "01 - Song Name.mp3" or
"01. Song Name.mp3"). If there's no leading number, the whole filename
(minus extension) is used as the title.

After adding/removing files, run `npm run library` (or just `npm run dev`
/ `npm run build`, which do this automatically) to regenerate
public/library.json, which the app reads from.

This file and .gitkeep can stay — they don't affect the app.
