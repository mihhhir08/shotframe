import { useState, type ReactNode } from 'react'
import { Icon } from './icons.tsx'
import { edgeColor, palette, readAsDataURL, type LoadedImage } from './image.ts'
import { alignPos, type Layout } from './layout.ts'
import {
  ASPECTS, FRAMES, GRADIENTS, MESHES, SOLIDS, STYLE_PRESETS,
  type BgType, type Corner, type Settings,
} from './settings.ts'

export type SetSettings = (patch: Partial<Settings>, key?: string) => void
export interface UserPreset { name: string; settings: Partial<Settings> }

interface Props {
  s: Settings
  set: SetSettings
  layout: Layout | null
  image: LoadedImage | null
  presets: UserPreset[]
  onSavePreset: (name: string) => void
  onDeletePreset: (name: string) => void
  onReset: () => void
}

export function Panel({ s, set, layout, image, presets, onSavePreset, onDeletePreset, onReset }: Props) {
  return (
    <aside className="panel">
      <Presets s={s} set={set} presets={presets} onSave={onSavePreset} onDelete={onDeletePreset} />
      <Background s={s} set={set} image={image} />
      <Section title="Canvas">
        <Field label="Size">
          <select value={s.aspect} onChange={(e) => set({ aspect: e.target.value })}>
            {ASPECTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </Field>
        {s.aspect === 'custom' && (
          <div className="row">
            <NumberInput label="W" value={s.customW} onChange={(v) => set({ customW: v }, 'customW')} />
            <NumberInput label="H" value={s.customH} onChange={(v) => set({ customH: v }, 'customH')} />
          </div>
        )}
        <Slider label="Padding" value={s.padding} min={0} max={300} onChange={(v) => set({ padding: v }, 'padding')} />
        <Slider label="Scale" value={s.scale} min={20} max={200} unit="%" onChange={(v) => set({ scale: v }, 'scale')} />
        <Field label="Position">
          <div className="align-grid">
            {[-1, 0, 1].flatMap((ay) => [-1, 0, 1].map((ax) => {
              const p = layout ? alignPos(layout, ax, ay) : { posX: 0, posY: 0 }
              const on = Math.abs(p.posX - s.posX) < 0.002 && Math.abs(p.posY - s.posY) < 0.002
              return <button key={`${ax}${ay}`} className={on ? 'on' : ''} aria-label={`Align ${ax},${ay}`} onClick={() => set(p)} />
            }))}
          </div>
          <span className="hint">or drag the screenshot</span>
        </Field>
      </Section>

      <Section title="Screenshot">
        <Slider label="Corner radius" value={s.radius} min={0} max={80} onChange={(v) => set({ radius: v }, 'radius')} />
        <Slider label="Inset" value={s.inset} min={0} max={160} onChange={(v) => set({ inset: v }, 'inset')} />
        <div className="row">
          <ColorInput value={s.insetColor} onChange={(v) => set({ insetColor: v }, 'insetColor')} />
          <button className="btn" disabled={!image} onClick={() => image && set({ insetColor: edgeColor(image.el), inset: Math.max(s.inset, 32) })}>
            <Icon name="sparkle" size={14} /> Auto-balance
          </button>
        </div>
        <Field label="Shadow">
          <Seg
            value={shadowName(s)}
            options={SHADOWS.map((x) => [x.name, x.name])}
            onChange={(n) => { const p = SHADOWS.find((x) => x.name === n); if (p) set(p.patch) }}
          />
        </Field>
        <Slider label="Shadow blur" value={s.shadowBlur} min={0} max={200} onChange={(v) => set({ shadowBlur: v }, 'shadowBlur')} />
        <Slider label="Shadow opacity" value={s.shadowOpacity} min={0} max={100} unit="%" onChange={(v) => set({ shadowOpacity: v }, 'shadowOpacity')} />
        <Slider label="Shadow offset" value={s.shadowY} min={-100} max={150} onChange={(v) => set({ shadowY: v }, 'shadowY')} />
        <Slider label="Border" value={s.borderWidth} min={0} max={20} step={0.5} onChange={(v) => set({ borderWidth: v }, 'borderWidth')} />
        {s.borderWidth > 0 && (
          <div className="row">
            <ColorInput value={s.borderColor.slice(0, 7)} onChange={(v) => set({ borderColor: v + s.borderColor.slice(7) }, 'borderColor')} />
            <Slider label="Opacity" value={alpha(s.borderColor)} min={0} max={100} unit="%"
              onChange={(v) => set({ borderColor: s.borderColor.slice(0, 7) + Math.round(v * 2.55).toString(16).padStart(2, '0') }, 'borderAlpha')} />
          </div>
        )}
      </Section>

      <Section title="Frame">
        <div className="chips">
          {FRAMES.map((f) => (
            <button key={f.id} className={`chip ${s.frame === f.id ? 'on' : ''}`} onClick={() => set({ frame: f.id })}>{f.label}</button>
          ))}
        </div>
        {s.frame !== 'none' && s.frame !== 'glass' && (
          <Field label={s.frame.startsWith('browser') ? 'URL' : 'Title'}>
            <input type="text" value={s.frameTitle} placeholder={s.frame.startsWith('browser') ? 'shotframe.app' : 'Window title'}
              onChange={(e) => set({ frameTitle: e.target.value }, 'frameTitle')} />
          </Field>
        )}
      </Section>

      <Section title="3D & rotation">
        <div className="chips">
          {TILTS.map(([name, tiltX, tiltY]) => (
            <button key={name} className={`chip ${s.tiltX === tiltX && s.tiltY === tiltY ? 'on' : ''}`} onClick={() => set({ tiltX, tiltY })}>{name}</button>
          ))}
        </div>
        <Slider label="Tilt up / down" value={s.tiltX} min={-45} max={45} unit="°" onChange={(v) => set({ tiltX: v }, 'tiltX')} />
        <Slider label="Tilt left / right" value={s.tiltY} min={-45} max={45} unit="°" onChange={(v) => set({ tiltY: v }, 'tiltY')} />
        <Slider label="Rotate" value={s.rotate} min={-45} max={45} unit="°" onChange={(v) => set({ rotate: v }, 'rotate')} />
      </Section>

      <Section title="Text" open={false}>
        <Field label="Caption">
          <textarea rows={2} value={s.caption} placeholder="Headline above or below" onChange={(e) => set({ caption: e.target.value }, 'caption')} />
        </Field>
        {s.caption && (
          <>
            <div className="row">
              <Seg value={s.captionPos} options={[['top', 'Above'], ['bottom', 'Below']]} onChange={(v) => set({ captionPos: v as 'top' | 'bottom' })} />
              <ColorInput value={s.captionColor} onChange={(v) => set({ captionColor: v }, 'captionColor')} />
            </div>
            <Slider label="Caption size" value={s.captionSize} min={12} max={140} onChange={(v) => set({ captionSize: v }, 'captionSize')} />
          </>
        )}
        <Field label="Watermark">
          <input type="text" value={s.watermark} placeholder="@yourhandle" onChange={(e) => set({ watermark: e.target.value }, 'watermark')} />
        </Field>
        {s.watermark && (
          <>
            <Seg value={s.watermarkPos} options={CORNERS} onChange={(v) => set({ watermarkPos: v as Corner })} />
            <Slider label="Watermark opacity" value={s.watermarkOpacity} min={5} max={100} unit="%" onChange={(v) => set({ watermarkOpacity: v }, 'watermarkOpacity')} />
          </>
        )}
      </Section>

      <div className="panel-foot">
        <button className="btn ghost" onClick={onReset}><Icon name="reset" size={14} /> Reset style</button>
      </div>
    </aside>
  )
}

function Presets({ s, set, presets, onSave, onDelete }: { s: Settings; set: SetSettings; presets: UserPreset[]; onSave: (n: string) => void; onDelete: (n: string) => void }) {
  const [naming, setNaming] = useState<string | null>(null)
  return (
    <Section title="Presets">
      <div className="preset-grid">
        {STYLE_PRESETS.map((p) => (
          <button key={p.name} className="preset" onClick={() => set(p.patch)}>
            <span className="preset-swatch" style={{ background: bgCss({ ...s, ...p.patch }) }}><i /></span>
            {p.name}
          </button>
        ))}
        {presets.map((p) => (
          <div key={p.name} className="preset user">
            <button onClick={() => set(p.settings)}>
              <span className="preset-swatch" style={{ background: bgCss({ ...s, ...p.settings }) }}><i /></span>
              {p.name}
            </button>
            <button className="preset-del" aria-label={`Delete ${p.name}`} onClick={() => onDelete(p.name)}><Icon name="x" size={12} /></button>
          </div>
        ))}
      </div>
      {naming === null ? (
        <button className="btn ghost wide" onClick={() => setNaming('')}><Icon name="plus" size={14} /> Save current style</button>
      ) : (
        <form className="row" onSubmit={(e) => { e.preventDefault(); if (naming.trim()) onSave(naming.trim()); setNaming(null) }}>
          <input autoFocus type="text" value={naming} placeholder="Preset name" onChange={(e) => setNaming(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && setNaming(null)} />
          <button className="btn" type="submit"><Icon name="check" size={14} /></button>
        </form>
      )}
    </Section>
  )
}

const BG_TABS: [BgType, string][] = [['gradient', 'Gradient'], ['mesh', 'Mesh'], ['solid', 'Solid'], ['image', 'Image'], ['blurred', 'Blur'], ['transparent', 'None']]

function Background({ s, set, image }: { s: Settings; set: SetSettings; image: LoadedImage | null }) {
  return (
    <Section title="Background">
      <Seg value={s.bgType} options={BG_TABS} onChange={(v) => set({ bgType: v as BgType })} />

      {s.bgType === 'gradient' && (
        <>
          <div className="swatches">
            {GRADIENTS.map((g) => (
              <button key={g.name} title={g.name} aria-label={g.name}
                className={same(s.gradColors, g.colors) ? 'on' : ''}
                style={{ background: `linear-gradient(${g.angle}deg, ${g.colors.join(',')})` }}
                onClick={() => set({ gradColors: g.colors, gradAngle: g.angle })} />
            ))}
          </div>
          <div className="stops">
            {s.gradColors.map((c, i) => (
              <ColorInput key={i} value={c} onChange={(v) => set({ gradColors: s.gradColors.map((x, j) => (j === i ? v : x)) }, `stop${i}`)} />
            ))}
            {s.gradColors.length < 4 && (
              <button className="icon-btn" aria-label="Add colour" onClick={() => set({ gradColors: [...s.gradColors, s.gradColors[s.gradColors.length - 1]] })}><Icon name="plus" size={14} /></button>
            )}
            {s.gradColors.length > 2 && (
              <button className="icon-btn" aria-label="Remove colour" onClick={() => set({ gradColors: s.gradColors.slice(0, -1) })}><Icon name="minus" size={14} /></button>
            )}
          </div>
          <div className="row">
            <Seg value={s.gradRadial ? 'radial' : 'linear'} options={[['linear', 'Linear'], ['radial', 'Radial']]} onChange={(v) => set({ gradRadial: v === 'radial' })} />
          </div>
          {!s.gradRadial && <Slider label="Angle" value={s.gradAngle} min={0} max={360} unit="°" onChange={(v) => set({ gradAngle: v }, 'gradAngle')} />}
          <button className="btn wide" disabled={!image} onClick={() => image && set({ gradColors: palette(image.el), gradRadial: false })}>
            <Icon name="sparkle" size={14} /> Match screenshot colours
          </button>
        </>
      )}

      {s.bgType === 'mesh' && (
        <>
          <div className="swatches">
            {MESHES.map((m) => (
              <button key={m.name} title={m.name} aria-label={m.name} className={same(s.meshColors, m.colors) ? 'on' : ''}
                style={{ background: meshCss(m.colors) }} onClick={() => set({ meshColors: m.colors })} />
            ))}
          </div>
          <div className="stops">
            {s.meshColors.map((c, i) => (
              <ColorInput key={i} value={c} onChange={(v) => set({ meshColors: s.meshColors.map((x, j) => (j === i ? v : x)) }, `mesh${i}`)} />
            ))}
          </div>
        </>
      )}

      {s.bgType === 'solid' && (
        <div className="swatches">
          {SOLIDS.map((c) => (
            <button key={c} aria-label={c} className={s.solidColor === c ? 'on' : ''} style={{ background: c }} onClick={() => set({ solidColor: c })} />
          ))}
          <ColorInput value={s.solidColor} onChange={(v) => set({ solidColor: v }, 'solidColor')} />
        </div>
      )}

      {s.bgType === 'image' && (
        <label className="btn wide file">
          <Icon name="image" size={14} /> {s.bgImage ? 'Replace image' : 'Upload background image'}
          <input type="file" accept="image/*" onChange={async (e) => {
            const f = e.target.files?.[0]
            if (f) set({ bgImage: await readAsDataURL(f) })
            e.target.value = ''
          }} />
        </label>
      )}

      {(s.bgType === 'image' || s.bgType === 'blurred') && (
        <Slider label="Blur" value={s.bgBlur} min={0} max={100} onChange={(v) => set({ bgBlur: v }, 'bgBlur')} />
      )}
      {s.bgType !== 'transparent' && (
        <Slider label="Grain" value={s.noise} min={0} max={100} unit="%" onChange={(v) => set({ noise: v }, 'noise')} />
      )}
    </Section>
  )
}

const SHADOWS: { name: string; patch: Partial<Settings> }[] = [
  { name: 'None', patch: { shadowOpacity: 0 } },
  { name: 'Soft', patch: { shadowBlur: 40, shadowOpacity: 20, shadowY: 12 } },
  { name: 'Medium', patch: { shadowBlur: 60, shadowOpacity: 35, shadowY: 24 } },
  { name: 'Strong', patch: { shadowBlur: 100, shadowOpacity: 60, shadowY: 40 } },
  { name: 'Float', patch: { shadowBlur: 150, shadowOpacity: 40, shadowY: 90 } },
]
const shadowName = (s: Settings) =>
  SHADOWS.find((x) => Object.entries(x.patch).every(([k, v]) => s[k as keyof Settings] === v))?.name ?? ''

const TILTS: [string, number, number][] = [['Flat', 0, 0], ['Left', 10, 24], ['Right', 10, -24], ['Back', 32, 0], ['Iso', 40, -30]]
const CORNERS: [string, string][] = [['tl', '↖'], ['tc', '↑'], ['tr', '↗'], ['bl', '↙'], ['bc', '↓'], ['br', '↘']]

const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x.toLowerCase() === b[i].toLowerCase())
const alpha = (hex: string) => (hex.length > 7 ? Math.round(parseInt(hex.slice(7, 9), 16) / 2.55) : 100)
const meshCss = (c: string[]) =>
  `radial-gradient(at 12% 18%, ${c[1]} 0, transparent 60%), radial-gradient(at 88% 14%, ${c[2]} 0, transparent 60%), radial-gradient(at 85% 88%, ${c[3]} 0, transparent 60%), radial-gradient(at 18% 82%, ${c[4]} 0, transparent 60%), ${c[0]}`

function bgCss(s: Settings) {
  if (s.bgType === 'gradient') return `linear-gradient(${s.gradAngle}deg, ${s.gradColors.join(',')})`
  if (s.bgType === 'mesh') return meshCss(s.meshColors)
  if (s.bgType === 'solid') return s.solidColor
  if (s.bgType === 'transparent') return 'repeating-conic-gradient(#3a3633 0 25%, #2a2724 0 50%) 0 0 / 10px 10px'
  return 'linear-gradient(135deg, #6b645d, #2a2724)'
}

function Section({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="section" open={open}>
      <summary>{title}</summary>
      <div className="section-body">{children}</div>
    </details>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      {children}
    </div>
  )
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="slider">
      <span className="label">{label}<output>{value}{unit}</output></span>
      <input type="range" min={min} max={max} step={step} value={value}
        style={{ '--p': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
        onChange={(e) => onChange(+e.target.value)}
        onDoubleClick={() => onChange(min < 0 ? 0 : min)} />
    </label>
  )
}

function Seg({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="seg" role="radiogroup">
      {options.map(([v, l]) => (
        <button key={v} role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  )
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="color" style={{ background: value }} title={value}>
      <input type="color" value={value.slice(0, 7)} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="num">
      <span>{label}</span>
      <input type="number" min={1} value={value} onChange={(e) => onChange(Math.max(1, +e.target.value))} />
    </label>
  )
}
