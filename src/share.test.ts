import assert from 'node:assert/strict'
import { DEFAULTS, STYLE_PRESETS } from './settings.ts'
import { styleFromHash, styleToHash } from './share.ts'

// Defaults write nothing; no style in the hash reads as null.
assert.equal(styleToHash(DEFAULTS), '')
assert.equal(styleFromHash('#sample'), null)

// Every preset survives the round trip.
for (const { patch } of STYLE_PRESETS) {
  const s = { ...DEFAULTS, ...patch }
  assert.deepEqual({ ...DEFAULTS, ...styleFromHash(styleToHash(s)) }, s)
}

// Readable hand-written links work, colours with or without '#'.
assert.deepEqual(styleFromHash('#preset=glass&padding=96&gradColors=ff0000,%2300ff00'), {
  ...STYLE_PRESETS.find((p) => p.name === 'Glass')!.patch, padding: 96, gradColors: ['#ff0000', '#00ff00'],
})

// Hostile input is dropped field by field.
assert.equal(styleFromHash('#padding=1e9&radius=abc&frame=evil&bgImage=data:x&crop=1&gradColors=red'), null)
assert.equal(styleFromHash('#__proto__=1&constructor=1'), null)

console.log('share ok')
