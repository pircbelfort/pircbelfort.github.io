# PIRCBELFORT Website

Static HTML5, Tailwind CSS v4 browser build, and vanilla JavaScript website for PIRCBELFORT.

## Update Points

- Contact email: replace `runtyjudge74@gmail.com` in `index.html` and `script.js` if needed.
- Order Now links: currently open a prefilled email to `runtyjudge74@gmail.com` (nav bar + footer).
- Formspree action: currently `https://formspree.io/f/xjkrbyka`.
- Design tokens: update the configurable placeholders at the top of `styles.css`.
- Logo: `assets/logo.png` is used in the header and footer. `assets/favicon-32.png`, `assets/apple-touch-icon.png`, and `assets/favicon-512.png` are used for browser tab/app icons. Keep the `assets` folder next to `index.html` — the site references it with a relative path (`./assets/...`), so as long as the whole `PIRCBELFORT` folder stays together (uploaded/deployed as one unit), the images will load correctly anywhere.

## Local Preview

Open `index.html` in a browser. The contact form requires internet access to submit through Formspree.
