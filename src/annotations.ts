import { blurred, isLight, makeCanvas, pixelated, rgba } from './canvas.ts'
import type { Annotation } from './settings.ts'

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
const textFont = (a: Annotation) => `700 ${a.size * 5}px ${FONT}`
const stepRadius = (a: Annotation) => a.size * 3.4

function box(a: Annotation) {
  return { x: Math.min(a.x1, a.x2), y: Math.min(a.y1, a.y2), w: Math.abs(a.x2 - a.x1), h: Math.abs(a.y2 - a.y1) }
}

export const curved = (a: Annotation) => a.cx !== undefined && a.cy !== undefined
const control = (a: Annotation) => (curved(a) ? { x: a.cx!, y: a.cy! } : { x: (a.x1 + a.x2) / 2, y: (a.y1 + a.y2) / 2 })

// The handle sits on the curve (t = 0.5), which is easier to grab than the control point itself.
export function curveHandle(a: Annotation) {
  const c = control(a)
  return curved(a)
    ? { x: 0.25 * a.x1 + 0.5 * c.x + 0.25 * a.x2, y: 0.25 * a.y1 + 0.5 * c.y + 0.25 * a.y2 }
    : c
}

export function bendThrough(a: Annotation, mx: number, my: number, snap: number): Annotation {
  const hx = (a.x1 + a.x2) / 2
  const hy = (a.y1 + a.y2) / 2
  if (Math.hypot(mx - hx, my - hy) < snap) return straighten(a)
  return { ...a, cx: 2 * mx - hx, cy: 2 * my - hy }
}

export function withBend(a: Annotation): Annotation {
  const [dx, dy] = [a.x2 - a.x1, a.y2 - a.y1]
  const len = Math.hypot(dx, dy)
  if (len < 1) return a
  return bendThrough(a, (a.x1 + a.x2) / 2 - (dy / len) * len * 0.18, (a.y1 + a.y2) / 2 + (dx / len) * len * 0.18, 0)
}

export function straighten(a: Annotation): Annotation {
  const { cx: _cx, cy: _cy, ...rest } = a
  return rest
}

// ctx draws in device pixels; (offX, offY) is the crop origin in image px.
export function drawAnnotation(ctx: CanvasRenderingContext2D, a: Annotation, px: number, offX: number, offY: number, stepNo: number) {
  const { x, y, w, h } = box(a)
  const c = ctx.canvas
  ctx.save()
  ctx.setTransform(px, 0, 0, px, -offX * px, -offY * px)
  ctx.strokeStyle = ctx.fillStyle = a.color
  ctx.lineWidth = a.size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (a.type) {
    case 'arrow': {
      const c = control(a)
      const len = Math.hypot(a.x2 - a.x1, a.y2 - a.y1)
      const head = Math.min(len * 0.7, a.size * 4 + 6)
      const heads = a.heads ?? 'end'
      // tangents at the ends: straight lines fall out of this too, since the control point is the midpoint
      const endAng = Math.atan2(a.y2 - c.y, a.x2 - c.x)
      const startAng = Math.atan2(a.y1 - c.y, a.x1 - c.x)
      const trim = head * 0.7
      const back = (px2: number, py: number, ang: number, on: boolean) =>
        on ? [px2 - Math.cos(ang) * trim, py - Math.sin(ang) * trim] : [px2, py]
      const [ex, ey] = back(a.x2, a.y2, endAng, heads !== 'none')
      const [sx, sy] = back(a.x1, a.y1, startAng, heads === 'both')
      if (a.dashed) ctx.setLineDash([a.size * 1.6, a.size * 2])
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      if (curved(a)) ctx.quadraticCurveTo(c.x, c.y, ex, ey)
      else ctx.lineTo(ex, ey)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.lineWidth = a.size * 0.6
      const tip = (tx: number, ty: number, ang: number) => {
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(tx - head * Math.cos(ang - 0.5), ty - head * Math.sin(ang - 0.5))
        ctx.lineTo(tx - head * Math.cos(ang + 0.5), ty - head * Math.sin(ang + 0.5))
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
      if (heads !== 'none') tip(a.x2, a.y2, endAng)
      if (heads === 'both') tip(a.x1, a.y1, startAng)
      break
    }
    case 'rect':
      if (a.dashed) ctx.setLineDash([a.size * 1.6, a.size * 2])
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, a.size)
      ctx.stroke()
      break
    case 'ellipse':
      if (a.dashed) ctx.setLineDash([a.size * 1.6, a.size * 2])
      ctx.beginPath()
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'highlight':
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillStyle = rgba(a.color, 0.55)
      ctx.fillRect(x, y, w, h)
      break
    case 'blur':
    case 'pixelate': {
      const dx = Math.max(0, Math.round((x - offX) * px))
      const dy = Math.max(0, Math.round((y - offY) * px))
      const dw = Math.min(c.width - dx, Math.round(w * px))
      const dh = Math.min(c.height - dy, Math.round(h * px))
      if (dw < 2 || dh < 2) break
      const out = a.type === 'blur'
        ? blurred(c, dx, dy, dw, dh, dw, dh, Math.max(8, a.size * px * 4))
        : pixelated(c, dx, dy, dw, dh, dw, dh, Math.max(3, a.size * px * 2.5))
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(out, dx, dy)
      break
    }
    case 'spotlight':
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.beginPath()
      ctx.rect(offX, offY, c.width / px, c.height / px)
      ctx.roundRect(x, y, w, h, a.size * 2)
      ctx.fill('evenodd')
      break
    case 'text': {
      ctx.font = textFont(a)
      ctx.textBaseline = 'top'
      ctx.lineWidth = a.size * 1.2
      ctx.strokeStyle = isLight(a.color) ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)'
      ;(a.text || '').split('\n').forEach((line, i) => {
        const ly = a.y1 + i * a.size * 6
        ctx.strokeText(line, a.x1, ly)
        ctx.fillText(line, a.x1, ly)
      })
      break
    }
    case 'step': {
      const r = stepRadius(a)
      ctx.beginPath()
      ctx.arc(a.x1, a.y1, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = a.size * 0.6
      ctx.strokeStyle = '#ffffff'
      ctx.stroke()
      ctx.fillStyle = isLight(a.color) ? '#111111' : '#ffffff'
      ctx.font = `700 ${r * 1.1}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(stepNo), a.x1, a.y1 + r * 0.06)
      break
    }
    case 'pen': {
      const p = a.points || []
      if (a.dashed) ctx.setLineDash([a.size * 1.6, a.size * 2])
      ctx.beginPath()
      for (let i = 0; i < p.length; i += 2) i ? ctx.lineTo(p[i], p[i + 1]) : ctx.moveTo(p[i], p[i + 1])
      ctx.stroke()
      break
    }
  }
  ctx.restore()
}

export function drawAnnotations(ctx: CanvasRenderingContext2D, list: Annotation[], px: number, offX: number, offY: number) {
  let step = 0
  for (const a of list) drawAnnotation(ctx, a, px, offX, offY, a.type === 'step' ? ++step : 0)
}

let measure: CanvasRenderingContext2D | null = null
export function bounds(a: Annotation) {
  if (a.type === 'step') {
    const r = stepRadius(a)
    return { x: a.x1 - r, y: a.y1 - r, w: r * 2, h: r * 2 }
  }
  if (a.type === 'text') {
    measure ??= makeCanvas(1, 1)[1]
    measure.font = textFont(a)
    const lines = (a.text || '').split('\n')
    const w = Math.max(...lines.map((l) => measure!.measureText(l).width))
    return { x: a.x1, y: a.y1, w, h: lines.length * a.size * 6 }
  }
  if (a.type === 'arrow' && curved(a)) {
    const m = curveHandle(a)
    const x = Math.min(a.x1, a.x2, m.x)
    const y = Math.min(a.y1, a.y2, m.y)
    return { x, y, w: Math.max(a.x1, a.x2, m.x) - x, h: Math.max(a.y1, a.y2, m.y) - y }
  }
  if (a.type === 'pen' && a.points?.length) {
    const xs = a.points.filter((_, i) => i % 2 === 0)
    const ys = a.points.filter((_, i) => i % 2 === 1)
    const x = Math.min(...xs)
    const y = Math.min(...ys)
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
  }
  return box(a)
}

// Topmost annotation under an image-space point.
export function hitTest(list: Annotation[], ix: number, iy: number, tol: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const b = bounds(list[i])
    if (ix >= b.x - tol && ix <= b.x + b.w + tol && iy >= b.y - tol && iy <= b.y + b.h + tol) return list[i]
  }
  return null
}

export function moveAnnotation(a: Annotation, dx: number, dy: number): Annotation {
  return {
    ...a,
    x1: a.x1 + dx, y1: a.y1 + dy, x2: a.x2 + dx, y2: a.y2 + dy,
    cx: a.cx === undefined ? undefined : a.cx + dx,
    cy: a.cy === undefined ? undefined : a.cy + dy,
    points: a.points?.map((v, i) => v + (i % 2 ? dy : dx)),
  }
}
