import { ASPECTS, type FrameType, type Settings } from './settings.ts'

// Window chrome thickness in "units" (u). u scales with screenshot size so a
// look stays the same whether the screenshot is 600px or 4000px wide.
export function chrome(frame: FrameType): { top: number; side: number } {
  if (frame === 'macLight' || frame === 'macDark') return { top: 34, side: 0 }
  if (frame === 'windowsLight' || frame === 'windowsDark') return { top: 36, side: 0 }
  if (frame === 'browserLight' || frame === 'browserDark') return { top: 52, side: 0 }
  if (frame === 'glass') return { top: 16, side: 16 }
  return { top: 0, side: 0 }
}

export function aspectRatio(s: Pick<Settings, 'aspect' | 'customW' | 'customH'>): number | null {
  if (s.aspect === 'custom') return s.customW > 0 && s.customH > 0 ? s.customW / s.customH : null
  const a = ASPECTS.find((x) => x.id === s.aspect)
  return a && a.w ? a.w / a.h : null
}

export interface Layout {
  W: number // canvas size, logical px (1 logical px = 1 screenshot px)
  H: number
  u: number
  cropX: number // crop origin in image px
  cropY: number
  sw: number // cropped screenshot size
  sh: number
  top: number // chrome
  side: number
  inset: number
  ww: number // window size (chrome + inset + screenshot), before scale
  wh: number
  k: number // scale
  cx: number // window centre
  cy: number
  pad: number
  captionY: number
  captionSize: number
}

export function computeLayout(s: Settings, imgW: number, imgH: number, ignoreCrop = false): Layout {
  const c = !ignoreCrop && s.crop ? s.crop : { x: 0, y: 0, w: 1, h: 1 }
  const cropX = c.x * imgW
  const cropY = c.y * imgH
  const sw = Math.max(1, c.w * imgW)
  const sh = Math.max(1, c.h * imgH)
  const u = Math.min(5, Math.max(0.5, Math.sqrt(sw * sh) / 800))

  const { top: t, side: sd } = chrome(s.frame)
  const top = t * u
  const side = sd * u
  const inset = s.inset * u
  const ww = sw + 2 * inset + 2 * side
  const wh = sh + 2 * inset + top + side
  const pad = s.padding * u

  const captionSize = s.caption ? s.captionSize * u : 0
  const capBlock = s.caption ? captionSize * 1.3 * (s.caption.split('\n').length) + captionSize * 0.9 : 0

  const contentW = ww + 2 * pad
  const contentH = wh + 2 * pad + capBlock
  let W = contentW
  let H = contentH
  const ratio = aspectRatio(s)
  if (ratio) {
    if (contentW / contentH > ratio) H = contentW / ratio
    else W = contentH * ratio
  }

  const k = s.scale / 100
  const shift = s.captionPos === 'top' ? capBlock / 2 : -capBlock / 2
  const cx = W / 2 + s.posX * (W / 2)
  const cy = H / 2 + shift + s.posY * (H / 2)
  const captionY = s.captionPos === 'top'
    ? cy - (wh * k) / 2 - capBlock
    : cy + (wh * k) / 2 + captionSize * 0.9

  return { W, H, u, cropX, cropY, sw, sh, top, side, inset, ww, wh, k, cx, cy, pad, captionY, captionSize }
}

// Where the screenshot pixels sit on the canvas when drawn flat (no rotation or tilt).
export function shotRect(L: Layout) {
  const x = L.cx - (L.ww * L.k) / 2 + (L.side + L.inset) * L.k
  const y = L.cy - (L.wh * L.k) / 2 + (L.top + L.inset) * L.k
  return { x, y, w: L.sw * L.k, h: L.sh * L.k }
}

export function canvasToImage(L: Layout, lx: number, ly: number) {
  const r = shotRect(L)
  return { x: L.cropX + (lx - r.x) / L.k, y: L.cropY + (ly - r.y) / L.k }
}

export function imageToCanvas(L: Layout, ix: number, iy: number) {
  const r = shotRect(L)
  return { x: r.x + (ix - L.cropX) * L.k, y: r.y + (iy - L.cropY) * L.k }
}

// posX/posY that align the window to a padding edge (-1 left/top, 0 centre, 1 right/bottom).
export function alignPos(L: Layout, ax: number, ay: number) {
  const fx = Math.max(0, L.W - 2 * L.pad - L.ww * L.k) / L.W
  const fy = Math.max(0, L.H - 2 * L.pad - L.wh * L.k) / L.H
  return { posX: ax * fx, posY: ay * fy }
}
