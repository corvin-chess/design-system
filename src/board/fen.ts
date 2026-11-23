import { pieceFromFenChar, type Piece } from "./pieces.ts"

export class FenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FenError"
  }
}

/**
 * Parse the placement field (or a full FEN) into 64 squares, a1..h8.
 * Does not validate legality — rendering only.
 */
export const parseFenPlacement = (fen: string): (Piece | null)[] => {
  if (typeof fen !== "string" || fen.trim() === "") {
    throw new FenError("empty FEN")
  }
  const placement = fen.trim().split(/\s+/)[0]!
  const ranks = placement.split("/")
  if (ranks.length !== 8) {
    throw new FenError(`expected 8 ranks, got ${ranks.length}`)
  }

  const board: (Piece | null)[] = Array.from({ length: 64 }, () => null)

  for (let fenRank = 0; fenRank < 8; fenRank++) {
    const row = ranks[fenRank]!
    let file = 0
    for (let i = 0; i < row.length; i++) {
      const ch = row[i]!
      if (ch >= "1" && ch <= "8") {
        file += Number(ch)
        if (file > 8) {
          throw new FenError(`rank overflow in rank ${8 - fenRank}`)
        }
        continue
      }
      const piece = pieceFromFenChar(ch)
      if (!piece) {
        throw new FenError(`invalid piece character '${ch}'`)
      }
      if (file >= 8) {
        throw new FenError(`rank overflow in rank ${8 - fenRank}`)
      }
      // FEN rank 0 is rank 8 on the board
      const square = (7 - fenRank) * 8 + file
      board[square] = piece
      file += 1
    }
    if (file !== 8) {
      throw new FenError(`rank underflow in rank ${8 - fenRank}`)
    }
  }

  return board
}
