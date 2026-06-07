# Architecture Migration Route

This project keeps the current Web Canvas game instead of switching to Unity or Unreal. The existing JavaScript logic, CSV data, UI, QA scripts, and packaging tools remain the commercial-production base while we migrate core systems gradually.

## Current Direction

- Keep rendering on Canvas for now. Upgrade specific visual systems to PixiJS/WebGL later only if animation, particles, or map scale require it.
- Move core systems from JavaScript into TypeScript step by step under `src/core/**/*.ts`.
- Keep CSV as the design-time format. Build `csv/*.csv` into `runtime-data/runtime-data.json` before running or packaging.
- Keep browser `localStorage` compatibility during development. Use Electron/Tauri-style local JSON files for the commercial desktop profile, then hand that payload to Steam Cloud later.

## Implemented In This Iteration

- `src/core/data/runtime-data.ts` defines a typed runtime data loader.
- `src/core/persistence/save-runtime.ts` defines a typed save adapter for browser storage and desktop JSON save bridges.
- `src/core/quests/quest-runtime.ts` moves quest step progress, quest state checks, story quest start/done checks, quest reward claiming, configured event trigger readiness, side-quest route/action readiness, and side-quest clue visibility into TypeScript.
- `tools/build-runtime-data.mjs` converts gameplay CSV tables into `runtime-data/runtime-data.json`.
- `src/runtime/xiannong-core.js` is the generated TypeScript runtime loaded before `src/game.js`.
- `desktop-shell/main.mjs` and `desktop-shell/preload.cjs` expose `XiannongStorage`, writing the main profile to `Electron userData/saves/profile_1.json`.

## Next Migration Targets

- Quests: continue moving configured event execution side effects and side-quest route execution side effects into TypeScript.
- Shop: move sale stats, customer decision rules, and shop-opening story gates into TypeScript.
- Farming: move plot state, crop growth, weather effects, and harvest accounting into TypeScript.
- NPC: move favor rewards, schedules, relationship memory, and dialogue gates into TypeScript.
- Combat: move dungeon enemy/boss state, loot, and spirit skill calculations into TypeScript.
