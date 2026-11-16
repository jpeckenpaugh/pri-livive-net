# Phase 2 Decisions — Princess Play Time (`pri-livive-net`)

**Date:** 2026-11-16  
**Status:** Approved (Auto-Pilot)

## Phase 2: Go to the Ball & Decorate the Ball

1. **Ballroom Scene & Navigation:**
   - Add a dedicated **`ballroom`** tab (`🏰 Ballroom`) to `TABS` in `src/ui.js`.
   - When `activeTab === 'ballroom'`, the stage displays a grand 2D SVG Royal Ballroom (`src/ballroom.js`) with the player's customized 2D SVG Paper-Doll Princess (`renderPaperDollSvg`) composited right in the center of the dance floor, keeping her outfit, hair, tiara, makeup, and accessories intact.
   - The controls panel switches to **Decorate the Ball**, allowing kids to customize every part of the ballroom live with instant visual feedback and synthesized Web Audio cues (`ballroom-enter`, `sparkle-chime`, `ui-click`).

2. **Customizable Ballroom Elements (`data/ballroom_config.json`):**
   - **Theme / Sky & Windows (`skyTheme`):**
     - `starlight-night` (Starlight Night — deep indigo sky with twinkling stars and crescent moon)
     - `sunset-rose` (Sunset Rose — warm pink-orange twilight sky)
     - `enchanted-dawn` (Enchanted Dawn — soft pastel lavender & gold morning sky)
     - `crystal-ice` (Crystal Ice — cool icy blue aurora sky)
   - **Chandelier (`chandelier`):**
     - `crystal-chandelier` (Crystal Chandelier — sparkling tiered crystal drops)
     - `golden-candelabra` (Golden Candelabra — warm glowing royal candles)
     - `fairy-lanterns` (Fairy Lanterns — floating pastel glowing lanterns)
   - **Banners & Drapes (`bannerStyle` + `bannerColor`):**
     - Styles: `royal-swags`, `velvet-curtains`, `heart-pennants`
     - Colors: `royal-pink`, `lavender`, `sky-blue`, `gold`, `mint`, `ruby`
   - **Floor / Royal Carpet (`floor`):**
     - `marble-red-carpet` (Marble & Red Carpet — classic checkered marble with a royal runner)
     - `starry-dance-floor` (Starry Dance Floor — shimmering midnight-blue floor with gold stars)
     - `rose-petal-aisle` (Rose Petal Aisle — cream marble scattered with pink rose petals)
   - **Flowers & Pillars (`decor`):**
     - `rose-garlands` (Rose Garlands — marble pillars wrapped in blooming pink roses)
     - `lily-vases` (Lily Vases — golden urns overflowing with white & pastel lilies)
     - `glowing-columns` (Glowing Columns — crystal pillars with warm fairy-light halos)

3. **State Persistence (`src/state.js`):**
   - Extend `DEFAULT_STATE` in `priplay.save.v1` with a `ballroom` object:
     ```json
     "ballroom": {
       "skyTheme": "starlight-night",
       "chandelier": "crystal-chandelier",
       "bannerStyle": "royal-swags",
       "bannerColor": "royal-pink",
       "floor": "marble-red-carpet",
       "decor": "rose-garlands"
     }
     ```
   - `normalizeState` safely migrates existing `priplay.save.v1` saves that lack `ballroom` by filling in defaults, and preserves valid string fields.

4. **Testing:**
   - Add `test/ballroom.test.js` to verify `renderBallroomSvg` renders all themes, chandeliers, banner styles/colors, floors, decor, and composites the Princess paper-doll SVG.
   - Update `test/data_validation.test.js` to validate `data/ballroom_config.json` and the `ballroom-enter` cue in `data/sounds.json`.
   - Update `test/state.test.js` to verify `ballroom` state normalization, migration from Phase 1 saves, and persistence round-trip.
