# Shotframe

## What it is
A browser tool that turns a raw screenshot into something worth posting: backgrounds,
window frames, shadows, 3D tilt, annotations, and an animated MP4 version. Everything
runs in the browser — images never leave the device, there is no account and no upload.

## Who uses it
Indie makers, developers and designers who post screenshots publicly: launch posts on X
and LinkedIn, Product Hunt galleries, docs, changelogs, client updates. They work on both
Mac and Windows, which is why this is a website and not a Mac app. Most arrive with an
image already on the clipboard.

## The job
Paste a screenshot, make it look considered, get it out — in under a minute, most times
without touching more than three controls. Repeat visits are frequent and short.

## What makes it different
- Runs entirely client-side: privacy is structural, not a promise.
- Motion export: the same styling, animated, as an MP4 for social. Paid rivals charge for this.
- Covers Windows, which the well-known rivals (CleanShot, Xnapper, Shotbase) do not.
- No account, no install required, free today.

## Constraints
- Vite + React + TypeScript, hand-written CSS, no UI framework.
- All rendering is canvas-based; the editor chrome must never compete with the canvas.
- Static hosting on Vercel. No backend, no database, no user data.
- Keyboard-driven: paste, tool keys, undo, copy, export.
- Must work on Chrome, Edge and Safari; the page is also opened on phones from shared links.

## Commercial
Free today. A paid tier is likely later (Motion export and high-resolution export are the
candidates), sold as a one-time licence. Nothing in the UI should assume accounts or billing yet.

## Brand commitments
- Name: Shotframe. Amber/orange accent is established and liked.
- Tone: plain, unhyped, confident. British-English copy.
- The user's screenshot is the hero; the interface serves it.
