import { DEFAULTS, FRAMES, STYLE_PRESETS, type Settings } from './settings.ts'

// A style travels in the URL hash as readable params: #preset=Glass&frame=macDark&padding=96.
// The hash never reaches a server, and the same format is easy for people and agents to write.
// Only differences from DEFAULTS are written, so links stay short.

const SKIP = new Set(['bgImage', 'crop']) // a data URL is too big for a link; crop belongs to one image
const ENUMS: Partial<Record<keyof Settings, readonly string[]>> = {
  bgType: ['wallpaper', 'theme', 'texture', 'pattern', 'gradient', 'mesh', 'solid', 'image', 'blurred', 'transparent'],
  frame: FRAMES.map((f) => f.id),
  captionPos: ['top', 'bottom'],
  watermarkPos: ['tl', 'tc', 'tr', 'bl', 'bc', 'br'],
}
// ponytail: one bound for every number, not each slider's range; it only stops absurd canvases
const LIMIT = 10000
const strip = (c: string) => c.replace(/^#/, '')

export function styleToHash(s: Settings): string {
  const p = new URLSearchParams()
  for (const k of Object.keys(DEFAULTS) as (keyof Settings)[]) {
    const v = s[k]
    if (SKIP.has(k) || JSON.stringify(v) === JSON.stringify(DEFAULTS[k])) continue
    p.set(k, Array.isArray(v) ? v.map(strip).join(',') : String(v))
  }
  return p.toString()
}

// Returns null when the hash carries no style, so the caller keeps the stored one.
export function styleFromHash(hash: string): Partial<Settings> | null {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  const out: Record<string, unknown> = {}
  const preset = STYLE_PRESETS.find((x) => x.name.toLowerCase() === p.get('preset')?.toLowerCase())
  if (preset) Object.assign(out, preset.patch)
  let found = !!preset
  for (const [k, raw] of p) {
    if (!Object.hasOwn(DEFAULTS, k) || SKIP.has(k)) continue
    const def = DEFAULTS[k as keyof Settings]
    let v: unknown
    if (typeof def === 'number') v = Number(raw)
    else if (typeof def === 'boolean') v = raw === 'true' || raw === '1'
    else if (Array.isArray(def)) v = raw.split(',').filter((c) => /^#?[0-9a-f]{3,8}$/i.test(c)).map((c) => `#${strip(c)}`)
    else v = raw
    if (typeof v === 'number' && !(Math.abs(v) <= LIMIT)) continue
    if (Array.isArray(v) && v.length < 2) continue
    const allowed = Object.hasOwn(ENUMS, k) ? ENUMS[k as keyof Settings] : undefined
    if (allowed && !allowed.includes(v as string)) continue
    out[k] = v
    found = true
  }
  return found ? (out as Partial<Settings>) : null
}
