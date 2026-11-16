# Phase 6 Decisions: 📖 Episodes (Interactive Story Mode)

## Overview
Phase 6 introduces **Episodes** (`📖 Episodes`), an interactive 5-beat story mode placed after **🏫 Academy** in the navigation tabs. Players guide their custom princess through social-emotional scenarios at the Royal Academy alongside **Princess Maya**, making choices that shape the ending.

## 5-Beat Interactive Episode Design
1. **Beat 1 — Arrival at the Royal Academy Courtyard:** Princess Maya arrives as a new student. The player chooses to say hello and welcome her (+1 kindness) or ignore her.
2. **Beat 2 — The Banquet Table at Lunch:** Maya is looking for a place to sit. The player chooses to invite her to sit (+1 kindness) or say the seat is saved.
3. **Beat 3 — Potion Lab Partners:** Students pair up for Potion Lab. The player chooses to ask Maya to be their partner (+1 kindness) or leave her out.
4. **Beat 4 — Dropped Spellbook in the Hallway:** Maya drops her spellbook. The player chooses to help her pick it up (+1 kindness) or laugh and walk away.
5. **Beat 5 — Ending & Reflection:**
   - **Welcoming Ending (`kindnessCount >= 3`):** Maya feels welcomed and becomes a close friend at the Royal Academy.
   - **Gentle Exclusionary Reflection (`kindnessCount < 3`):** A gentle, age-appropriate reflection on how Maya felt left out and how small acts of kindness can make someone's day brighter.

## Architecture
- **`data/episodes_config.json`:** Data-driven episode definitions, beats, choices, reaction text, and endings.
- **`src/episodes.js`:** Pure helpers (`getEpisodeById`, `resolveEpisodeEnding`, `renderEpisodeSceneSvg`) that composite the player's `renderPaperDollSvg` on the left and Princess Maya on the right in a school backdrop with animated expressions and sparkles.
- **`src/state.js`:** Adds `episodes: { completed: [] }` to `DEFAULT_STATE` and `normalizeState` for save migration.
- **`src/ui.js` & `src/speech.js`:** Interactive 5-beat player with **Read Aloud 🔊** (`speechSynthesis`), choice/reaction flow, **Replay Episode**, and **Royal Stars ⭐** reward.
