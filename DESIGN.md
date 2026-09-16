---
name: Shotframe
description: A dark studio where the screenshot is the only lit object in the room.
colors:
  room: "#08070a"
  room-2: "#0d0c11"
  glass: "rgba(24, 23, 29, 0.72)"
  glass-solid: "#17161c"
  glass-2: "rgba(255, 255, 255, 0.045)"
  glass-3: "rgba(255, 255, 255, 0.08)"
  edge: "rgba(255, 255, 255, 0.09)"
  edge-lit: "rgba(255, 255, 255, 0.16)"
  hairline: "rgba(255, 255, 255, 0.06)"
  well: "rgba(0, 0, 0, 0.28)"
  well-deep: "rgba(0, 0, 0, 0.4)"
  text: "#f2f0ee"
  muted: "#9a958f"
  faint: "#8a8580"
  dim: "#5a5550"
  accent: "#ff8f45"
  accent-hi: "#ffab73"
  accent-dim: "rgba(255, 143, 69, 0.16)"
  accent-ink: "#1a0c02"
  glow-a: "#ff8f45"
  glow-b: "#7a4bd1"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "27px"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  display-mobile:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "-0.015em"
  brand:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    fontFeature: "ss01"
  control:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "Spline Sans Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    fontFeature: "tabular-nums"
rounded:
  control: "9px"
  brand: "7px"
  transient: "13px"
  toast: "11px"
  mark: "4px"
  mark-sm: "3px"
  mark-xs: "2px"
  slab: "16px"
  plate: "12px"
  tool: "10px"
  dock: "14px"
  chip: "8px"
  seg-item: "6px"
  overlay-card: "20px"
  pill: "99px"
spacing:
  hair: "2px"
  xs: "6px"
  sm: "8px"
  md: "14px"
  lg: "16px"
  xl: "22px"
components:
  button:
    backgroundColor: "{colors.glass-2}"
    textColor: "{colors.text}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "34px"
  button-hover:
    backgroundColor: "{colors.glass-3}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "34px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    height: "34px"
  button-small:
    height: "28px"
    padding: "0 10px"
    typography: "{typography.control}"
  icon-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    height: "34px"
    width: "34px"
  icon-button-on:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent}"
  tool:
    textColor: "{colors.muted}"
    rounded: "{rounded.tool}"
    height: "36px"
    width: "36px"
  tool-on:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent}"
  input:
    backgroundColor: "rgba(0, 0, 0, 0.28)"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 11px"
    height: "34px"
  input-focus:
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  field-scrubber:
    backgroundColor: "rgba(0, 0, 0, 0.28)"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "34px"
  chip:
    backgroundColor: "rgba(0, 0, 0, 0.28)"
    textColor: "{colors.muted}"
    rounded: "{rounded.chip}"
    padding: "0 11px"
    height: "30px"
  chip-on:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent}"
  slab:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.text}"
    rounded: "{rounded.slab}"
  tab:
    textColor: "{colors.faint}"
    typography: "{typography.label}"
    rounded: "{rounded.tool}"
    padding: "9px 2px 8px"
  tab-on:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent}"
  kbd:
    backgroundColor: "rgba(255, 255, 255, 0.07)"
    textColor: "{colors.text}"
    typography: "{typography.numeral}"
    rounded: "{rounded.seg-item}"
    padding: "3px 7px"
---

# Design System: Shotframe

## Overview

**Creative North Star: "The Dark Studio"**

Shotframe is a near-black room with the lights off and one object lit: the user's
screenshot on its plate at the centre. Everything else in the room is smoked glass
floating above that darkness — a command bar along the top, an inspector down the right,
a tool bar at the bottom of the stage. Nothing is docked into a chrome frame, nothing is
divided by a structural border; the slabs read as separate objects because light falls on
their top edge and darkness pools between them.

The room takes its colour from the work. When an image loads, `palette()` samples it and
publishes two hues onto `--glow-a` and `--glow-b`; those feed the ambient wash behind the
plate, the glow the plate throws, the tint mixed into every glass slab, and the lit top
edge that separates each slab from the dark. The interface is therefore never a fixed
colour scheme — it is a room lit by the object in it, and it re-lights over 700ms whenever
the object changes.

Density is high and quiet. Controls are small (34px tall, 13px base type), labels are
always written out rather than left to icons, and every numeral is monospaced and
tabular so a value never jitters while it is being dragged. The one saturated colour in
the chrome is amber; it marks state and nothing else. This world explicitly refuses the
docked-toolbar-plus-settings-form arrangement that every other screenshot tool ships.

**Key Characteristics:**
- Near-black room (#08070a) with floating smoked-glass slabs, never a docked chrome frame
- Separation by light and darkness, not by structural borders
- One amber accent, used only to mark state
- Ambient light sampled at runtime from the user's own image
- Archivo throughout, Spline Sans Mono for every numeral
- Damped physical motion: decelerate into place, never bounce

## Colors

A near-black room, three depths of smoked glass, a narrow warm-grey text ramp, one amber
accent, and two runtime glow hues borrowed from the user's image.

### Primary
- **Amber** (`{colors.accent}`): the single accent. Active tools and tabs, the export
  button's gradient, focus rings, selection handles, slider fills and thumbs, the caret,
  `::selection`. It is a state marker, not decoration.
- **Amber Light** (`{colors.accent-hi}`): top stop of the primary button's vertical
  gradient only, giving the button a lit upper surface consistent with the slabs.
- **Amber Wash** (`{colors.accent-dim}`): the tinted bed under any on-state (tool, tab,
  chip, scrubber fill).
- **Amber Ink** (`{colors.accent-ink}`): text on amber. The near-black brown that keeps
  primary-button and selection text legible against a saturated warm field.

### Wells, Scrims and Shadow Blacks
The room is lit from one place, so everything that recedes is black at an alpha, never a
lighter grey. Two are tokens because they repeat; the rest are composited into a specific
shadow, mask or scrim and are documented here so they read as system, not drift.
- **Well** (`{colors.well}`, `rgba(0,0,0,0.28)`): every recessed field — inputs, selects,
  textareas, field-sliders, segmented beds, swatch beds, the panel's tab rail.
- **Well Deep** (`{colors.well-deep}`, `rgba(0,0,0,0.4)`): the same field while focused.
- `rgba(0,0,0,0.3)` — the motion card's stage bed, one step deeper than a control well
  because it frames a moving object.
- `rgba(0,0,0,0.45)` / `0.5` / `0.6` / `0.75` / `0.9` — composited inside `--lift-1/2/3`,
  the crop size chip, the annotation handle shadow, the plate's drop shadow. Depth comes
  from stacking these, never from a lighter surface.
- `rgba(0,0,0,0.55)` and `rgba(6,5,8,0.66)` — the recording scrim and the crop mask: the
  two moments the room dims so one thing can be read.
- `#000` — mask stops only (the phone tab row's fade), never a painted surface.

### Annotation Ink (content, not chrome)
Eight colours the user draws *with*. They belong to the artwork, not the interface, and are
the one place saturated non-amber colour is allowed: `#ff3b30` `#ff9500` `#ffcc00`
`#34c759` `#0a84ff` `#af52de` `#ffffff` `#111111`. The custom-colour button carries five of
them (`#ff5f45` `#ffcc00` `#34c759` `#0a84ff` `#af52de`) as a conic gradient meaning "any
colour". Chrome never adopts these; ink never adopts amber's state meaning.

### Secondary
- **Sampled Warm Glow** (`{colors.glow-a}`): the first hue the palette sampler pulls from
  the loaded image. Defaults to amber before any image exists. Drives the ambient wash,
  the plate's halo, the slab tint and the slab's lit top edge.
- **Sampled Cool Glow** (`{colors.glow-b}`): the second sampled hue, defaulting to violet.
  Used only in the second radial of the ambient wash and the plate halo, so the room has
  two light sources rather than one flat colour cast.

### Neutral
- **Room** (`{colors.room}`): the page and app background — the unlit room.
- **Room Deep** (`{colors.room-2}`): the darker companion tone available for recessed
  ground.
- **Smoked Glass** (`{colors.glass}`): every floating slab, behind a 20px blur at 1.4
  saturation.
- **Solid Glass** (`{colors.glass-solid}`): the opaque variant for surfaces that must not
  show the room through them — the export menu, the sample badge, the ring gap on a
  selected swatch.
- **Glass Film / Glass Film Strong** (`{colors.glass-2}` / `{colors.glass-3}`): the rest
  and hover beds for controls sitting on a slab.
- **Lit Edge** (`{colors.edge-lit}`) and **Edge** (`{colors.edge}`): the top border and
  the remaining three borders of a slab or field. The difference between them is the
  whole separation strategy.
- **Hairline** (`{colors.hairline}`): the only divider allowed inside a slab — group
  rules, bar separators, the panel rail edge.
- **Text** (`{colors.text}`): primary copy.
- **Muted** (`{colors.muted}`): secondary copy, resting control labels, icon strokes.
- **Faint** (`{colors.faint}`): tertiary copy — hints, group headings, resting tab labels.
  It measures ~4.6:1 on the room and is the floor for text.
- **Dim** (`{colors.dim}`): explicitly **not a text tone**. It exists for exactly one
  thing: the resting dot inside a position-grid cell.

### Named Rules
**The One Lit Object Rule.** The screenshot plate is the brightest thing on screen. No
chrome surface may out-glow it; slabs stay at glass values and only the plate carries a
halo.

**The Borrowed Light Rule.** Room colour is never authored per-surface. Anything that
should feel lit reads `--glow-a` / `--glow-b`, which the image publishes at runtime. A new
surface that wants warmth mixes the glow token in; it does not pick a hue.

**The Amber-Is-State Rule.** Amber means "this is on, focused, selected or about to
export". Never use it for emphasis, decoration or hierarchy.

**The Dim-Is-Not-Text Rule.** `--dim` never carries a glyph. Text bottoms out at
`--faint`.

## Typography

**Display / Body Font:** Archivo (self-hosted variable woff2, weights 400–700, with
`ui-sans-serif, system-ui, -apple-system, sans-serif` behind it)
**Numeral / Mono Font:** Spline Sans Mono (self-hosted variable woff2, weights 400–500,
with `ui-monospace, SFMono-Regular, Menlo, monospace` behind it)

Both faces load from `public/fonts` with `font-display: block`: the world's voice is not a
third-party runtime dependency, and a swap from a system face on first paint would show
the wrong face for a beat. Archivo runs with the `ss01` stylistic set on at the root.

**Mobile display step:** the first-run headline drops from 27px to 21px under 900px. It is
the one size that exists only at a breakpoint, and it is deliberate: 27px wraps to four
lines in a phone-width card.

**Character:** Archivo is a compact grotesque that stays legible at 11px and tightens
handsomely with negative tracking at heading sizes, which suits an interface built almost
entirely from small labels. Spline Sans Mono handles every number so that dragging a value
never shifts the layout around it.

### Hierarchy
- **Display** (600, 27px, 1.12, −0.03em): the first-run card headline. One per session, the
  only type in the product above 15px.
- **Title** (600, 15px, −0.015em): the inspector panel heading.
- **Brand** (600, 14px, −0.015em): the wordmark in the command bar.
- **Body** (400, 13px, `ss01`): the base size for the whole interface. Also the first-run
  paragraph at 14.5px / 1.5 and hints at 11.5px / 1.5.
- **Control** (500, 12px): segmented buttons, chips, tab labels on phone.
- **Label** (500, 11px, +0.01em): group headings, menu labels, preset and motion captions.
- **Numeral** (400–500, 10.5–11.5px, tabular): every measurement, duration, dimension,
  scrubber output, keycap and export-meta string.

### Named Rules
**The Numerals-Are-Mono Rule.** Any digit a user reads as a value — dimensions, times,
percentages, scale factors, keycaps — is set in Spline Sans Mono with
`font-variant-numeric: tabular-nums`. Digits inside prose stay in Archivo.

**The Say-What-It-Is Rule.** Every control that can carry a word carries one. Inspector
tabs ship an icon *and* a written label; tools carry an `aria-label` and a title with the
shortcut. An icon alone makes people guess, and this world does not make people guess.

**The Two-Faces Rule.** Archivo and Spline Sans Mono are the complete type inventory. No
third family, and no system-UI display face.

## Layout

The app is a single fixed-height room (`100dvh`, no page scroll) with three floating slabs
placed absolutely over it and a grid-centred stage between them. Nothing is in normal flow
at the top level.

At desktop widths the geometry is: command bar inset 14px left and right at top 14px,
52px tall; inspector pinned top 80px / right 14px / bottom 16px at 344px wide; stage
occupying `inset: 80px 372px 84px 14px`; dock spanning the stage's width at bottom 16px.
The 14px inset and the 80px top clearance are the room's margins — every slab respects
them.

Inside the inspector, content is grouped in stacked blocks separated by a single hairline
rule and 14px/16px of vertical padding; controls inside a group sit 9px apart, controls in
a row 8px apart. Repeated grids are fixed: swatches at 6 columns, wallpapers and motion
cards at 2, presets at 3, the position grid at 3 × 26px.

**Breakpoints.** At 1180px the inspector narrows to 310px and the stage and dock follow
(`right: 338px`); the export button's meta string drops. At 900px the layout turns
vertical: the bar shrinks to 48px and sheds file actions, undo/redo and Copy, keeping
identity, the Static/Motion switch and Export; the stage hugs the top at
`min(42dvh, 380px)`; the dock and panel stack beneath it, anchored to
`--plate-h` — the plate's real rendered height, published by Stage onto the document
element — so nothing floats below a dead band; and the panel's vertical tab rail becomes a
horizontal scrolling row with a fade mask on its right edge.

### Named Rules
**The Anchored-To-The-Work Rule.** On phone, stacked surfaces position against
`--plate-h`, the canvas's measured height, not against a guessed constant. Any new stacked
surface reads the same variable.

**The Room-Margin Rule.** Floating surfaces sit 14px from the room's edges. 16px for the
bottom of the two lower slabs. Nothing touches the wall.

## Elevation & Depth

Depth is atmospheric, not architectural. Three things stack it: a dark-to-light lift ramp
that puts real distance between a slab and the room, a 20px backdrop blur at 1.4
saturation that proves the slab is glass, and an inner top highlight plus a lit top border
that reads as light falling from above. There is no white-on-black border box anywhere;
if two surfaces need separating, one of them is lighter at the top.

### Shadow Vocabulary
- **Lift 1** (`0 1px 2px rgba(0,0,0,0.5)`): the brand mark and other small objects resting
  on a slab.
- **Lift 2** (`0 8px 24px -8px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.4)`): transient
  objects a short distance off the surface — the sample badge, the drop-hint pill, a
  hovered preset swatch.
- **Lift 3** (`0 24px 60px -18px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.45)`): every
  slab and the toast. The room's default float height.
- **Plate shadow** (`0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)`):
  the canvas only. The deepest cast in the room plus a one-pixel light ring, because the
  plate is the object everything else is arranged around.
- **Slab inner light** (`inset 0 1px 0 rgba(255,255,255,0.07)`): paired with every Lift 3
  slab.
- **Primary button light** (`inset 0 1px 0 rgba(255,255,255,0.35),
  0 6px 16px -6px rgba(255,143,69,0.7)`): the export button alone — a lit top face and an
  amber cast into the room beneath it.

### Named Rules
**The Light-Not-Borders Rule.** Separation is achieved with a lit top edge
(`color-mix(--glow-a 38%, --edge-lit)`), an inner highlight and shadow. A full-strength
border on all four sides is not how this world separates things.

**The No-Hard-Offset Rule.** Every shadow is soft, negative-spread and near-black. No
hard offset shadow, no coloured glow except the amber cast under the export button and the
blurred image-sampled ambience.

## Shapes

Radius is assigned by what a thing *is*, not by size. Slabs are 16px. The canvas plate and
its rendered image share 12px. Controls — buttons, fields, segmented containers, colour
wells, scrubbers — are 9px. Tools and tabs are 10px, the toolbar and timeline 14px, chips
and swatches 8px, segment items and small grid cells 6px. Anything that reads as a badge
or a thumb is fully round (`99px` or `50%`): the sample badge, ink dots, slider thumbs,
selection handles, the preset delete button. Overlay cards — first-run and drop-hint — go
to 20px, the softest corner in the system, which is what marks them as covering the room
rather than sitting in it.

Borders are one pixel and exist to define a field's edge (`--edge`, rising to
`--edge-lit` on hover, amber on focus), not to box a region. Dashed 1.5px amber marks a
live canvas selection; solid 1.5px white with a 9999px black spread marks a crop.

### Named Rules
Below the role scale sits a micro scale for marks rather than surfaces: 4px for the focus
ring's own corner and the crop-box corner brackets, 3px for the preset swatch's inner
sheet, the motion card's moving block and the lock/well caps, 2px for the slider fill cap
and the position-grid dot. Two component radii sit off the role scale on purpose: 7px for
the brand mark (it reads as an app icon, not a control) and 11px/13px for the toast and
tool-options pill (transient surfaces, sized between a control and a slab).

### Named Rules
**The Radius-By-Role Rule.** A new surface takes the radius of its role — slab 16, plate
12, control 9, tool 10, chip 8 — not a value picked to suit its size. Marks smaller than a
control use the micro scale (4/3/2), never a rounded-down role value.

## Components

### Buttons
- **Shape:** softly rounded (9px), 34px tall, 13px gap-7 flex row with an inline SVG icon
  at 13–17px.
- **Default:** faint glass film bed (`{colors.glass-2}`), text at full strength, weight 500.
  Hover raises the bed to `{colors.glass-3}`.
- **Primary:** a vertical amber gradient (`--accent-hi` → `--accent`) with near-black-brown
  ink at weight 600, a lit inner top edge and an amber cast beneath. Hover brightens 6%.
  Reserved for the action that finishes the job — Export, and the two first-run
  affirmatives.
- **Quiet:** no bed, muted text; the hover fills in the glass film and lifts text to full.
  Used for secondary bar actions and in-panel resets.
- **Press:** `translateY(1px) scale(0.985)` over 60ms, released on the damped
  `--settle` curve. Every control in the system presses this way.
- **Disabled:** 35% opacity, default cursor. No colour change.
- **Small:** 28px tall at 12px for in-panel and tool-option use.

### Icon Buttons and Tools
- Square (34px control / 36px tool), icon-only, always carrying an `aria-label` and a
  title with the keyboard shortcut.
- Resting colour is muted; hover fills the glass film and lifts the icon to full text
  colour.
- **On-state:** amber wash bed with an amber icon; the tool adds a
  `inset 0 0 0 1px rgba(255,143,69,0.35)` ring. Tools press with `scale(0.93)`.
- All icons are inline SVG stroke paths on a 24-unit grid, `stroke-linecap: round`. No icon
  font, no glyph characters.

### Inputs / Fields
- **Style:** a well cut into the slab — `rgba(0,0,0,0.28)` under a 1px `--edge` border at
  9px radius, 34px tall. Selects carry a 10 × 6 chevron drawn in `--muted` at the right
  inset.
- **Hover:** border rises to `--edge-lit`.
- **Focus:** border goes amber and the well darkens to `rgba(0,0,0,0.4)`. Caret is amber.
- Global focus fallback for everything else: a 2px amber outline at 2px offset.

### Field Scrubber (signature)
The inspector's primary control: a 34px field where **the bar is the control**. The label
sits left, the mono value right, and the amber wash fills from the left edge to the
current position behind them, ending in a 2px amber bar with a 10px amber glow. Dragging
horizontally anywhere on the field changes the value (`cursor: ew-resize`); a transparent
range input covers the field so keyboard and screen readers get the real semantics, and
`:has(input:focus-visible)` promotes the outline to the whole field. Negative values fill
from the right. There is no separate track, thumb or number box.

### Chips and Segments
- **Chip:** 30px, 8px radius, dark well, muted 12px text. Hover lifts text and border;
  selected turns the text amber, the border to `rgba(255,143,69,0.55)` and the bed to the
  amber wash. Used for frames, tilt presets, and other short exclusive sets.
- **Segment:** a single dark well holding 26px buttons at 6px radius. The selected item
  gets the stronger glass film and an inset top highlight — it rises out of the well
  rather than colouring in. Used for binary and short-form choices.

### Slabs (signature)
The four-part material the room is built from: a glass fill with the sampled warm glow
mixed 17% into its top third, a 20px saturating backdrop blur, a 1px `--edge` border whose
top edge is mixed 38% with the glow, Lift 3, and an inner top highlight. Border-top-colour
and background transition over 700ms so a re-light is a change of light, not a repaint.
Anything that floats in the room — command bar, inspector, toolbar, tool options,
timeline, first-run card — is a slab.

### Navigation
The inspector's tab rail: a 78px column in a recessed dark well, hairline-separated from
the body, each tab an icon over a 10.5px label at weight 500. Resting labels are faint;
hover lifts to full text on glass film; active is amber on an amber wash. Changing tab
replays the body with `tab-in`. On phone the rail becomes a horizontal scrolling row with
its scrollbar hidden and a linear fade mask on the right edge to signal overflow.

### Canvas Plate (signature)
The one lit object. A 12px-radius canvas carrying the deepest shadow in the room and a
1px light ring, with a `::before` at `inset: -26% -16%` behind it painting two radial
gradients from the sampled glow hues, blurred 80px at 1.7 saturation and 62% opacity. When
transparency is the background, the plate shows a 16px conic checker in two near-black
greys. Before the first paste it carries a sample image and a rounded sample badge that
names the paste shortcut, so the tool is visibly working on arrival.

### Overlays
- **Menu** (`popover`): solid glass, 330px, 16px padding, 16px radius, Lift 3, entering on
  `pop`. Its foot is hairline-separated with the resulting dimensions in mono on the left.
- **Toast:** inverted — text colour as background, room colour as ink — pinned under the
  command bar.
- **Drop hint:** a 2px dashed amber outline inset 12px over an amber film at 7%, with a
  solid amber pill at its centre.
- **Recording:** the room dims to 80% under an 8px blur behind a 280px progress rail with
  an amber fill scaled by transform.

### Motion
- **`--settle`** (`420ms cubic-bezier(0.16, 1, 0.3, 1)`): the damped release. Decelerate
  into place, never bounce. Used for control presses and the entrances below.
- **`--ease`** (`cubic-bezier(0.2, 0.8, 0.2, 1)`) at **`--fast`** (140ms) for colour and
  bed changes and **`--slow`** (260ms) for atmosphere.
- **Entrances:** slabs arrive from their own edge — `slab-down` (bar, 520ms),
  `slab-right` (inspector, 560ms at 60ms), `slab-up` (toolbar, 560ms at 120ms) — staggered
  so the room assembles rather than appearing. The plate enters on `plate`.
- **`pop`** (6px rise, 180–400ms) is reserved for transient surfaces: menu, tool options,
  toast, sample badge, first-run card.
- **`tab-in`** (300ms on `--settle`) replays the inspector body on tab change.
- **Re-light:** glow-dependent properties transition over 700ms.
- `prefers-reduced-motion: reduce` collapses every animation and transition to 0.01ms
  globally.

### Named Rules
**The Settle Rule.** Motion decelerates into rest and never overshoots. A bounce, a
spring or an elastic curve is out of this world.

**The Entrance-From-Edge Rule.** A slab enters from the edge it lives on, with a stagger.
Nothing fades in from nowhere.

## Do's and Don'ts

### Do:
- **Do** build any new floating surface as a `.slab`: glass fill with the glow mixed into
  its top, 20px backdrop blur, Lift 3, lit top border, 16px radius.
- **Do** read `--glow-a` / `--glow-b` for anything that should look lit, so the surface
  re-lights with the user's image.
- **Do** set every value, dimension, duration and keycap in Spline Sans Mono with
  tabular numerals.
- **Do** give every control a written label, an `aria-label`, or both; tabs carry icon and
  word together.
- **Do** keep amber for state — on, focused, selected, exporting.
- **Do** take radius from role (slab 16px, plate 12px, control 9px, tool 10px, chip 8px).
- **Do** press controls with the damped `--settle` release and honour
  `prefers-reduced-motion`.
- **Do** anchor phone-stacked surfaces to `--plate-h`.
- **Do** draw icons as inline SVG stroke paths on the 24-unit grid.

### Don't:
- **Don't** separate two surfaces with a full-strength four-sided border; separate them
  with a lit top edge, an inner highlight and shadow.
- **Don't** let any chrome surface out-glow the canvas plate.
- **Don't** use `--dim` on text; `--faint` is the floor.
- **Don't** use amber for emphasis, decoration or hierarchy.
- **Don't** introduce a third type family or a system-UI display face into the chrome.
- **Don't** add a hard offset shadow or a coloured glow beyond the export button's amber
  cast and the image-sampled ambience.
- **Don't** ship an icon-only control without a label or accessible name.
- **Don't** use a bouncing, springing or elastic curve.
- **Don't** dock chrome into a solid frame or wrap settings in a form panel with
  structural rules — that is the arrangement this world exists to refuse.

## Accepted Deviations

**The command bar ships full-bleed, not centred.** The direction contract's FIRST VIEWPORT
describes a "glass command bar floating at top centre". The build ships `.bar` at
`left: 14px; right: 14px` — a full-width slab respecting the room margin. This is a
deliberate adaptation: the bar carries the wordmark, Open and Paste, the Static/Motion
switch, undo and redo, Copy, and the Export split button with its meta string. A centred
pill cannot hold that payload at 1440px without crowding. The bar keeps every other
property of the world — it is a glass slab with a lit top edge, floating 14px off the
walls, entering on `slab-down` — and the Static/Motion switch is absolutely centred within
it (`.mode-wrap`), so the contract's centred focal point survives inside a full-bleed
container. New top-level chrome follows the built rule: full-bleed slab, room margin,
centred mode control.

## Open Decisions

**How far the glass goes.** The finish review judged the material honest but short of its
ceiling: the slabs carry one lit top edge and one inset highlight, with no specular
falloff along their length, no edge refraction where they cross the plate's light, and no
weighting that makes a near slab read heavier than a far one. The reviewer and the builder
both classed this as ambition rather than defect, so it is recorded here rather than
silently inherited. Taking it would deepen the world's signature; leaving it keeps the
chrome quieter behind the screenshot, which is the thesis. The product owner decides.
