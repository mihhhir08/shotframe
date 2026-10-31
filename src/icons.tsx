const PATHS = {
  select: 'M5 3l14 8-6 1.5L10 19z',
  crop: 'M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14',
  arrow: 'M5 19L19 5M9 5h10v10',
  rect: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  ellipse: 'M12 5c5 0 9 3.1 9 7s-4 7-9 7-9-3.1-9-7 4-7 9-7z',
  highlight: 'M9 11l-6 6v3h9l3-3M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4',
  blur: 'M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z',
  pixelate: 'M3 3h6v6H3zM15 3h6v6h-6zM9 9h6v6H9zM3 15h6v6H3zM15 15h6v6h-6z',
  spotlight: 'M12 2v3M4.2 4.2l2.1 2.1M2 12h3M19 12h3M17.7 6.3l2.1-2.1M12 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM10 21h4',
  text: 'M5 6V4h14v2M12 4v16M9 20h6',
  step: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM10.5 9l2-1.5V16',
  pen: 'M3 21c3-1 4-4 7-7l7-7a2.1 2.1 0 0 1 3 3l-7 7c-3 3-6 4-10 4z',
  undo: 'M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  redo: 'M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h3',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  download: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  image: 'M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4M15.5 8.5h.01',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M5 12l5 5L20 7',
  x: 'M6 6l12 12M18 6L6 18',
  layout: 'M3 4h18v16H3zM8 9h8v6H8z',
  style: 'M4 4h12v12H4zM20 8v12H8',
  window: 'M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01',
  cube: 'M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12v10M12 12L3 7',
  play: 'M7 4l13 8-13 8z',
  pause: 'M7 4h3v16H7zM14 4h3v16h-3z',
  film: 'M3 4h18v16H3zM7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4',
  curve: 'M4 20C4 11 10 6 19 6M14 3l5 3-3 5',
  headEnd: 'M3 12h17M15 7l5 5-5 5',
  headBoth: 'M4 12h16M9 7l-5 5 5 5M15 7l5 5-5 5',
  headNone: 'M4 12h16',
  dash: 'M3 12h4M10 12h4M17 12h4',
  chevron: 'M6 9l6 6 6-6',
  keyboard: 'M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M8 14h8',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
}

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
