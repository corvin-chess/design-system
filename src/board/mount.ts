import { parseFenPlacement } from "./fen.ts"
import type { BoardOrientation, FocusKey } from "./keyboard.ts"
import { moveFocusSquare } from "./keyboard.ts"
import type { PieceUrlFn } from "./pieces.ts"
import { renderBoardHtml } from "./render.ts"
import { algebraicToSquare, squareToAlgebraic } from "./squares.ts"

export type MountBoardOptions = {
  fen: string
  orientation?: BoardOrientation
  pieceUrl: PieceUrlFn
  showCoordinates?: boolean
  /** Initial focus square (default e2 for white, e7 for black). */
  focusSquare?: number
  onSelect?: (square: number, algebraic: string) => void
  onFocusChange?: (square: number, algebraic: string) => void
}

export type BoardHandle = {
  element: HTMLElement
  setFen: (fen: string) => void
  getFen: () => string
  getFocusSquare: () => number
  getSelectedSquare: () => number | null
  setOrientation: (orientation: BoardOrientation) => void
  destroy: () => void
}

const isFocusKey = (key: string): key is FocusKey =>
  key === "ArrowUp" ||
  key === "ArrowDown" ||
  key === "ArrowLeft" ||
  key === "ArrowRight"

const defaultFocus = (orientation: BoardOrientation): number =>
  orientation === "white" ? algebraicToSquare("e2") : algebraicToSquare("e7")

/**
 * Mount an interactive board: Tab focuses the grid, arrows move the focus
 * square, Enter/Space toggle selection (keyboard nav stub — no move apply).
 */
export const mountBoard = (
  container: HTMLElement,
  options: MountBoardOptions
): BoardHandle => {
  const root = container.ownerDocument.createElement("div")
  root.className = "corvin-board-host"
  container.appendChild(root)

  let fen = options.fen
  let orientation: BoardOrientation = options.orientation ?? "white"
  let focusSquare = options.focusSquare ?? defaultFocus(orientation)
  let selectedSquare: number | null = null
  // Validate FEN early
  parseFenPlacement(fen)

  const paint = (): HTMLElement | null => {
    root.innerHTML = renderBoardHtml({
      fen,
      orientation,
      pieceUrl: options.pieceUrl,
      showCoordinates: options.showCoordinates,
      focusSquare,
      selectedSquare,
    })
    const board = root.querySelector<HTMLElement>(".corvin-board")
    if (!board) return null
    board.tabIndex = 0
    const focusId = `corvin-sq-${squareToAlgebraic(focusSquare)}`
    board.setAttribute("aria-activedescendant", focusId)
    return board
  }

  const emitFocus = () => {
    options.onFocusChange?.(focusSquare, squareToAlgebraic(focusSquare))
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const board = root.querySelector<HTMLElement>(".corvin-board")
    if (!board || event.target !== board) return

    if (isFocusKey(event.key)) {
      event.preventDefault()
      const next = moveFocusSquare(focusSquare, event.key, orientation)
      if (next !== focusSquare) {
        focusSquare = next
        // Re-query after paint: innerHTML replaces the previous board node.
        paint()?.focus()
        emitFocus()
      }
      return
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      selectedSquare =
        selectedSquare === focusSquare ? null : focusSquare
      paint()?.focus()
      options.onSelect?.(focusSquare, squareToAlgebraic(focusSquare))
    }
  }

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null
    const cell = target?.closest?.("[data-index]") as HTMLElement | null
    if (!cell) return
    const index = Number(cell.dataset.index)
    if (!Number.isInteger(index) || index < 0 || index > 63) return
    focusSquare = index
    selectedSquare = index
    paint()?.focus()
    emitFocus()
    options.onSelect?.(focusSquare, squareToAlgebraic(focusSquare))
  }

  paint()
  root.addEventListener("keydown", handleKeyDown)
  root.addEventListener("click", handleClick)

  return {
    element: root,
    setFen: (nextFen: string) => {
      parseFenPlacement(nextFen)
      fen = nextFen
      selectedSquare = null
      paint()
    },
    getFen: () => fen,
    getFocusSquare: () => focusSquare,
    getSelectedSquare: () => selectedSquare,
    setOrientation: (next) => {
      orientation = next
      if (options.focusSquare === undefined) {
        focusSquare = defaultFocus(orientation)
      }
      paint()
    },
    destroy: () => {
      root.removeEventListener("keydown", handleKeyDown)
      root.removeEventListener("click", handleClick)
      root.remove()
    },
  }
}
