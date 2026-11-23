#!/usr/bin/env node
/**
 * CV-114: write src/board-preview.html with startpos Ravenboard + Corvid pieces.
 */
import { writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")
const boardDir = join(repoRoot, "src", "board")

const { corvidFileName } = await import(
  pathToFileURL(join(boardDir, "pieces.ts")).href
)
const { renderBoardHtml } = await import(
  pathToFileURL(join(boardDir, "render.ts")).href
)
const { algebraicToSquare } = await import(
  pathToFileURL(join(boardDir, "squares.ts")).href
)

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const pieceBase = "../../assets/pieces/corvid"

const boardHtml = renderBoardHtml({
  fen: START,
  orientation: "white",
  pieceUrl: (piece) => `${pieceBase}/${corvidFileName(piece)}`,
  showCoordinates: true,
  focusSquare: algebraicToSquare("e2"),
})

const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Corvin board preview</title>
    <link rel="stylesheet" href="./tokens.css" />
    <link rel="stylesheet" href="./board/board.css" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: var(--font-ui);
        background: var(--ground);
        color: var(--body);
      }
      main {
        max-width: 36rem;
        margin: 0 auto;
        padding: 1.25rem;
      }
      h1 {
        font-family: var(--font-display);
        font-weight: 600;
        letter-spacing: -0.02em;
        margin: 0 0 0.5rem;
      }
      p { margin: 0 0 1rem; line-height: 1.45; }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      button {
        font-family: var(--font-ui);
        font-size: 0.95rem;
        padding: 0.45rem 0.85rem;
        border: 2px solid var(--indigo);
        background: var(--panel);
        color: var(--body);
        cursor: pointer;
      }
      button:focus-visible {
        outline: 2px solid var(--focus-ring);
        outline-offset: 2px;
      }
      #host .corvin-board {
        --corvin-board-size: min(100%, 28rem);
      }
      .live {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        min-height: 1.25rem;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Corvin board</h1>
      <p>Ravenboard + Corvid from FEN. Tab into the board; arrows move focus; Enter or Space selects.</p>
      <div class="toolbar">
        <button type="button" id="theme-light" aria-label="Switch to light theme">Light</button>
        <button type="button" id="theme-dark" aria-label="Switch to dark theme">Dark</button>
      </div>
      <div id="host">${boardHtml}</div>
      <p class="live" id="status" aria-live="polite">Focus e2</p>
    </main>
    <script>
      const FILES = "abcdefgh"
      const RANKS = "12345678"
      const fileOf = (s) => s & 7
      const rankOf = (s) => s >> 3
      const squareToAlgebraic = (square) => FILES[fileOf(square)] + RANKS[rankOf(square)]
      const algebraicToSquare = (algebraic) => {
        const file = FILES.indexOf(algebraic[0])
        const rank = RANKS.indexOf(algebraic[1])
        return rank * 8 + file
      }
      const moveFocusSquare = (from, key, orientation) => {
        let file = fileOf(from)
        let rank = rankOf(from)
        const flip = orientation === "black"
        if (key === "ArrowRight") file += flip ? -1 : 1
        else if (key === "ArrowLeft") file += flip ? 1 : -1
        else if (key === "ArrowUp") rank += flip ? -1 : 1
        else if (key === "ArrowDown") rank += flip ? 1 : -1
        if (file < 0 || file > 7 || rank < 0 || rank > 7) return from
        return rank * 8 + file
      }

      const root = document.documentElement
      const host = document.getElementById("host")
      const status = document.getElementById("status")
      const orientation = "white"
      let focusSquare = algebraicToSquare("e2")
      let selectedSquare = null

      const boardEl = () => host.querySelector(".corvin-board")

      const syncFocusClass = () => {
        const board = boardEl()
        if (!board) return
        board.tabIndex = 0
        for (const cell of board.querySelectorAll(".corvin-sq")) {
          cell.classList.remove("corvin-sq--focus", "corvin-sq--selected")
          const idx = Number(cell.dataset.index)
          if (idx === focusSquare) cell.classList.add("corvin-sq--focus")
          if (selectedSquare !== null && idx === selectedSquare) {
            cell.classList.add("corvin-sq--selected")
          }
        }
        board.setAttribute(
          "aria-activedescendant",
          "corvin-sq-" + squareToAlgebraic(focusSquare)
        )
        status.textContent =
          "Focus " +
          squareToAlgebraic(focusSquare) +
          (selectedSquare !== null
            ? "; selected " + squareToAlgebraic(selectedSquare)
            : "")
      }

      document.getElementById("theme-light").addEventListener("click", () => {
        root.setAttribute("data-theme", "light")
      })
      document.getElementById("theme-dark").addEventListener("click", () => {
        root.setAttribute("data-theme", "dark")
      })

      host.addEventListener("keydown", (event) => {
        const board = boardEl()
        if (!board || event.target !== board) return
        const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
        if (keys.includes(event.key)) {
          event.preventDefault()
          focusSquare = moveFocusSquare(focusSquare, event.key, orientation)
          syncFocusClass()
          return
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          selectedSquare =
            selectedSquare === focusSquare ? null : focusSquare
          syncFocusClass()
        }
      })

      host.addEventListener("click", (event) => {
        const cell = event.target.closest && event.target.closest("[data-index]")
        if (!cell) return
        focusSquare = Number(cell.dataset.index)
        selectedSquare = focusSquare
        syncFocusClass()
        boardEl().focus()
      })

      syncFocusClass()
    </script>
  </body>
</html>
`

writeFileSync(join(repoRoot, "src", "board-preview.html"), html, "utf8")
console.log("Wrote src/board-preview.html")
