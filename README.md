<div align="center">

<a href="https://github.com/corvin-chess"><img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=0:0b0d12,55:161b2b,100:2f3d63&text=Corvin&fontColor=e6e9f2&fontSize=64&fontAlignY=45&animation=twinkling" alt="Corvin" width="100%" /></a>

<img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=500&size=16&color=8FA3D9&center=true&vCenter=true&width=560&height=34&duration=2800&pause=1200&lines=design-system;Tokens+for+color,+type,+and+motion.+Board+renderer+Planned." alt="design-system" />

<p>
  <a href="https://github.com/corvin-chess/design-system"><img src="https://skillicons.dev/icons?i=ts&theme=dark" width="44" height="44" alt="design-system" /></a>&nbsp;
  <a href="https://github.com/corvin-chess"><img src="https://skillicons.dev/icons?i=github&theme=dark" width="44" height="44" alt="GitHub" /></a>
</p>

</div>

<br/>

TypeScript package `@corvin-chess/design-system` with CSS and TS design tokens. Board and piece rendering Planned.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=OVERVIEW" alt="Overview" /></p>

`@corvin-chess/design-system` exports CSS custom properties and TypeScript constants for color, typography, and motion used by [web](https://github.com/corvin-chess/web) and other Corvin clients. Values match the product palette in the organization design notes. Visual assets (Corvid pieces, Ravenboard, IBM Plex files) come from [assets](https://github.com/corvin-chess/assets); this package does not vendor font binaries or piece SVGs. Piece sets and board art stay Corvin-original; no third-party piece sets. Board and piece rendering is Planned.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=GETTING+STARTED" alt="Getting Started" /></p>

```bash
git clone https://github.com/corvin-chess/design-system
cd design-system
```

Import tokens in a client:

```css
@import "@corvin-chess/design-system/tokens.css";
```

```ts
import { colors, motion, typography } from "@corvin-chess/design-system"
```

Self-host IBM Plex from [assets](https://github.com/corvin-chess/assets) (`fonts/ibm-plex/fonts.css`). Do not load fonts from a third-party host.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=DEVELOPMENT" alt="Development" /></p>

Edit `src/tokens.css` and `src/tokens.ts` together so CSS variables and TS exports stay aligned. After changing a hex or motion value, run the token verify script. Board renderer work belongs in a later task.

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=TESTING" alt="Testing" /></p>

```bash
node scripts/verify-tokens.mjs
node scripts/verify-readme.mjs
npm test
```

`verify-tokens.mjs` asserts CSS and TypeScript token values match the documented palette, type stacks, and motion ranges (including `prefers-reduced-motion`).

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Mono&weight=700&size=18&color=8FA3D9&center=true&vCenter=true&width=420&height=40&duration=1&pause=1000000&letterSpacing=6px&lines=ARCHITECTURE" alt="Architecture" /></p>

- `src/tokens.css` — CSS custom properties for color, Ravenboard squares, type stacks, motion, light/dark `data-theme`.
- `src/tokens.ts` — same values as typed constants for non-CSS consumers.
- `src/index.ts` — package entry re-exports.
- Board/piece React renderers Planned; they will consume these tokens and [assets](https://github.com/corvin-chess/assets).

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
| Board/piece renderer | Planned |
| Implementation | Planned |

<img src="https://capsule-render.vercel.app/api?type=rect&height=3&color=0:0b0d12,35:8fa3d9,70:c9a227,100:0b0d12" width="100%" alt="" />

<br/>

<p align="center"><sub><i>Shared tokens keep every board the same board, wherever it appears.</i></sub></p>

## License

This repository is licensed under AGPL-3.0-or-later.

<img src="https://capsule-render.vercel.app/api?type=waving&section=footer&height=110&color=0:0b0d12,55:161b2b,100:2f3d63" alt="" width="100%" />
