#!/usr/bin/env node
/**
 * CV-114: board FEN parse, piece map, keyboard focus stub, HTML render.
 * Runs with: node --experimental-strip-types scripts/verify-board.mjs
 */
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")
const boardDir = join(repoRoot, "src", "board")

const fail = (msg) => {
  console.error(`FAIL: ${msg}`)
  process.exitCode = 1
}

const ok = (msg) => console.log(`OK: ${msg}`)

const assert = (cond, msg) => {
  if (!cond) fail(msg)
}

const requiredFiles = [
  "fen.ts",
  "squares.ts",
  "pieces.ts",
  "keyboard.ts",
  "render.ts",
  "mount.ts",
  "board.css",
  "index.ts",
]

for (const name of requiredFiles) {
  const p = join(boardDir, name)
  if (!existsSync(p)) {
    fail(`missing src/board/${name}`)
  }
}
if (!process.exitCode) ok("board source files present")

if (process.exitCode) {
  console.error("Board sources missing; aborting import tests.")
  process.exit(1)
}

const importTs = async (rel) => {
  const url = pathToFileURL(join(boardDir, rel)).href
  return import(url)
}

const { parseFenPlacement, FenError } = await importTs("fen.ts")
const { algebraicToSquare, squareToAlgebraic, fileOf, rankOf, isDarkSquare } =
  await importTs("squares.ts")
const { corvidFileName, PIECE_KINDS } = await importTs("pieces.ts")
const { moveFocusSquare } = await importTs("keyboard.ts")
const { renderBoardHtml } = await importTs("render.ts")

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

// --- squares ---
assert(algebraicToSquare("a1") === 0, "a1 index 0")
assert(algebraicToSquare("h1") === 7, "h1 index 7")
assert(algebraicToSquare("a8") === 56, "a8 index 56")
assert(algebraicToSquare("h8") === 63, "h8 index 63")
assert(squareToAlgebraic(0) === "a1", "0 -> a1")
assert(squareToAlgebraic(63) === "h8", "63 -> h8")
assert(fileOf(0) === 0 && rankOf(0) === 0, "a1 file/rank")
assert(isDarkSquare(0) === true, "a1 is dark")
assert(isDarkSquare(1) === false, "b1 is light")
try {
  algebraicToSquare("i1")
  fail("i1 must throw")
} catch {
  ok("algebraic rejects i1")
}

// --- FEN placement ---
const start = parseFenPlacement(START_FEN)
assert(start.length === 64, "startpos 64 squares")
assert(start[algebraicToSquare("a1")]?.kind === "r" && start[0].color === "w", "a1 white rook")
assert(start[algebraicToSquare("e1")]?.kind === "k" && start[algebraicToSquare("e1")].color === "w", "e1 white king")
assert(start[algebraicToSquare("e8")]?.kind === "k" && start[algebraicToSquare("e8")].color === "b", "e8 black king")
assert(start[algebraicToSquare("a2")]?.kind === "p" && start[algebraicToSquare("a2")].color === "w", "a2 white pawn")
assert(start[algebraicToSquare("a3")] === null, "a3 empty")

const afterE4 = parseFenPlacement(
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
)
assert(afterE4[algebraicToSquare("e4")]?.kind === "p", "e4 pawn after 1.e4")
assert(afterE4[algebraicToSquare("e2")] === null, "e2 empty after 1.e4")

const reject = (fen, label) => {
  try {
    parseFenPlacement(fen)
    fail(`expected reject: ${label}`)
  } catch (err) {
    assert(err instanceof FenError || err?.name === "FenError", `FenError for ${label}`)
  }
}
reject("", "empty")
reject("8/8/8/8/8/8/8 w KQkq - 0 1", "7 ranks")
reject("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/8 w KQkq - 0 1", "9 ranks")
reject("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNx w KQkq - 0 1", "bad piece")
reject("9/8/8/8/8/8/8/8 w - - 0 1", "rank overflow")
reject("rnbqkbnr/pppppppp/7/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1", "rank underflow")
ok("FEN reject cases")

// --- pieces ---
assert(PIECE_KINDS.length === 6, "six piece kinds")
assert(corvidFileName({ color: "w", kind: "k" }) === "w-king.svg", "w-king.svg")
assert(corvidFileName({ color: "b", kind: "n" }) === "b-knight.svg", "b-knight.svg")
assert(corvidFileName({ color: "w", kind: "p" }) === "w-pawn.svg", "w-pawn.svg")
assert(corvidFileName({ color: "b", kind: "q" }) === "b-queen.svg", "b-queen.svg")
ok("corvid file names")

// --- keyboard stub ---
// White orientation: ArrowRight from a1 -> b1; ArrowUp -> a2
assert(moveFocusSquare(0, "ArrowRight", "white") === 1, "white ArrowRight a1->b1")
assert(moveFocusSquare(0, "ArrowUp", "white") === 8, "white ArrowUp a1->a2")
assert(moveFocusSquare(0, "ArrowLeft", "white") === 0, "white ArrowLeft clamps a1")
assert(moveFocusSquare(0, "ArrowDown", "white") === 0, "white ArrowDown clamps a1")
assert(moveFocusSquare(63, "ArrowRight", "white") === 63, "white clamp h8 right")
assert(moveFocusSquare(63, "ArrowUp", "white") === 63, "white clamp h8 up")
// Black orientation flips screen axes: ArrowRight from a1 moves toward file a visually = h from white's a1? 
// Focus is still on board squares; arrows follow screen. From black's view, a1 is top-right.
// Screen right increases visual file toward h from white = toward a from black's left...
// Convention: arrows move on the visual grid. With black orientation, visual (0,0) top-left is h1.
assert(moveFocusSquare(0, "ArrowRight", "black") === 0, "black orient: a1 visual right stays (edge)")
assert(moveFocusSquare(0, "ArrowLeft", "black") === 1, "black orient: a1 visual left -> b1")
assert(moveFocusSquare(0, "ArrowDown", "black") === 8, "black orient: a1 visual down -> a2")
assert(moveFocusSquare(0, "ArrowUp", "black") === 0, "black orient: a1 visual up clamps")
ok("keyboard focus transitions")

// --- HTML render ---
const html = renderBoardHtml({
  fen: START_FEN,
  orientation: "white",
  pieceUrl: (piece) => `pieces/${corvidFileName(piece)}`,
  showCoordinates: true,
})
assert(/role="grid"/.test(html), "grid role")
assert(/aria-label="Chess board"/.test(html), "board aria-label")
assert((html.match(/role="gridcell"/g) || []).length === 64, "64 gridcells")
assert(/data-square="e1"/.test(html), "e1 cell")
assert(/alt="White King"/.test(html), "white king alt")
assert(/alt="Black Knight"/.test(html), "black knight alt")
assert(/src="pieces\/w-king\.svg"/.test(html), "w-king src")
assert(/src="pieces\/b-rook\.svg"/.test(html), "b-rook src")
assert(/corvin-board/.test(html), "corvin-board class")
assert(/>a</.test(html) || /data-file="a"/.test(html) || />a</.test(html), "file coord a present")
ok("renderBoardHtml startpos")

const emptyHtml = renderBoardHtml({
  fen: "8/8/8/8/8/8/8/8 w - - 0 1",
  orientation: "white",
  pieceUrl: (piece) => corvidFileName(piece),
})
assert(!(/alt="White/.test(emptyHtml) || /alt="Black/.test(emptyHtml)), "empty board no pieces")
ok("renderBoardHtml empty")

// CSS must use token vars, not hard-coded competitor assets
const css = readFileSync(join(boardDir, "board.css"), "utf8")
assert(/--board-sq-light/.test(css), "board.css uses --board-sq-light")
assert(/--board-sq-dark/.test(css), "board.css uses --board-sq-dark")
assert(/--board-selected/.test(css), "board.css selected token")
assert(/--focus-ring|--mist|outline/.test(css), "focus ring styling")
assert(!/Stockfish|cburnett|merida|lichess/i.test(css), "no third-party piece refs in css")
ok("board.css token usage")

const mountSrc = readFileSync(join(boardDir, "mount.ts"), "utf8")
assert(/ArrowUp|ArrowDown|ArrowLeft|ArrowRight/.test(mountSrc), "mount handles arrows")
assert(/Enter| |Space|["'] ["']/.test(mountSrc) && /keydown/.test(mountSrc), "mount keydown")
assert(/tabIndex|tabindex/.test(mountSrc), "mount sets tabindex")
assert(/aria-activedescendant|focus/.test(mountSrc), "focus management present")
assert(
  /paint\(\)\?\.focus\(\)/.test(mountSrc) ||
    /paint\(\)[\s\S]{0,80}querySelector[\s\S]{0,40}\.focus\(/.test(mountSrc),
  "mount re-focuses board after paint (no stale node)"
)
ok("mount keyboard stub present in source")

const renderSrc = readFileSync(join(boardDir, "render.ts"), "utf8")
assert(/escapeAttr\(className\)/.test(renderSrc), "className escaped in HTML")
assert(
  /orientation === "black" \? "black" : "white"/.test(renderSrc),
  "orientation whitelisted"
)
ok("render HTML escaping hardened")

const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u
for (const name of requiredFiles) {
  const text = readFileSync(join(boardDir, name), "utf8")
  if (emojiRe.test(text)) fail(`emoji in src/board/${name}`)
}
if (!process.exitCode) ok("no emoji in board sources")

if (!process.exitCode) {
  console.log("All CV-114 board checks passed.")
}
