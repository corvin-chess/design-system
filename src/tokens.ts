/**
 * Corvin design tokens (CV-113). Keep values aligned with tokens.css and DESIGN.md.
 */

export const colors = {
  ink: "#0b0d12",
  slate: "#161b2b",
  indigo: "#2f3d63",
  mist: "#8fa3d9",
  gold: "#c9a227",
  paper: "#e6e9f2",
  snow: "#f8fafc",
  inkText: "#12141a",
  danger: "#b33a3a",
  ok: "#2f6d4f",
} as const

export const board = {
  lightSquare: "#c5cddf",
  darkSquare: "#3a4563",
  darkThemeLightSquare: "#4a5570",
  darkThemeDarkSquare: "#1c2233",
  lastMove: "#c9a227",
  lastMoveOpacity: 0.35,
  selected: "#8fa3d9",
  selectedWidthPx: 2,
  legal: "#8fa3d9",
  coordOnDark: "#e6e9f2",
  coordOnLight: "#2f3d63",
  coordSizePx: 11,
} as const

export const typography = {
  ui: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  display: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  /** Font files live in assets; clients import that CSS, not a CDN. */
  fontSource: "assets/fonts/ibm-plex",
} as const

export const motion = {
  /** Midpoint of DESIGN.md piece move range 120-160ms. */
  pieceMs: 140,
  pieceEasing: "ease-out",
  panelMs: 120,
  clockPulseHz: 1,
  reducedMotionMs: 0,
} as const

export const tokens = {
  colors,
  board,
  typography,
  motion,
} as const

export type ColorToken = keyof typeof colors
export type MotionToken = keyof typeof motion
