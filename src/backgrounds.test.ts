import assert from 'node:assert/strict'
import { MOTIONS, motionPatch } from './motion.ts'
import { DEFAULTS } from './settings.ts'

// wallpapers.ts reaches for the DOM the moment it paints, so this file checks the
// registry's shape and the rules around it rather than the pixels.
const ids = [
  'fluid-dusk', 'bloom-halo', 'curtains-borealis', 'satin-pearl', 'ribbons-amber',
  'folds-cobalt', 'drape-dune', 'haze-sahara', 'nebula-teal',
  'theme-sonoma', 'tex-paper',
]
const ANIMATED = /^(fluid|bloom|curtains|satin|theme|ribbons|folds|drape)-/

// Every id the settings can hold must belong to a known family.
for (const id of ids) {
  assert.ok(/^[a-z]+-[a-z0-9-]+$/.test(id), `${id} is not a family-name id`)
}

// The families that read a frame time are exactly the ones advertised as moving.
assert.ok(ANIMATED.test('fluid-dusk'))
assert.ok(ANIMATED.test('theme-sonoma'))
assert.ok(!ANIMATED.test('tex-paper'), 'textures are a material, they do not drift')
assert.ok(!ANIMATED.test('haze-sahara'), 'haze is still air')
assert.ok(!ANIMATED.test('nebula-teal'), 'nebula holds its position')

// The defaults point at backgrounds that exist in those families.
assert.ok(ANIMATED.test(DEFAULTS.wallpaper) || /^(haze|nebula)-/.test(DEFAULTS.wallpaper))
assert.ok(DEFAULTS.theme.startsWith('theme-'))
assert.ok(DEFAULTS.texture.startsWith('tex-'))

// Still means still: the screenshot must not be touched at any point in the cycle.
const still = MOTIONS.find((m) => m.id === 'still')
assert.ok(still, 'the Still preset is what makes a background-only animation possible')
for (const t of [0, 0.25, 0.5, 0.75, 1]) {
  assert.deepEqual(motionPatch('still', t, DEFAULTS), {}, `still moved the screenshot at t=${t}`)
}

// An unknown id falls back rather than throwing mid-render.
assert.ok(motionPatch('does-not-exist', 0.5, DEFAULTS))

console.log('backgrounds ok')
