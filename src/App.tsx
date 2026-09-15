import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { makeCanvas } from './canvas.ts'
import { Icon, type IconName } from './icons.tsx'
import { loadFile, loadImage, sampleImage, type LoadedImage } from './image.ts'
import { computeLayout } from './layout.ts'
import { bgCss, Panel, type SetSettings, type UserPreset } from './Panel.tsx'
import { render, type Scene } from './render.ts'
import { DEFAULTS, type Annotation, type Settings, type Tool } from './settings.ts'
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
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null)
  const [tool, setToolRaw] = useState<Tool>('select')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [color, setColor] = useState('#ff3b30')
  const [sizeLevel, setSizeLevel] = useState(1)
  const [format, setFormat] = useState<(typeof FORMATS)[number]>(() => load('shotframe:format', 'png'))
  const [scale, setScale] = useState<number>(() => load('shotframe:scale', 1))
  const [presets, setPresets] = useState<UserPreset[]>(() => load('shotframe:presets', []))
  const [toast, setToast] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const toastTimer = useRef(0)

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

  useEffect(() => {
    if (!s.bgImage) return setBgImg(null)
    let live = true
    loadImage(s.bgImage).then((img) => live && setBgImg(img), () => {})
    return () => { live = false }
  }, [s.bgImage])

  const openImage = useCallback((img: LoadedImage) => {
    setImage(img)
    update((d) => ({ settings: { ...d.settings, crop: null }, annotations: [] }))
    setSelectedId(null)
    setToolRaw('select')
  }, [update])

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

  const pasteButton = async () => {
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((t) => t.startsWith('image/'))
        if (type) return openFile(await item.getType(type))
      }
      flash('No image on the clipboard')
    } catch {
      flash(`Press ${MOD}V to paste`)
    }
  }

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
    render(c, scene!, exportPx)
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

  const download = async () => {
    if (!scene) return
    const blob = await exportBlob(`image/${format}`)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `shotframe-${stamp()}.${format === 'jpeg' ? 'jpg' : format}`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 10000)
    flash('Image saved')
  }

  const copy = async () => {
    if (!scene) return
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': exportBlob('image/png') })])
      flash('Copied to clipboard')
    } catch {
      flash('Copy failed. Try Download instead.')
    }
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
    if (selected) updateAnnotation({ ...selected, color: c })
  }
  const pickSize = (l: number) => {
    setSizeLevel(l)
    if (selected && layout) updateAnnotation({ ...selected, size: SIZES[l] * layout.u })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
      const mod = e.metaKey || e.ctrlKey
      const k = e.key.toLowerCase()
      if (mod && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo() }
      else if (mod && k === 'y') { e.preventDefault(); redo() }
      else if (mod && k === 'c') { if (scene && !getSelection()?.toString()) { e.preventDefault(); copy() } }
      else if (mod && k === 's') { e.preventDefault(); download() }
      else if (mod && k === 'o') { e.preventDefault(); fileRef.current?.click() }
      else if (mod || e.altKey) return
      else if ((k === 'backspace' || k === 'delete') && selectedId) { e.preventDefault(); removeSelected() }
      else if (k === 'escape' || (k === 'enter' && tool === 'crop')) { setSelectedId(null); setTool('select') }
      else if (scene) {
        const t = TOOLS.find((x) => x[3].toLowerCase() === k)
        if (t) setTool(t[0])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const drawing = tool !== 'select' && tool !== 'crop'
  const outW = layout ? Math.round(layout.W * exportPx) : 0
  const outH = layout ? Math.round(layout.H * exportPx) : 0

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <img src="/icon.svg" alt="" width={22} height={22} />
          <span>Shotframe</span>
        </div>
        <div className="top-group">
          <button className="btn ghost" onClick={() => fileRef.current?.click()} title={`Open (${MOD}O)`}><Icon name="image" size={15} /> Open</button>
          <button className="btn ghost" onClick={pasteButton} title={`Paste (${MOD}V)`}><Icon name="copy" size={15} /> Paste</button>
        </div>
        <div className="top-group">
          <button className="icon-btn" disabled={!canUndo} onClick={undo} aria-label="Undo" title={`Undo (${MOD}Z)`}><Icon name="undo" /></button>
          <button className="icon-btn" disabled={!canRedo} onClick={redo} aria-label="Redo" title={`Redo (${MOD}⇧Z)`}><Icon name="redo" /></button>
        </div>
        <div className="top-export">
          <select value={format} onChange={(e) => setFormat(e.target.value as (typeof FORMATS)[number])} aria-label="Format">
            {FORMATS.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
          <select value={scale} onChange={(e) => setScale(+e.target.value)} aria-label="Export scale">
            {SCALES.map((x) => <option key={x} value={x}>{x}×</option>)}
          </select>
          {layout && <span className="dims">{outW} × {outH}</span>}
          <button className="btn" disabled={!scene} onClick={copy} title={`Copy (${MOD}C)`}><Icon name="copy" size={15} /> Copy</button>
          <button className="btn primary" disabled={!scene} onClick={download} title={`Save (${MOD}S)`}><Icon name="download" size={15} /> Download</button>
        </div>
      </header>

      <nav className="rail" aria-label="Tools">
        {TOOLS.map(([id, icon, label, key], i) => (
          <button key={id} className={`tool ${tool === id ? 'on' : ''} ${i === 2 || i === 9 ? 'gap' : ''}`} disabled={!scene}
            onClick={() => setTool(id)} aria-label={label} title={`${label} (${key})`}>
            <Icon name={icon} />
          </button>
        ))}
      </nav>

      <main className="main">
        {scene && (drawing || selected || tool === 'crop') && (
          <div className="toolopts">
            {tool === 'crop' ? (
              <>
                <span className="toolopts-label">Drag to crop</span>
                <button className="btn ghost" disabled={!s.crop} onClick={() => set({ crop: null })}>Reset</button>
                <button className="btn primary" onClick={() => setTool('select')}><Icon name="check" size={14} /> Done</button>
              </>
            ) : (
              <>
                {!['blur', 'pixelate', 'spotlight'].includes(selected?.type ?? tool) && INK.map((c) => (
                  <button key={c} className={`ink ${(selected?.color ?? color) === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Colour ${c}`} onClick={() => pickColor(c)} />
                ))}
                <div className="seg small">
                  {['S', 'M', 'L'].map((l, i) => (
                    <button key={l} className={sizeLevel === i ? 'on' : ''} onClick={() => pickSize(i)}>{l}</button>
                  ))}
                </div>
                {selected && <button className="icon-btn" onClick={removeSelected} aria-label="Delete annotation" title="Delete (⌫)"><Icon name="trash" size={16} /></button>}
                {doc.annotations.length > 0 && (
                  <button className="btn ghost" onClick={() => { update((d) => ({ ...d, annotations: [] })); setSelectedId(null) }}>Clear all</button>
                )}
              </>
            )}
          </div>
        )}

        {scene ? (
          <Stage scene={scene} tool={tool} selectedId={selectedId} color={color} sizeLevel={sizeLevel}
            onSelect={setSelectedId} onAdd={addAnnotation} onUpdate={updateAnnotation} set={set} />
        ) : (
          <div className="empty">
            <div className="empty-card" style={{ background: bgCss(s) }}>
              <div className="empty-inner">
                <h1>Make any screenshot look good.</h1>
                <p>Press <kbd>{MOD}V</kbd> to paste, or drop an image anywhere.</p>
                <div className="row center">
                  <button className="btn primary" onClick={() => fileRef.current?.click()}><Icon name="image" size={15} /> Choose file</button>
                  <button className="btn" onClick={() => openImage(sampleImage())}><Icon name="sparkle" size={15} /> Try a sample</button>
                </div>
                <small>Everything stays on your device. Nothing is uploaded.</small>
              </div>
            </div>
          </div>
        )}
        {dragging && <div className="drop-hint"><span>Drop to open</span></div>}
      </main>

      <Panel s={s} set={set} layout={layout} image={image} presets={presets}
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
      />

      {toast && <div className="toast" role="status">{toast}</div>}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => {
        const f = e.target.files?.[0]
        if (f) openFile(f)
        e.target.value = ''
      }} />
    </div>
  )
}
