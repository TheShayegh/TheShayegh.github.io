# music

A 3D carousel of my music covers. Tapping a cover opens a small dropdown with links to that
track on YouTube, Spotify, Apple Music and Amazon Music.

Live at https://TheShayegh.github.io/music/. It is a single file, [index.html](index.html), with
no build step. The covers are loaded from Apple Music's artwork servers (not stored here).

## Adding a new track

Everything is driven by the `TRACKS` list near the top of the `<script>` in `index.html`.
Add one object to it. The order of the list is the order around the carousel.

```js
{
  title: "Track Name",
  cover: "https://is1-ssl.mzstatic.com/image/thumb/.../600x600bb.jpg",
  youtube: "https://www.youtube.com/watch?v=VIDEO_ID",
  spotify: "https://open.spotify.com/track/TRACK_ID",
  apple: "https://music.apple.com/ca/album/track-name-single/ALBUM_ID",
  // amazon: "https://music.amazon.com/albums/ASIN",   // optional, see below
},
```

Where to find each value:

| Field | Where |
|---|---|
| `cover` | Apple's artwork URL for the release, with the size part set to `600x600bb`. `https://itunes.apple.com/lookup?id=1736428336&entity=album&country=ca` lists all releases with their `artworkUrl100`; replace `100x100bb` by `600x600bb`. |
| `youtube` | The track's video on the "Behzad Shayegh - Topic" channel (or your own visualizer video). |
| `spotify` | Spotify, "Share" → "Copy link to song". |
| `apple` | Apple Music, "Share" → "Copy link" (the `?uo=4` suffix can be dropped). |
| `amazon` | Optional. When omitted, the Amazon Music row opens an Amazon Music search for the track title plus the artist name. Set it only to link to an exact release. |

Keep the cover count reasonable: the carousel spaces covers evenly, so a dozen or more get crowded.
To change the radius or cover size, edit `radius` and `imgWidth` in the same script.

## Notes

- A tap/click that moves less than a few pixels opens the dropdown; a longer drag rotates the carousel.
- Links open in a new tab. On screens up to 600px wide the dropdown is a bottom sheet.
- Adding a platform: add an entry to `PLATFORMS`, a matching `<symbol id="i-...">` icon in the SVG at the
  top of `<body>`, an optional accent color rule (`#menu a[data-p="..."]`), and a field of that name on
  each track.
