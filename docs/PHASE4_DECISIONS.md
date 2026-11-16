# Phase 4 Design Decisions — Character Types, Powers & Pets

## Overview
Phase 4 expands Princess Play Time with magical **Character Types**, interactive **Powers**, and customizable **Pet Companions** that appear in both the Studio and the Ballroom.

## 1. Character Types (`characterTypeId`)
Players can transform their character into five distinct types:
- `princess` — Classic royal princess (standard gown/shoes).
- `mermaid` — Shimmering mermaid tail with iridescent scales and fin, replacing the lower skirt/shoes.
- `fairy` — Translucent, shimmering fairy wings behind the shoulders with sparkle accents.
- `angel` — Golden glowing halo above the crown/head and feathered angel wings.
- `demon` — Cute royal curved horns and playful bat wings.

## 2. Magical Powers (`powerId`)
Players can choose a signature magical power and trigger it with the **"✨ Use Power!"** button:
- `starlight` — Starlight Sparkles (golden & lavender stars)
- `bubbles` — Ocean Bubbles (iridescent aqua bubbles)
- `fairy-dust` — Fairy Dust (pastel magenta & gold dust)
- `sunbeam` — Sunbeam Halo (warm golden rays)
- `hearts` — Playful Hearts (pink & rose floating hearts)

Triggering **"✨ Use Power!"** renders an animated SVG particle burst around the character in the Studio stage and plays the `power-cast` Web Audio cue.

## 3. Companion Pets (`petId`, `petName`)
Players can adopt a companion pet and give it a custom name:
- `none` — No pet
- `puppy` — Royal Puppy
- `kitten` — Velvet Kitten
- `dragon` — Baby Dragon
- `seahorse` — Seahorse
- `unicorn` — Unicorn Foal

The selected pet (and its custom name badge when set) renders beside the character in both the **Studio** (`src/paper_doll.js`) and the **Ballroom** (`src/ballroom.js`).

## 4. State Persistence (`priplay.save.v1`)
`src/state.js` extends `DEFAULT_STATE` and normalization with:
- `characterTypeId` (default: `'princess'`)
- `powerId` (default: `'starlight'`)
- `petId` (default: `'none'`)
- `petName` (default: `''`, trimmed/sanitized string)

All new fields are validated against `princess_config.json` in `normalizeState` and persisted in `localStorage` under `priplay.save.v1`.
