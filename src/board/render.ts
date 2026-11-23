import { parseFenPlacement } from "./fen.ts"
import {
  pieceAltText,
  type Piece,
  type PieceUrlFn,
} from "./pieces.ts"
import {
  FILES,
  RANKS,
  isDarkSquare,
  squareToAlgebraic,
} from "./squares.ts"
import type { BoardOrientation } from "./keyboard.ts"

export type RenderBoardOptions = {
  fen: string
  orientation?: BoardOrientation
  pieceUrl: PieceUrlFn
  showCoordinates?: boolean
  focusSquare?: number
  selectedSquare?: number | null
  lastMoveSquares?: readonly [number, number] | null
  className?: string
}

/** Visual row/col 0..7 (0,0 = top-left on screen). */
const visualToSquare = (
  row: number,
  col: number,
  orientation: BoardOrientation
): number => {
  if (orientation === "white") {
    const file = col
    const rank = 7 - row
    return rank * 8 + file
  }
  const file = 7 - col
  const rank = row
  return rank * 8 + file
}

const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const squareClasses = (
  square: number,
  opts: {
    focusSquare?: number
    selectedSquare?: number | null
    lastMoveSquares?: readonly [number, number] | null
  }
): string => {
  const parts = ["corvin-sq"]
  parts.push(isDarkSquare(square) ? "corvin-sq--dark" : "corvin-sq--light")
  if (opts.focusSquare === square) parts.push("corvin-sq--focus")
  if (opts.selectedSquare === square) parts.push("corvin-sq--selected")
  if (
    opts.lastMoveSquares &&
    (opts.lastMoveSquares[0] === square || opts.lastMoveSquares[1] === square)
  ) {
    parts.push("corvin-sq--last-move")
  }
  return parts.join(" ")
}

const coordLabels = (
  row: number,
  col: number,
  orientation: BoardOrientation,
  square: number
): string => {
  let html = ""
  const showFile = row === 7
  const showRank = col === 0
  if (!showFile && !showRank) return html
  const file =
    orientation === "white" ? FILES[col]! : FILES[7 - col]!
  const rank =
    orientation === "white" ? RANKS[7 - row]! : RANKS[row]!
  const onDark = isDarkSquare(square)
  const tone = onDark ? "corvin-coord--on-dark" : "corvin-coord--on-light"
  if (showFile) {
    html += `<span class="corvin-coord corvin-coord--file ${tone}" data-file="${file}" aria-hidden="true">${file}</span>`
  }
  if (showRank) {
    html += `<span class="corvin-coord corvin-coord--rank ${tone}" data-rank="${rank}" aria-hidden="true">${rank}</span>`
  }
  return html
}

const pieceImg = (piece: Piece, pieceUrl: PieceUrlFn): string => {
  const src = escapeAttr(pieceUrl(piece))
  const alt = escapeAttr(pieceAltText(piece))
  return `<img class="corvin-piece" src="${src}" alt="${alt}" draggable="false" width="45" height="45" />`
}

/**
 * Static HTML for a Ravenboard + Corvid position. Used by tests and SSR-style mounts.
 */
export const renderBoardHtml = (options: RenderBoardOptions): string => {
  const orientation =
    options.orientation === "black" ? "black" : "white"
  const squares = parseFenPlacement(options.fen)
  const showCoordinates = options.showCoordinates ?? true
  const extraClass = options.className
    ? escapeAttr(options.className.replace(/[^a-zA-Z0-9_\-\s]/g, ""))
    : ""
  const className = ["corvin-board", extraClass].filter(Boolean).join(" ")

  let cells = ""
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = visualToSquare(row, col, orientation)
      const alg = squareToAlgebraic(square)
      const piece = squares[square]
      const classes = squareClasses(square, options)
      const id = `corvin-sq-${alg}`
      const coords = showCoordinates
        ? coordLabels(row, col, orientation, square)
        : ""
      const content = piece ? pieceImg(piece, options.pieceUrl) : ""
      cells += `<div role="gridcell" id="${id}" class="${classes}" data-square="${alg}" data-index="${square}" aria-label="${alg}">${coords}${content}</div>`
    }
  }

  return `<div class="${escapeAttr(className)}" role="grid" aria-label="Chess board" aria-rowcount="8" aria-colcount="8" data-orientation="${orientation}">${cells}</div>`
}

export { visualToSquare }
