# Phase 3 Decisions — Princess Play Time (`pri-livive-net`)

**Date:** 2026-11-16  
**Status:** Approved (Auto-Pilot)

## Phase 3: Playable Piano & Dance with the Prince

1. **Playable Royal Piano (`src/piano.js`):**
   - **1-Octave+ Layout (`C4`–`C5`):** 13 keys total — 8 white keys (`C4`, `D4`, `E4`, `F4`, `G4`, `A4`, `B4`, `C5`) and 5 black keys (`C#4`, `D#4`, `F#4`, `G#4`, `A#4`).
   - **Web Audio Note Synthesis:** `createPianoPlayer()` synthesizes warm piano/celesta notes using `AudioContext` / `webkitAudioContext` (fundamental `triangle` + soft `sine` octave harmonic with an exponential decay envelope). Import-safe in Node (fails soft when Web Audio is unavailable) and respects the global `muted` toggle.
   - **Input Support:**
     - Mouse & touch (`pointerdown`) on individual piano keys.
     - Computer keyboard (`A S D F G H J K` for white keys `C4`–`C5`, `W E T Y U` for black keys `C#4`–`A#4`) when in the Ballroom tab.
   - **Preset Songs:** 3 built-in royal melodies with a **Stop** button:
     - `twinkle` (*Twinkle Star*)
     - `royal-waltz` (*Royal Waltz*)
     - `royal-birthday` (*Royal Birthday*)
     Each preset animates the corresponding piano keys (`is-pressed`) in sync with the synthesized notes.

2. **Dance with the Prince (`src/ballroom.js`):**
   - **Prince SVG Character:** Added a 2D SVG Prince character (`renderPrinceSvg`) wearing a royal tunic, sash, cape, and crown, with selectable `princeOutfitColor` (`royal-blue`, `crimson`, `emerald`, `lavender`, `gold`).
   - **Dance Toggle:** A **"💃 Dance with the Prince"** toggle button in the Ballroom controls (`ballroom.dancing`).
   - **Waltz Animation & Musical Notes:** When `dancing` is `true`, the Prince joins the Princess on the dance floor, both characters sway/waltz smoothly via CSS animations (`is-dancing`), and floating musical notes (`♪`, `♫`) and sparkles (`✦`) rise above them.

3. **State Persistence (`src/state.js`):**
   - Extend `DEFAULT_STATE.ballroom` in `priplay.save.v1`:
     ```json
     "ballroom": {
       "skyTheme": "starlight-night",
       "chandelier": "crystal-chandelier",
       "bannerStyle": "royal-swags",
       "bannerColor": "royal-pink",
       "floor": "marble-red-carpet",
       "decor": "rose-garlands",
       "dancing": false,
       "princeOutfitColor": "royal-blue"
     }
     ```
   - `normalizeState` safely migrates Phase 1 and Phase 2 saves by filling in `dancing: false` and `princeOutfitColor: 'royal-blue'`.

4. **Testing:**
   - Add `test/piano.test.js` covering `PIANO_KEYS`, `PRESET_SONGS`, `getNoteFrequency`, `getKeyByKeyboard`, and `createPianoPlayer` (Node import-safety & mute behavior).
   - Update `test/ballroom.test.js` to verify `renderBallroomSvg` renders the Prince and musical notes when `dancing: true`, and `princeOutfitColor` customization.
   - Update `test/state.test.js` to verify `dancing` and `princeOutfitColor` normalization and migration.
