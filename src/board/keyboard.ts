import { fileOf, rankOf } from "./squares.ts"

export type BoardOrientation = "white" | "black"

export type FocusKey =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"

/**
 * Move focus on the visual grid. White: rank up = ArrowUp.
 * Black: board is flipped, so visual arrows invert both axes.
 */
export const moveFocusSquare = (
  from: number,
  key: FocusKey,
  orientation: BoardOrientation
): number => {
  if (!Number.isInteger(from) || from < 0 || from > 63) {
    return 0
  }

  let file = fileOf(from)
  let rank = rankOf(from)

  const flip = orientation === "black"
  switch (key) {
    case "ArrowRight":
      file += flip ? -1 : 1
      break
    case "ArrowLeft":
      file += flip ? 1 : -1
      break
    case "ArrowUp":
      rank += flip ? -1 : 1
      break
    case "ArrowDown":
      rank += flip ? 1 : -1
      break
    default:
      return from
  }

  if (file < 0 || file > 7 || rank < 0 || rank > 7) {
    return from
  }
  return rank * 8 + file
}
