# TheShayegh.github.io

Personal website of Behzad Shayegh, live at **https://TheShayegh.github.io/**.

The site is served by GitHub Pages straight from the `master` branch, with no build step.
The root `index.html` redirects to [`home/`](home/), the main page.

## Layout

Every page lives in its own folder, with `<name>/index.html` as its entry point, so it is served
at `https://TheShayegh.github.io/<name>/`.

| Folder | Page |
|---|---|
| [`home/`](home/) | Personal website |
| [`music/`](music/) | Music catalogue: a 3D cover carousel with per-track links to YouTube, Spotify, Apple Music and Amazon Music |

Pages use relative links only, since they are served from a sub-path.
