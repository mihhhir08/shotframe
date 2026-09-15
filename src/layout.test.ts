import assert from 'node:assert/strict'
import { alignPos, canvasToImage, computeLayout, imageToCanvas } from './layout.ts'
import { DEFAULTS } from './settings.ts'

const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`)

// Auto size wraps screenshot + padding exactly.
{
  const L = computeLayout({ ...DEFAULTS, padding: 50 }, 1600, 1000)
  const u = Math.sqrt(1600 * 1000) / 800
  near(L.W, 1600 + 100 * u)
  near(L.H, 1000 + 100 * u)
}

// Fixed ratio grows the short side only.
{
  const L = computeLayout({ ...DEFAULTS, aspect: '1:1', padding: 0 }, 1600, 1000)
  near(L.W, 1600)
  near(L.H, 1600)
}

// Canvas <-> image mapping round-trips, including crop, frame, inset and scale.
{
  const s = { ...DEFAULTS, frame: 'macLight' as const, inset: 20, scale: 80, posX: 0.1, crop: { x: 0.25, y: 0.1, w: 0.5, h: 0.5 } }
  const L = computeLayout(s, 2000, 1200)
  const p = imageToCanvas(L, 700, 400)
  const q = canvasToImage(L, p.x, p.y)
  near(q.x, 700)
  near(q.y, 400)
  near(L.sw, 1000)
}

// Aligning to the left edge puts the window on the padding line.
{
  const s = { ...DEFAULTS, aspect: '16:9', scale: 60 }
  let L = computeLayout(s, 800, 800)
  const { posX } = alignPos(L, -1, 0)
  L = computeLayout({ ...s, posX }, 800, 800)
  near(L.cx - (L.ww * L.k) / 2, L.pad)
}

console.log('layout ok')
