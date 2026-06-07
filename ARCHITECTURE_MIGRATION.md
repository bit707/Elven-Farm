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
- `src/core/quests/quest-runtime.ts` moves quest step progress, quest state checks, story quest start/done checks, quest reward claiming, configured event trigger readiness/ready-queue scanning/action classification/execute-group resolution/execution planning, side-quest route/action readiness, and side-quest clue visibility into TypeScript.
- `src/core/shop/shop-runtime.ts` moves shop customer price rules, customer profiles, reputation score, merged customer preference views, budget calculation, shelf theme matching, semantic tag matching, hot-tag prioritization, compendium display customer support, weather shelf customer support and choice weighting, customer good selection, sales statistics deltas, shop season cycle rules, shop season metric formulas/scoring helpers/rules-to-score plans, shop season settlement/reward claim plans, shop season rewards/ranks, feedback diagnosis matching, word-of-mouth customer boosts, item pricing plans, customer purchase decisions, and sale price settlement into TypeScript.
- `src/core/farming/farming-runtime.ts` moves crop target lookup, solar-term crop affinity, yield bonus, projected harvest previews, harvest yield planning, harvest quality scoring, crop growth visual specs, and night crop growth planning into TypeScript.
- `src/core/combat/dungeon-runtime.ts` moves dungeon boss skill ordering/turn selection, boss phase thresholds, boss skill pressure, spirit combat skill fallback/bonus, boss HP percentage/max-HP calculations, dungeon solar-mechanic effect rules, exploration encounter damage planning, and Boss exchange damage/shield/strike planning into TypeScript.
- `tools/build-runtime-data.mjs` converts gameplay CSV tables into `runtime-data/runtime-data.json`.
- `src/runtime/xiannong-core.js` is the generated TypeScript runtime loaded before `src/game.js`.
- `desktop-shell/main.mjs`, `desktop-shell/preload.cjs`, and `desktop-shell/json-save-core.mjs` expose `XiannongStorage`, writing the main profile to `Electron userData/saves/profile_1.json`; `tools/smoke-desktop-json-save.mjs` verifies write/read/path-safety behavior without requiring Electron.

## Next Migration Targets

- Quests: continue moving configured event execution side effects and side-quest route execution side effects into TypeScript.
- Shop: continue moving sale stats, customer decision rules, and shop-opening story gates into TypeScript.
- Farming: continue moving plot state, crop growth, weather effects, and harvest accounting into TypeScript.
- NPC: move favor rewards, schedules, relationship memory, and dialogue gates into TypeScript.
- Combat: continue moving dungeon enemy/boss state mutation, loot resolution, mechanic state progression, and battle outcome application into TypeScript.
