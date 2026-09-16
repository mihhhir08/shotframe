import { blurred, makeCanvas, noiseTile, rgba } from './canvas.ts'

// Procedural wallpapers: drawn from code at any size, so nothing to download and no licensing.
type Draw = (ctx: CanvasRenderingContext2D, W: number, H: number, rand: () => number) => void

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------------------------------------------------------------------------
   Premium wallpapers are made of light, not shapes. Each one renders a smooth
   colour field per pixel at low resolution, upscales it, then finishes with a
   vignette and fine grain — the grain is what kills the banding that makes a
   procedural gradient look cheap.
   --------------------------------------------------------------------------- */

function noise2(rand: () => number) {
  const N = 64
  const grid = new Float32Array(N * N)
  for (let i = 0; i < grid.length; i++) grid[i] = rand()
  const at = (x: number, y: number) => grid[(((y % N) + N) % N) * N + (((x % N) + N) % N)]
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = smooth(x - xi)
    const yf = smooth(y - yi)
    const a = at(xi, yi)
    const b = at(xi + 1, yi)
    const c = at(xi, yi + 1)
    const d = at(xi + 1, yi + 1)
    return (a * (1 - xf) + b * xf) * (1 - yf) + (c * (1 - xf) + d * xf) * yf
  }
}

const fbm = (n: (x: number, y: number) => number, x: number, y: number, oct = 4) => {
  let v = 0
  let amp = 0.5
  let f = 1
  for (let i = 0; i < oct; i++) {
    v += amp * n(x * f, y * f)
    f *= 2
    amp *= 0.5
  }
  return v
}

// 256-step lookup so the per-pixel loop never parses a colour string
function ramp(stops: string[]) {
  const rgb = stops.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)))
  const out = new Uint8ClampedArray(256 * 3)
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * (rgb.length - 1)
    const k = Math.min(rgb.length - 2, Math.floor(t))
    const f = t - k
    for (let c = 0; c < 3; c++) out[i * 3 + c] = rgb[k][c] + (rgb[k + 1][c] - rgb[k][c]) * f
  }
  return out
}

function vignette(ctx: CanvasRenderingContext2D, W: number, H: number, strength = 0.5) {
  const g = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.78)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, `rgba(0,0,0,${strength})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

// the difference between "AI gradient" and "wallpaper": dither the ramp
function grain(ctx: CanvasRenderingContext2D, W: number, H: number, amount = 0.05) {
  ctx.save()
  ctx.globalAlpha = amount
  ctx.globalCompositeOperation = 'overlay'
  ctx.fillStyle = ctx.createPattern(noiseTile(), 'repeat')!
  ctx.fillRect(0, 0, W, H)
  ctx.restore()
}

// renders a per-pixel field small, then lets bilinear upscaling do the smoothing
function field(ctx: CanvasRenderingContext2D, W: number, H: number, shade: (u: number, v: number) => number, stops: string[]) {
  const w = 260
  const h = Math.max(120, Math.round((260 * H) / W))
  const [c, cx] = makeCanvas(w, h)
  const img = cx.createImageData(w, h)
  const lut = ramp(stops)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = Math.max(0, Math.min(1, shade(x / w, y / h)))
      const i = (y * w + x) * 4
      const j = Math.round(t * 255) * 3
      img.data[i] = lut[j]
      img.data[i + 1] = lut[j + 1]
      img.data[i + 2] = lut[j + 2]
      img.data[i + 3] = 255
    }
  }
  cx.putImageData(img, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(c, 0, 0, W, H)
}

// Domain-warped flow: colour bends around itself like ink in water.
function fluid(stops: string[]): Draw {
  return (ctx, W, H, rand) => {
    const n = noise2(rand)
    const sx = 2.2 + rand()
    const rot = rand() * 6.28
    field(ctx, W, H, (u, v) => {
      const a = u * sx + Math.cos(rot)
      const b = v * sx + Math.sin(rot)
      const wx = fbm(n, a + 1.7, b + 9.2, 3)
      const wy = fbm(n, a + 8.3, b + 2.8, 3)
      return (fbm(n, a + 3.4 * wx, b + 3.4 * wy) - 0.22) / 0.52
    }, stops)
    vignette(ctx, W, H, 0.42)
    grain(ctx, W, H, 0.05)
  }
}

// One volumetric source in a deep room, with soft satellites.
function bloom(base: string[], glow: string, orbs: string[]): Draw {
  return (ctx, W, H, rand) => {
    const n = noise2(rand)
    field(ctx, W, H, (u, v) => fbm(n, u * 1.6, v * 1.6, 3) * 0.6 + v * 0.35, base)
    const cx = W * (0.24 + rand() * 0.5)
    const cy = H * (0.18 + rand() * 0.34)
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.72)
    g.addColorStop(0, rgba(glow, 0.9))
    g.addColorStop(0.18, rgba(glow, 0.42))
    g.addColorStop(0.55, rgba(glow, 0.1))
    g.addColorStop(1, rgba(glow, 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    orbs.forEach((c) => {
      const r = Math.min(W, H) * (0.22 + rand() * 0.3)
      const x = W * (0.1 + rand() * 0.8)
      const y = H * (0.25 + rand() * 0.7)
      const og = ctx.createRadialGradient(x, y, 0, x, y, r)
      og.addColorStop(0, rgba(c, 0.38))
      og.addColorStop(0.5, rgba(c, 0.12))
      og.addColorStop(1, rgba(c, 0))
      ctx.fillStyle = og
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    })
    vignette(ctx, W, H, 0.55)
    grain(ctx, W, H, 0.055)
  }
}

// Haze over distance: no ridge line, just air thickening toward the horizon.
function haze(stops: string[], sun: string): Draw {
  return (ctx, W, H, rand) => {
    const n = noise2(rand)
    field(ctx, W, H, (u, v) => {
      const drift = fbm(n, u * 1.4 + 3, v * 2.6, 3) * 0.28
      return v * 0.9 + drift - 0.1
    }, stops)
    const sx = W * (0.3 + rand() * 0.4)
    const sy = H * (0.3 + rand() * 0.2)
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(W, H) * 0.5)
    g.addColorStop(0, rgba(sun, 0.5))
    g.addColorStop(0.4, rgba(sun, 0.12))
    g.addColorStop(1, rgba(sun, 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    vignette(ctx, W, H, 0.38)
    grain(ctx, W, H, 0.045)
  }
}

// Curtains of light over a starfield, warped rather than drawn.
function curtains(base: string[], lights: string[]): Draw {
  return (ctx, W, H, rand) => {
    const n = noise2(rand)
    field(ctx, W, H, (u, v) => v * 0.8 + fbm(n, u * 1.2, v * 1.2, 2) * 0.3, base)
    for (let i = 0; i < 420; i++) {
      const y = rand()
      ctx.fillStyle = `rgba(255,255,255,${(0.2 + rand() * 0.6) * (1 - y * 0.8)})`
      ctx.beginPath()
      ctx.arc(rand() * W, y * H * 0.9, Math.max(0.4, H * (0.0004 + rand() * 0.0011)), 0, Math.PI * 2)
      ctx.fill()
    }
    const [c, cx] = makeCanvas(Math.max(24, W / 5), Math.max(24, H / 5))
    const w = c.width
    const h = c.height
    cx.globalCompositeOperation = 'lighter'
    lights.forEach((light, k) => {
      const base2 = h * (0.3 + k * 0.12 + rand() * 0.1)
      const amp = h * (0.08 + rand() * 0.1)
      const f = ((0.8 + rand()) * Math.PI * 2) / w
      const p = rand() * 6.28
      for (let x = 0; x < w; x += 1) {
        const y = base2 + amp * Math.sin(f * x + p) + amp * 0.4 * Math.sin(f * 2.7 * x + p * 1.3)
        const len = h * (0.22 + 0.14 * Math.sin(x * f * 1.9 + p))
        const g = cx.createLinearGradient(0, y - len, 0, y + h * 0.04)
        g.addColorStop(0, rgba(light, 0))
        g.addColorStop(0.75, rgba(light, 0.34))
        g.addColorStop(1, rgba(light, 0))
        cx.fillStyle = g
        cx.fillRect(x, y - len, 1.5, len + h * 0.04)
      }
    })
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.drawImage(blurred(c, 0, 0, w, h, W, H, Math.max(3, H * 0.015)), 0, 0)
    ctx.restore()
    vignette(ctx, W, H, 0.5)
    grain(ctx, W, H, 0.05)
  }
}

// Deep space: dust clouds lit from within, not a star sticker sheet.
function nebula(base: string[], clouds: string[]): Draw {
  return (ctx, W, H, rand) => {
    const n = noise2(rand)
    field(ctx, W, H, (u, v) => fbm(n, u * 2.4, v * 2.4, 4) * 0.9 - 0.1, base)
    clouds.forEach((c) => {
      const m = noise2(rand)
      const [s, sx2] = makeCanvas(200, Math.max(100, Math.round((200 * H) / W)))
      const img = sx2.createImageData(s.width, s.height)
      const col = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
      for (let y = 0; y < s.height; y++) {
        for (let x = 0; x < s.width; x++) {
          const t = Math.max(0, fbm(m, (x / s.width) * 3, (y / s.height) * 3, 4) - 0.42) * 2.4
          const i = (y * s.width + x) * 4
          img.data[i] = col[0]
          img.data[i + 1] = col[1]
          img.data[i + 2] = col[2]
          img.data[i + 3] = Math.min(255, t * 255)
        }
      }
      sx2.putImageData(img, 0, 0)
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.drawImage(s, 0, 0, W, H)
      ctx.restore()
    })
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.15 + rand() * 0.7})`
      ctx.beginPath()
      ctx.arc(rand() * W, rand() * H, Math.max(0.35, H * (0.0003 + rand() * 0.001)), 0, Math.PI * 2)
      ctx.fill()
    }
    vignette(ctx, W, H, 0.6)
    grain(ctx, W, H, 0.05)
  }
}

// Brushed light sweeping diagonally, the way satin catches a studio lamp.
function satin(stops: string[]): Draw {
  return (ctx, W, H, rand) => {
    const n = noise2(rand)
    const angle = 0.5 + rand() * 0.8
    field(ctx, W, H, (u, v) => {
      const d = u * Math.cos(angle) + v * Math.sin(angle)
      return 0.5 + 0.42 * Math.sin(d * 5.4 + fbm(n, u * 1.5, v * 1.5, 3) * 3.4)
    }, stops)
    vignette(ctx, W, H, 0.34)
    grain(ctx, W, H, 0.06)
  }
}

export const WALLPAPERS: { id: string; name: string; draw: Draw }[] = [
  { id: 'fluid-dusk', name: 'Dusk', draw: fluid(['#150b30', '#3d1a6b', '#8e2f86', '#e2646a', '#ffb27a']) },
  { id: 'fluid-reef', name: 'Reef', draw: fluid(['#021a26', '#054e5c', '#0e9c8c', '#6fdcb0', '#d7f5df']) },
  { id: 'fluid-ember', name: 'Ember', draw: fluid(['#150402', '#4a1206', '#a33412', '#e8752a', '#ffc46b']) },
  { id: 'fluid-ink', name: 'Ink', draw: fluid(['#05060f', '#141a3a', '#2f3f7a', '#5f7bc4', '#b9c9f0']) },
  { id: 'bloom-halo', name: 'Halo', draw: bloom(['#05040f', '#120c2b'], '#8b5cf6', ['#f472b6', '#38bdf8']) },
  { id: 'bloom-sunrise', name: 'Sunrise', draw: bloom(['#180806', '#3a1410'], '#ff9a3d', ['#ff5f6d', '#ffd28a']) },
  { id: 'bloom-frost', name: 'Frost', draw: bloom(['#030d18', '#0a2236'], '#5ad1ff', ['#a78bfa', '#dff6ff']) },
  { id: 'haze-sahara', name: 'Sahara', draw: haze(['#2b1206', '#7a3512', '#c8762f', '#f2c078'], '#ffd9a0') },
  { id: 'haze-alpine', name: 'Alpine', draw: haze(['#0a1626', '#1d3a5c', '#5b7fa6', '#b9cbd8'], '#ffffff') },
  { id: 'haze-rose', name: 'Rose', draw: haze(['#240a1c', '#5e1c3f', '#a84a67', '#e7a6a6'], '#ffd7cf') },
  { id: 'curtains-borealis', name: 'Borealis', draw: curtains(['#01060f', '#04121f', '#072433'], ['#3dffa8', '#20c9ff', '#a86bff']) },
  { id: 'curtains-magenta', name: 'Magenta', draw: curtains(['#07030f', '#160726', '#250c3a'], ['#ff4fd8', '#6c7bff', '#ff9a5a']) },
  { id: 'curtains-solar', name: 'Solar', draw: curtains(['#0a0402', '#1e0a04', '#2e1206'], ['#ff7a1a', '#ffcf40', '#ff3d5a']) },
  { id: 'nebula-deep', name: 'Deep field', draw: nebula(['#02030c', '#070d22', '#0d1533'], ['#4c3bd6', '#d14aa0']) },
  { id: 'nebula-crimson', name: 'Crimson', draw: nebula(['#0a0206', '#1c0510', '#2a081a'], ['#e0345c', '#ff8a3d']) },
  { id: 'nebula-teal', name: 'Teal', draw: nebula(['#01090c', '#04181f', '#062a33'], ['#19b3a6', '#4c7fe0']) },
  { id: 'satin-pearl', name: 'Pearl', draw: satin(['#c9ccd6', '#eef0f4', '#9aa2b4', '#f6f7fa']) },
  { id: 'satin-onyx', name: 'Onyx', draw: satin(['#0b0b10', '#2a2b36', '#15161d', '#3c3e4d']) },
  { id: 'satin-jade', name: 'Jade', draw: satin(['#06231f', '#10564a', '#0a3b33', '#2f8f78']) },
]

function paint(id: string, W: number, H: number) {
  const i = Math.max(0, WALLPAPERS.findIndex((w) => w.id === id))
  const [c, ctx] = makeCanvas(W, H)
  WALLPAPERS[i].draw(ctx, c.width, c.height, seeded(i * 7919 + 17))
  return c
}

// One cached size is enough: preview and export ask for the same size repeatedly.
let last: { key: string; canvas: HTMLCanvasElement } | null = null
export function wallpaper(id: string, W: number, H: number) {
  const key = `${id}:${W}x${H}`
  if (last?.key !== key) last = { key, canvas: paint(id, W, H) }
  return last.canvas
}

const thumbs = new Map<string, string>()
export function wallpaperThumb(id: string) {
  if (!thumbs.has(id)) thumbs.set(id, paint(id, 320, 200).toDataURL('image/jpeg', 0.85))
  return thumbs.get(id)!
}

export type PatternKind = 'dots' | 'grid' | 'lines' | 'checks' | 'rings' | 'cross'
export const PATTERNS: [PatternKind, string][] = [
  ['dots', 'Dots'], ['grid', 'Grid'], ['lines', 'Lines'],
  ['checks', 'Checks'], ['rings', 'Rings'], ['cross', 'Crosses'],
]

// Drawn straight onto the export canvas so it stays crisp at any scale.
export function drawPattern(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  kind: PatternKind, back: string, fore: string, scalePct: number, angle: number,
) {
  ctx.save()
  ctx.fillStyle = back
  ctx.fillRect(0, 0, W, H)
  const step = Math.max(6, (Math.max(W, H) / 40) * (scalePct / 100))
  const r = step * 0.5
  ctx.translate(W / 2, H / 2)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.translate(-W / 2, -H / 2)
  const span = Math.hypot(W, H)
  const x0 = W / 2 - span / 2
  const y0 = H / 2 - span / 2
  ctx.strokeStyle = fore
  ctx.fillStyle = fore
  ctx.lineWidth = Math.max(1, step * 0.06)
  ctx.beginPath()
  for (let y = y0, row = 0; y < y0 + span; y += step, row++) {
    for (let x = x0; x < x0 + span; x += step) {
      const ox = kind === 'dots' || kind === 'rings' ? (row % 2) * step * 0.5 : 0
      switch (kind) {
        case 'dots':
          ctx.moveTo(x + ox + r * 0.3, y)
          ctx.arc(x + ox, y, r * 0.3, 0, Math.PI * 2)
          break
        case 'rings':
          ctx.moveTo(x + ox + r * 0.42, y)
          ctx.arc(x + ox, y, r * 0.42, 0, Math.PI * 2)
          break
        case 'checks':
          if ((Math.round(x / step) + row) % 2 === 0) ctx.rect(x, y, step, step)
          break
        case 'cross':
          ctx.moveTo(x - r * 0.3, y); ctx.lineTo(x + r * 0.3, y)
          ctx.moveTo(x, y - r * 0.3); ctx.lineTo(x, y + r * 0.3)
          break
      }
    }
    if (kind === 'grid' || kind === 'lines') {
      ctx.moveTo(x0, y)
      ctx.lineTo(x0 + span, y)
    }
  }
  if (kind === 'grid') {
    for (let x = x0; x < x0 + span; x += step) {
      ctx.moveTo(x, y0)
      ctx.lineTo(x, y0 + span)
    }
  }
  if (kind === 'dots' || kind === 'checks') ctx.fill()
  else ctx.stroke()
  ctx.restore()
}
