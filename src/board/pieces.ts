export type PieceColor = "w" | "b"

export type PieceKind = "k" | "q" | "r" | "b" | "n" | "p"

export type Piece = {
  color: PieceColor
  kind: PieceKind
}

export const PIECE_KINDS: readonly PieceKind[] = [
  "k",
  "q",
  "r",
  "b",
  "n",
  "p",
] as const

const KIND_TO_NAME: Record<PieceKind, string> = {
  k: "king",
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
  p: "pawn",
}

const KIND_FROM_LETTER: Record<string, PieceKind> = {
  k: "k",
  q: "q",
  r: "r",
  b: "b",
  n: "n",
  p: "p",
}

export const pieceKindName = (kind: PieceKind): string => KIND_TO_NAME[kind]

export const pieceFromFenChar = (ch: string): Piece | null => {
  const lower = ch.toLowerCase()
  const kind = KIND_FROM_LETTER[lower]
  if (!kind) return null
  return {
    color: ch === lower ? "b" : "w",
    kind,
  }
}

/** Corvid export filename (assets/pieces/corvid/). */
export const corvidFileName = (piece: Piece): string =>
  `${piece.color}-${KIND_TO_NAME[piece.kind]}.svg`

export const pieceAltText = (piece: Piece): string => {
  const color = piece.color === "w" ? "White" : "Black"
  const name = KIND_TO_NAME[piece.kind]
  return `${color} ${name[0]!.toUpperCase()}${name.slice(1)}`
}

export type PieceUrlFn = (piece: Piece) => string
