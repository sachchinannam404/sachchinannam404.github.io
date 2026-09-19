# Sachchin Annam — Dark Batman Portfolio

A dark, Batman-themed personal portfolio / online resume designed for GitHub Pages.

**Live:** https://sachchinannam404.github.io

## Features

- Dark Gotham aesthetic (black / charcoal + yellow accent)
- Online-resume layout: About, Skills, Experience timeline, Achievements
- Responsive (mobile + desktop)
- Subtle particle sparks and scanline overlay
- Spotify playlist embed (background music — requires user click due to browser autoplay rules)
- Smooth scroll + reveal animations

## Customize

| What | Where |
|------|--------|
| Name, titles, about text | `index.html` — hero + About section |
| Skills tags | `index.html` — Skills section |
| Experience entries | `index.html` — Timeline |
| Awards / certs | `index.html` — Achievements |
| Spotify playlist | `index.html` — change the `src` of the iframe |
| Colors | `css/styles.css` — CSS variables at the top |

### Spotify playlist

Replace the iframe `src` with any public Spotify playlist embed URL. Use `theme=0` for the dark player.

Browsers block autoplay with sound until the user interacts — visitors press play once.

## Tech

- Plain HTML / CSS / vanilla JS (no build step)
- Google Fonts: Bebas Neue, Orbitron, Rajdhani
- Fully static — ideal for GitHub Pages

---

🦇 Built for the night.
