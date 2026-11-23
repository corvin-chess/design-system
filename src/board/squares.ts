/**
 * Square indexing: a1 = 0 … h1 = 7, a8 = 56 … h8 = 63.
 */

export const FILES = "abcdefgh" as const
export const RANKS = "12345678" as const

export const algebraicToSquare = (algebraic: string): number => {
  if (algebraic.length !== 2) {
    throw new RangeError(`invalid square: ${algebraic}`)
  }
  const file = FILES.indexOf(algebraic[0]!.toLowerCase())
  const rank = RANKS.indexOf(algebraic[1]!)
  if (file < 0 || rank < 0) {
    throw new RangeError(`invalid square: ${algebraic}`)
  }
  return rank * 8 + file
}

export const squareToAlgebraic = (square: number): string => {
  if (!Number.isInteger(square) || square < 0 || square > 63) {
    throw new RangeError(`square out of range: ${square}`)
  }
  return `${FILES[fileOf(square)]}${RANKS[rankOf(square)]}`
}

export const fileOf = (square: number): number => square & 7

export const rankOf = (square: number): number => square >> 3

/** a1 is dark on a standard chessboard. */
export const isDarkSquare = (square: number): boolean =>
  ((fileOf(square) + rankOf(square)) & 1) === 0

export const isLightSquare = (square: number): boolean => !isDarkSquare(square)
