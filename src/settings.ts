export type BgType = 'gradient' | 'mesh' | 'solid' | 'image' | 'blurred' | 'transparent'
export type FrameType =
  | 'none' | 'macLight' | 'macDark' | 'windowsLight' | 'windowsDark'
  | 'browserLight' | 'browserDark' | 'glass'
export type Corner = 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br'
export interface Crop { x: number; y: number; w: number; h: number } // 0..1 of the image

export interface Settings {
  bgType: BgType
  gradColors: string[]
  gradAngle: number
  gradRadial: boolean
  meshColors: string[] // [base, blob1..blob4]
  solidColor: string
  bgImage: string | null // data URL
  bgBlur: number
  noise: number

  padding: number
  inset: number
  insetColor: string
  radius: number
  shadowBlur: number
  shadowOpacity: number
  shadowY: number
  borderWidth: number
  borderColor: string

  scale: number
  posX: number
  posY: number
  rotate: number
  tiltX: number
  tiltY: number

  frame: FrameType
  frameTitle: string

  aspect: string
  customW: number
  customH: number
  crop: Crop | null

  caption: string
  captionSize: number
  captionColor: string
  captionPos: 'top' | 'bottom'
  watermark: string
  watermarkPos: Corner
  watermarkOpacity: number
}

export type AnnotationType =
  | 'arrow' | 'rect' | 'ellipse' | 'highlight' | 'blur' | 'pixelate'
  | 'spotlight' | 'text' | 'step' | 'pen'
export type Tool = 'select' | 'crop' | AnnotationType

export interface Annotation {
  id: string
  type: AnnotationType
  // image pixel coordinates (uncropped)
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  size: number
  text?: string
  points?: number[]
}

export const GRADIENTS: { name: string; colors: string[]; angle: number }[] = [
  { name: 'Ember', colors: ['#ffb347', '#e8541e', '#7a1f3d'], angle: 135 },
  { name: 'Peach', colors: ['#ffecd2', '#fcb69f'], angle: 135 },
  { name: 'Sky', colors: ['#89f7fe', '#66a6ff'], angle: 135 },
  { name: 'Aurora', colors: ['#00c9ff', '#92fe9d'], angle: 135 },
  { name: 'Mint', colors: ['#a8ff78', '#78ffd6'], angle: 135 },
  { name: 'Candy', colors: ['#fbc2eb', '#a6c1ee'], angle: 135 },
  { name: 'Grape', colors: ['#c471f5', '#fa71cd'], angle: 135 },
  { name: 'Sunset', colors: ['#f83600', '#f9d423'], angle: 45 },
  { name: 'Lava', colors: ['#f12711', '#f5af19'], angle: 135 },
  { name: 'Lilac', colors: ['#e0c3fc', '#8ec5fc'], angle: 135 },
  { name: 'Rose', colors: ['#ee9ca7', '#ffdde1'], angle: 135 },
  { name: 'Ocean', colors: ['#0ea5e9', '#1e3a8a'], angle: 160 },
  { name: 'Forest', colors: ['#134e5e', '#71b280'], angle: 135 },
  { name: 'Steel', colors: ['#bdc3c7', '#2c3e50'], angle: 160 },
  { name: 'Midnight', colors: ['#232526', '#414345'], angle: 135 },
  { name: 'Noir', colors: ['#000000', '#434343'], angle: 160 },
  { name: 'Cream', colors: ['#fdfbfb', '#ebedee'], angle: 135 },
  { name: 'Hyper', colors: ['#f72585', '#7209b7', '#3a0ca3'], angle: 120 },
]

export const MESHES: { name: string; colors: string[] }[] = [
  { name: 'Solar', colors: ['#ffedd5', '#fb923c', '#f43f5e', '#facc15', '#fda4af'] },
  { name: 'Nebula', colors: ['#1a1033', '#ff6ec4', '#7873f5', '#22d3ee', '#fbbf24'] },
  { name: 'Lagoon', colors: ['#042f2e', '#14b8a6', '#0ea5e9', '#a3e635', '#1e40af'] },
  { name: 'Bloom', colors: ['#fdf2f8', '#f9a8d4', '#c4b5fd', '#fcd34d', '#86efac'] },
  { name: 'Ink', colors: ['#0a0a0a', '#3b82f6', '#9333ea', '#0f766e', '#1f2937'] },
  { name: 'Citrus', colors: ['#fefce8', '#fde047', '#fb923c', '#4ade80', '#fef08a'] },
  { name: 'Rust', colors: ['#1c0f0a', '#ea580c', '#b91c1c', '#f59e0b', '#44403c'] },
  { name: 'Frost', colors: ['#eff6ff', '#bfdbfe', '#e0e7ff', '#a5f3fc', '#f5f5f4'] },
]

export const SOLIDS = ['#ffffff', '#f5f5f4', '#e7e5e4', '#0e0d0c', '#1e293b', '#fde68a', '#fecaca', '#bbf7d0', '#bfdbfe', '#e9d5ff']

export const ASPECTS: { id: string; label: string; w: number; h: number }[] = [
  { id: 'auto', label: 'Auto', w: 0, h: 0 },
  { id: '1:1', label: 'Square 1:1', w: 1, h: 1 },
  { id: '4:3', label: '4:3', w: 4, h: 3 },
  { id: '3:2', label: '3:2', w: 3, h: 2 },
  { id: '16:9', label: '16:9', w: 16, h: 9 },
  { id: '16:10', label: '16:10', w: 16, h: 10 },
  { id: '9:16', label: 'Story 9:16', w: 9, h: 16 },
  { id: '4:5', label: 'Instagram 4:5', w: 4, h: 5 },
  { id: 'x', label: 'X post 1600×900', w: 1600, h: 900 },
  { id: 'linkedin', label: 'LinkedIn 1200×627', w: 1200, h: 627 },
  { id: 'og', label: 'Open Graph 1200×630', w: 1200, h: 630 },
  { id: 'ph', label: 'Product Hunt 1270×760', w: 1270, h: 760 },
  { id: 'dribbble', label: 'Dribbble 1600×1200', w: 1600, h: 1200 },
  { id: 'yt', label: 'YouTube 1280×720', w: 1280, h: 720 },
  { id: 'custom', label: 'Custom', w: 0, h: 0 },
]

export const FRAMES: { id: FrameType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'macLight', label: 'macOS' },
  { id: 'macDark', label: 'macOS dark' },
  { id: 'browserLight', label: 'Browser' },
  { id: 'browserDark', label: 'Browser dark' },
  { id: 'windowsLight', label: 'Windows' },
  { id: 'windowsDark', label: 'Windows dark' },
  { id: 'glass', label: 'Glass' },
]

export const DEFAULTS: Settings = {
  bgType: 'gradient',
  gradColors: GRADIENTS[0].colors,
  gradAngle: 135,
  gradRadial: false,
  meshColors: MESHES[0].colors,
  solidColor: '#f5f5f4',
  bgImage: null,
  bgBlur: 40,
  noise: 0,

  padding: 72,
  inset: 0,
  insetColor: '#ffffff',
  radius: 14,
  shadowBlur: 60,
  shadowOpacity: 35,
  shadowY: 24,
  borderWidth: 0,
  borderColor: '#ffffff66',

  scale: 100,
  posX: 0,
  posY: 0,
  rotate: 0,
  tiltX: 0,
  tiltY: 0,

  frame: 'none',
  frameTitle: '',

  aspect: 'auto',
  customW: 1600,
  customH: 1000,
  crop: null,

  caption: '',
  captionSize: 44,
  captionColor: '#ffffff',
  captionPos: 'top',
  watermark: '',
  watermarkPos: 'br',
  watermarkOpacity: 70,
}

export const STYLE_PRESETS: { name: string; patch: Partial<Settings> }[] = [
  { name: 'Ember', patch: { bgType: 'gradient', gradColors: GRADIENTS[0].colors, gradAngle: 135, frame: 'none', radius: 14, tiltX: 0, tiltY: 0, shadowBlur: 60, shadowOpacity: 35, borderWidth: 0 } },
  { name: 'Clean', patch: { bgType: 'solid', solidColor: '#f5f5f4', frame: 'macLight', radius: 12, tiltX: 0, tiltY: 0, shadowBlur: 50, shadowOpacity: 18, shadowY: 16, borderWidth: 0 } },
  { name: 'Glass', patch: { bgType: 'mesh', meshColors: MESHES[1].colors, frame: 'glass', radius: 22, tiltX: 0, tiltY: 0, shadowBlur: 70, shadowOpacity: 40, borderWidth: 0 } },
  { name: 'Tilted', patch: { bgType: 'mesh', meshColors: MESHES[0].colors, frame: 'macLight', radius: 12, tiltX: 14, tiltY: -20, shadowBlur: 80, shadowOpacity: 30, shadowY: 40 } },
  { name: 'Browser', patch: { bgType: 'gradient', gradColors: GRADIENTS[2].colors, gradAngle: 135, frame: 'browserLight', radius: 12, tiltX: 0, tiltY: 0, shadowBlur: 60, shadowOpacity: 30 } },
  { name: 'Midnight', patch: { bgType: 'gradient', gradColors: GRADIENTS[14].colors, frame: 'macDark', radius: 12, tiltX: 0, tiltY: 0, borderWidth: 1.5, borderColor: '#ffffff33', shadowBlur: 80, shadowOpacity: 60 } },
  { name: 'Blurred', patch: { bgType: 'blurred', bgBlur: 60, frame: 'none', radius: 16, tiltX: 0, tiltY: 0, borderWidth: 2, borderColor: '#ffffff55', shadowBlur: 70, shadowOpacity: 45 } },
  { name: 'Lagoon', patch: { bgType: 'mesh', meshColors: MESHES[2].colors, frame: 'browserDark', radius: 12, tiltX: -10, tiltY: 16, shadowBlur: 90, shadowOpacity: 55, shadowY: 40 } },
]
