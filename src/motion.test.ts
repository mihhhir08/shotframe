import assert from 'node:assert/strict'
import { bendThrough, curveHandle, straighten, withBend } from './annotations.ts'
import { MOTIONS, motionPatch } from './motion.ts'
import { DEFAULTS, type Annotation } from './settings.ts'

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`)
const base = { ...DEFAULTS, tiltX: 6, tiltY: -4, scale: 90, posY: 0.2, rotate: 2 }

// Intro animations must land exactly on the current style, or the video ends on the wrong frame.
for (const m of MOTIONS.filter((m) => !m.loop && m.id !== 'push')) {
  const end = motionPatch(m.id, 1, base)
  for (const [k, v] of Object.entries(end)) near(v as number, base[k as keyof typeof base] as number)
}

// Loops must start and end on the same frame, or the loop jumps.
for (const m of MOTIONS.filter((m) => m.loop)) {
  const a = motionPatch(m.id, 0, base)
  const b = motionPatch(m.id, 1, base)
  for (const k of Object.keys(a)) near(a[k as keyof typeof a] as number, b[k as keyof typeof b] as number, 1e-9)
}

// Bending an arrow puts the curve through the point you dragged, and straightening undoes it.
{
  const a: Annotation = { id: 'a', type: 'arrow', x1: 0, y1: 0, x2: 100, y2: 0, color: '#fff', size: 4 }
  const bent = bendThrough(a, 50, -30, 2)
  near(curveHandle(bent).x, 50)
  near(curveHandle(bent).y, -30)
  assert.equal(straighten(bent).cx, undefined)
  // a tiny drag near the midpoint snaps back to straight
  assert.equal(bendThrough(a, 50, 1, 4).cx, undefined)
  // the default bend is off the straight line
  assert.ok(Math.abs(curveHandle(withBend(a)).y) > 5)
}

console.log('motion ok')
