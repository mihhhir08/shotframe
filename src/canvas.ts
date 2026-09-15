export function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(w))
  c.height = Math.max(1, Math.round(h))
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  return [c, ctx] as const
}

// Accepts #rgb, #rrggbb, #rrggbbaa; multiplies any embedded alpha by `a`.
export function rgba(hex: string, a = 1) {
  let h = hex.replace('#', '')
  if (h.length <= 4) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h.slice(0, 6), 16)
  const base = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${+(base * a).toFixed(3)})`
}

export function isLight(hex: string) {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16)
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return lum > 0.6
}

// ponytail: blur = repeated 2x downscale then stepwise bilinear upscale. Works in every
// browser (ctx.filter is missing in older Safari); swap for a gaussian if it looks soft-blocky.
export function blurred(
  src: CanvasImageSource, sx: number, sy: number, sw: number, sh: number,
  w: number, h: number, radius: number,
) {
  const [out, octx] = makeCanvas(w, h)
  octx.drawImage(src, sx, sy, sw, sh, 0, 0, out.width, out.height)
  const steps = Math.round(Math.log2(Math.max(1, radius)))
  const chain: HTMLCanvasElement[] = [out]
  for (let i = 0; i < steps; i++) {
    const prev = chain[chain.length - 1]
    if (prev.width <= 2 || prev.height <= 2) break
    const [c, x] = makeCanvas(prev.width / 2, prev.height / 2)
    x.drawImage(prev, 0, 0, c.width, c.height)
    chain.push(c)
  }
  for (let i = chain.length - 2; i >= 0; i--) {
    const c = chain[i]
    const x = c.getContext('2d')!
    x.clearRect(0, 0, c.width, c.height)
    x.drawImage(chain[i + 1], 0, 0, c.width, c.height)
  }
  return out
}

export function pixelated(
  src: CanvasImageSource, sx: number, sy: number, sw: number, sh: number,
  w: number, h: number, block: number,
) {
  const [small, sctx] = makeCanvas(w / block, h / block)
  sctx.drawImage(src, sx, sy, sw, sh, 0, 0, small.width, small.height)
  const [out, octx] = makeCanvas(w, h)
  octx.imageSmoothingEnabled = false
  octx.drawImage(small, 0, 0, out.width, out.height)
  return out
}

let noise: HTMLCanvasElement | null = null
export function noiseTile() {
  if (noise) return noise
  const [c, ctx] = makeCanvas(160, 160)
  const d = ctx.createImageData(160, 160)
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v
    d.data[i + 3] = 255
  }
  ctx.putImageData(d, 0, 0)
  return (noise = c)
}
