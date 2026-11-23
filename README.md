<div align="center">

<a href="https://github.com/corvin-chess"><img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=0:0b0d12,55:161b2b,100:2f3d63&text=Corvin&fontColor=e6e9f2&fontSize=64&fontAlignY=45&animation=twinkling" alt="Corvin" width="100%" /></a>

<img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=500&size=16&color=8FA3D9&center=true&vCenter=true&width=560&height=34&duration=2800&pause=1200&lines=design-system;Tokens+and+Ravenboard+%2F+Corvid+board+renderer." alt="design-system" />

<p>
  <a href="https://github.com/corvin-chess/design-system"><img src="https://skillicons.dev/icons?i=ts&theme=dark" width="44" height="44" alt="design-system" /></a>&nbsp;
  <a href="https://github.com/corvin-chess"><img src="https://skillicons.dev/icons?i=github&theme=dark" width="44" height="44" alt="GitHub" /></a>
</p>

</div>

<br/>

TypeScript package `@corvin-chess/design-system` with CSS/TS design tokens and a framework-agnostic Ravenboard + Corvid board renderer (FEN + keyboard focus stub).

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=OVERVIEW" alt="Overview" /></p>

`@corvin-chess/design-system` exports CSS custom properties and TypeScript constants for color, typography, and motion used by [web](https://github.com/corvin-chess/web) and other Corvin clients. Values match the product palette in the organization design notes. It also exports a board module that renders a FEN placement on Ravenboard with Corvid piece URLs supplied by the caller (piece SVGs stay in [assets](https://github.com/corvin-chess/assets); this package does not vendor them). Keyboard navigation is a stub: Tab enters the grid, arrows move the focused square, Enter/Space toggles selection. Move legality stays in [chess-core](https://github.com/corvin-chess/chess-core). Piece sets and board art stay Corvin-original; no third-party piece sets.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=GETTING+STARTED" alt="Getting Started" /></p>

```bash
git clone https://github.com/corvin-chess/design-system
cd design-system
```

Import tokens and board styles in a client:

```css
@import "@corvin-chess/design-system/tokens.css";
@import "@corvin-chess/design-system/board.css";
```

```ts
import {
  colors,
  motion,
  typography,
  mountBoard,
  corvidFileName,
} from "@corvin-chess/design-system"

mountBoard(container, {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  pieceUrl: (piece) => `/pieces/corvid/${corvidFileName(piece)}`,
})
```

Self-host IBM Plex and Corvid SVGs from [assets](https://github.com/corvin-chess/assets). Do not load fonts or pieces from a third-party host.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=DEVELOPMENT" alt="Development" /></p>

Edit `src/tokens.css` and `src/tokens.ts` together so CSS variables and TS exports stay aligned. Board rendering lives under `src/board/` (`parseFenPlacement`, `renderBoardHtml`, `mountBoard`). After changing tokens or board behavior, run the verify scripts. Local preview: `node --experimental-strip-types scripts/write-board-preview.mjs` then open `src/board-preview.html` (pieces resolve via the sibling [assets](https://github.com/corvin-chess/assets) checkout).

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=TESTING" alt="Testing" /></p>

```bash
node scripts/verify-tokens.mjs
node --experimental-strip-types scripts/verify-board.mjs
node scripts/verify-readme.mjs
npm test
```

`verify-tokens.mjs` asserts CSS and TypeScript token values match the documented palette, type stacks, and motion ranges (including `prefers-reduced-motion`). `verify-board.mjs` asserts FEN placement parsing, Corvid filenames, keyboard focus transitions, and HTML render output for startpos.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=ARCHITECTURE" alt="Architecture" /></p>

- `src/tokens.css` — CSS custom properties for color, Ravenboard squares, type stacks, motion, light/dark `data-theme`.
- `src/tokens.ts` — same values as typed constants for non-CSS consumers.
- `src/board/` — FEN placement parse, square math, Corvid URL helpers, HTML render, DOM `mountBoard` with keyboard focus stub; `board.css` uses token variables.
- `src/index.ts` — package entry re-exports tokens and board APIs.
- React wrappers and full legal-move play UX stay in [web](https://github.com/corvin-chess/web); this package stays framework-agnostic.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=STATUS" alt="Status" /></p>

| Area | State |
|---|---|
| README | Built |
| LICENSE | Built |
| CI verify gate | Built |
| Package scaffold | Built |
| Tokens | Built |
| Board/piece renderer | Built |
| Implementation | Planned |

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><sub><i>Shared tokens keep every board the same board, wherever it appears.</i></sub></p>

## License

This repository is licensed under AGPL-3.0-or-later.

<img src="https://capsule-render.vercel.app/api?type=waving&section=footer&height=110&color=0:0b0d12,55:161b2b,100:2f3d63" alt="" width="100%" />
