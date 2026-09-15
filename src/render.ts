import { drawAnnotations } from './annotations.ts'
import { blurred, makeCanvas, noiseTile, rgba } from './canvas.ts'
import { computeLayout, type Layout } from './layout.ts'
import type { Annotation, Settings } from './settings.ts'
import { tilt } from './tilt.ts'

export interface Scene {
  settings: Settings
  image: CanvasImageSource
  imgW: number
  imgH: number
  annotations: Annotation[]
  bgImage: HTMLImageElement | null
}

export interface RenderOpts {
  flat?: boolean // skip rotate/tilt (used while annotating so clicks map 1:1)
  ignoreCrop?: boolean // show the whole image (used by the crop tool)
}

const SYS = `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

export function render(canvas: HTMLCanvasElement, scene: Scene, px: number, opts: RenderOpts = {}): Layout {
  const s = scene.settings
  const L = computeLayout(s, scene.imgW, scene.imgH, opts.ignoreCrop)
  canvas.width = Math.max(1, Math.round(L.W * px))
  canvas.height = Math.max(1, Math.round(L.H * px))
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'

  drawBackground(ctx, scene, L)

  let layer = makeWindow(makeShot(scene, L, px), s, L, px)
  let fitTilt = 1
  if (!opts.flat && (s.tiltX || s.tiltY)) {
    const t = tilt(layer, s.tiltX, s.tiltY)
    // keep the tilted window inside its flat footprint so it never spills over padding or caption
    if (t) fitTilt = Math.min(1, layer.width / t.width, layer.height / t.height)
    layer = t ?? layer
  }
  const lw = (layer.width / px) * fitTilt
  const lh = (layer.height / px) * fitTilt

  ctx.save()
  ctx.setTransform(px, 0, 0, px, 0, 0)
  ctx.translate(L.cx, L.cy)
  if (!opts.flat) ctx.rotate((s.rotate * Math.PI) / 180)
  ctx.scale(L.k, L.k)
  if (s.shadowOpacity > 0) {
    // shadow values are in device px and ignore the transform
    ctx.shadowColor = `rgba(0,0,0,${s.shadowOpacity / 100})`
    ctx.shadowBlur = s.shadowBlur * L.u * px * L.k
    ctx.shadowOffsetY = s.shadowY * L.u * px * L.k
  }
  ctx.drawImage(layer, -lw / 2, -lh / 2, lw, lh)
  ctx.restore()

  drawText(ctx, s, L, px)
  return L
}

function drawBackground(ctx: CanvasRenderingContext2D, scene: Scene, L: Layout) {
  const s = scene.settings
  const { width: W, height: H } = ctx.canvas
  const px = W / L.W
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const cover = (img: CanvasImageSource, iw: number, ih: number, radius: number) => {
    const scale = Math.max(W / iw, H / ih)
    const sw = W / scale
    const sh = H / scale
    ctx.drawImage(blurred(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, W, H, radius), 0, 0)
  }

  switch (s.bgType) {
    case 'gradient': {
      let g: CanvasGradient
      if (s.gradRadial) {
        g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) / 2)
      } else {
        const a = (s.gradAngle * Math.PI) / 180
        const dx = Math.sin(a)
        const dy = -Math.cos(a)
        const len = Math.abs(W * dx) + Math.abs(H * dy)
        g = ctx.createLinearGradient(W / 2 - (dx * len) / 2, H / 2 - (dy * len) / 2, W / 2 + (dx * len) / 2, H / 2 + (dy * len) / 2)
      }
      s.gradColors.forEach((c, i) => g.addColorStop(i / Math.max(1, s.gradColors.length - 1), c))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      break
    }
    case 'mesh': {
      const [base, ...blobs] = s.meshColors
      ctx.fillStyle = base
      ctx.fillRect(0, 0, W, H)
      const spots = [[0.12, 0.18], [0.88, 0.14], [0.85, 0.88], [0.18, 0.82]]
      const R = Math.max(W, H) * 0.7
      blobs.forEach((c, i) => {
        const [x, y] = spots[i % spots.length]
        const g = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, R)
        g.addColorStop(0, rgba(c, 0.95))
        g.addColorStop(0.45, rgba(c, 0.45))
        g.addColorStop(1, rgba(c, 0))
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })
      break
    }
    case 'solid':
      ctx.fillStyle = s.solidColor
      ctx.fillRect(0, 0, W, H)
      break
    case 'image':
      if (scene.bgImage) cover(scene.bgImage, scene.bgImage.naturalWidth, scene.bgImage.naturalHeight, s.bgBlur * L.u * px * 0.5)
      else {
        ctx.fillStyle = '#1c1a18'
        ctx.fillRect(0, 0, W, H)
      }
      break
    case 'blurred':
      cover(scene.image, scene.imgW, scene.imgH, Math.max(4, s.bgBlur * L.u * px * 0.5))
      ctx.fillStyle = 'rgba(0,0,0,0.08)'
      ctx.fillRect(0, 0, W, H)
      break
    case 'transparent':
      ctx.clearRect(0, 0, W, H)
      break
  }

  if (s.noise > 0 && s.bgType !== 'transparent') {
    ctx.save()
    ctx.globalCompositeOperation = 'overlay'
    ctx.globalAlpha = (s.noise / 100) * 0.6
    ctx.fillStyle = ctx.createPattern(noiseTile(), 'repeat')!
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
  }
}

function makeShot(scene: Scene, L: Layout, px: number) {
  const [c, ctx] = makeCanvas(L.sw * px, L.sh * px)
  ctx.setTransform(px, 0, 0, px, -L.cropX * px, -L.cropY * px)
  ctx.drawImage(scene.image, 0, 0, scene.imgW, scene.imgH)
  drawAnnotations(ctx, scene.annotations, px, L.cropX, L.cropY)
  return c
}

const BAR: Record<string, { bg: string; fg: string; line: string; pill?: string }> = {
  macLight: { bg: '#ececec', fg: '#4a4a4a', line: 'rgba(0,0,0,0.1)' },
  macDark: { bg: '#2c2c2e', fg: '#c7c7c7', line: 'rgba(0,0,0,0.5)' },
  browserLight: { bg: '#e9e9eb', fg: '#555555', line: 'rgba(0,0,0,0.1)', pill: '#ffffff' },
  browserDark: { bg: '#232325', fg: '#b5b5b5', line: 'rgba(0,0,0,0.5)', pill: '#38383b' },
  windowsLight: { bg: '#f3f3f3', fg: '#333333', line: 'rgba(0,0,0,0.08)' },
  windowsDark: { bg: '#202020', fg: '#dddddd', line: 'rgba(0,0,0,0.5)' },
}

function makeWindow(shot: HTMLCanvasElement, s: Settings, L: Layout, px: number) {
  const [c, ctx] = makeCanvas(L.ww * px, L.wh * px)
  ctx.setTransform(px, 0, 0, px, 0, 0)
  const u = L.u
  const W = L.ww
  const H = L.wh
  const r = Math.min(s.radius * u, W / 2, H / 2)
  const bar = BAR[s.frame]

  ctx.beginPath()
  ctx.roundRect(0, 0, W, H, r)
  ctx.clip()

  if (s.frame === 'glass') {
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.fillRect(0, 0, W, H)
  } else if (bar) {
    ctx.fillStyle = bar.bg
    ctx.fillRect(0, 0, W, H)
  }

  const iw = L.sw + 2 * L.inset
  const ih = L.sh + 2 * L.inset
  ctx.save()
  if (s.frame === 'glass') {
    ctx.beginPath()
    ctx.roundRect(L.side, L.top, iw, ih, Math.max(0, r - L.side))
    ctx.clip()
  }
  if (L.inset > 0) {
    ctx.fillStyle = s.insetColor
    ctx.fillRect(L.side, L.top, iw, ih)
  }
  ctx.drawImage(shot, L.side + L.inset, L.top + L.inset, L.sw, L.sh)
  ctx.restore()

  if (bar) drawChrome(ctx, s, L, bar)
  if (s.frame === 'glass') {
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.lineWidth = 3 * u
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, r)
    ctx.stroke()
  }
  if (s.borderWidth > 0) {
    ctx.strokeStyle = rgba(s.borderColor)
    ctx.lineWidth = s.borderWidth * u * 2 // half is clipped away
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, r)
    ctx.stroke()
  }
  return c
}

function drawChrome(ctx: CanvasRenderingContext2D, s: Settings, L: Layout, bar: (typeof BAR)[string]) {
  const u = L.u
  const W = L.ww
  const top = L.top
  const mid = top / 2
  ctx.fillStyle = bar.line
  ctx.fillRect(0, top - u, W, u)
  ctx.textBaseline = 'middle'

  const lights = () => {
    ;['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
      ctx.beginPath()
      ctx.arc(20 * u + i * 20 * u, mid, 6.5 * u, 0, Math.PI * 2)
      ctx.fillStyle = col
      ctx.fill()
    })
  }

  if (s.frame.startsWith('mac')) {
    lights()
    ctx.fillStyle = bar.fg
    ctx.font = `600 ${13 * u}px ${SYS}`
    ctx.textAlign = 'center'
    ctx.fillText(s.frameTitle, W / 2, mid)
  } else if (s.frame.startsWith('browser')) {
    lights()
    ctx.strokeStyle = bar.fg
    ctx.lineWidth = 1.8 * u
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const [x, d] of [[92, -1], [116, 1]]) {
      ctx.beginPath()
      ctx.moveTo((x - 3 * d) * u, mid - 6 * u)
      ctx.lineTo((x + 3 * d) * u, mid)
      ctx.lineTo((x - 3 * d) * u, mid + 6 * u)
      ctx.stroke()
    }
    const pw = Math.max(Math.min(W - 300 * u, W * 0.55), Math.min(W - 150 * u, 160 * u))
    const ph = 30 * u
    const x0 = (W - pw) / 2
    ctx.fillStyle = bar.pill!
    ctx.beginPath()
    ctx.roundRect(x0, mid - ph / 2, pw, ph, 9 * u)
    ctx.fill()
    const text = s.frameTitle || 'shotframe.app'
    ctx.font = `500 ${13 * u}px ${SYS}`
    ctx.textAlign = 'left'
    const tw = ctx.measureText(text).width
    const tx = W / 2 - tw / 2 + 8 * u
    // lock
    ctx.fillStyle = bar.fg
    ctx.strokeStyle = bar.fg
    ctx.lineWidth = 1.5 * u
    ctx.beginPath()
    ctx.roundRect(tx - 18 * u, mid - 1 * u, 9 * u, 7 * u, 1.5 * u)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(tx - 13.5 * u, mid - 1 * u, 3 * u, Math.PI, 0)
    ctx.stroke()
    ctx.fillText(text, tx, mid + 0.5 * u)
  } else {
    ctx.fillStyle = bar.fg
    ctx.font = `400 ${12 * u}px ${SYS}`
    ctx.textAlign = 'left'
    ctx.fillText(s.frameTitle, 14 * u, mid)
    ctx.strokeStyle = bar.fg
    ctx.lineWidth = 1 * u
    const bw = 46 * u
    const cx = (i: number) => W - bw * (i + 0.5)
    const e = 5 * u
    ctx.beginPath()
    ctx.moveTo(cx(2) - e, mid)
    ctx.lineTo(cx(2) + e, mid)
    ctx.stroke()
    ctx.strokeRect(cx(1) - e, mid - e, e * 2, e * 2)
    ctx.beginPath()
    ctx.moveTo(cx(0) - e, mid - e)
    ctx.lineTo(cx(0) + e, mid + e)
    ctx.moveTo(cx(0) + e, mid - e)
    ctx.lineTo(cx(0) - e, mid + e)
    ctx.stroke()
  }
}

function drawText(ctx: CanvasRenderingContext2D, s: Settings, L: Layout, px: number) {
  ctx.save()
  ctx.setTransform(px, 0, 0, px, 0, 0)
  if (s.caption) {
    ctx.fillStyle = s.captionColor
    ctx.font = `700 ${L.captionSize}px ${SYS}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    s.caption.split('\n').forEach((line, i) => ctx.fillText(line, L.cx, L.captionY + i * L.captionSize * 1.3))
  }
  if (s.watermark) {
    const size = 18 * L.u
    const m = 22 * L.u
    ctx.globalAlpha = s.watermarkOpacity / 100
    ctx.font = `600 ${size}px ${SYS}`
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.35)'
    ctx.shadowBlur = 6 * L.u * px
    const p = s.watermarkPos
    ctx.textAlign = p[1] === 'l' ? 'left' : p[1] === 'r' ? 'right' : 'center'
    ctx.textBaseline = p[0] === 't' ? 'top' : 'bottom'
    const x = p[1] === 'l' ? m : p[1] === 'r' ? L.W - m : L.W / 2
    ctx.fillText(s.watermark, x, p[0] === 't' ? m : L.H - m)
  }
  ctx.restore()
}
