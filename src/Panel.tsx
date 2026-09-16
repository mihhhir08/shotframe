import { useState, type CSSProperties, type ReactNode } from 'react'
import { Icon, type IconName } from './icons.tsx'
import { edgeColor, palette, readAsDataURL, type LoadedImage } from './image.ts'
import { alignPos, type Layout } from './layout.ts'
import {
  ASPECTS, FRAMES, GRADIENTS, MESHES, SOLIDS, STYLE_PRESETS,
  type BgType, type Corner, type Settings,
} from './settings.ts'
import { MOTIONS } from './motion.ts'
import { WALLPAPERS, wallpaperThumb } from './wallpapers.ts'

export type SetSettings = (patch: Partial<Settings>, key?: string) => void
export interface UserPreset { name: string; settings: Partial<Settings> }
export type PanelTab = 'motion' | 'presets' | 'background' | 'canvas' | 'style' | 'frame' | '3d' | 'text'

// Every tab says what it is: an icon alone makes people guess.
export const TABS: [PanelTab, IconName, string, string][] = [
  ['motion', 'film', 'Motion', 'Motion'],
  ['presets', 'sparkle', 'Presets', 'Presets'],
  ['background', 'image', 'Background', 'Background'],
  ['canvas', 'layout', 'Canvas', 'Canvas & position'],
  ['style', 'style', 'Style', 'Screenshot style'],
  ['frame', 'window', 'Frame', 'Window frame'],
  ['3d', 'cube', '3D', '3D & rotation'],
  ['text', 'text', 'Text', 'Text & watermark'],
]

interface Props {
  tab: PanelTab
  onTab: (t: PanelTab) => void
  motion: boolean
  s: Settings
  set: SetSettings
  layout: Layout | null
  image: LoadedImage | null
  presets: UserPreset[]
  onSavePreset: (name: string) => void
  onDeletePreset: (name: string) => void
  onReset: () => void
}

export function Panel({ tab, onTab, motion, s, set, layout, image, presets, onSavePreset, onDeletePreset, onReset }: Props) {
  const tabs = TABS.filter(([id]) => motion || id !== 'motion')
  const current = tabs.find((t) => t[0] === tab) ?? tabs[0]
  // the stored tab can point at a tab this mode does not show (Motion, after a reload in Static)
  const active = current[0]
  return (
    <aside className="panel slab">
      <nav className="panel-tabs" role="tablist" aria-label="Settings">
        {tabs.map(([id, icon, short, label]) => (
          <button key={id} role="tab" aria-selected={active === id} aria-label={label} title={label}
            className={active === id ? 'on' : ''} onClick={() => onTab(id)}>
            <Icon name={icon} size={17} />
            {short}
          </button>
        ))}
      </nav>

      <div className="panel-body" role="tabpanel" key={active}>
        <header className="panel-head">
          <h2>{current[2]}</h2>
          <button className="btn quiet small" onClick={onReset} title="Reset every style setting"><Icon name="reset" size={13} /> Reset</button>
        </header>

        {active === 'motion' && motion && (
          <>
            <Group title="Animation">
              <div className="motion-grid">
                {MOTIONS.map((m) => (
                  <button key={m.id} className={`motion-card m-${m.id} ${s.motion === m.id ? 'on' : ''}`} onClick={() => set({ motion: m.id })}>
                    <span className="motion-stage"><i /></span>
                    {m.label}
                  </button>
                ))}
              </div>
            </Group>
            <Group title="Timing">
              <Slider label="Duration" value={s.motionDuration} min={2} max={12} step={0.5} unit="s" onChange={(v) => set({ motionDuration: v }, 'motionDuration')} />
              <p className="hint">The animation starts from your current style and lands on it. Export an MP4 from the Export menu.</p>
            </Group>
          </>
        )}
        {active === 'presets' && <Presets s={s} set={set} presets={presets} onSave={onSavePreset} onDelete={onDeletePreset} />}
        {active === 'background' && <Background s={s} set={set} image={image} />}

        {active === 'canvas' && (
          <>
            <Group title="Size">
              <select value={s.aspect} onChange={(e) => set({ aspect: e.target.value })} aria-label="Canvas size">
                {ASPECTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
              {s.aspect === 'custom' && (
                <div className="row">
                  <NumberInput label="W" value={s.customW} onChange={(v) => set({ customW: v }, 'customW')} />
                  <NumberInput label="H" value={s.customH} onChange={(v) => set({ customH: v }, 'customH')} />
                </div>
              )}
            </Group>
            <Group title="Spacing">
              <Slider label="Padding" value={s.padding} min={0} max={300} onChange={(v) => set({ padding: v }, 'padding')} />
              <Slider label="Scale" value={s.scale} min={20} max={200} unit="%" onChange={(v) => set({ scale: v }, 'scale')} />
            </Group>
            <Group title="Position">
              <div className="row top">
                <div className="align-grid">
                  {[-1, 0, 1].flatMap((ay) => [-1, 0, 1].map((ax) => {
                    const p = layout ? alignPos(layout, ax, ay) : { posX: 0, posY: 0 }
                    // with no free space every button resolves to 0, so only the centre one counts as active
                    const on = Math.abs(p.posX - s.posX) < 0.002 && Math.abs(p.posY - s.posY) < 0.002 && (ax === 0 || p.posX !== 0) && (ay === 0 || p.posY !== 0)
                    return <button key={`${ax}${ay}`} className={on ? 'on' : ''} aria-label={`Align ${ax},${ay}`} onClick={() => set(p)} />
                  }))}
                </div>
                <span className="hint">Pick an edge, or drag the screenshot on the canvas.</span>
              </div>
            </Group>
          </>
        )}

        {active === 'style' && (
          <>
            <Group title="Corners">
              <Slider label="Radius" value={s.radius} min={0} max={80} onChange={(v) => set({ radius: v }, 'radius')} />
            </Group>
            <Group title="Inset">
              <Slider label="Inset" value={s.inset} min={0} max={160} onChange={(v) => set({ inset: v }, 'inset')} />
              <div className="row">
                <ColorInput value={s.insetColor} onChange={(v) => set({ insetColor: v }, 'insetColor')} />
                <button className="btn wide" disabled={!image} onClick={() => image && set({ insetColor: edgeColor(image.el), inset: Math.max(s.inset, 32) })}>
                  <Icon name="sparkle" size={14} /> Auto-balance
                </button>
              </div>
            </Group>
            <Group title="Shadow">
              <Seg
                value={shadowName(s)}
                options={SHADOWS.map((x) => [x.name, x.name])}
                onChange={(n) => { const p = SHADOWS.find((x) => x.name === n); if (p) set(p.patch) }}
              />
              <Slider label="Blur" value={s.shadowBlur} min={0} max={200} onChange={(v) => set({ shadowBlur: v }, 'shadowBlur')} />
              <Slider label="Opacity" value={s.shadowOpacity} min={0} max={100} unit="%" onChange={(v) => set({ shadowOpacity: v }, 'shadowOpacity')} />
              <Slider label="Offset" value={s.shadowY} min={-100} max={150} onChange={(v) => set({ shadowY: v }, 'shadowY')} />
            </Group>
            <Group title="Border">
              <Slider label="Width" value={s.borderWidth} min={0} max={20} step={0.5} onChange={(v) => set({ borderWidth: v }, 'borderWidth')} />
              {s.borderWidth > 0 && (
                <div className="row">
                  <ColorInput value={s.borderColor.slice(0, 7)} onChange={(v) => set({ borderColor: v + s.borderColor.slice(7) }, 'borderColor')} />
                  <Slider label="Opacity" value={alpha(s.borderColor)} min={0} max={100} unit="%"
                    onChange={(v) => set({ borderColor: s.borderColor.slice(0, 7) + Math.round(v * 2.55).toString(16).padStart(2, '0') }, 'borderAlpha')} />
                </div>
              )}
            </Group>
          </>
        )}

        {active === 'frame' && (
          <Group title="Window">
            <div className="chips">
              {FRAMES.map((f) => (
                <button key={f.id} className={`chip ${s.frame === f.id ? 'on' : ''}`} onClick={() => set({ frame: f.id })}>{f.label}</button>
              ))}
            </div>
            {s.frame !== 'none' && s.frame !== 'glass' && (
              <input type="text" value={s.frameTitle} aria-label={s.frame.startsWith('browser') ? 'URL' : 'Window title'}
                placeholder={s.frame.startsWith('browser') ? 'URL, e.g. shotframe.app' : 'Window title'}
                onChange={(e) => set({ frameTitle: e.target.value }, 'frameTitle')} />
            )}
          </Group>
        )}

        {active === '3d' && (
          <>
            <Group title="Angle">
              <div className="chips">
                {TILTS.map(([name, tiltX, tiltY]) => (
                  <button key={name} className={`chip ${s.tiltX === tiltX && s.tiltY === tiltY ? 'on' : ''}`} onClick={() => set({ tiltX, tiltY })}>{name}</button>
                ))}
              </div>
              <Slider label="Tilt up / down" value={s.tiltX} min={-45} max={45} unit="°" onChange={(v) => set({ tiltX: v }, 'tiltX')} />
              <Slider label="Tilt left / right" value={s.tiltY} min={-45} max={45} unit="°" onChange={(v) => set({ tiltY: v }, 'tiltY')} />
            </Group>
            <Group title="Rotation">
              <Slider label="Rotate" value={s.rotate} min={-45} max={45} unit="°" onChange={(v) => set({ rotate: v }, 'rotate')} />
            </Group>
          </>
        )}

        {active === 'text' && (
          <>
            <Group title="Caption">
              <textarea rows={2} value={s.caption} placeholder="Headline above or below" aria-label="Caption" onChange={(e) => set({ caption: e.target.value }, 'caption')} />
              {s.caption && (
                <>
                  <div className="row">
                    <Seg value={s.captionPos} options={[['top', 'Above'], ['bottom', 'Below']]} onChange={(v) => set({ captionPos: v as 'top' | 'bottom' })} />
                    <ColorInput value={s.captionColor} onChange={(v) => set({ captionColor: v }, 'captionColor')} />
                  </div>
                  <Slider label="Size" value={s.captionSize} min={12} max={140} onChange={(v) => set({ captionSize: v }, 'captionSize')} />
                </>
              )}
            </Group>
            <Group title="Watermark">
              <input type="text" value={s.watermark} placeholder="@yourhandle" aria-label="Watermark" onChange={(e) => set({ watermark: e.target.value }, 'watermark')} />
              {s.watermark && (
                <>
                  <Seg value={s.watermarkPos} options={CORNERS} onChange={(v) => set({ watermarkPos: v as Corner })} />
                  <Slider label="Opacity" value={s.watermarkOpacity} min={5} max={100} unit="%" onChange={(v) => set({ watermarkOpacity: v }, 'watermarkOpacity')} />
                </>
              )}
            </Group>
          </>
        )}
      </div>
    </aside>
  )
}

function Presets({ s, set, presets, onSave, onDelete }: { s: Settings; set: SetSettings; presets: UserPreset[]; onSave: (n: string) => void; onDelete: (n: string) => void }) {
  const [naming, setNaming] = useState<string | null>(null)
  return (
    <>
      <Group title="Styles">
        <div className="preset-grid">
          {STYLE_PRESETS.map((p) => (
            <button key={p.name} className="preset" onClick={() => set(p.patch)}>
              <span className="preset-swatch" style={{ background: bgCss({ ...s, ...p.patch }) }}><i /></span>
              {p.name}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Yours">
        {presets.length > 0 && (
          <div className="preset-grid">
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
        )}
        {naming === null ? (
          <button className="btn wide" onClick={() => setNaming('')}><Icon name="plus" size={14} /> Save current style</button>
        ) : (
          <form className="row" onSubmit={(e) => { e.preventDefault(); if (naming.trim()) onSave(naming.trim()); setNaming(null) }}>
            <input autoFocus type="text" value={naming} placeholder="Preset name" onChange={(e) => setNaming(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && setNaming(null)} />
            <button className="btn" type="submit" aria-label="Save preset"><Icon name="check" size={14} /></button>
          </form>
        )}
      </Group>
    </>
  )
}

const BG_TABS: [BgType, string][] = [['wallpaper', 'Wallpaper'], ['gradient', 'Gradient'], ['mesh', 'Mesh'], ['solid', 'Solid'], ['image', 'Image'], ['blurred', 'Blur'], ['transparent', 'None']]

function Background({ s, set, image }: { s: Settings; set: SetSettings; image: LoadedImage | null }) {
  return (
    <>
      <Group title="Type">
        <Seg value={s.bgType} options={BG_TABS} onChange={(v) => set({ bgType: v as BgType })} wrap />
      </Group>

      {s.bgType === 'wallpaper' && (
        <Group title="Wallpaper">
          <div className="wallpapers">
            {WALLPAPERS.map((w) => (
              <button key={w.id} className={s.wallpaper === w.id ? 'on' : ''} onClick={() => set({ wallpaper: w.id })} title={w.name}>
                <img src={wallpaperThumb(w.id)} alt="" />
                <span>{w.name}</span>
              </button>
            ))}
          </div>
        </Group>
      )}

      {s.bgType === 'gradient' && (
        <Group title="Gradient">
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
          <Seg value={s.gradRadial ? 'radial' : 'linear'} options={[['linear', 'Linear'], ['radial', 'Radial']]} onChange={(v) => set({ gradRadial: v === 'radial' })} />
          {!s.gradRadial && <Slider label="Angle" value={s.gradAngle} min={0} max={360} unit="°" onChange={(v) => set({ gradAngle: v }, 'gradAngle')} />}
          <button className="btn wide" disabled={!image} onClick={() => image && set({ gradColors: palette(image.el), gradRadial: false })}>
            <Icon name="sparkle" size={14} /> Match screenshot colours
          </button>
        </Group>
      )}

      {s.bgType === 'mesh' && (
        <Group title="Mesh">
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
        </Group>
      )}

      {s.bgType === 'solid' && (
        <Group title="Colour">
          <div className="swatches">
            {SOLIDS.map((c) => (
              <button key={c} aria-label={c} className={s.solidColor === c ? 'on' : ''} style={{ background: c }} onClick={() => set({ solidColor: c })} />
            ))}
            <ColorInput value={s.solidColor} onChange={(v) => set({ solidColor: v }, 'solidColor')} />
          </div>
        </Group>
      )}

      {s.bgType === 'image' && (
        <Group title="Image">
          <label className="btn wide file">
            <Icon name="image" size={14} /> {s.bgImage ? 'Replace image' : 'Upload background image'}
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0]
              if (f) set({ bgImage: await readAsDataURL(f) })
              e.target.value = ''
            }} />
          </label>
        </Group>
      )}

      {s.bgType !== 'transparent' && (
        <Group title="Effects">
          {(s.bgType === 'image' || s.bgType === 'blurred') && (
            <Slider label="Blur" value={s.bgBlur} min={0} max={100} onChange={(v) => set({ bgBlur: v }, 'bgBlur')} />
          )}
          <Slider label="Grain" value={s.noise} min={0} max={100} unit="%" onChange={(v) => set({ noise: v }, 'noise')} />
        </Group>
      )}
    </>
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

export function bgCss(s: Settings) {
  if (s.bgType === 'wallpaper') return `center / cover url(${wallpaperThumb(s.wallpaper)})`
  if (s.bgType === 'gradient') return `linear-gradient(${s.gradAngle}deg, ${s.gradColors.join(',')})`
  if (s.bgType === 'mesh') return meshCss(s.meshColors)
  if (s.bgType === 'solid') return s.solidColor
  if (s.bgType === 'transparent') return 'repeating-conic-gradient(#3a3633 0 25%, #2a2724 0 50%) 0 0 / 10px 10px'
  return 'linear-gradient(135deg, #6b645d, #2a2724)'
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="group">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

// The whole bar is the control: label inside, value on the right, fill showing the amount.
export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  const zero = min < 0 ? pct(0) : 0
  const p = pct(value)
  const fill: CSSProperties = { left: `${Math.min(zero, p)}%`, width: `${Math.abs(p - zero)}%` }
  return (
    <label className="fs">
      <span className={`fs-fill ${p < zero ? 'neg' : ''}`} style={fill} />
      <span className="fs-label">{label}</span>
      <output>{+value.toFixed(1)}{unit}</output>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        onDoubleClick={() => onChange(min < 0 ? 0 : min)} />
    </label>
  )
}

export function Seg({ value, options, onChange, wrap }: { value: string; options: [string, ReactNode][]; onChange: (v: string) => void; wrap?: boolean }) {
  return (
    <div className={`seg ${wrap ? 'wrap' : ''}`} role="radiogroup">
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
