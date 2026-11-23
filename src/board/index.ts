export { FenError, parseFenPlacement } from "./fen.ts"
export {
  moveFocusSquare,
  type BoardOrientation,
  type FocusKey,
} from "./keyboard.ts"
export {
  PIECE_KINDS,
  corvidFileName,
  pieceAltText,
  pieceFromFenChar,
  pieceKindName,
  type Piece,
  type PieceColor,
  type PieceKind,
  type PieceUrlFn,
} from "./pieces.ts"
export { renderBoardHtml, visualToSquare, type RenderBoardOptions } from "./render.ts"
export {
  FILES,
  RANKS,
  algebraicToSquare,
  fileOf,
  isDarkSquare,
  isLightSquare,
  rankOf,
  squareToAlgebraic,
} from "./squares.ts"
export { mountBoard, type BoardHandle, type MountBoardOptions } from "./mount.ts"
