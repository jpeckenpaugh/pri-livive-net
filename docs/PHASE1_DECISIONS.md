# Phase 1 Decisions — Princess Play Time (`pri-livive-net`)

**Date:** 2026-11-15  
**Status:** Approved

## Converged Architecture & Design Decisions
1. **Tech Stack:** Zero-build static web app (`index.html`, `css/app.css`, native ES modules in `src/`, JSON configs in `data/`, `node --test` in `test/`), matching `pp-livive-net` and `kor-livive-net`.
2. **Avatar Style:** **2D SVG Paper-Doll** (layered SVG components for expressive eyes, hair, gowns, tiaras, accessories, and makeup with dynamic color customization).
3. **Princess Color Game:** **Tap-to-Fill Coloring Book** (princess/castle/crown line art with a royal & pastel color palette).
4. **Do Makeup:** **Tap-to-Apply** for Lipstick, Blush, Eyeshadow, and Face Gems/Sparkles (stars/hearts), plus a "Clear Makeup" button.
5. **Dress Up Scope:** Hairstyle, Gown/Dress, Tiara/Crown, and Accessories (wand, necklace, wings), each customizable with color palettes.
6. **Name Character & Royal Titles:** Free-text input + **"Random Royal Name"** generator (e.g., *Princess Luna of Starlight Castle*).
7. **Layout & Navigation:** Single **Princess Dressing Studio** with big, colorful icon tabs so the Princess stays visible while customizing, plus a tab/mode for the Color Game.
8. **Audio & Speech:** Synthesized Web Audio chimes (`data/sounds.json`) + optional `window.speechSynthesis` with a mute toggle.
9. **Testing:** Automated `node --test` for pure logic, data validation, and `localStorage` autosave (`priplay.save.v1`); human user performs interactive browser testing.
