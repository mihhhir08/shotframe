---
name: Shotframe
description: One neutral graphite room, chrome docked to the window edges in hairlines, and the screenshot as the only saturated thing on screen.
colors:
  room: "#131314"
  glass: "#1a1a1c"
  glass-solid: "#1a1a1c"
  glass-2: "rgba(255, 255, 255, 0.04)"
  glass-3: "rgba(255, 255, 255, 0.07)"
  edge: "rgba(255, 255, 255, 0.08)"
  edge-lit: "rgba(255, 255, 255, 0.08)"
  hairline: "rgba(255, 255, 255, 0.06)"
  well: "rgba(255, 255, 255, 0.06)"
  well-deep: "rgba(255, 255, 255, 0.11)"
  text: "#f0f0f1"
  muted: "#a0a0a4"
  faint: "#8a8a8e"
  dim: "#5c5c60"
  accent: "#f0f0f1"
  accent-hi: "#ffffff"
  accent-dim: "rgba(255, 255, 255, 0.1)"
  accent-ink: "#131314"
  scrim-hair: "rgba(0, 0, 0, 0.18)"
  scrim-soft: "rgba(0, 0, 0, 0.3)"
  shadow-lifted: "rgba(0, 0, 0, 0.35)"
  shadow-contact: "rgba(0, 0, 0, 0.4)"
  shadow-card: "rgba(0, 0, 0, 0.45)"
  shadow-knob: "rgba(0, 0, 0, 0.5)"
  scrim-caption: "rgba(0, 0, 0, 0.6)"
  scrim-readout: "rgba(0, 0, 0, 0.75)"
  mask-stop: "#000"
  checker-a: "#232326"
  checker-b: "#1a1a1d"
  placeholder-a: "#3a3a3e"
  placeholder-b: "#1f1f22"
  preset-paper: "#fbfaf9"
  ink-red: "#ff3b30"
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
  display-compact:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  brand:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
    fontFeature: "ss01"
  control:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  panel-head:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.07em"
  group-head:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
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
    lineHeight: 1.2
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
rounded:
  square: "0"
  tick: "2px"
  nib: "3px"
  focus: "4px"
  mark: "5px"
  xs: "6px"
  control: "7px"
  plate: "8px"
  swatch: "9px"
  slab: "10px"
  toast: "11px"
  pill-sm: "12px"
  tray: "13px"
  dock-item: "15px"
  hint-frame: "20px"
  dock: "24px"
  timeline: "26px"
  card: "30px"
  pill: "99px"
  round: "50%"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "7px"
  md: "10px"
  lg: "14px"
  xl: "16px"
  gutter: "24px"
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
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "34px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hi}"
    textColor: "{colors.accent-ink}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    height: "34px"
  button-small:
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "28px"
  button-big:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.dock-item}"
    padding: "0 22px"
    height: "46px"
  icon-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    size: "34px"
  icon-button-on:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent}"
  tool:
    textColor: "{colors.muted}"
    rounded: "{rounded.dock-item}"
    size: "40px"
  tool-on:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 11px"
    height: "34px"
  input-focus:
    backgroundColor: "{colors.well-deep}"
  chip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    rounded: "{rounded.plate}"
    padding: "0 11px"
    height: "30px"
  chip-on:
    backgroundColor: "{colors.glass-3}"
    textColor: "{colors.text}"
  segment-item:
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    rounded: "{rounded.xs}"
    padding: "0 7px"
    height: "26px"
  segment-item-on:
    backgroundColor: "{colors.glass-3}"
    textColor: "{colors.text}"
  panel-tab:
    textColor: "{colors.faint}"
    typography: "{typography.tab}"
    rounded: "{rounded.slab}"
    padding: "9px 2px 8px"
    width: "78px"
  panel-tab-on:
    backgroundColor: "{colors.glass-3}"
    textColor: "{colors.text}"
  slab:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
  command-bar:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.square}"
    height: "46px"
    padding: "0 10px 0 14px"
  toast:
    backgroundColor: "{colors.text}"
    textColor: "{colors.room}"
    rounded: "11px"
    padding: "10px 16px"
---

# Design System: Shotframe

## Overview

**Creative North Star: "The Graphite Bench"**

Shotframe is a workbench, not a showroom. The interface is one unlit neutral room
(`--room` #131314) with its chrome docked hard to the window edges, cut apart by
1px hairlines. Nothing in the chrome carries hue, nothing blurs, nothing glows, and
nothing floats over anything else except the tool dock. The single saturated object
on screen is the user's screenshot on the stage plate. Everything else is graphite,
so the work reads true.

Density is instrument-panel tight: 34px controls, 10-16px rhythm, 10-11px uppercase
small caps for every panel and group heading, and tabular mono for every numeral a
user reads. The world earns its seriousness from restraint — hairline separation
instead of glass, opaque fills instead of `backdrop-filter`, near-flat shadows
instead of lift. This replaced an earlier indigo-and-gradient world that read as
generated rather than built; the rejection of specular glass pills, chromatic
accents and ambient runtime glow is a confirmed, durable one.

Motion is a response, never an entrance. No surface animates in on load. Press-release
on tools and buttons, a 300ms tab-in when the inspector changes tab, a 180ms `pop` for
things that genuinely appear (menus, toasts, tool options), and full honour of
`prefers-reduced-motion`.

**Key Characteristics:**
- One neutral room, zero chroma in the chrome.
- The accent *is* the text colour (#f0f0f1); selection reads as light, not as colour.
- Separation is always a 1px hairline, never blur and never glow.
- Chrome docks to window edges with square corners; only the tool dock floats.
- Near-flat elevation: the deepest shadow in the system is `0 2px 8px`.
- Small-caps labelling, tabular numerals, no icon-only tab.

## Colors

A single graphite neutral, laddered by opacity, with no hue anywhere in the interface;
the only saturated values in the system are the annotation inks the user draws with.

### Primary
- **Paper White** (`accent` / `text`): the interface has no colour of its own, so the
  accent and the body text are the same value. It marks the active tool, the focused
  field's border, the selection box, the slider thumb, the toast fill and `::selection`.
  On a filled accent surface the text flips to **Room Ink** (`accent-ink`), the room
  colour itself.
- **Accent Wash** (`accent-dim`): a 10% white fill for a toggled icon button — on, but
  not the loudest thing in the bar.

### Neutral
- **Graphite Room** (`room`): the app background and the ground of every docked panel.
- **Graphite Deep** (`room-2`): the darker ground beneath the room.
- **Slab** (`glass` / `glass-solid`): every chrome surface — command bar, background
  panel, inspector, dock, menus, empty card. Opaque. The name is inherited; the material
  is not.
- **Raise 4% / Raise 7%** (`glass-2`, `glass-3`): hover and selected states on otherwise
  transparent controls. These are the only two "lit" steps in the system.
- **Edge** (`edge`) and **Hairline** (`hairline`): the structural lines. `edge` draws the
  outside of a slab and the border of a well; `hairline` draws internal dividers (group
  rules, bar separators, the tab rail's inner border).
- **Well / Well Deep** (`well`, `well-deep`): recessed beds — inputs, sliders, segmented
  controls, swatch grids, the inspector's tab rail. A recessed field is a darker pane of
  the same slab, never a black hole.
- **Muted / Faint** (`muted`, `faint`): secondary label text and panel headings.
- **Dim** (`dim`): non-text only — the position-grid dot and a group heading's uppercase
  label, which is the one place it carries a glyph, at 10px/0.08em.

### Scrims and Shadow Blacks
Depth over the user's image, and the shadow blacks the tokens are mixed from, are pure
neutral black at fixed opacities. They are component-level values, not surface colours:
never paint a chrome surface with one.
- **Hairline scrim** (18%): the inset divider between the two halves of a split button.
- **Soft scrim** (30%): the on-canvas text editor's field while typing.
- **Shadow blacks** (35% / 40% / 45% / 50%): the two elevation tokens, the preset card's
  hover shadow (`0 4px 10px`), and the timeline and crop knobs (`0 2px 6px`).
- **Caption scrim** (60%): the gradient under a background tile's name, the crop handle's
  drop shadow, and the pressed underside of a keycap.
- **Readout scrim** (75%): the crop-size pill, so a number stays legible over any image.
- **Mask stop** (`#000` at 86% of a linear-gradient): not a colour — the fade mask on the
  phone tab rail, where the black end means "opaque here".
- **Crop surround** (`0 0 0 9999px`): the whole canvas outside a crop, held at two thirds.

**The Black-Is-For-Image Rule.** Black scrims exist only where chrome sits on top of the
user's picture. Inside the panels, separation is a hairline and contrast is white-alpha;
a panel never darkens itself with black.

### Annotation Ink (content, not chrome)
Eight fixed inks for the drawing tools: red, orange, amber, green, blue, violet, white,
black. These live on the user's image, never on the interface. A custom-colour well sits
beside them as a conic wheel. **This is the only saturation the system allows, and it is
always inside the plate.**

### Named Rules
**The One Lit Object Rule.** The screenshot plate is the only saturated, only genuinely
lit thing on screen. If a new chrome surface needs colour to be understood, the surface
is wrong, not the palette.

**The Colourless Chrome Rule.** No hue enters the interface. Every chrome value is
graphite or white-alpha. State is expressed by lightness (4% → 7% → full white), never
by hue.

**The Accent-Is-Light Rule.** "Selected", "focused", "on" and "primary" all read as the
text colour at full strength on a room-ink ground. There is no second accent to reach
for, and a gradient accent is not available.

**The Dim-Is-Not-Body Rule.** `--dim` never sets body text. Readable text bottoms out at
`--faint`; `--dim` is reserved for the group-heading small caps and non-text marks.

## Typography

**Display / Body Font:** Archivo (self-hosted variable woff2, `ss01` on, with
`ui-sans-serif, system-ui, -apple-system` fallback)
**Label/Mono Font:** Spline Sans Mono (self-hosted variable woff2, with
`ui-monospace, SFMono-Regular, Menlo` fallback)

**Character:** Archivo is a working grotesque — neutral at small sizes, tight and
confident at 40px with -0.045em tracking. Spline Sans Mono carries every number. Both
are self-hosted with `font-display: block`, because the world's voice should not swap
faces on first paint or depend on a third-party runtime.

### Hierarchy
- **Display** (700, 40px, 1.05, -0.045em): the empty-state headline only.
- **Display compact** (700, 21px, same tracking): the same headline below 900px. The one
  step the ramp takes on phones — everything else keeps its desktop size, because the
  panels are already at instrument density.
- **Headline** (400, 15.5px, 1.55): the empty-state paragraph. Its 15px sibling sets the
  big primary button and the drop-target pill — the only type above body size inside the
  app proper.
- **Brand** (500, 14px, -0.005em): the wordmark in the command bar. One step above body,
  the smallest increment that still reads as a title; deliberately not a display size,
  because the bar is 46px tall and the brand must not outweigh the work.
- **Body** (400, 13px, root size): every control label, menu row and field value.
- **Control** (500, 12px): buttons at small size, segmented items, chips, the sample badge.
- **Hint** (400, 11.5px, 1.5, `--faint`): explanatory copy under a control group.
- **Panel head** (500, 11px, 0.07em, uppercase, `--faint`): the title of a panel.
- **Tab / micro label** (500, 10.5px, 0.01em): inspector tab rail labels, pattern and
  preset captions, the split-button meta.
- **Group head** (500, 10px, 0.08em, uppercase, `--dim`): the heading of a group inside
  a panel.
- **Numeral** (11px Spline Sans Mono, `tabular-nums`): dimensions, timecodes, slider
  outputs, crop size, keycaps.

### Named Rules
**The Small-Caps Head Rule.** Headings inside chrome are not larger, they are smaller and
spaced: 11px/0.07em uppercase in `--faint` for a panel, 10px/0.08em uppercase in `--dim`
for a group. Hierarchy comes from tracking and colour, not from size.

**The Tabular Numeral Rule.** Every numeral a user reads is Spline Sans Mono with
`font-variant-numeric: tabular-nums`, so a value never jitters as it changes.

**The Two Faces Rule.** Archivo for language, Spline Sans Mono for number. There is no
third face, and no system-UI display face; the one system stack that remains is inside
the canvas text tool, where it matches what the exported image will render.

**The Labelled Tab Rule.** No tab and no rail item ships icon-only. The inspector rail is
78px wide precisely so every icon carries its word underneath (10.5px), and it becomes a
scrolling row of icon+word pairs below 900px.

## Layout

The window is divided, not floated over. Four docked regions, each separated from its
neighbour by one hairline:

- **Command bar**: full width, fixed to the top, 46px tall, square corners, bottom
  hairline only (`border-width: 0 0 1px`). Brand left, mode switch centred by absolute
  transform, file and export actions right.
- **Background panel**: flush left under the bar, 300px wide, right hairline only. When
  collapsed it leaves a 44px vertical tab with a vertical-writing label.
- **Inspector**: flush right under the bar, 348px wide, left hairline only, laid out as
  a 78px labelled tab rail (recessed in `--well`) plus the panel body.
- **Stage**: whatever remains — `inset: 46px 348px 0 var(--bg-left)`. `--bg-left` is
  `300px` when the background panel is open and `44px` when it is collapsed, and the
  stage transitions its inset over 260ms.

The tool dock is the single exception: it floats above the stage, bottom-centred within
the stage's horizontal span, 14px off the bottom.

**Rhythm:** groups are 16px vertical padding separated by a top hairline; panel bodies
pad `0 16px 24px`; rows gap 8px; control clusters gap 7-10px; icon clusters gap 2-3px.

**Responsive:** at ≤1180px the inspector drops to 310px and the background panel to
264px, with the stage and dock following. At ≤900px the app becomes a stacked phone
sheet: the background panel and its tab disappear, the bar keeps only identity, mode and
export, the stage pins to the top at `min(42dvh, 380px)`, and the inspector becomes a
bottom sheet whose top is measured from `--plate-h`, the canvas's real rendered height.

### Named Rules
**The Docked Chrome Rule.** Chrome meets the window edge. A panel that touches an edge
has square corners on that side and a single hairline on its inner side; it does not
inset itself, round itself away from the frame, or cast a shadow onto the room. Only the
tool dock floats.

**The Hairline Separation Rule.** Regions are separated by exactly one 1px hairline.
Never two adjacent borders, never a blur, never a gradient scrim standing in for an edge.

**The Real Height Rule.** The phone layout anchors to `--plate-h`, the canvas's measured
height, not to a guessed offset, so nothing stacks below a dead band.

## Elevation & Depth

This system is near-flat and depth comes from tone and hairlines, not from lift. Docked
chrome carries no shadow at all; its separation from the room is a border. Only things
that genuinely leave the plane — the menu popover, the stage plate, the toast, the tool
dock's children — receive a shadow, and the largest of them is 8px of blur.

### Shadow Vocabulary
- **Flat** (`--lift-1: none`): the default. Docked panels, bars, groups, wells.
- **Contact** (`--lift-2: 0 1px 2px rgba(0,0,0,0.4)`): a hairline of shadow under
  something resting just above its neighbour — the sample badge, a hovered preset, the
  drop-hint pill.
- **Lifted** (`--lift-3: 0 2px 8px rgba(0,0,0,0.35)`): the menu popover, the toast, and
  the stage plate. The stage plate pairs it with a 1px white ring
  (`0 0 0 1px rgba(255,255,255,0.08)`) so the image has an edge against any background.
- **Knob** (`0 2px 6px rgba(0,0,0,0.5)` on the timeline thumb, `0.6` on a crop handle): the
  only shadow allowed on a control, and only on a round grab target sitting over the image.
- **Card hover** (`0 4px 10px rgba(0,0,0,0.45)`, paired with `--lift-2` on the preset
  swatch): a thumbnail lifting 2px under the cursor.
- **Selection ring** (`0 0 0 2px var(--glass-solid), 0 0 0 4px var(--accent)`): the
  chosen swatch, wallpaper, pattern or ink. A ring, not a glow: the inner stop is the
  slab colour so the ring reads as a cut, not a halo.

### Named Rules
**The Flat-By-Default Rule.** A new surface gets `--lift-1` (none) unless it overlays
content the user was already looking at. Shadow is permission to cover, not decoration.

**The No Atmosphere Rule.** No `backdrop-filter` on chrome, no ambient glow layer, no
room tint sampled from the user's image. The room is a fixed neutral; the image lights
nothing but itself.

## Shapes

One radius ladder, split at 10px by whether the surface is docked or floating.

**Docked chrome is square at the frame and tight inside it** (0 → 10px). The command bar,
background panel and inspector are `border-radius: 0`; the collapsed background tab rounds
only its outer pair (10px). Inside them:

- **2px** (`tick`): the slider track and the position-grid dot — marks, not surfaces.
- **3px** (`nib`): the crop tool's mid handle, the preset and motion thumbnails' plate
  proxies, the recording progress bar.
- **4px** (`focus`): the global focus ring's own corner and the on-canvas text editor.
- **5px** (`mark`): the brand mark, a 20px square that must still read as a mark rather
  than a dot at the smallest scale in the app.
- **6px** (`xs`): segmented items, align-grid cells, the selection box, the crop-size pill,
  keycaps.
- **7px** (`control`): the default control corner — buttons, inputs, fields, colour wells.
- **8px** (`plate`): the stage plate, chips, swatches, the 24px small icon button.
- **9px** (`swatch`) and **10px** (`slab`): preset thumbnails; then menus, pattern and
  wallpaper tiles, motion cards and inspector tab items.

**Floating chrome is soft** (11px → capsule). 11px the toast, 12px the drop pill, 13px the
tool-options tray, 15px the tools inside the dock and the big primary button, 20px the
drop-target frame, 24px the tool dock capsule, 26px the timeline capsule, 30px the empty
card. Badges, scroll thumbs and the sample tag are full pills (99px); handles, ink dots and
round dismiss buttons are circles (50%).

Borders are 1px `--edge` on slabs and wells, 1px `--hairline` for internal dividers.
Selection on a media tile is a ring, not a border-colour change. Dashed 1.5px `--accent`
marks a live interaction on the canvas (selection box, text editor); 2px dashed marks a
drop target; the crop frame is 1.5px solid white with 3px corner brackets.

### Named Rules
**The Two Radius Families Rule.** The ladder breaks at 10. If it touches the window frame,
it is square there and ≤10px inside. If it floats over the stage, it is ≥11px, and anything
holding a row of controls is a capsule (24-26px). Nothing borrows the other family's corner.

**The Micro-Rung Rule.** 2/3/4px belong to marks and canvas furniture — track, dot, handle,
progress bar, focus ring. A surface never takes a micro rung; the smallest surface corner in
the system is 5px.

## Components

### Buttons
- **Shape:** softly cut corners (7px, `--r-control`), 34px tall, 13px side padding.
- **Default:** a 4% white fill (`glass-2`) on the slab, text at full `--text`, weight 500.
- **Primary:** the accent (paper white) with room-ink text at weight 600; hover goes to
  pure white.
- **Quiet:** transparent with `--muted` text; hover fills 4% and brings text to full.
- **Small / Wide / Big:** 28px with 12px type; `width: 100%`; 46px at 15px type and 15px
  radius for the empty state's single call to action.
- **Press:** `translateY(1px) scale(0.985)` over 60ms, releasing on `--settle`
  (420ms damped, never bouncing). Hover changes fill only.
- **Split button:** two halves sharing the control radius, divided by an inset 1px dark
  line, the right half 10px/6px padding with an 10.5px mono meta label.

### Icon Buttons and Tools
- **Icon button:** 34px square, 7px radius, `--muted` glyph; hover fills 4% and lights the
  glyph; toggled-on takes `accent-dim` with a full-white glyph. A 24px/8px `small`
  variant sits in group headings.
- **Tool:** 40px square at 15px radius inside the 24px dock capsule; active takes the full
  accent with room-ink glyph. Press is `scale(0.93)` over 60ms, releasing on `--settle`.
- All icons are drawn SVG strokes at 14-16px. No glyph fonts, no emoji.

### Cards / Containers
- **Slab:** `--glass` fill, 1px `--edge` border. Docked instances square their corners and
  keep only the inner border; floating instances (menu 10px, empty card 30px) keep all
  four.
- **Group:** vertical stack, 16px padding, separated by a top hairline; the first group in
  a panel drops its rule.
- **Panel head:** sticky, small-caps title, fading out over a
  `linear-gradient(180deg, var(--glass) 72%, transparent)` so scrolled content dissolves
  under it rather than sliding beneath a hard box.

### Inputs / Fields
- **Style:** recessed — `--well` fill, 1px `--edge`, 7px radius, 34px tall. Selects carry a
  drawn chevron, not a system arrow.
- **Focus:** border becomes the accent and the well deepens to `--well-deep`. No glow.
- **Field-slider (`.fs`):** the signature input. The bar *is* the control: a 34px well with
  a label left and a mono tabular value right, dragged horizontally (`cursor: ew-resize`),
  with a 7% fill growing from the origin and a 3px white leading edge. The native range
  input sits invisible on top so keyboard and screen-reader behaviour stay real.

### Chips and Segments
- **Chip:** 30px, 8px radius, well fill, `--muted` label; selected lifts to `glass-3` with
  full-white text and a lit edge.
- **Segmented control:** a well with 3px inner padding holding 26px/6px items; the selected
  item takes `glass-3`, full-white text and a 1px inner top highlight. Wraps to a 3-column
  grid when the option list is long.

### Navigation
- **Command bar:** the only global nav. Brand, then grouped icon actions divided by 1px
  22px-tall separators, mode switch centred, export actions right.
- **Inspector tab rail:** a vertical 78px recessed column of icon-over-label buttons at
  10px radius; hover fills 4%, selected fills 7% and adds a 1px inset edge. Body content
  plays `tab-in` (300ms, 5px rise) on change — the one entrance left in the system.
- **Background tab:** when the left panel is collapsed, a 44px stub with a vertical-writing
  11px/0.04em label, rounded only on its outer side.

### Signature: the curated picker
Background pickers open on a curated FEATURED set of sixteen — 8 wallpapers, 4 themes,
4 textures — presented as 16:10 tiles in two columns, each with its name over a bottom
scrim and a "Moves" pill if it animates. The current pick is always shown even when it is
not featured. A quiet full-width button reveals the rest (`Show all 31` / `Show the N
picks`), and a shuffle action sits in the group heading.

**The Point-Of-View Rule.** A picker opens on a point of view, not an inventory. The
default view is a curated subset chosen by the house; the full list is always exactly one
click away and never the first thing shown.

### Signature: the sample badge
A capsule tag pinned under the stage plate, slab fill with `--lift-2`, 12px `--muted`
text with a mono keycap and a dismiss. It fades in 300ms after the plate (`pop`,
`backwards`) — the tool arrives already working, and says so.

### Motion
- **Tokens:** `--fast` 140ms, `--slow` 260ms (layout inset changes), `--settle` 420ms
  `cubic-bezier(0.16, 1, 0.3, 1)` for press-release, `--ease`
  `cubic-bezier(0.2, 0.8, 0.2, 1)` for everything else.
- **On load:** nothing. No slab or plate entrance animations exist.
- **Allowed entrances:** `pop` (180ms) for a menu, toast, tool-option tray or empty card;
  `tab-in` (300ms) for inspector tab changes; the 560ms `slab-up` that remains on the tool
  dock; the delayed sample badge.
- **Reduced motion:** all animation and transition durations collapse to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** dock new chrome to a window edge: square corners on the edge side, one 1px
  `--edge` hairline on the inner side, no shadow.
- **Do** express state with lightness — 4% (`glass-2`) hover, 7% (`glass-3`) selected,
  full accent for active.
- **Do** use the accent (#f0f0f1 on #131314 ink) for exactly one thing at a time in a
  region: the on tool, the focused field, the chosen tile.
- **Do** head panels at 11px/0.07em uppercase `--faint` and groups at 10px/0.08em
  uppercase `--dim`.
- **Do** set every user-facing number in Spline Sans Mono with `tabular-nums`.
- **Do** recess anything editable into a `--well` and raise nothing.
- **Do** ship every rail item and tab with a visible word beside its icon.
- **Do** open any long list on a curated subset with "Show all N" behind a quiet button.
- **Do** reach for a black scrim only where chrome sits over the user's image (30% for a
  field, 60% for a caption, 75% for a readout), and keep it pure neutral black.
- **Do** keep 2/3/4px corners for marks and canvas furniture and 5px as the smallest
  surface corner.
- **Do** keep `--lift-1` (none) as the default elevation and justify anything heavier by
  the surface actually covering content.

### Don't:
- **Don't** introduce a hue into the chrome — no coloured accent, no gradient accent, no
  tinted surface. Saturation belongs inside the plate.
- **Don't** use `backdrop-filter` on chrome, an ambient glow layer, or any room tint
  sampled from the user's image.
- **Don't** float a panel over the room with an inset and a drop shadow; the tool dock is
  the only floating surface.
- **Don't** animate a surface in on page load.
- **Don't** exceed `0 2px 8px` of shadow, or use a shadow to imply a border.
- **Don't** put body text in `--dim`.
- **Don't** add a third typeface, or set an interface heading larger than 14px.
- **Don't** darken a panel with black; panels separate by hairline and contrast by
  white-alpha.
- **Don't** give a floating surface a docked corner, or a docked surface a capsule.
- **Don't** double a separator: one hairline between two regions, never a border on both.

## Accepted Deviations

- **Three tinted near-blacks remain.** The crop surround (`rgba(6,5,8,0.66)`), the recording
  scrim (`rgba(8,7,10,0.8)`) and the "Moves" badge (`rgba(8,6,16,0.72)`) are violet-leaning
  blacks left from the previous world. All three sit over the user's image rather than over
  chrome, and at 66-80% the cast is nearly invisible — but they are not neutral, and the
  Colourless Chrome rule does not have an exception for them. Recorded as debt, not as
  tokens: resolve them to the neutral scrim scale (0.66 → a 60-75% pure black). A new
  surface must not copy these values.
- **Two blurs remain.** `-webkit-backdrop-filter: blur(6px)` on the "Moves" badge and
  `backdrop-filter: blur(8px)` on the recording scrim. Both are over the image, not over
  chrome, so they do not break the no-atmosphere rule — but they are the only blurs in the
  build and must not spread to a panel.
- **`#fbfaf9`** on the preset thumbnail's plate proxy: a warm off-white standing in for a
  screenshot. Harmless as content, but it is the one warm value in the shell; `--text`
  would do the same job.
- **Legacy token names — decision: rename, and it is cheap.** `--glass`, `--glass-solid`,
  `--glass-2`, `--glass-3` and `--edge-lit` are named for a material the build no longer
  uses. `--glass` and `--glass-solid` hold the identical value (#1a1a1c) and `--edge-lit`
  is now identical to `--edge`, so two of the five are pure duplicates. Total usage is 32
  references across `styles.css` and the three components — a single find-and-replace, no
  behaviour change: `--glass`/`--glass-solid` → `--surface`, `--glass-2` → `--raise-1`,
  `--glass-3` → `--raise-2`, `--edge-lit` deleted in favour of `--edge`. Do it in one
  commit; until then read the old names as surface / raise-1 / raise-2 / edge. **This
  question is settled — do not re-open it, just execute the rename.**
- **Two dead declarations.** `--room-2` (#101011) and `--accent-run` (#f0f0f1) are declared
  in `:root` and referenced nowhere. They are not part of the system and are not tokens;
  delete them with the rename.
- **Resolved since the previous document:** the violet transparency chequer is now graphite
  (#232326 / #1a1a1d in the app shell, #2a2a2d / #1f1f22 in the panel swatch), the
  image-background placeholder is a graphite gradient (#3a3a3e → #1f1f22), and the custom-ink
  wheel opens on `#ff3b30`, so it starts from a documented ink.
