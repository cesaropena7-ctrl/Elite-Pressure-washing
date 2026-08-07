# Elite Pressure Washing — Website

Static site for Elite Pressure Washing, Tampa FL. No build step, no dependencies.

## Files

```
elite-pressure-washing/
├── index.html          all page content and copy
├── css/styles.css      all styling
├── js/main.js          nav, scroll animations, before/after slider, form
├── images/             photos (see IMAGES.md for what goes here)
└── README.md
```

## Setup checklist

- [ ] Add your Web3Forms access key in `index.html` (search for `YOUR_ACCESS_KEY_HERE`)
- [ ] Add images to `images/` — filenames listed in `IMAGES.md`
- [ ] Replace the three placeholder reviews with real Google reviews
- [ ] Update the stat numbers in `index.html` (search for `data-count`)

## Business details

These appear in several places. To change them, search and replace across
`index.html`:

| Detail | Value |
|---|---|
| Phone | `(609) 335-8822` / `tel:+16093358822` |
| Email | `cesaropena7@gmail.com` |
| Hours | Mon–Sat, 7:00am – 7:00pm |
| Service area | Tampa, Brandon, Riverview, Carrollwood, Westchase, Lutz, Wesley Chapel |

## Running it locally

```bash
python3 -m http.server 8788 --directory elite-pressure-washing
```

Then open <http://localhost:8788>.
