import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { bounds, hitTest, moveAnnotation } from './annotations.ts'
import { canvasToImage, computeLayout, imageToCanvas } from './layout.ts'
import type { SetSettings } from './Panel.tsx'
import { render, type Scene } from './render.ts'
import type { Annotation, Crop, Tool } from './settings.ts'

interface Props {
  scene: Scene
  tool: Tool
  selectedId: string | null
  color: string
  sizeLevel: number
  onSelect: (id: string | null) => void
  onAdd: (a: Annotation) => void
  onUpdate: (a: Annotation, key?: string) => void
  set: SetSettings
}

type Drag =
  | { kind: 'draw' }
  | { kind: 'move'; start: { x: number; y: number }; orig: Annotation }
  | { kind: 'pos'; x: number; y: number; posX: number; posY: number }
  | { kind: 'crop'; mode: string; start: { x: number; y: number }; orig: Crop }

export const SIZES = [3, 6, 11]
const FULL: Crop = { x: 0, y: 0, w: 1, h: 1 }
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const newId = () => Math.random().toString(36).slice(2, 10)

export function Stage({ scene, tool, selectedId, color, sizeLevel, onSelect, onAdd, onUpdate, set }: Props) {
  const s = scene.settings
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drag = useRef<Drag | null>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [draft, setDraft] = useState<Annotation | null>(null)
  const [cropDraft, setCropDraft] = useState<Crop | null>(null)
  const [text, setText] = useState<{ id?: string; x: number; y: number; value: string } | null>(null)

  const cropping = tool === 'crop'
  // ponytail: rotate/tilt are hidden while annotating so clicks map 1:1; mapping through the tilt is the upgrade
  const flat = tool !== 'select' || selectedId !== null
  const L = useMemo(() => computeLayout(s, scene.imgW, scene.imgH, cropping), [s, scene.imgW, scene.imgH, cropping])
  const fit = box.w ? Math.min((box.w - 64) / L.W, (box.h - 48) / L.H) : 0
  const px = Math.min(fit * (window.devicePixelRatio || 1), 2)

  useLayoutEffect(() => {
    const el = wrapRef.current!
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!fit) return
    const id = requestAnimationFrame(() => {
      let annotations = scene.annotations
      if (text?.id) annotations = annotations.filter((a) => a.id !== text.id)
      if (draft) annotations = [...annotations, draft]
      render(canvasRef.current!, { ...scene, annotations }, px, { flat, ignoreCrop: cropping })
    })
    return () => cancelAnimationFrame(id)
  }, [scene, draft, px, fit, flat, cropping, text?.id])

  useEffect(() => {
    setDraft(null)
    setText(null)
  }, [tool])

  const toLogical = (e: { clientX: number; clientY: number }) => {
    const r = canvasRef.current!.getBoundingClientRect()
    return { x: (e.clientX - r.left) / fit, y: (e.clientY - r.top) / fit }
  }
  const size = SIZES[sizeLevel] * L.u

  const commitText = () => {
    if (!text) return
    const existing = scene.annotations.find((a) => a.id === text.id)
    if (existing) onUpdate({ ...existing, text: text.value }, 'text')
    else if (text.value.trim()) onAdd({ id: newId(), type: 'text', x1: text.x, y1: text.y, x2: text.x, y2: text.y, color, size, text: text.value })
    setText(null)
  }

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault() // otherwise the mousedown steals focus from the text box we are about to open
    if (text) return commitText()
    const p = toLogical(e)
    const ip = canvasToImage(L, p.x, p.y)
    ;(e.target as Element).setPointerCapture(e.pointerId)

    if (cropping) {
      const c = s.crop ?? FULL
      const a = imageToCanvas(L, c.x * scene.imgW, c.y * scene.imgH)
      const b = imageToCanvas(L, (c.x + c.w) * scene.imgW, (c.y + c.h) * scene.imgH)
      const tol = 14 / fit
      let mode = ''
      const inY = p.y > a.y - tol && p.y < b.y + tol
      const inX = p.x > a.x - tol && p.x < b.x + tol
      if (inX && Math.abs(p.y - a.y) < tol) mode += 'n'
      if (inX && Math.abs(p.y - b.y) < tol) mode += 's'
      if (inY && Math.abs(p.x - a.x) < tol) mode += 'w'
      if (inY && Math.abs(p.x - b.x) < tol) mode += 'e'
      if (!mode) mode = s.crop && p.x > a.x && p.x < b.x && p.y > a.y && p.y < b.y ? 'move' : 'new'
      drag.current = { kind: 'crop', mode, start: ip, orig: c }
      return
    }

    if (tool === 'select') {
      const hit = hitTest(scene.annotations, ip.x, ip.y, 10 / (fit * L.k))
      onSelect(hit?.id ?? null)
      drag.current = hit
        ? { kind: 'move', start: ip, orig: hit }
        : { kind: 'pos', x: p.x, y: p.y, posX: s.posX, posY: s.posY }
      return
    }

    if (tool === 'text') {
      setText({ x: ip.x, y: ip.y, value: '' })
      return
    }
    if (tool === 'step') {
      onAdd({ id: newId(), type: 'step', x1: ip.x, y1: ip.y, x2: ip.x, y2: ip.y, color, size })
      return
    }
    setDraft({ id: newId(), type: tool, x1: ip.x, y1: ip.y, x2: ip.x, y2: ip.y, color, size, points: tool === 'pen' ? [ip.x, ip.y] : undefined })
    drag.current = { kind: 'draw' }
  }

  const onMove = (e: PointerEvent) => {
    const d = drag.current
    if (!d) return
    const p = toLogical(e)
    const ip = canvasToImage(L, p.x, p.y)

    if (d.kind === 'draw') {
      setDraft((a) => a && (a.type === 'pen' ? { ...a, points: [...a.points!, ip.x, ip.y] } : { ...a, x2: ip.x, y2: ip.y }))
    } else if (d.kind === 'move') {
      onUpdate(moveAnnotation(d.orig, ip.x - d.start.x, ip.y - d.start.y), `move:${d.orig.id}`)
    } else if (d.kind === 'pos') {
      const snap = (v: number) => (Math.abs(v) < 0.015 ? 0 : clamp(v, -1, 1))
      set({ posX: snap(d.posX + (p.x - d.x) / (L.W / 2)), posY: snap(d.posY + (p.y - d.y) / (L.H / 2)) }, 'pos')
    } else {
      const o = d.orig
      const ix = clamp(ip.x / scene.imgW, 0, 1)
      const iy = clamp(ip.y / scene.imgH, 0, 1)
      const dx = (ip.x - d.start.x) / scene.imgW
      const dy = (ip.y - d.start.y) / scene.imgH
      const min = 0.02
      let { x, y, w, h } = o
      if (d.mode === 'new') {
        const sx = clamp(d.start.x / scene.imgW, 0, 1)
        const sy = clamp(d.start.y / scene.imgH, 0, 1)
        ;[x, y, w, h] = [Math.min(sx, ix), Math.min(sy, iy), Math.abs(ix - sx), Math.abs(iy - sy)]
      } else if (d.mode === 'move') {
        x = clamp(o.x + dx, 0, 1 - o.w)
        y = clamp(o.y + dy, 0, 1 - o.h)
      } else {
        if (d.mode.includes('w')) { x = clamp(o.x + dx, 0, o.x + o.w - min); w = o.x + o.w - x }
        if (d.mode.includes('e')) w = clamp(o.w + dx, min, 1 - o.x)
        if (d.mode.includes('n')) { y = clamp(o.y + dy, 0, o.y + o.h - min); h = o.y + o.h - y }
        if (d.mode.includes('s')) h = clamp(o.h + dy, min, 1 - o.y)
      }
      setCropDraft({ x, y, w, h })
    }
  }

  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (d?.kind === 'draw' && draft) {
      const b = bounds(draft)
      if (Math.max(b.w, b.h) > 4 / L.k) onAdd(draft)
      setDraft(null)
    }
    if (d?.kind === 'crop' && cropDraft) {
      const full = cropDraft.w > 0.995 && cropDraft.h > 0.995
      if (cropDraft.w > 0.02 && cropDraft.h > 0.02) set({ crop: full ? null : cropDraft })
      setCropDraft(null)
    }
  }

  const onDouble = (e: { clientX: number; clientY: number }) => {
    if (tool !== 'select') return
    const p = toLogical(e)
    const ip = canvasToImage(L, p.x, p.y)
    const hit = hitTest(scene.annotations, ip.x, ip.y, 10 / (fit * L.k))
    if (hit?.type === 'text') setText({ id: hit.id, x: hit.x1, y: hit.y1, value: hit.text || '' })
  }

  // Overlays in CSS px
  const toCss = (ix: number, iy: number) => {
    const c = imageToCanvas(L, ix, iy)
    return { x: c.x * fit, y: c.y * fit }
  }
  const selected = scene.annotations.find((a) => a.id === selectedId)
  const selBox = selected && flat && (() => {
    const b = bounds(selected)
    const a = toCss(b.x, b.y)
    const z = toCss(b.x + b.w, b.y + b.h)
    return { left: a.x - 6, top: a.y - 6, width: z.x - a.x + 12, height: z.y - a.y + 12 }
  })()
  const crop = cropDraft ?? s.crop ?? FULL
  const cropBox = cropping && (() => {
    const a = toCss(crop.x * scene.imgW, crop.y * scene.imgH)
    const z = toCss((crop.x + crop.w) * scene.imgW, (crop.y + crop.h) * scene.imgH)
    return { left: a.x, top: a.y, width: z.x - a.x, height: z.y - a.y }
  })()
  const textPos = text && toCss(text.x, text.y)

  const cursor = cropping || tool !== 'select' ? (tool === 'text' ? 'text' : 'crosshair') : selectedId ? 'move' : 'grab'

  return (
    <div className="stage" ref={wrapRef}>
      {fit > 0 && (
        <div className="stage-canvas" style={{ width: L.W * fit, height: L.H * fit }}>
          <canvas ref={canvasRef} className={s.bgType === 'transparent' ? 'checker' : ''} style={{ width: '100%', height: '100%' }} />
          <div className="overlay" style={{ cursor }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDoubleClick={onDouble}>
            {selBox && <div className="sel-box" style={selBox} />}
            {cropBox && (
              <div className="crop-box" style={cropBox}>
                <i className="nw" /><i className="ne" /><i className="sw" /><i className="se" />
                <span className="crop-size">{Math.round(crop.w * scene.imgW)} × {Math.round(crop.h * scene.imgH)}</span>
              </div>
            )}
          </div>
          {text && textPos && (
            <textarea
              className="text-edit"
              autoFocus
              value={text.value}
              rows={Math.max(1, text.value.split('\n').length)}
              style={{ left: textPos.x, top: textPos.y, color, fontSize: size * 5 * L.k * fit, lineHeight: 1.2 }}
              onChange={(e) => setText({ ...text, value: e.target.value })}
              onBlur={commitText}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Escape') setText(null)
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitText() }
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
