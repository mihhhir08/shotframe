import type { Settings } from './settings.ts'

// Animations are expressed as a patch over the current style at time t (0..1),
// so whatever the screenshot looks like is where the animation lands.
export interface Motion {
  id: string
  label: string
  loop: boolean // loops seamlessly; the others play in and hold
  at: (t: number, s: Settings) => Partial<Settings>
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const TAU = Math.PI * 2

export const MOTIONS: Motion[] = [
  {
    // the background's own drift is the animation; the screenshot holds still
    id: 'still', label: 'Still', loop: true,
    at: () => ({}),
  },
  {
    id: 'tilt-in', label: 'Tilt in', loop: false,
    at: (t, s) => {
      const e = easeOut(clamp01(t / 0.65))
      return { tiltX: lerp(38, s.tiltX, e), tiltY: lerp(-28, s.tiltY, e), scale: lerp(s.scale * 0.82, s.scale, e) }
    },
  },
  {
    id: 'zoom-in', label: 'Zoom in', loop: false,
    at: (t, s) => ({ scale: lerp(s.scale * 0.55, s.scale, easeOut(clamp01(t / 0.6))) }),
  },
  {
    id: 'rise', label: 'Rise', loop: false,
    at: (t, s) => {
      const e = easeOut(clamp01(t / 0.6))
      return { posY: lerp(s.posY + 0.9, s.posY, e), tiltX: lerp(s.tiltX + 30, s.tiltX, e) }
    },
  },
  {
    id: 'push', label: 'Slow push', loop: false,
    at: (t, s) => ({ scale: lerp(s.scale, s.scale * 1.2, easeInOut(t)) }),
  },
  {
    id: 'float', label: 'Float', loop: true,
    at: (t, s) => ({
      posY: s.posY + 0.018 * Math.sin(t * TAU),
      tiltX: s.tiltX + 5 * Math.sin(t * TAU + Math.PI / 2),
      tiltY: s.tiltY + 7 * Math.sin(t * TAU),
      rotate: s.rotate + 1.2 * Math.sin(t * TAU),
    }),
  },
  {
    id: 'swing', label: 'Swing', loop: true,
    at: (t, s) => ({ tiltY: s.tiltY + 22 * Math.sin(t * TAU), tiltX: s.tiltX + 8 }),
  },
  {
    id: 'orbit', label: 'Orbit', loop: true,
    at: (t, s) => ({ tiltX: s.tiltX + 14 * Math.cos(t * TAU), tiltY: s.tiltY + 24 * Math.sin(t * TAU) }),
  },
]

export const motionPatch = (id: string, t: number, s: Settings) =>
  (MOTIONS.find((m) => m.id === id) ?? MOTIONS[0]).at(clamp01(t), s)

export const VIDEO_SIZES: [string, number][] = [['720p', 1280], ['1080p', 1920], ['1440p', 2560]]

export function videoMime() {
  return ['video/mp4;codecs=avc1.4d002a', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
    .find((m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m))
}
