# Shotframe

Make screenshots look good. Runs entirely in the browser — images never leave your device.

## Use

- **Open a screenshot:** choose a file, or drag one anywhere on the page. `⌘V` also pastes one straight from the clipboard, and `#sample` in the URL loads a demo image for testing.
- **Style it:** presets, 24 built-in wallpapers, six adjustable patterns (dots, grid, lines, checks, rings, crosses), gradient / mesh / solid / image / blurred backgrounds, grain, padding, inset with auto-balance, radius, shadow, border, macOS / browser / Windows / glass frames, 3D tilt, rotation, canvas sizes for X, LinkedIn, Instagram, Product Hunt and more, caption and watermark.
- **Mark it up:** crop, arrow (straight or curved, one head, two or none, solid or dashed), box, ellipse, highlighter, text, numbered steps, pen, blur, pixelate, spotlight.
- **Export:** PNG, JPEG or WebP at 0.5×–4×, copy to clipboard or download.
- **Motion:** switch to Motion for an animated version — tilt in, zoom in, rise, slow push, float, swing or orbit — and export it as an MP4 at 720p–1440p, 30 or 60 fps.

Your last style is remembered. Save your own presets from the Presets section.

### Shortcuts

| Key | Action |
| --- | --- |
| `⌘V` / `⌘O` | Paste / open image |
| `⌘C` / `⌘S` | Copy / download result |
| `⌘Z` / `⌘⇧Z` | Undo / redo |
| `V` `C` `A` `R` `O` `H` `T` `N` `P` `B` `X` `S` | Select, crop, arrow, box, ellipse, highlight, text, step, pen, blur, pixelate, spotlight |
| `⌫` | Delete selected annotation |
| `Esc` / `Enter` | Back to select / finish crop |

Drag the screenshot to reposition it. Double-click a text annotation to edit it. Select an arrow and drag its middle handle to bend it. In Motion, space plays and pauses.

## Install as an app

Open the deployed site, then:

- **Chrome:** install icon in the address bar. Once installed you can right-click an image in Finder → Open With → Shotframe.
- **Safari:** File → Add to Dock.

It works offline after the second visit.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run verify   # type-check, layout tests, production build
```

## Deploy

Static site, no server or env vars. On Vercel: New Project → import this repo → Deploy (Vite is detected automatically).
