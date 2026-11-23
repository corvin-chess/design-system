#!/usr/bin/env node
/**
 * CV-113: assert design tokens match DESIGN.md (colors, type, motion).
 */
import { readFileSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")
const workspaceRoot = resolve(repoRoot, "..")
const designPath = join(workspaceRoot, "DESIGN.md")
const cssPath = join(repoRoot, "src", "tokens.css")
const tsPath = join(repoRoot, "src", "tokens.ts")
const packagePath = join(repoRoot, "package.json")

const fail = (msg) => {
  console.error(`FAIL: ${msg}`)
  process.exitCode = 1
}

const ok = (msg) => console.log(`OK: ${msg}`)

const COLORS = {
  ink: "#0b0d12",
  slate: "#161b2b",
  indigo: "#2f3d63",
  mist: "#8fa3d9",
  gold: "#c9a227",
  paper: "#e6e9f2",
  snow: "#f8fafc",
  "ink-text": "#12141a",
  danger: "#b33a3a",
  ok: "#2f6d4f",
}

const BOARD = {
  "board-light-square": "#c5cddf",
  "board-dark-square": "#3a4563",
  "board-dark-light-square": "#4a5570",
  "board-dark-dark-square": "#1c2233",
  "board-last-move": "#c9a227",
  "board-selected": "#8fa3d9",
  "board-legal": "#8fa3d9",
  "board-coord-on-dark": "#e6e9f2",
  "board-coord-on-light": "#2f3d63",
}

if (!existsSync(packagePath)) {
  fail("missing package.json")
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(packagePath, "utf8"))
if (pkg.name !== "@corvin-chess/design-system") {
  fail(`package.json name must be @corvin-chess/design-system; got ${pkg.name}`)
} else {
  ok("package name @corvin-chess/design-system")
}

if (!existsSync(cssPath)) {
  fail(`missing ${cssPath}`)
  process.exit(1)
}
if (!existsSync(tsPath)) {
  fail(`missing ${tsPath}`)
  process.exit(1)
}

const css = readFileSync(cssPath, "utf8")
const ts = readFileSync(tsPath, "utf8")

const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u
if (emojiRe.test(css) || emojiRe.test(ts)) {
  fail("emoji found in token sources")
} else {
  ok("no emoji in token sources")
}

const cssVar = (name) => {
  const re = new RegExp(`--${name}\\s*:\\s*([^;]+);`)
  const m = css.match(re)
  return m ? m[1].trim().toLowerCase() : null
}

for (const [name, hex] of Object.entries(COLORS)) {
  const value = cssVar(name)
  if (value !== hex.toLowerCase()) {
    fail(`CSS --${name} expected ${hex}, got ${value}`)
  }
}
if (!process.exitCode) ok("CSS color tokens match DESIGN.md")

for (const [name, hex] of Object.entries(BOARD)) {
  const value = cssVar(name)
  if (value !== hex.toLowerCase()) {
    fail(`CSS --${name} expected ${hex}, got ${value}`)
  }
}
if (!process.exitCode) ok("CSS Ravenboard square tokens match DESIGN.md")

const fontUi = cssVar("font-ui")
if (!fontUi || !/IBM Plex Sans/i.test(fontUi)) {
  fail(`--font-ui must include IBM Plex Sans; got ${fontUi}`)
} else {
  ok("--font-ui includes IBM Plex Sans")
}

const fontMono = cssVar("font-mono")
if (!fontMono || !/IBM Plex Mono/i.test(fontMono)) {
  fail(`--font-mono must include IBM Plex Mono; got ${fontMono}`)
} else {
  ok("--font-mono includes IBM Plex Mono")
}

if (/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com/i.test(css)) {
  fail("token CSS must not load fonts from a network host")
} else {
  ok("no external font hosts in token CSS")
}

const pieceMs = cssVar("motion-piece-ms")
if (!pieceMs) {
  fail("missing --motion-piece-ms")
} else {
  const ms = Number.parseInt(pieceMs, 10)
  if (Number.isNaN(ms) || ms < 120 || ms > 160) {
    fail(`--motion-piece-ms must be 120-160; got ${pieceMs}`)
  } else {
    ok(`--motion-piece-ms ${pieceMs} in DESIGN range`)
  }
}

const pieceEasing = cssVar("motion-piece-easing")
if (pieceEasing !== "ease-out") {
  fail(`--motion-piece-easing expected ease-out, got ${pieceEasing}`)
} else {
  ok("--motion-piece-easing ease-out")
}

const panelMs = cssVar("motion-panel-ms")
if (panelMs !== "120ms") {
  fail(`--motion-panel-ms expected 120ms, got ${panelMs}`)
} else {
  ok("--motion-panel-ms 120ms")
}

if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(css)) {
  fail("missing prefers-reduced-motion: reduce media query")
} else {
  const reduceBlock = css.match(
    /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{([\s\S]*?)\n\}/
  )
  if (!reduceBlock) {
    fail("could not parse reduced-motion block")
  } else {
    const block = reduceBlock[1]
    if (!/--motion-piece-ms\s*:\s*0ms/.test(block)) {
      fail("reduced-motion must set --motion-piece-ms: 0ms")
    } else if (!/--motion-panel-ms\s*:\s*0ms/.test(block)) {
      fail("reduced-motion must set --motion-panel-ms: 0ms")
    } else if (!/--motion-clock-pulse-hz\s*:\s*0/.test(block)) {
      fail("reduced-motion must set --motion-clock-pulse-hz: 0")
    } else {
      ok("reduced-motion zeroes piece, panel, and clock pulse")
    }
  }
}

const lastMoveOpacity = cssVar("board-last-move-opacity")
if (lastMoveOpacity !== "0.35") {
  fail(`--board-last-move-opacity expected 0.35, got ${lastMoveOpacity}`)
} else {
  ok("--board-last-move-opacity 0.35")
}

const selectedWidth = cssVar("board-selected-width")
if (selectedWidth !== "2px") {
  fail(`--board-selected-width expected 2px, got ${selectedWidth}`)
} else {
  ok("--board-selected-width 2px")
}

if (!/\[data-theme=["']light["']\]|:root/.test(css)) {
  fail("missing light theme root selectors")
}
if (!/\[data-theme=["']dark["']\]/.test(css)) {
  fail("missing [data-theme=\"dark\"] selector")
}
if (!process.exitCode) ok("light and dark theme selectors present")

const tsColor = (key) => {
  const re = new RegExp(`${key}\\s*:\\s*["'](#[0-9a-fA-F]{6})["']`)
  const m = ts.match(re)
  return m ? m[1].toLowerCase() : null
}

const tsKeyMap = {
  ink: "ink",
  slate: "slate",
  indigo: "indigo",
  mist: "mist",
  gold: "gold",
  paper: "paper",
  snow: "snow",
  inkText: "ink-text",
  danger: "danger",
  ok: "ok",
}

for (const [tsKey, cssName] of Object.entries(tsKeyMap)) {
  const expected = COLORS[cssName].toLowerCase()
  const got = tsColor(tsKey)
  if (got !== expected) {
    fail(`TS colors.${tsKey} expected ${expected}, got ${got}`)
  }
}
if (!process.exitCode) ok("TS color exports match DESIGN.md")

if (!/IBM Plex Sans/.test(ts) || !/IBM Plex Mono/.test(ts)) {
  fail("TS typography must name IBM Plex Sans and IBM Plex Mono")
} else {
  ok("TS typography names IBM Plex families")
}

if (!/pieceMs\s*:\s*1[2-5]\d/.test(ts) && !/pieceMs\s*:\s*160/.test(ts)) {
  fail("TS motion.pieceMs must be 120-160")
} else {
  ok("TS motion.pieceMs in DESIGN range")
}

if (!/pieceEasing\s*:\s*["']ease-out["']/.test(ts)) {
  fail('TS motion.pieceEasing must be "ease-out"')
} else {
  ok("TS motion.pieceEasing ease-out")
}

if (!/panelMs\s*:\s*120/.test(ts)) {
  fail("TS motion.panelMs must be 120")
} else {
  ok("TS motion.panelMs 120")
}

const tsBoardHex = {
  lightSquare: "#c5cddf",
  darkSquare: "#3a4563",
  darkThemeLightSquare: "#4a5570",
  darkThemeDarkSquare: "#1c2233",
  lastMove: "#c9a227",
  selected: "#8fa3d9",
  legal: "#8fa3d9",
  coordOnDark: "#e6e9f2",
  coordOnLight: "#2f3d63",
}
for (const [key, hex] of Object.entries(tsBoardHex)) {
  const got = tsColor(key)
  if (got !== hex.toLowerCase()) {
    fail(`TS board.${key} expected ${hex}, got ${got}`)
  }
}
if (!/lastMoveOpacity\s*:\s*0\.35/.test(ts)) {
  fail("TS board.lastMoveOpacity must be 0.35")
} else if (!/selectedWidthPx\s*:\s*2/.test(ts)) {
  fail("TS board.selectedWidthPx must be 2")
} else if (!process.exitCode) {
  ok("TS board exports match DESIGN.md")
}

if (!/reducedMotionMs\s*:\s*0/.test(ts)) {
  fail("TS motion.reducedMotionMs must be 0")
} else {
  ok("TS motion.reducedMotionMs 0")
}

if (existsSync(designPath)) {
  const design = readFileSync(designPath, "utf8")
  for (const hex of Object.values(COLORS)) {
    if (!design.toLowerCase().includes(hex.toLowerCase())) {
      fail(`DESIGN.md missing expected hex ${hex}`)
    }
  }
  if (!process.exitCode) ok("DESIGN.md still lists token hexes")
}

const forbidden =
  /\b(Stockfish|Leela|lc0|cburnett|merida|staunty|Inter|Roboto)\b/i
if (forbidden.test(css) || forbidden.test(ts)) {
  fail("forbidden third-party typeface or chess asset name in tokens")
} else {
  ok("no forbidden third-party names in tokens")
}

if (!process.exitCode) {
  console.log("All CV-113 token checks passed.")
}
