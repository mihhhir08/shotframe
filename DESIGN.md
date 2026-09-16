---
name: Shotframe
description: An indigo night studio where glass pills float and the screenshot is the only lit object.
colors:
  room: "#06050e"
  room-2: "#0a0817"
  glass: "rgba(26, 22, 46, 0.5)"
  glass-solid: "#171332"
  glass-2: "rgba(255, 255, 255, 0.07)"
  glass-3: "rgba(255, 255, 255, 0.13)"
  edge: "rgba(255, 255, 255, 0.12)"
  edge-lit: "rgba(255, 255, 255, 0.34)"
  hairline: "rgba(255, 255, 255, 0.09)"
  well: "rgba(255, 255, 255, 0.06)"
  well-deep: "rgba(255, 255, 255, 0.11)"
  text: "#ffffff"
  muted: "#b9b3d6"
  faint: "#a49dc6"
  dim: "#5d5880"
  accent: "#ff5fa2"
  accent-run: "linear-gradient(120deg, #ff8a3d, #ff5fa2 55%, #a855f7)"
  accent-hi: "#ff8a3d"
  accent-dim: "rgba(255, 95, 162, 0.2)"
  accent-ink: "#20081a"
  glow-a: "#ff8f45"
  glow-b: "#7a4bd1"
  glow-fixed: "#6d28d9"
  accent-violet: "#a855f7"
  glow-fixed: "#6d28d9"
  well: "rgba(255, 255, 255, 0.06)"
  well-deep: "rgba(255, 255, 255, 0.11)"
  scrim-soft: "rgba(0, 0, 0, 0.3)"
  scrim: "rgba(0, 0, 0, 0.42)"
  scrim-deep: "rgba(0, 0, 0, 0.6)"
  shadow-mid: "rgba(0, 0, 0, 0.45)"
  shadow-strong: "rgba(0, 0, 0, 0.5)"
  shadow-deep: "rgba(0, 0, 0, 0.75)"
  shadow-black: "rgba(0, 0, 0, 0.9)"
  mask-stop: "#000"
  checker-a: "#221c3f"
  checker-b: "#16122c"
  swatch-fallback: "#6b5aa8"
  ink-red: "#ff3b30"
  ink-coral: "#ff5f45"
  ink-orange: "#ff9500"
  ink-amber: "#ffcc00"
  ink-green: "#34c759"
  ink-blue: "#0a84ff"
  ink-violet: "#af52de"
  ink-white: "#ffffff"
  ink-black: "#111111"

typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  display-mobile:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    letterSpacing: "-0.03em"
  brand:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.55
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
  tab:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "10.5px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "Spline Sans Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    fontFeature: "tabular-nums"
rounded:
  micro: "2px"
  hair: "3px"
  focus: "4px"
  inner: "6px"
  control: "12px"
  plate: "16px"
  tool: "15px"
  slab: "24px"
  bar: "29px"
  card: "30px"
  pill: "99px"
  timeline: "26px"
  toolopts: "22px"
  drop-hint: "20px"
  toast: "11px"
  swatch: "9px"
  thumb: "10px"
  seg-chip: "8px"
  note: "13px"

spacing:
  hair: "2px"
  xs: "3px"
  sm: "7px"
  md: "10px"
  lg: "14px"
  xl: "16px"
  gutter: "20px"
  card: "44px"
components:
  button-primary:
    backgroundColor: "{colors.accent-run}"
    textColor: "#ffffff"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "34px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "34px"
  button-quiet-hover:
    backgroundColor: "{colors.glass-2}"
    textColor: "{colors.text}"
  tool:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.tool}"
    size: "40px"
  tool-on:
    backgroundColor: "{colors.accent-run}"
    textColor: "#ffffff"
    rounded: "{rounded.tool}"
    size: "40px"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 11px"
    height: "34px"
  input-focus:
    backgroundColor: "{colors.well-deep}"
    textColor: "{colors.text}"
  chip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    rounded: "8px"
    padding: "0 11px"
    height: "30px"
  chip-on:
    backgroundColor: "{colors.accent-dim}"
    textColor: "#ffffff"
  panel-tab:
    backgroundColor: "transparent"
    textColor: "{colors.faint}"
    typography: "{typography.tab}"
    rounded: "10px"
    padding: "9px 2px 8px"
  panel-tab-on:
    backgroundColor: "linear-gradient(120deg, rgba(255, 138, 61, 0.28), rgba(255, 95, 162, 0.32))"
    textColor: "#ffffff"
  command-bar:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.text}"
    rounded: "{rounded.bar}"
    padding: "0 10px 0 18px"
    height: "58px"
    width: "min(1180px, calc(100% - 32px))"
  inspector:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.text}"
    rounded: "{rounded.slab}"
    width: "348px"
  first-run-card:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "44px 44px 34px"
    width: "min(560px, 100%)"
---

# Design System: Shotframe

## Overview

**Creative North Star: "The Aurora Room"**

Shotframe's editor is a deep indigo night with a light in it. The room is almost black but
never neutral: it is violet-black, and the only real illumination comes from two places —
the screenshot plate, which throws its own halo, and an ambient field of three enormous
soft radials, two of which are sampled live from the user's own image. Chrome does not sit
on this room; it floats above it as heavy, specular glass pills that pick up the room's
colour through a 34px blur and hand it back as a lit top edge.

Density is high but quiet. The interface is built almost entirely from 34px controls, 11px
labels and mono numerals, packed tightly so that nothing competes with the plate. The one
place the world raises its voice is the accent, which is not a colour but a light: a
120-degree run from amber through pink to violet, used only where something is running,
armed or on. Everything else is glass, edge and text.

The arrangement is the thesis. This world refuses the docked-toolbar-plus-settings-form
layout every screenshot tool ships. Nothing is edge-docked: the command bar is a centred
pill, the tool dock is a pill, and the inspector is a floating rounded panel with a 20px
margin of room visible on every side.

**Key Characteristics:**
- Indigo-black room, never grey, never neutral
- Chrome is pills and floating panels; nothing docks to an edge
- Heavy specular glass: 34px blur at 1.9 saturation, top sheen, lit top edge, inner bottom shadow
- The accent is a gradient light source, used only for state
- Ambient light is sampled from the user's image and is the dominant surface treatment
- Every user-read numeral is tabular mono

## Colors

An indigo night lit by a warm-to-violet aurora, with white-alpha glass as the only surface
material.

### Primary
- **Aurora Run** (`{colors.accent-run}`): the signature. A 120° gradient from warm amber
  through hot pink to violet. It fills exactly three things: the primary/export button, an
  active tool in the dock, and (at reduced alpha) an active panel tab. It is a light
  source, not a fill colour.
- **Aurora Pink** (`{colors.accent}`): the single flat accent value, for anywhere a
  gradient cannot go — focus outlines, caret, selection, slider thumbs, the annotation
  selection box and handles, the recording progress bar, the position-grid on-state, the
  drop-zone dash.
- **Aurora Amber** (`{colors.accent-hi}`): the warm end of the run, reachable on its own
  only where the gradient's first stop is needed (the field-slider fill, the active tab
  wash, the motion card's lit border).
- **Aurora Wash** (`{colors.accent-dim}`): the tinted bed under a quieter on-state — icon
  toggles, selected chips, the motion card's lit stage.
- **Aurora Ink** (`{colors.accent-ink}`): the near-black plum that stays legible on a
  saturated accent field — selection text and the drop-hint badge.

### Secondary
- **Sampled Warm Glow** (`{colors.glow-a}`): the first hue `palette()` pulls from the
  loaded image. Drives the first ambient radial, half the plate halo, the slab's warm tint
  and — mixed 34% into the lit edge — the top border of every glass surface.
- **Sampled Cool Glow** (`{colors.glow-b}`): the second sampled hue, defaulting to violet.
  Second ambient radial and second plate-halo radial, so the room has two light sources.
- **Fixed Violet** (`{colors.glow-fixed}`): the third ambient radial, low and centred. It
  is the only glow that never changes with the image, and it is what keeps the room indigo
  when the user loads a monochrome screenshot.

### Neutral
- **Indigo Night** (`{colors.room}`): the page and app background.
- **Indigo Deep** (`{colors.room-2}`): the darker companion tone for recessed ground.
- **Aurora Glass** (`{colors.glass}`): every floating pill and panel, behind a 34px blur at
  1.9 saturation.
- **Solid Glass** (`{colors.glass-solid}`): the opaque variant for surfaces that must not
  show the room through them — the export menu, the sample badge, the ring gap on a
  selected swatch, the preset delete button.
- **Glass Film / Glass Film Strong** (`{colors.glass-2}` / `{colors.glass-3}`): the rest
  and hover beds for controls sitting on a pill.
- **Lit Edge** (`{colors.edge-lit}`) and **Edge** (`{colors.edge}`): the top border and the
  remaining three borders of a pill or field. The difference between them is the whole
  separation strategy.
- **Hairline** (`{colors.hairline}`): the only divider allowed inside a surface — group
  rules, bar separators, the panel rail edge.
- **Text** (`{colors.text}`): primary copy, pure white.
- **Muted Violet** (`{colors.muted}`): secondary copy, resting control labels, icon strokes.
- **Faint Violet** (`{colors.faint}`): tertiary copy — hints, group headings, resting tab
  labels, the sample badge's dismiss glyph.
- **Dim Violet** (`{colors.dim}`): explicitly **not a text tone**. One use only: the
  resting dot inside a position-grid cell.

### Wells, Scrims and Shadow Blacks
Two value families do the depth work, and they now run in opposite directions. Recessed
fields are built from *white* alpha — a darker pane of the same glass — while scrims and
shadows remain black at an alpha. Two wells are tokens because they repeat; the blacks are
composited into a specific shadow, mask or scrim and are listed here so they read as
system, not drift.
- **Well** (`{colors.well}`): every recessed field — inputs, selects, textareas,
  field-sliders, segmented beds, chips, align cells, motion stages, the panel's tab rail.
- **Well Deep** (`{colors.well-deep}`): the same field while focused.
- `rgba(0,0,0,0.3)` / `0.4` / `0.5` / `0.65` / `0.88` — composited inside `--lift-1/2/3`
  and the slab's inner bottom shadow. Depth comes from stacking these, never from a
  lighter surface.
- `rgba(0,0,0,0.75)` / `0.9` / `0.6` / `0.45` — the crop size chip, the plate drop shadow,
  the annotation handle shadow, the wallpaper label gradient and the preset-swatch card.
- `rgba(8,7,10,0.55)`→`0.88` and `rgba(8,7,10,0.8)` — the first-run scrim and the
  recording scrim. `rgba(6,5,8,0.66)` — the crop mask. The three moments the room dims so
  one thing can be read.
- `#000` — mask stops only (the phone tab row's fade), never a painted surface.

### Annotation Ink (content, not chrome)
Eight colours the user draws *with*. They belong to the artwork, not the interface, and are
the one place saturated non-accent colour is allowed: `#ff3b30` `#ff9500` `#ffcc00`
`#34c759` `#0a84ff` `#af52de` `#ffffff` `#111111`. The custom-colour button carries five of
them (`#ff5f45` `#ffcc00` `#34c759` `#0a84ff` `#af52de`) as a conic gradient meaning "any
colour". Chrome never adopts these; ink never adopts the accent's state meaning.

### Named Rules
**The One Lit Object Rule.** The screenshot plate is the brightest thing on screen. No
chrome surface may out-glow it; glass stays at glass values and only the plate carries a
halo (0.85 opacity, 95px blur).

**The Borrowed Light Rule.** Room colour is never authored per-surface. Anything that
should feel lit reads `--glow-a` / `--glow-b`, which the image publishes at runtime. A new
surface that wants warmth mixes the glow token in; it does not pick a hue.

**The Accent-Is-State Rule.** The Aurora run means "this is on, focused, selected or about
to export". Never use it for emphasis, decoration or hierarchy. Where a gradient will not
fit, use the flat `{colors.accent}` — never a fourth pink.

**The Dim-Is-Not-Text Rule.** `--dim` never carries a glyph. Text bottoms out at
`--faint`.

## Typography

**Display / Body Font:** Archivo (self-hosted variable woff2, weights 400–700, with
`ui-sans-serif, system-ui, -apple-system, sans-serif` behind it)
**Numeral / Mono Font:** Spline Sans Mono (self-hosted variable woff2, weights 400–500,
with `ui-monospace, SFMono-Regular, Menlo, monospace` behind it)

Both faces load from `public/fonts` with `font-display: block`: the world's voice is not a
third-party runtime dependency, and a swap from a system face on first paint would show the
wrong face for a beat. Archivo runs with the `ss01` stylistic set on at the root.

**Character:** Archivo is a compact grotesque that stays legible at 10.5px and tightens
handsomely under heavy negative tracking at heading sizes, which suits an interface built
almost entirely from small labels and three loud headings. Spline Sans Mono handles every
number so that dragging a value never shifts the layout around it.

**Mobile display step:** the first-run headline drops from 40px to 21px under 900px, and
its paragraph from 15.5px to 13.5px. The 21px display is the one size that exists only at a
breakpoint, and it is deliberate: 40px wraps to five lines in a phone-width card.

### Hierarchy
- **Display** (700, 40px, 1.05, −0.045em): the first-run card headline. One per session,
  and the only type in the product above 21px.
- **Title** (700, 21px, −0.03em): the inspector panel heading. It carries the tab's SHORT
  name; the long name stays on the tab as its accessible name.
- **Brand** (700, 19px, −0.03em): the wordmark in the command bar.
- **Lede** (400, 15.5px, 1.55): the first-run paragraph. Nothing else uses it.
- **Body** (400, 13px, `ss01`): the base size for the whole interface, including fields and
  buttons. Hints run 11.5px / 1.5.
- **Control** (500, 12px): small buttons, segmented options, chips.
- **Label** (500, 11px): group headings, menu labels, preset and motion card captions.
- **Tab** (500, 10.5px, 0.01em, 1.1): the vertical rail's labels. Rises to 12px on phones
  where the rail becomes a horizontal scrolling row.
- **Numeral** (400–500, 10.5–11px, tabular): every value the user reads — dimensions,
  slider outputs, timecodes, export meta, keycaps.

### Named Rules
**The Tabular Numeral Rule.** Every numeral a user reads is Spline Sans Mono with
`font-variant-numeric: tabular-nums`. A dragged value must never reflow the control around
it.

**The Labelled Tab Rule.** No tab, and no icon-only control, ships without a visible label
or an accessible name. Icons never carry meaning alone.

**The Two Faces Rule.** Archivo for language, Spline Sans Mono for number. There is no
third family in the chrome.

## Layout

A fixed full-viewport room (`100dvh`, no page scroll) with three floating chrome objects
and one centred stage.

**Desktop.** The command bar is a centred pill 16px from the top, `min(1180px, 100% − 32px)`
wide, 58px tall. The inspector floats at `top: 92px; right: 20px; bottom: 18px`, 348px
wide, split into a 78px tab rail and a scrolling body. The stage occupies
`inset: 92px 376px 96px 20px` and centres the plate inside it. The tool dock is
bottom-centred within the stage's horizontal band (`left: 20px; right: 376px; bottom: 18px`),
stacking the tool pill, its options pill and the timeline as separate floating objects.

**1180px and below.** The inspector narrows to 310px; the stage and dock follow it in; the
export button's mono meta string drops.

**900px and below (phone).** Chrome restacks vertically: the bar shrinks to 48px and keeps
only identity, mode and export; the stage hugs the top of its box at
`min(42dvh, 380px)`; the dock and panel sit beneath it, anchored to `--plate-h` — the
plate's real rendered height, published by Stage onto the document element — so nothing
ever stacks below a dead band. The tab rail turns into a horizontal scrolling row with a
mask fade, and the sticky panel header lightens because the panel is now glass over the
room rather than glass over a rail.

**Rhythm.** Gaps come from a tight scale: 2/3px between adjacent segments, 7–10px inside a
group, 14–16px between groups, 20px between chrome and the wall. The first-run card is the
only surface with generous padding (44px).

### Named Rules
**The Floating Chrome Rule.** No chrome surface touches a viewport edge. Every pill and
panel keeps a visible margin of room on all sides, at every breakpoint.

**The Real Height Rule.** Phone layout anchors to `--plate-h`, the canvas's measured
height, never to a guessed constant.

## Elevation & Depth

Hybrid, and heavily material. Depth comes from four stacked mechanisms: an enormous soft
ambient field behind everything, a translucent blurred glass body, a directional edge
(lit on top, plain on the other three sides), and a large diffuse black drop shadow. There
are no hard offset shadows and no borders used as structure.

Glass is specular. Every floating surface layers a white top-gradient sheen
(`rgba(255,255,255,0.13)` fading to transparent by 42%) over a glow-tinted body, backed by
`blur(34px) saturate(1.9)`, with an inner top highlight and an inner bottom shadow so the
pane reads as having thickness.

Ambient light is the dominant surface treatment, not an accent: `.ambient` sits at 0.66
opacity with a 100px blur and 1.8 saturation, inset −26% beyond the viewport, composed of
three radials — two sampled from the user's image, one fixed violet.

### Shadow Vocabulary
- **Lift 1** (`0 1px 2px rgba(0,0,0,0.5)`): tiny objects resting on glass — the brand mark.
- **Lift 2** (`0 8px 24px -8px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.4)`): transient and
  hover-raised objects — the sample badge, a lifted preset swatch, the drop-hint badge.
- **Lift 3** (`0 34px 80px -26px rgba(0,0,0,0.88), 0 4px 14px rgba(0,0,0,0.5)`): every
  floating pill and panel, and the toast.
- **Glass inner** (`inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(0,0,0,0.3)`):
  the specular top highlight and inner bottom shadow that give glass thickness.
- **Accent cast** (`0 10px 26px -8px rgba(255,95,162,0.65)` on buttons,
  `0 8px 20px -7px rgba(255,95,162,0.75)` on active tools): the only coloured shadow in the
  chrome.
- **Plate** (`0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)`): the
  screenshot canvas, plus its own halo at 0.85 opacity and 95px blur.

### Named Rules
**The Light-Not-Borders Rule.** Surfaces separate by light: a lit top edge, an inner
highlight, an inner shadow and a large diffuse cast. A four-sided full-strength border is
never the separator.

**The Borrowed Edge Rule.** The lit top edge is not a fixed white. It mixes 34% of the
sampled glow into `--edge-lit`, so the chrome's highlight changes colour with the user's
image.

## Shapes

Everything is a pill or a rounded rectangle; there is not a square corner in the chrome.

The scale runs in two registers. **Structural radii** are large and per-object rather than
stepwise: command bar 29px, tool dock 24px, inspector 24px (`--r-slab`), tool options
13px, timeline 26px, first-run card 30px, plate 16px (`--r-plate`). **Control radii** are a
tight scale: 12px (`--r-control`) for every field, button and icon button; 15px for a tool
in the dock; 10px for panel tabs, motion stages and wallpaper thumbs; 8–9px for chips,
swatches and preset swatches.

A **micro scale** handles internal geometry only: 6px for a segment button, crop chip or
inner corner; 4px for the global focus-visible ring and the annotation text-edit box; 3px
for the annotation mid handle, the position-grid dot and the recording bar; 2px for a
slider track and the align cell's inner mark. Full pills (`99px`) are reserved for the
sample badge and scrollbar thumbs.

Strokes are 1px and hairline-weight. The exceptions all belong to the canvas overlay, not
the chrome: 1.5px for the selection box, crop box and text-edit outline, 2px for handle
rings and the drop zone's dashed border, 3px for crop corner brackets.

### Named Rules
**The No Square Corner Rule.** Every surface, control and overlay is rounded. If a new
element needs a radius and no token fits, it takes `--r-control`.

## Components

### Buttons
- **Shape:** softly rounded (12px `--r-control`), 34px tall, 13px horizontal padding.
- **Primary:** the Aurora run as background, white 600 text, an inset white top hairline
  and a pink cast beneath. Hover brightens the whole gradient by 6% rather than shifting
  colour.
- **Default:** glass film bed, transparent border, 500 weight; hover steps to the stronger
  film.
- **Quiet:** transparent with muted violet text; hover adopts the film bed and white text.
- **Press:** a 1px drop with a 0.985 scale over 60ms, then released on `--settle`.
- **Small / Wide / File:** 28px tall at 12px; full-width; and a transparent file input laid
  over the button face.
- **Split:** the export button and its arrow share one silhouette — left cap rounded left,
  arrow capped right with an inset divider hairline and its own mono meta string.

### Icon Buttons and Tools
- **Icon button:** 34px square at `--r-control`, muted violet at rest, film bed on hover,
  Aurora wash with flat accent glyph when on.
- **Tool:** 40px square at 15px, muted at rest; when active it takes the full Aurora run,
  white glyph and a pink cast. Press scales to 0.93.

### Cards / Containers
- **Command bar:** a centred glass pill (29px), 58px tall, entering on `slab-down`.
- **Inspector:** a floating glass panel (24px), 348px wide, clipping a well-bedded tab rail
  against a scrolling body, entering on `slab-right`.
- **Tool dock:** a glass pill (24px) entering on `slab-up`, with its options pill (13px)
  and timeline (26px) as separate floating objects.
- **Export menu:** solid glass, 24px, 16px padding, appearing on `pop`.
- **First-run card:** glass at 30px, 44px padding, centred over a radial scrim with a 3px
  backdrop blur.
- **Shadow strategy:** Lift 3 plus the glass inner pair; see Elevation & Depth.

### Inputs / Fields
- **Style:** a well bed (white 6% alpha) inside a 1px edge at `--r-control`, 34px tall.
- **Hover:** the border steps to the lit edge.
- **Focus:** the border takes the flat accent and the bed deepens to `--well-deep`. Global
  `:focus-visible` adds a 2px accent outline at 2px offset.
- **Field slider:** the bar is the control. A gradient fill (amber→pink) sweeps the bed
  with a 3px white glowing leading edge; the label sits left and a mono output right; the
  real range input is transparent and absolute over the whole bar. Hover brightens the
  fill 25%.
- **Segmented:** a well bed holding 26px buttons at 6px; the selected one takes the strong
  glass film and an inset top highlight, not the accent.

### Chips
- **Style:** 30px tall, 8px radius, well bed, 1px edge, muted violet at 12px/500.
- **State:** hover lifts text to white and the border to the lit edge; on takes the Aurora
  wash with a 60%-alpha pink border and white text.

### Navigation
- **Style:** a vertical rail of icon-over-label tabs on a well bed, each 10px radius,
  faint violet at 10.5px/500.
- **Active:** a 120° amber→pink wash at 28–32% alpha with an inset white hairline and white
  text — the gradient present but held below the primary button's intensity.
- **Mobile:** the rail becomes a horizontal scrolling row with icon beside label at 12px,
  a right-edge mask fade and hidden scrollbars.

### Signature: the Sample Badge
The editor opens on a worked sample and says so. A solid-glass full pill floats 16px below
the plate, muted violet at 12px, carrying a mono keycap for the paste shortcut and a single
dismiss button that swaps to a file picker. It arrives on `pop` with a 300ms delay so the
plate lands first.

### Motion
- **Damped release** (`--settle`, `420ms cubic-bezier(0.16, 1, 0.3, 1)`): every transform
  on a tool or button decelerates and never bounces.
- **Entrances:** `slab-down` (bar, 520ms), `slab-right` (panel, 560ms @60ms),
  `slab-up` (dock, 560ms @120ms) — a staggered arrival, each object from its own wall.
- **`pop`** (180–400ms): transient surfaces — menu, toast, tool options, sample badge,
  first-run card.
- **`tab-in`** (300ms on `--settle`): the panel body on tab change.
- **`plate`** (400ms): the canvas landing.
- **Light transitions** run at 700ms, slower than everything else, so a re-sampled room
  changes colour as a fade rather than a cut.
- **Reduced motion** is honoured globally: all animation and transition durations collapse
  to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** float new chrome as a pill or rounded panel with a visible margin of room on every
  side.
- **Do** separate surfaces with a lit top edge, an inner highlight and a diffuse cast —
  never a full-strength four-sided border.
- **Do** mix `--glow-a` / `--glow-b` into anything that should read as lit, instead of
  authoring a hue.
- **Do** reserve the Aurora run for state: primary action, active tool, active tab.
- **Do** build recessed fields from white alpha (`--well` / `--well-deep`) — a darker pane
  of the same glass.
- **Do** set every user-read numeral in Spline Sans Mono with tabular figures.
- **Do** give every icon-only control a visible label or an accessible name.
- **Do** anchor phone layout to `--plate-h`.

### Don't:
- **Don't** let any chrome surface out-glow the canvas plate.
- **Don't** use `--dim` on text; `--faint` is the floor.
- **Don't** use the accent for emphasis, decoration or hierarchy.
- **Don't** introduce a third type family or a system-UI display face into the chrome.
- **Don't** cut a recessed field as a black hole; it is glass, darker.
- **Don't** add a hard offset shadow; every shadow in this world is large and diffuse, and
  the only coloured cast is the accent's.
- **Don't** ship a square corner in the chrome.
- **Don't** use a bouncing, springing or elastic curve.
- **Don't** dock chrome into a solid frame or wrap settings in a form panel with structural
  rules — that is the arrangement this world exists to refuse.

## Accepted Deviations

**Resolved: the command bar is now centred.** The previous pass recorded a deviation — the
bar shipped full-bleed at `left: 14px; right: 14px` against a contract asking for a "glass
command bar floating at top centre". The Aurora build ships `.bar` as a centred pill
capped at `min(1180px, 100% − 32px)` with a 29px radius, which is the contract's shape. The
deviation is closed, not dropped: the rule for new top-level chrome has changed with it —
centred, width-capped pill, not full-bleed slab.

**Outstanding: the direction contract in `index.html` now describes the previous world.**
It states a near-black room, smoked glass, "one amber accent", and amber-with-mono
typography. The build ships an indigo-night room, heavy specular glass and a
gradient accent. The build is the truth here; the contract comment needs rewriting to
match. Flagged, not edited.

## Open Decisions

**The radius set is wider than a system wants.** The build ships fourteen distinct radii
(29/30/26/24/22/20/16/15/13/12/11/10/9/8 plus the 6/4/3/2 micro scale). Every one is
recorded above because this document describes what ships, but several are near-duplicates
that exist because a component was tuned by eye rather than assigned a role: 8 against 9
against 10 on swatches, thumbnails and preset tiles; 11 against 13 on the toast and the
note. Consolidating to roughly six structural steps would tighten the world and cost a few
pixels of visual change. Not taken, because the owner approved this build as it looks.


**How far the glass goes — partly taken.** The finish review previously judged the material
honest but short of its ceiling on four counts. Two have since been taken: the glass now
carries a **specular top sheen** (a white gradient falling off by 42% of the pane's height)
and an **inner bottom shadow**, so a pane reads as having thickness rather than being a
single lit line.

Two remain open. There is still **no specular falloff along a pane's length** — the sheen
is uniform horizontally, so a 1180px bar is lit identically at both ends. And there is
still **no near/far weighting**: the command bar, the dock and the inspector share one
blur, one edge treatment and one shadow, so nothing reads as closer to the viewer than
anything else. Edge refraction where a pane crosses the plate's light was never attempted
and is bundled with the falloff question.

Taking the rest would deepen the world's signature; leaving it keeps the chrome quieter
behind the screenshot, which is the thesis. The product owner decides.
