# Phase 5: Royal Academy — Design & Architecture Decisions

## Overview
Phase 5 introduces the **Royal Academy** (`🏫 Academy` tab), an interactive learning studio where the princess can complete 5 subject-themed demo lessons and earn **Royal Stars (`⭐`)**.

## Subjects & Interactive Demo Lessons
All lesson content is data-driven via `data/lessons_config.json`:

1. **Math (`math` — Royal Treasury):**
   - 4 quick gem/coin math questions (addition and multiplication) with multiple-choice answers.
2. **Spelling (`spelling` — Enchanted Spellbook):**
   - Tap letter tiles to spell royal words (`CASTLE`, `SPARKLE`, `TIARA`, `DRAGON`) with a **"Hear Word 🔊"** button powered by `window.speechSynthesis` (graceful fallback when unavailable).
3. **Science (`science` — Potion & Nature Lab):**
   - 4 fun questions covering color mixing and animal/character habitats.
4. **Music (`music` — Royal Conservatory):**
   - "Listen & Echo" 3-note melody challenge using `src/piano.js` (`createPianoPlayer` & `PIANO_KEYS`).
5. **Geography (`geography` — Kingdom Map):**
   - Compass Quest with North/South/East/West clues on a Starlight Kingdom SVG map.

## Architecture & Persistence
- **`src/lessons.js`**: Pure, framework-free helpers for lesson lookup, answer checking (multiple-choice, spelling, melody echo), progress calculation, and star reward calculation.
- **`src/state.js`**: Adds `academy: { stars: 0, completedLessons: [] }` to `DEFAULT_STATE` in `priplay.save.v1`, with safe `normalizeState` migration for older saves.
- **`src/ui.js` & `css/app.css`**: Adds the `🏫 Academy` tab, a Royal Stars `⭐` badge in the header, subject selection cards, and interactive lesson views.
- **`index.html`**: Bumps cache-busting query string to `?v=20261116-5`.

## Testing
- `test/lessons.test.js`: Unit tests for `src/lessons.js` helpers.
- `test/state.test.js`: Tests for `academy` state persistence and migration.
- `test/data_validation.test.js`: Validates `data/lessons_config.json` structure and all 5 subjects.
