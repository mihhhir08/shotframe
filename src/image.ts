import { makeCanvas } from './canvas.ts'

export interface LoadedImage {
  el: CanvasImageSource
  w: number
  h: number
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image'))
    img.src = src
  })
}

export function readAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })
}

export async function loadFile(file: Blob): Promise<LoadedImage> {
  // Finder can hand over a file with an empty type; trust the decoder over the label
  if (file.type && !file.type.startsWith('image/')) throw new Error('That file is not an image')
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    return { el: img, w: img.naturalWidth, h: img.naturalHeight }
  } catch {
    try {
      // some WebKit builds refuse a blob URL in an <img>; the bytes inline always work
      const img = await loadImage(await readAsDataURL(file))
      return { el: img, w: img.naturalWidth, h: img.naturalHeight }
    } catch { /* fall through to the message below */ }
    // HEIC is the usual culprit: it comes out of Photos and no browser decodes it
    const heic = /hei[cf]/i.test(file.type) || (file instanceof File && /\.hei[cf]$/i.test(file.name))
    throw new Error(heic
      ? 'Browsers cannot read HEIC. Export it as PNG or JPEG first.'
      : 'Could not read that image. Try a PNG or JPEG.')
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 30000)
  }
}

const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

function pixels(img: CanvasImageSource, size: number) {
  const [, ctx] = makeCanvas(size, size)
  ctx.drawImage(img, 0, 0, size, size)
  return ctx.getImageData(0, 0, size, size).data
}

// Most common colour along the image border — used to "balance" the inset.
export function edgeColor(img: CanvasImageSource) {
  const n = 64
  const d = pixels(img, n)
  const buckets = new Map<number, [number, number, number, number]>()
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (x > 1 && x < n - 2 && y > 1 && y < n - 2) continue
      const i = (y * n + x) * 4
      const key = (d[i] >> 4 << 8) | (d[i + 1] >> 4 << 4) | (d[i + 2] >> 4)
      const b = buckets.get(key) ?? [0, 0, 0, 0]
      b[0] += d[i]; b[1] += d[i + 1]; b[2] += d[i + 2]; b[3]++
      buckets.set(key, b)
    }
  }
  const [r, g, b, c] = [...buckets.values()].sort((a, b) => b[3] - a[3])[0]
  return hex(r / c, g / c, b / c)
}

// Two or three vivid, distinct colours from the image for a matching gradient.
export function palette(img: CanvasImageSource): string[] {
  const d = pixels(img, 40)
  const buckets = new Map<number, { r: number; g: number; b: number; n: number; score: number }>()
  for (let i = 0; i < d.length; i += 4) {
    const [r, g, b] = [d[i], d[i + 1], d[i + 2]]
    const max = Math.max(r, g, b)
    const sat = max ? (max - Math.min(r, g, b)) / max : 0
    const key = (r >> 5 << 6) | (g >> 5 << 3) | (b >> 5)
    const e = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0, score: 0 }
    e.r += r; e.g += g; e.b += b; e.n++
    e.score += 0.2 + sat * (max / 255)
    buckets.set(key, e)
  }
  const picks: number[][] = []
  for (const e of [...buckets.values()].sort((a, b) => b.score - a.score)) {
    const c = [e.r / e.n, e.g / e.n, e.b / e.n]
    if (picks.every((p) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) > 90)) picks.push(c)
    if (picks.length === 3) break
  }
  if (picks.length < 2) picks.push(picks[0].map((v) => v * 0.45))
  return picks.map((p) => hex(p[0], p[1], p[2]))
}

// A fake dashboard so the app can be tried without a screenshot.
export function sampleImage(): LoadedImage {
  const W = 1600
  const H = 1000
  const [c, x] = makeCanvas(W, H)
  const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
  x.fillStyle = '#fbfaf9'
  x.fillRect(0, 0, W, H)
  x.fillStyle = '#f1efec'
  x.fillRect(0, 0, 280, H)
  x.fillStyle = '#1f1d1b'
  x.font = `700 30px ${font}`
  x.fillText('Northwind', 40, 70)
  x.font = `500 22px ${font}`
  ;['Overview', 'Revenue', 'Customers', 'Reports', 'Settings'].forEach((t, i) => {
    if (i === 0) {
      x.fillStyle = '#e4e0db'
      x.beginPath()
      x.roundRect(24, 128, 232, 50, 12)
      x.fill()
    }
    x.fillStyle = i === 0 ? '#1f1d1b' : '#77726c'
    x.fillText(t, 48, 162 + i * 64)
  })
  x.fillStyle = '#1f1d1b'
  x.font = `700 44px ${font}`
  x.fillText('Good morning, Sam', 340, 100)
  x.fillStyle = '#8a857f'
  x.font = `400 24px ${font}`
  x.fillText('Here is what happened this week.', 340, 142)
  const stats = [['Revenue', '$48,210', '#e8541e'], ['Orders', '1,284', '#2f7d5b'], ['Churn', '1.9%', '#3a61c9']]
  stats.forEach(([label, value, color], i) => {
    const bx = 340 + i * 410
    x.fillStyle = '#ffffff'
    x.strokeStyle = '#ebe7e2'
    x.lineWidth = 2
    x.beginPath()
    x.roundRect(bx, 190, 380, 170, 20)
    x.fill()
    x.stroke()
    x.fillStyle = '#8a857f'
    x.font = `500 22px ${font}`
    x.fillText(label, bx + 32, 245)
    x.fillStyle = '#1f1d1b'
    x.font = `700 50px ${font}`
    x.fillText(value, bx + 32, 315)
    x.fillStyle = color
    x.beginPath()
    x.roundRect(bx + 290, 222, 60, 30, 15)
    x.fill()
  })
  x.fillStyle = '#ffffff'
  x.strokeStyle = '#ebe7e2'
  x.beginPath()
  x.roundRect(340, 400, 1200, 540, 20)
  x.fill()
  x.stroke()
  x.fillStyle = '#1f1d1b'
  x.font = `600 26px ${font}`
  x.fillText('Weekly revenue', 380, 455)
  const bars = [0.42, 0.58, 0.5, 0.72, 0.64, 0.86, 0.78, 0.94, 0.7, 0.82, 0.9, 0.99]
  bars.forEach((v, i) => {
    const bh = v * 380
    x.fillStyle = i === bars.length - 1 ? '#e8541e' : '#f0c9b4'
    x.beginPath()
    x.roundRect(390 + i * 95, 900 - bh, 60, bh, 10)
    x.fill()
  })
  return { el: c, w: W, h: H }
}
