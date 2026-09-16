import { blurred, makeCanvas, rgba } from './canvas.ts'

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

function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [p(a), p(b)]
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

function vertical(ctx: CanvasRenderingContext2D, y0: number, y1: number, stops: string[]) {
  const g = ctx.createLinearGradient(0, y0, 0, y1)
  stops.forEach((c, i) => g.addColorStop(i / Math.max(1, stops.length - 1), c))
  return g
}

function curve(W: number, y: (x: number) => number, closeTo?: number) {
  const path = new Path2D()
  const step = W / 90
  path.moveTo(0, y(0))
  for (let x = step; x <= W + step; x += step) path.lineTo(x, y(x))
  if (closeTo !== undefined) {
    path.lineTo(W + step, closeTo)
    path.lineTo(0, closeTo)
    path.closePath()
  }
  return path
}

// Soft rolling bands, lit along the crest.
function waves(sky: string[], bands: [string, string][]): Draw {
  return (ctx, W, H, rand) => {
    ctx.fillStyle = vertical(ctx, 0, H, sky)
    ctx.fillRect(0, 0, W, H)
    bands.forEach(([top, bottom], i) => {
      const base = H * (0.34 + (i / bands.length) * 0.56)
      const amp = H * (0.05 + rand() * 0.06)
      const f1 = ((1 + rand() * 1.2) * Math.PI * 2) / W
      const f2 = f1 * (1.9 + rand())
      const [p1, p2] = [rand() * 6.28, rand() * 6.28]
      const y = (x: number) => base + amp * Math.sin(f1 * x + p1) + amp * 0.35 * Math.sin(f2 * x + p2)
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = H * 0.06
      ctx.shadowOffsetY = -H * 0.012
      ctx.fillStyle = vertical(ctx, base - amp * 1.4, H, [top, bottom])
      ctx.fill(curve(W, y, H))
      ctx.restore()
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'
      ctx.lineWidth = H * 0.005
      ctx.stroke(curve(W, (x) => y(x) + H * 0.004))
    })
  }
}

// Layered ridges fading into haze, with a low sun.
function hills(sky: string[], far: string, near: string, sun: string): Draw {
  return (ctx, W, H, rand) => {
    ctx.fillStyle = vertical(ctx, 0, H * 0.8, sky)
    ctx.fillRect(0, 0, W, H)
    const sx = W * (0.3 + rand() * 0.4)
    const sy = H * 0.42
    const R = Math.max(W, H) * 0.55
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, R)
    glow.addColorStop(0, rgba(sun, 0.75))
    glow.addColorStop(0.25, rgba(sun, 0.25))
    glow.addColorStop(1, rgba(sun, 0))
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = rgba(sun, 0.95)
    ctx.beginPath()
    ctx.arc(sx, sy, Math.min(W, H) * 0.06, 0, Math.PI * 2)
    ctx.fill()

    const layers = 5
    for (let i = 0; i < layers; i++) {
      const t = i / (layers - 1)
      const base = H * (0.52 + t * 0.34)
      const amp = H * (0.13 - t * 0.06)
      const f1 = ((1.4 + rand() * 1.6) * Math.PI * 2) / W
      const f2 = f1 * (2.6 + rand() * 1.5)
      const [p1, p2] = [rand() * 6.28, rand() * 6.28]
      const y = (x: number) => base - amp * Math.pow(Math.sin(f1 * x + p1) * 0.5 + 0.5, 1.6) - amp * 0.28 * Math.sin(f2 * x + p2)
      const color = mix(far, near, t)
      ctx.fillStyle = vertical(ctx, base - amp, H, [color, mix(color, near, 0.5)])
      ctx.fill(curve(W, y, H))
    }
  }
}

// Thick glossy ribbons sweeping across.
function silk(bg: string[], ribbons: string[]): Draw {
  return (ctx, W, H, rand) => {
    const g = ctx.createLinearGradient(0, 0, W, H)
    bg.forEach((c, i) => g.addColorStop(i / Math.max(1, bg.length - 1), c))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ribbons.forEach((c) => {
      const path = new Path2D()
      path.moveTo(-W * 0.15, H * (rand() * 1.1 - 0.05))
      path.bezierCurveTo(W * 0.3, H * (rand() * 1.4 - 0.2), W * 0.7, H * (rand() * 1.4 - 0.2), W * 1.15, H * (rand() * 1.1 - 0.05))
      const width = H * (0.1 + rand() * 0.16)
      const sheen = ctx.createLinearGradient(0, 0, W, H * 0.4)
      sheen.addColorStop(0, c)
      sheen.addColorStop(0.5, mix(c, '#ffffff', 0.4))
      sheen.addColorStop(1, c)
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.38)'
      ctx.shadowBlur = H * 0.07
      ctx.shadowOffsetY = H * 0.02
      ctx.lineCap = 'round'
      ctx.globalAlpha = 0.92
      ctx.lineWidth = width
      ctx.strokeStyle = sheen
      ctx.stroke(path)
      ctx.restore()
      ctx.save()
      ctx.translate(0, -width * 0.28)
      ctx.lineCap = 'round'
      ctx.lineWidth = width * 0.1
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.stroke(path)
      ctx.restore()
    })
  }
}

// Night sky with glowing curtains of light over a dark ridge.
function aurora(bg: string[], lights: string[]): Draw {
  return (ctx, W, H, rand) => {
    ctx.fillStyle = vertical(ctx, 0, H, bg)
    ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + rand() * 0.7})`
      ctx.beginPath()
      ctx.arc(rand() * W, rand() * H * 0.75, Math.max(0.4, H * (0.0005 + rand() * 0.0013)), 0, Math.PI * 2)
      ctx.fill()
    }
    const [c, x] = makeCanvas(Math.max(16, W / 6), Math.max(16, H / 6))
    const w = c.width
    const h = c.height
    const col = Math.max(1, w / 160)
    x.globalCompositeOperation = 'lighter'
    lights.forEach((light, k) => {
      const base = h * (0.32 + k * 0.1 + rand() * 0.08)
      const amp = h * (0.07 + rand() * 0.08)
      const f = ((1 + rand() * 1.4) * Math.PI * 2) / w
      const p = rand() * 6.28
      for (let i = 0; i < w; i += col) {
        const y = base + amp * Math.sin(f * i + p)
        const len = h * (0.2 + 0.12 * Math.sin(i * f * 2.3 + p))
        const g = x.createLinearGradient(0, y - len, 0, y + h * 0.03)
        g.addColorStop(0, rgba(light, 0))
        g.addColorStop(0.8, rgba(light, 0.4))
        g.addColorStop(1, rgba(light, 0))
        x.fillStyle = g
        x.fillRect(i, y - len, col + 0.5, len + h * 0.03)
      }
    })
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.drawImage(blurred(c, 0, 0, w, h, W, H, Math.max(2, H * 0.02)), 0, 0)
    ctx.restore()
    const f = ((1.2 + rand()) * Math.PI * 2) / W
    const p = rand() * 6.28
    ctx.fillStyle = vertical(ctx, H * 0.8, H, [mix(bg[0], '#000000', 0.4), '#000000'])
    ctx.fill(curve(W, (xx) => H * 0.86 - H * 0.05 * (Math.sin(f * xx + p) * 0.5 + 0.5) - H * 0.015 * Math.sin(f * 3.1 * xx), H))
  }
}


// Soft light through a window: one big bloom, a few drifting orbs.
function bloom(bg: string[], glow: string, orbs: string[]): Draw {
  return (ctx, W, H, rand) => {
    ctx.fillStyle = vertical(ctx, 0, H, bg)
    ctx.fillRect(0, 0, W, H)
    const cx = W * (0.3 + rand() * 0.4)
    const cy = H * (0.2 + rand() * 0.3)
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.8)
    g.addColorStop(0, rgba(glow, 0.85))
    g.addColorStop(0.35, rgba(glow, 0.3))
    g.addColorStop(1, rgba(glow, 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    orbs.forEach((c) => {
      const r = Math.min(W, H) * (0.12 + rand() * 0.22)
      const x = rand() * W
      const y = H * (0.25 + rand() * 0.7)
      const og = ctx.createRadialGradient(x, y, 0, x, y, r)
      og.addColorStop(0, rgba(c, 0.55))
      og.addColorStop(1, rgba(c, 0))
      ctx.fillStyle = og
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    })
  }
}

// Contour lines across a gradient, like a survey map.
function contour(bg: string[], line: string, accent: string): Draw {
  return (ctx, W, H, rand) => {
    const g = ctx.createLinearGradient(0, 0, W, H)
    bg.forEach((c, i) => g.addColorStop(i / Math.max(1, bg.length - 1), c))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    const rings = 26
    const f1 = ((0.8 + rand()) * Math.PI * 2) / W
    const f2 = ((1.6 + rand()) * Math.PI * 2) / W
    const p1 = rand() * 6.28
    for (let i = 0; i < rings; i++) {
      const base = H * (-0.1 + (i / rings) * 1.25)
      const amp = H * (0.05 + 0.04 * Math.sin(i * 0.7 + p1))
      ctx.strokeStyle = i % 6 === 0 ? rgba(accent, 0.55) : rgba(line, 0.3)
      ctx.lineWidth = (i % 6 === 0 ? 2.4 : 1.4) * (H / 900)
      ctx.stroke(curve(W, (x) => base + amp * Math.sin(f1 * x + p1 + i * 0.35) + amp * 0.4 * Math.sin(f2 * x + i)))
    }
  }
}

// A quiet plotting grid with one lit cell band.
function grid(bg: string[], line: string, accent: string): Draw {
  return (ctx, W, H, rand) => {
    ctx.fillStyle = vertical(ctx, 0, H, bg)
    ctx.fillRect(0, 0, W, H)
    const step = Math.max(W, H) / 22
    ctx.lineWidth = Math.max(1, H / 1100)
    ctx.strokeStyle = rgba(line, 0.5)
    ctx.beginPath()
    for (let x = 0; x <= W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H) }
    for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y) }
    ctx.stroke()
    ctx.lineWidth = Math.max(1.5, H / 500)
    ctx.strokeStyle = rgba(accent, 0.7)
    const gx = Math.round(rand() * 18 + 2) * step
    const gy = Math.round(rand() * 14 + 2) * step
    ctx.strokeRect(gx, gy, step * 3, step * 2)
    const gl = ctx.createRadialGradient(gx + step * 1.5, gy + step, 0, gx + step * 1.5, gy + step, step * 6)
    gl.addColorStop(0, rgba(accent, 0.3))
    gl.addColorStop(1, rgba(accent, 0))
    ctx.fillStyle = gl
    ctx.fillRect(0, 0, W, H)
  }
}

// Overlapping translucent shapes, cut paper style.
function paper(bg: string, shapes: string[]): Draw {
  return (ctx, W, H, rand) => {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)
    shapes.forEach((c, i) => {
      ctx.save()
      ctx.globalAlpha = 0.85
      ctx.fillStyle = c
      ctx.shadowColor = 'rgba(0,0,0,0.22)'
      ctx.shadowBlur = H * 0.05
      ctx.shadowOffsetY = H * 0.012
      ctx.beginPath()
      if (i % 2 === 0) {
        const r = Math.min(W, H) * (0.3 + rand() * 0.35)
        ctx.arc(W * rand(), H * rand(), r, 0, Math.PI * 2)
      } else {
        const w = W * (0.35 + rand() * 0.4)
        const h = H * (0.3 + rand() * 0.45)
        ctx.roundRect(W * rand() - w / 2, H * rand() - h / 2, w, h, Math.min(w, h) * 0.18)
      }
      ctx.fill()
      ctx.restore()
    })
  }
}

export const WALLPAPERS: { id: string; name: string; draw: Draw }[] = [
  { id: 'waves-dusk', name: 'Dusk', draw: waves(['#2b1d4f', '#7b4b94', '#f3a683'], [['#c86b98', '#6d3a78'], ['#e58f9e', '#8a4a7d'], ['#f5b3a0', '#b25f7a'], ['#ffd1ba', '#d67b86']]) },
  { id: 'waves-meadow', name: 'Meadow', draw: waves(['#8ec5ff', '#d9ecff'], [['#9ad17b', '#3f8f57'], ['#6fbf6a', '#2e7a45'], ['#b9e07a', '#4c9a4a'], ['#e3d86a', '#5aa04a']]) },
  { id: 'waves-ocean', name: 'Ocean', draw: waves(['#050b24', '#12306b'], [['#1e4fa8', '#0b2257'], ['#2a78d6', '#0e3a86'], ['#39a5f0', '#1456b0'], ['#7fd6ff', '#1f78d1']]) },
  { id: 'hills-alpenglow', name: 'Alpenglow', draw: hills(['#3d2c5e', '#c86b85', '#f8b88b'], '#b98bb0', '#2a1f3d', '#ffe3b3') },
  { id: 'hills-mist', name: 'Mist', draw: hills(['#aebdd0', '#e9eef4'], '#b7c4d4', '#344256', '#ffffff') },
  { id: 'hills-desert', name: 'Desert', draw: hills(['#f6d365', '#fda085'], '#e9a071', '#6b2f22', '#fff4d6') },
  { id: 'silk-noir', name: 'Noir', draw: silk(['#07070c', '#1b1530'], ['#ff5fa2', '#7c6cff', '#39d0ff', '#ffb86b']) },
  { id: 'silk-blush', name: 'Blush', draw: silk(['#fff4ec', '#ffd9cf'], ['#ff8a80', '#ffb199', '#ff6f91', '#ffc3a0']) },
  { id: 'silk-arctic', name: 'Arctic', draw: silk(['#0b2230', '#1d4d63'], ['#4fd1ff', '#a6ffe0', '#e8fbff', '#3a8dff']) },
  { id: 'aurora-borealis', name: 'Borealis', draw: aurora(['#020713', '#07233a', '#0c3b4d'], ['#3dffa8', '#20c9ff', '#a86bff']) },
  { id: 'aurora-nebula', name: 'Nebula', draw: aurora(['#0a0418', '#240b3d', '#3a1250'], ['#ff4fd8', '#6c7bff', '#ff9a5a']) },
  { id: 'aurora-ember', name: 'Ember', draw: aurora(['#0c0503', '#2a0d06', '#4a1a08'], ['#ff7a1a', '#ffcf40', '#ff3d5a']) },
  { id: 'bloom-peach', name: 'Peach', draw: bloom(['#2a1220', '#4a1f2e'], '#ff9a76', ['#ff5f8f', '#ffd27f', '#a56bff']) },
  { id: 'bloom-teal', name: 'Lagoon', draw: bloom(['#04161c', '#062a33'], '#2ee6c5', ['#1fb6ff', '#7cf5d6', '#0f5f7a']) },
  { id: 'bloom-plum', name: 'Plum', draw: bloom(['#140a24', '#26123f'], '#b57bff', ['#ff6fc5', '#6d9bff', '#f0a6ff']) },
  { id: 'contour-sand', name: 'Survey', draw: contour(['#efdcbb', '#e3c396'], '#7a5a32', '#b3441f') },
  { id: 'contour-ink', name: 'Ink map', draw: contour(['#0d1424', '#16233f'], '#6f8cc4', '#57e0ff') },
  { id: 'contour-moss', name: 'Moss', draw: contour(['#16241a', '#24422a'], '#82b48c', '#d7f56a') },
  { id: 'grid-blueprint', name: 'Blueprint', draw: grid(['#0a2a54', '#072a55'], '#7fb2ff', '#ffffff') },
  { id: 'grid-graphite', name: 'Graph', draw: grid(['#141416', '#1d1d20'], '#6f6f78', '#ff8f45') },
  { id: 'grid-mint', name: 'Plot', draw: grid(['#f2f7f3', '#dceadf'], '#8fae99', '#1f9d63') },
  { id: 'paper-warm', name: 'Cutout', draw: paper('#f6ead8', ['#ff8f5e', '#ffd166', '#5aa9e6', '#ef6f8e']) },
  { id: 'paper-cool', name: 'Confetti', draw: paper('#101425', ['#6d5dfc', '#22d3ee', '#f472b6', '#facc15']) },
  { id: 'paper-sage', name: 'Studio', draw: paper('#e8e6df', ['#8fb996', '#c9ada7', '#6d6875', '#f2cc8f']) },
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
