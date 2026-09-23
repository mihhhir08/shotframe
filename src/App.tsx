import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { curved, straighten, withBend } from './annotations.ts'
import { makeCanvas } from './canvas.ts'
import { Icon, type IconName } from './icons.tsx'
import { loadFile, loadImage, palette, sampleImage, type LoadedImage } from './image.ts'
import { computeLayout } from './layout.ts'
import { motionPatch, videoMime, VIDEO_SIZES } from './motion.ts'
import { Background, Panel, Seg, TABS, type BgPick, type PanelTab, type SetSettings, type UserPreset } from './Panel.tsx'
import { render, type RenderCache, type Scene } from './render.ts'
import { DEFAULTS, type Annotation, type ArrowHeads, type Settings, type StrokeOpts, type Tool } from './settings.ts'
import { SIZES, Stage } from './Stage.tsx'

interface Doc { settings: Settings; annotations: Annotation[] }

const TOOLS: [Tool, IconName, string, string][] = [
  ['select', 'select', 'Select & move', 'V'],
  ['crop', 'crop', 'Crop', 'C'],
  ['arrow', 'arrow', 'Arrow', 'A'],
  ['rect', 'rect', 'Box', 'R'],
  ['ellipse', 'ellipse', 'Ellipse', 'O'],
  ['highlight', 'highlight', 'Highlighter', 'H'],
  ['text', 'text', 'Text', 'T'],
  ['step', 'step', 'Numbered step', 'N'],
  ['pen', 'pen', 'Pen', 'P'],
  ['blur', 'blur', 'Blur', 'B'],
  ['pixelate', 'pixelate', 'Pixelate', 'X'],
  ['spotlight', 'spotlight', 'Spotlight', 'S'],
]
const INK = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#0a84ff', '#af52de', '#ffffff', '#111111']
const FORMATS = ['png', 'jpeg', 'webp'] as const
const SCALES = [0.5, 1, 2, 3, 4]

const load = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')
const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent)
const MOD = isMac ? '⌘' : 'Ctrl+'

function useMedia(query: string) {
  const [hit, setHit] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setHit(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return hit
}

function useHistory(initial: Doc) {
  const [h, setH] = useState({ past: [] as Doc[], present: initial, future: [] as Doc[], key: '', t: 0 })
  const update = useCallback((fn: (d: Doc) => Doc, key = '') => setH((h) => {
    const now = Date.now()
    // consecutive changes to the same control (a slider drag) collapse into one undo step
    const merge = key !== '' && key === h.key && now - h.t < 800
    return { past: merge ? h.past : [...h.past, h.present].slice(-150), present: fn(h.present), future: [], key, t: now }
  }), [])
  const undo = useCallback(() => setH((h) => h.past.length
    ? { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future], key: '', t: 0 }
    : h), [])
  const redo = useCallback(() => setH((h) => h.future.length
    ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1), key: '', t: 0 }
    : h), [])
  return { doc: h.present, update, undo, redo, canUndo: h.past.length > 0, canRedo: h.future.length > 0 }
}

export default function App() {
  const initial = useMemo<Doc>(() => ({ settings: { ...DEFAULTS, ...load<Partial<Settings>>('shotframe:settings', {}), crop: null }, annotations: [] }), [])
  const { doc, update, undo, redo, canUndo, canRedo } = useHistory(initial)
  const s = doc.settings

  const [image, setImage] = useState<LoadedImage | null>(null)
  const [glow, setGlow] = useState(['#ff8f45', '#7a4bd1'])
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null)
  const [tool, setToolRaw] = useState<Tool>('select')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [color, setColor] = useState('#ff3b30')
  const [sizeLevel, setSizeLevel] = useState(1)
  const [stroke, setStroke] = useState<StrokeOpts>({ curve: false, heads: 'end', dashed: false })
  const [format, setFormat] = useState<(typeof FORMATS)[number]>(() => load('shotframe:format', 'png'))
  const [scale, setScale] = useState<number>(() => load('shotframe:scale', 1))
  const [tab, setTab] = useState<PanelTab>(() => {
    const t = load<PanelTab>('shotframe:tab', 'background')
    return TABS.some((x) => x[0] === t) ? t : 'background'
  })
  const [presets, setPresets] = useState<UserPreset[]>(() => load('shotframe:presets', []))
  const [recent, setRecent] = useState<BgPick[]>(() => load('shotframe:recent', []))
  const narrow = useMedia('(max-width: 900px)')
  const [bgOpen, setBgOpen] = useState<boolean>(() => load('shotframe:bgOpen', true))
  const [mode, setModeRaw] = useState<'static' | 'motion'>('static')
  const [videoSize, setVideoSize] = useState<number>(() => load('shotframe:videoSize', 1920))
  const [fps, setFps] = useState<number>(() => load('shotframe:fps', 30))
  const [recording, setRecording] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef(0)
  const bgTime = useRef(0) // frame the preview is showing, so a PNG exports what you see

  const flash = (msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2200)
  }

  const set: SetSettings = useCallback((patch, key) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } }), key), [update])
  const setTool = (t: Tool) => {
    setToolRaw(t)
    if (t !== 'select') setSelectedId(null)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      const { crop: _crop, ...style } = s
      if (!save('shotframe:settings', style)) save('shotframe:settings', { ...style, bgImage: null })
    }, 300)
    return () => clearTimeout(t)
  }, [s])
  useEffect(() => { save('shotframe:format', format); save('shotframe:scale', scale) }, [format, scale])
  useEffect(() => { save('shotframe:tab', tab) }, [tab])
  useEffect(() => { save('shotframe:bgOpen', bgOpen) }, [bgOpen])
  useEffect(() => { save('shotframe:videoSize', videoSize); save('shotframe:fps', fps) }, [videoSize, fps])

  const setMode = (m: 'static' | 'motion') => {
    setModeRaw(m)
    setSelectedId(null)
    setToolRaw('select')
    setTab(m === 'motion' ? 'motion' : 'background')
  }

  useEffect(() => {
    if (!s.bgImage) return setBgImg(null)
    let live = true
    loadImage(s.bgImage).then((img) => live && setBgImg(img), () => {})
    return () => { live = false }
  }, [s.bgImage])

  const openImage = useCallback((img: LoadedImage) => {
    setImage(img)
    // the room takes the colours of whatever you just brought in
    try {
      const p = palette(img.el)
      setGlow([p[0], p[1] ?? p[0]])
    } catch { /* tainted or tiny images keep the current light */ }
    update((d) => ({ settings: { ...d.settings, crop: null }, annotations: [] }))
    setSelectedId(null)
    setToolRaw('select')
  }, [update])

  // #sample still loads the demo image for screenshots and tests; nothing in the UI offers it.
  useEffect(() => {
    if (location.hash === '#sample') openImage(sampleImage())
  }, [openImage])

  const openFile = useCallback(async (file: Blob) => {
    try {
      openImage(await loadFile(file))
    } catch (e) {
      flash((e as Error).message)
    }
  }, [openImage])


  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files ?? [])].find((f) => f.type.startsWith('image/'))
      if (file) {
        e.preventDefault()
        openFile(file)
      }
    }
    const onDragOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes('Files')) return
      e.preventDefault()
      setDragging(true)
    }
    const onDragLeave = (e: DragEvent) => { if (!e.relatedTarget) setDragging(false) }
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer?.files[0]
      if (file) openFile(file)
    }
    window.addEventListener('paste', onPaste)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)
    // "Open with Shotframe" when installed as an app (Chrome file handlers)
    const lq = (window as unknown as { launchQueue?: { setConsumer(cb: (p: { files: FileSystemFileHandle[] }) => void): void } }).launchQueue
    lq?.setConsumer(async (p) => {
      const f = await p.files[0]?.getFile()
      if (f) openFile(f)
    })
    return () => {
      window.removeEventListener('paste', onPaste)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [openFile])

  const scene: Scene | null = useMemo(
    () => image && { settings: s, image: image.el, imgW: image.w, imgH: image.h, annotations: doc.annotations, bgImage: bgImg },
    [image, s, doc.annotations, bgImg],
  )
  const layout = useMemo(() => (image ? computeLayout(s, image.w, image.h) : null), [s, image])
  // ponytail: browsers cap canvas size (~16k px a side, lower area in Safari); tile the export if 4x of huge shots matters
  const exportPx = layout ? Math.min(scale, 16384 / layout.W, 16384 / layout.H, Math.sqrt(160e6 / (layout.W * layout.H))) : scale

  const exportBlob = (type: string) => new Promise<Blob>((resolve, reject) => {
    const c = document.createElement('canvas')
    render(c, scene!, exportPx, { time: bgTime.current })
    let out = c
    if (type === 'image/jpeg') {
      const [flat, ctx] = makeCanvas(c.width, c.height)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(c, 0, 0)
      out = flat
    }
    out.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), type, 0.93)
  })

  const saveBlob = (blob: Blob, ext: string) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `shotframe-${stamp()}.${ext}`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 10000)
  }

  const download = async () => {
    if (!scene) return
    menuRef.current?.hidePopover?.()
    saveBlob(await exportBlob(`image/${format}`), format === 'jpeg' ? 'jpg' : format)
    flash('Image saved')
  }

  const copy = async () => {
    if (!scene) return
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': exportBlob('image/png') })])
      flash('Copied to clipboard')
    } catch {
      flash('Copy failed. Try Export instead.')
    }
  }

  // Records the animation in real time off a canvas. ponytail: MediaRecorder is the
  // no-dependency route; if a slow machine drops frames, WebCodecs is the upgrade.
  const exportVideo = async () => {
    if (!scene || !layout || recording !== null) return
    menuRef.current?.hidePopover?.()
    const mime = videoMime()
    if (!mime) return flash('This browser cannot record video')
    const px = videoSize / Math.max(layout.W, layout.H)
    const even = (n: number) => Math.max(2, Math.round((n * px) / 2) * 2)
    const [out, octx] = makeCanvas(even(layout.W), even(layout.H))
    const work = document.createElement('canvas')
    const cache: RenderCache = {}
    const frame = (t: number) => {
      render(work, { ...scene, settings: { ...s, ...motionPatch(s.motion, t, s) } }, px, { time: t }, cache)
      octx.drawImage(work, 0, 0, out.width, out.height)
    }
    frame(0)
    setRecording(0)
    const rec = new MediaRecorder(out.captureStream(fps), { mimeType: mime, videoBitsPerSecond: videoSize >= 2560 ? 24e6 : 12e6 })
    const chunks: Blob[] = []
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
    const stopped = new Promise((r) => (rec.onstop = r))
    rec.start()
    const start = performance.now()
    const ms = s.motionDuration * 1000
    await new Promise<void>((resolve) => {
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / ms)
        frame(t)
        setRecording(t)
        if (t >= 1) setTimeout(resolve, 2000 / fps)
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    rec.stop()
    await stopped
    setRecording(null)
    saveBlob(new Blob(chunks, { type: mime.split(';')[0] }), mime.includes('mp4') ? 'mp4' : 'webm')
    flash('Video saved')
  }

  const addAnnotation = (a: Annotation) => update((d) => ({ ...d, annotations: [...d.annotations, a] }))
  const updateAnnotation = (a: Annotation, key?: string) =>
    update((d) => ({ ...d, annotations: d.annotations.map((x) => (x.id === a.id ? a : x)) }), key)
  const removeSelected = () => {
    if (!selectedId) return
    update((d) => ({ ...d, annotations: d.annotations.filter((x) => x.id !== selectedId) }))
    setSelectedId(null)
  }
  const selected = doc.annotations.find((a) => a.id === selectedId)

  const pickColor = (c: string) => {
    setColor(c)
    if (selected) updateAnnotation({ ...selected, color: c }, 'color')
  }
  const pickSize = (l: number) => {
    setSizeLevel(l)
    if (selected && layout) updateAnnotation({ ...selected, size: SIZES[l] * layout.u })
  }
  // the controls show the selected annotation's own settings, and edit it in place
  const strokeOf = (a?: Annotation): StrokeOpts =>
    a ? { curve: curved(a), heads: a.heads ?? 'end', dashed: !!a.dashed } : stroke
  const applyStroke = (patch: Partial<StrokeOpts>) => {
    setStroke({ ...strokeOf(selected), ...patch })
    if (!selected) return
    let a: Annotation = { ...selected }
    if (patch.dashed !== undefined) a.dashed = patch.dashed
    if (patch.heads !== undefined) a.heads = patch.heads
    if (patch.curve !== undefined) a = patch.curve ? withBend(a) : straighten(a)
    updateAnnotation(a)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
      const mod = e.metaKey || e.ctrlKey
      const k = e.key.toLowerCase()
      if (mod && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo() }
      else if (mod && k === 'y') { e.preventDefault(); redo() }
      else if (mod && k === 'c') { if (scene && !getSelection()?.toString()) { e.preventDefault(); copy() } }
      else if (mod && k === 's') { e.preventDefault(); if (mode === 'static') download(); else exportVideo() }
      else if (mod && k === 'o') { e.preventDefault(); fileRef.current?.click() }
      else if (mod && k === 'b') { e.preventDefault(); setBgOpen((v) => !v) }
      else if (mod || e.altKey) return
      else if ((k === 'backspace' || k === 'delete') && selectedId) { e.preventDefault(); removeSelected() }
      else if (k === 'escape') { setSelectedId(null); setTool('select') }
      else if (k === 'enter' && tool === 'crop') { setSelectedId(null); setTool('select') }
      else if (scene && mode === 'static') {
        const t = TOOLS.find((x) => x[3].toLowerCase() === k)
        if (t) setTool(t[0])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const addRecent = (p: BgPick) => {
    const same = (a: BgPick, b: BgPick) => JSON.stringify(a) === JSON.stringify(b)
    const next = [p, ...recent.filter((x) => !same(x, p))].slice(0, 12)
    setRecent(next)
    save('shotframe:recent', next)
  }
  const motionReady = mode === 'motion' && s.motion === 'still' && s.bgAnimate
  const animateBg = () => {
    // one press: Motion on, background animating, screenshot held still
    set({ bgAnimate: true, motion: 'still' })
    setModeRaw('motion')
    setSelectedId(null)
    setToolRaw('select')
  }

  const kind = selected?.type ?? tool
  const showOpts = scene && mode === 'static' && (tool !== 'select' || selected)
  const outW = layout ? Math.round(layout.W * exportPx) : 0
  const outH = layout ? Math.round(layout.H * exportPx) : 0

  return (
    <div className="app" style={{ '--glow-a': glow[0], '--glow-b': glow[1], '--bg-left': !narrow && bgOpen ? '334px' : '76px' } as CSSProperties}>
      <div className="ambient" />
      <div className="room-floor" />

      <header className="bar slab">
        <div className="brand">
          <img src="/icon.svg" alt="" width={24} height={24} />
          <span>Shotframe</span>
        </div>
        <span className="bar-sep" />
        <div className="bar-group file-actions">
          <button className="btn quiet" onClick={() => fileRef.current?.click()} title={`Open an image (${MOD}O)`}><Icon name="image" size={15} /> Open</button>
        </div>

        <div className="mode-wrap">
          <Seg value={mode} options={[['static', 'Static'], ['motion', 'Motion']]} onChange={(v) => setMode(v as 'static' | 'motion')} />
        </div>

        <div className="bar-right">
          <div className="bar-group">
            <button className="icon-btn" disabled={!canUndo} onClick={undo} aria-label="Undo" title={`Undo (${MOD}Z)`}><Icon name="undo" size={17} /></button>
            <button className="icon-btn" disabled={!canRedo} onClick={redo} aria-label="Redo" title={`Redo (${MOD}⇧Z)`}><Icon name="redo" size={17} /></button>
          </div>
          <span className="bar-sep" />
          {mode === 'static' && <button className="btn" disabled={!scene} onClick={copy} title={`Copy image (${MOD}C)`}><Icon name="copy" size={15} /> Copy</button>}
          <div className="split">
            <button className="btn primary" disabled={!scene || recording !== null} onClick={mode === 'static' ? download : exportVideo} title={`Export (${MOD}S)`}>
              <Icon name="download" size={15} /> Export
              <span className="split-meta">{mode === 'static' ? `${format.toUpperCase()} ${scale}×` : `MP4 ${VIDEO_SIZES.find(([, p]) => p === videoSize)?.[0]}`}</span>
            </button>
            <button className="btn primary split-arrow" popoverTarget="export-menu" aria-label="Export options"><Icon name="chevron" size={15} /></button>
          </div>
          <div id="export-menu" ref={menuRef} popover="auto" className="menu">
            {mode === 'static' ? (
              <>
                <div className="menu-row">
                  <span className="menu-label">Format</span>
                  <Seg value={format} options={FORMATS.map((f) => [f, f.toUpperCase()])} onChange={(v) => setFormat(v as (typeof FORMATS)[number])} />
                </div>
                <div className="menu-row">
                  <span className="menu-label">Scale</span>
                  <Seg value={String(scale)} options={SCALES.map((x) => [String(x), `${x}×`])} onChange={(v) => setScale(+v)} />
                </div>
                <div className="menu-foot">
                  <span className="dims">{layout ? `${outW} × ${outH} px` : ''}</span>
                  <button className="btn primary" disabled={!scene} onClick={download}><Icon name="download" size={14} /> Export</button>
                </div>
              </>
            ) : (
              <>
                <div className="menu-row">
                  <span className="menu-label">Size</span>
                  <Seg value={String(videoSize)} options={VIDEO_SIZES.map(([l, p]) => [String(p), l])} onChange={(v) => setVideoSize(+v)} />
                </div>
                <div className="menu-row">
                  <span className="menu-label">Frame rate</span>
                  <Seg value={String(fps)} options={[['30', '30 fps'], ['60', '60 fps']]} onChange={(v) => setFps(+v)} />
                </div>
                <div className="menu-foot">
                  <span className="dims">{videoMime()?.includes('mp4') ? 'MP4' : 'WebM'} · {s.motionDuration}s</span>
                  <button className="btn primary" disabled={!scene || recording !== null} onClick={exportVideo}><Icon name="download" size={14} /> Export</button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {!narrow && (bgOpen ? (
        <aside className="bg-panel slab">
          <header className="panel-head">
            <h2>Background</h2>
            <button className="icon-btn" onClick={() => setBgOpen(false)} aria-label="Collapse backgrounds" title={`Collapse (${MOD}B)`}>
              <Icon name="chevron" size={16} />
            </button>
          </header>
          <div className="bg-body">
            <Background s={s} set={set} image={image} recent={recent} onRecent={addRecent} onAnimateBg={animateBg} motionReady={motionReady} />
          </div>
        </aside>
      ) : (
        <button className="bg-tab slab" onClick={() => setBgOpen(true)} title={`Backgrounds (${MOD}B)`} aria-label="Show backgrounds">
          <Icon name="image" size={17} />
          <span>Background</span>
        </button>
      ))}

      <main className="main">
        {scene ? (
          <Stage scene={scene} tool={tool} selectedId={selectedId} color={color} sizeLevel={sizeLevel} stroke={stroke} motion={mode === 'motion'} onBgTime={(t) => { bgTime.current = t }}
            onSelect={setSelectedId} onAdd={addAnnotation} onUpdate={updateAnnotation} set={set} />
        ) : (
          <div className="empty">
            <div className="empty-card slab">
              <h1>Drop a screenshot in.</h1>
              <p>Choose a file, or drag one anywhere on this page.</p>
              <button className="btn primary big" onClick={() => fileRef.current?.click()}>
                <Icon name="image" size={17} /> Choose a file
              </button>
              <small>Your images never leave your device. Nothing is uploaded.</small>
            </div>
          </div>
        )}

        {recording !== null && (
          <div className="recording" role="status">
            <span>Recording video… {Math.round(recording * 100)}%</span>
            <span className="recording-bar"><i style={{ transform: `scaleX(${recording})` }} /></span>
            <small className="hint">Keep this tab in front while it records.</small>
          </div>
        )}

        {scene && mode === 'static' && (
          <div className="dock">
            {showOpts && (
              <div className="toolopts slab">
                {tool === 'crop' ? (
                  <>
                    <span className="toolopts-label">Drag on the image to crop</span>
                    <button className="btn quiet small" disabled={!s.crop} onClick={() => set({ crop: null })}>Reset</button>
                    <button className="btn primary small" onClick={() => setTool('select')}><Icon name="check" size={14} /> Done</button>
                  </>
                ) : (
                  <>
                    {!['blur', 'pixelate', 'spotlight'].includes(kind) && (
                      <div className="inks">
                        {INK.map((c) => (
                          <button key={c} className={`ink ${(selected?.color ?? color) === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Colour ${c}`} onClick={() => pickColor(c)} />
                        ))}
                        <label className="ink custom" title="Custom colour">
                          <input type="color" value={(selected?.color ?? color).slice(0, 7)} onChange={(e) => pickColor(e.target.value)} />
                        </label>
                      </div>
                    )}
                    <Seg value={String(sizeLevel)} options={['S', 'M', 'L'].map((l, i) => [String(i), l])} onChange={(v) => pickSize(+v)} />
                    {kind === 'arrow' && (
                      <>
                        <Seg value={strokeOf(selected).curve ? 'curve' : 'straight'}
                          options={[['straight', <Icon key="s" name="arrow" size={15} />], ['curve', <Icon key="c" name="curve" size={15} />]]}
                          onChange={(v) => applyStroke({ curve: v === 'curve' })} />
                        <Seg value={strokeOf(selected).heads}
                          options={[['end', <Icon key="e" name="headEnd" size={15} />], ['both', <Icon key="b" name="headBoth" size={15} />], ['none', <Icon key="n" name="headNone" size={15} />]]}
                          onChange={(v) => applyStroke({ heads: v as ArrowHeads })} />
                      </>
                    )}
                    {['arrow', 'rect', 'ellipse', 'pen'].includes(kind) && (
                      <button className={`icon-btn ${strokeOf(selected).dashed ? 'on' : ''}`} title="Dashed line" aria-pressed={strokeOf(selected).dashed}
                        onClick={() => applyStroke({ dashed: !strokeOf(selected).dashed })}><Icon name="dash" size={16} /></button>
                    )}
                    {selected && <button className="icon-btn" onClick={removeSelected} aria-label="Delete annotation" title="Delete (⌫)"><Icon name="trash" size={16} /></button>}
                    {doc.annotations.length > 0 && (
                      <button className="btn quiet small" onClick={() => { update((d) => ({ ...d, annotations: [] })); setSelectedId(null) }}>Clear all</button>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="toolbar slab" role="toolbar" aria-label="Tools">
              {TOOLS.map(([id, icon, label, key], i) => (
                <span key={id} className="toolbar-item">
                  {(i === 2 || i === 9) && <span className="sep" />}
                  <button className={`tool ${tool === id ? 'on' : ''}`} onClick={() => setTool(id)} aria-label={label} title={`${label}  ·  ${key}`}>
                    <Icon name={icon} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {dragging && <div className="drop-hint"><span>Drop to open</span></div>}
      </main>

      <Panel tab={tab} onTab={setTab} motion={mode === 'motion'} s={s} set={set} layout={layout} image={image} presets={presets}
        recent={recent}
        onRecent={addRecent}
        onSavePreset={(name) => {
          const { crop: _crop, ...style } = s
          const next = [...presets.filter((p) => p.name !== name), { name, settings: style }]
          if (save('shotframe:presets', next)) setPresets(next)
          else flash('Preset too large to store. Try without a background image.')
        }}
        onDeletePreset={(name) => {
          const next = presets.filter((p) => p.name !== name)
          save('shotframe:presets', next)
          setPresets(next)
        }}
        onReset={() => set({ ...DEFAULTS, crop: s.crop })}
        motionReady={motionReady}
        onAnimateBg={animateBg}
        showBackground={narrow}
      />


      {toast && <div className="toast" role="status">{toast}</div>}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/*" className="file-input" onChange={(e) => {
        const f = e.target.files?.[0]
        if (f) openFile(f)
        e.target.value = ''
      }} />
    </div>
  )
}
