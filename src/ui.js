import { renderPaperDollSvg } from './paper_doll.js';
import { renderColoringPageSvg } from './coloring_book.js';
import { renderBallroomSvg, PRINCE_OUTFIT_COLORS } from './ballroom.js';
import { PIANO_KEYS, PRESET_SONGS, getKeyByKeyboard, createPianoPlayer } from './piano.js';
import { generateRoyalName } from './names.js';
import { announcePrincess } from './speech.js';
import {
  getSubjectById,
  checkQuizAnswer,
  checkSpellingWord,
  shuffleLetters,
  checkMelodyEcho,
  awardLessonStars,
  getAcademyProgress
} from './lessons.js';

const TABS = [
  { id: 'profile', icon: '👑', label: 'Profile' },
  { id: 'hair', icon: '💇‍♀️', label: 'Hair' },
  { id: 'gowns', icon: '👗', label: 'Gowns' },
  { id: 'tiaras', icon: '💎', label: 'Tiaras' },
  { id: 'accessories', icon: '🪄', label: 'Magic' },
  { id: 'makeup', icon: '💄', label: 'Makeup' },
  { id: 'powers-pets', icon: '✨', label: 'Powers & Pets' },
  { id: 'ballroom', icon: '🏰', label: 'Ballroom' },
  { id: 'coloring', icon: '🎨', label: 'Coloring' },
  { id: 'academy', icon: '🏫', label: 'Academy' }
];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSwatches(items, selectedId, dataAttr, colorKey = 'hex') {
  return `<div class="swatch-grid">
    ${items
      .map((item) => {
        const bg = item[colorKey] || item.primary || '#FFFFFF';
        const isTransparent = bg === 'transparent';
        const active = item.id === selectedId ? 'is-active' : '';
        return `<button type="button" class="swatch-btn ${active} ${isTransparent ? 'is-clear' : ''}" data-${dataAttr}="${item.id}" title="${escapeHtml(item.label)}" aria-label="${escapeHtml(item.label)}" style="--swatch-bg: ${isTransparent ? '#FFFFFF' : bg}">
          ${isTransparent ? '✕' : ''}
        </button>`;
      })
      .join('')}
  </div>`;
}

function renderItemButtons(items, selectedId, dataAttr) {
  return `<div class="option-grid">
    ${items
      .map((item) => {
        const active = item.id === selectedId ? 'is-active' : '';
        return `<button type="button" class="option-btn ${active}" data-${dataAttr}="${item.id}">
          ${escapeHtml(item.label)}
        </button>`;
      })
      .join('')}
  </div>`;
}

export function mountApp({ root, store, config, coloringData, coloringController, soundPlayer, ballroomConfig, lessonsConfig }) {
  let powerBurstActive = false;
  let powerBurstTimer = null;
  const pianoPlayer = createPianoPlayer();
  let activeSongId = null;
  let academySession = {
    subjectId: null,
    stepIndex: 0,
    feedback: null,
    completed: false,
    newlyAwarded: false,
    spellingTiles: [],
    enteredLetters: [],
    usedTileIds: [],
    playedNotes: []
  };
  const sparkleLayer = () => root.querySelector('.sparkle-burst-layer');

  function speakWord(word) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(word);
        utter.rate = 0.85;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
      } catch {
        // Ignore speech synthesis errors
      }
    }
  }

  function flashPianoKey(keyId, durationMs = 240) {
    const keyEl = root.querySelector(`[data-piano-key="${keyId}"]`);
    if (!keyEl) return;
    keyEl.classList.add('is-pressed');
    setTimeout(() => {
      keyEl.classList.remove('is-pressed');
    }, Math.min(450, Math.max(140, durationMs)));
  }

  function triggerSparkle() {
    const layer = sparkleLayer();
    if (!layer) return;
    layer.classList.remove('is-bursting');
    void layer.offsetWidth;
    layer.classList.add('is-bursting');
  }

  function renderKingdomMapSvg() {
    return `
      <svg class="kingdom-map-svg" viewBox="0 0 320 220" role="img" aria-label="Starlight Kingdom Map">
        <rect x="0" y="0" width="320" height="220" rx="16" fill="#eef6ff" stroke="#c7d8f5" stroke-width="2" />
        <path d="M160 40 L160 180 M50 110 L270 110" stroke="#d5e2f7" stroke-width="4" stroke-dasharray="6 4" />
        <!-- North: Crystal Castle -->
        <g transform="translate(160, 32)">
          <rect x="-46" y="-18" width="92" height="32" rx="10" fill="#fde2ff" stroke="#d680e6" stroke-width="1.5" />
          <text x="0" y="3" text-anchor="middle" font-size="12" font-weight="600" fill="#5a189a">🏰 Crystal Castle</text>
        </g>
        <!-- South: Coral Bay -->
        <g transform="translate(160, 188)">
          <rect x="-42" y="-16" width="84" height="30" rx="10" fill="#d8f3dc" stroke="#52b788" stroke-width="1.5" />
          <text x="0" y="3" text-anchor="middle" font-size="12" font-weight="600" fill="#1b4332">🐚 Coral Bay</text>
        </g>
        <!-- West: Whispering Woods -->
        <g transform="translate(66, 110)">
          <rect x="-56" y="-16" width="112" height="30" rx="10" fill="#e9f5db" stroke="#718355" stroke-width="1.5" />
          <text x="0" y="3" text-anchor="middle" font-size="12" font-weight="600" fill="#334125">🌲 Whispering Woods</text>
        </g>
        <!-- East: Sunlit Meadow -->
        <g transform="translate(254, 110)">
          <rect x="-54" y="-16" width="108" height="30" rx="10" fill="#fff3b0" stroke="#e09f3e" stroke-width="1.5" />
          <text x="0" y="3" text-anchor="middle" font-size="12" font-weight="600" fill="#7f4f24">🌻 Sunlit Meadow</text>
        </g>
        <!-- Center: Royal Fountain -->
        <circle cx="160" cy="110" r="22" fill="#bde0fe" stroke="#4ea8de" stroke-width="2" />
        <text x="160" y="114" text-anchor="middle" font-size="14">⛲</text>
        <!-- Compass Rose -->
        <g transform="translate(284, 34)">
          <circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#a5b4fc" stroke-width="1.5" />
          <text x="0" y="-8" text-anchor="middle" font-size="9" font-weight="700" fill="#e63946">N</text>
          <text x="0" y="15" text-anchor="middle" font-size="9" font-weight="700" fill="#457b9d">S</text>
          <text x="11" y="3" text-anchor="middle" font-size="9" font-weight="700" fill="#457b9d">E</text>
          <text x="-11" y="3" text-anchor="middle" font-size="9" font-weight="700" fill="#457b9d">W</text>
        </g>
      </svg>
    `;
  }

  function renderAcademyTab(state) {
    if (!lessonsConfig || !Array.isArray(lessonsConfig.subjects)) {
      return '<div class="panel-section"><p>Royal Academy lessons are loading...</p></div>';
    }

    const academy = state.academy || { stars: 0, completedLessons: [] };
    const progress = getAcademyProgress(academy, lessonsConfig);

    if (!academySession.subjectId) {
      return `
        <div class="academy-header-card">
          <div>
            <h3 class="section-title">🏫 Royal Academy</h3>
            <p class="academy-subtitle">Complete lessons to earn Royal Stars! (${progress.completedCount}/${progress.totalCount} completed)</p>
          </div>
          <div class="academy-stars-pill">⭐ ${progress.stars} Stars</div>
        </div>
        <div class="academy-subject-grid">
          ${lessonsConfig.subjects
            .map((subj) => {
              const isDone = academy.completedLessons.includes(subj.id);
              return `
                <button type="button" class="academy-subject-card ${isDone ? 'is-completed' : ''}" data-academy-subject="${subj.id}">
                  <span class="academy-subject-icon">${subj.icon}</span>
                  <span class="academy-subject-info">
                    <strong>${escapeHtml(subj.title)}</strong>
                    <span>${escapeHtml(subj.subtitle)}</span>
                  </span>
                  <span class="academy-subject-status">${isDone ? '✅' : '▶'}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      `;
    }

    const subject = getSubjectById(lessonsConfig, academySession.subjectId);
    if (!subject) {
      academySession.subjectId = null;
      return renderAcademyTab(state);
    }

    if (academySession.completed) {
      return `
        <div class="academy-complete-card">
          <div class="academy-complete-burst">🌟</div>
          <h3>${escapeHtml(subject.title)} Complete!</h3>
          <p>${academySession.newlyAwarded ? `You earned +${lessonsConfig.starRewardPerLesson || 3} Royal Stars! ⭐` : 'Great practice! You already earned stars for this lesson.'}</p>
          <button type="button" class="action-btn primary" data-academy-back="true">Back to Academy 🏫</button>
        </div>
      `;
    }

    let bodyHtml = '';
    if (subject.type === 'quiz' || subject.type === 'compass') {
      const questions = subject.questions || [];
      const q = questions[academySession.stepIndex];
      bodyHtml = `
        <div class="academy-progress-label">Question ${academySession.stepIndex + 1} of ${questions.length}</div>
        ${subject.type === 'compass' ? renderKingdomMapSvg() : ''}
        <p class="academy-prompt">${escapeHtml(q.prompt)}</p>
        <div class="academy-options-grid">
          ${q.options
            .map(
              (opt) =>
                `<button type="button" class="option-btn academy-opt-btn" data-academy-answer="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`
            )
            .join('')}
        </div>
      `;
    } else if (subject.type === 'spelling') {
      const words = subject.words || [];
      const entry = words[academySession.stepIndex];
      const slots = entry.word.split('').map((_, idx) => academySession.enteredLetters[idx] || '_');
      bodyHtml = `
        <div class="academy-progress-label">Word ${academySession.stepIndex + 1} of ${words.length}</div>
        <p class="academy-prompt">Hint: ${escapeHtml(entry.hint)}</p>
        <div class="academy-spell-controls">
          <button type="button" class="action-btn secondary" data-academy-hear-word="${escapeHtml(entry.word)}">Hear Word 🔊</button>
          <button type="button" class="action-btn secondary" data-academy-clear-spell="true">Clear ↺</button>
        </div>
        <div class="academy-spell-slots">
          ${slots.map((ch) => `<span class="spell-slot ${ch !== '_' ? 'is-filled' : ''}">${escapeHtml(ch)}</span>`).join('')}
        </div>
        <div class="academy-tile-grid">
          ${academySession.spellingTiles
            .map((tile) => {
              const used = academySession.usedTileIds.includes(tile.id);
              return `<button type="button" class="spell-tile-btn ${used ? 'is-used' : ''}" data-academy-tile-id="${tile.id}" data-academy-tile-letter="${tile.letter}" ${used ? 'disabled' : ''}>${escapeHtml(tile.letter)}</button>`;
            })
            .join('')}
        </div>
      `;
    } else if (subject.type === 'melody') {
      const melodies = subject.melodies || [];
      const mel = melodies[academySession.stepIndex];
      const whiteKeys = PIANO_KEYS.filter((k) => !k.isBlack);
      bodyHtml = `
        <div class="academy-progress-label">Melody ${academySession.stepIndex + 1} of ${melodies.length}: ${escapeHtml(mel.title)}</div>
        <p class="academy-prompt">Listen to the 3-note melody, then echo it on the keys below!</p>
        <div class="academy-spell-controls">
          <button type="button" class="action-btn primary" data-academy-play-melody="true">Listen to Melody 🎵</button>
          <button type="button" class="action-btn secondary" data-academy-clear-melody="true">Clear Notes ↺</button>
        </div>
        <div class="academy-melody-dots">
          ${mel.notes
            .map((_, idx) => {
              const played = academySession.playedNotes[idx];
              return `<span class="melody-dot ${played ? 'is-filled' : ''}">${played ? escapeHtml(played) : '♪'}</span>`;
            })
            .join('')}
        </div>
        <div class="academy-mini-piano">
          ${whiteKeys
            .map(
              (k) =>
                `<button type="button" class="academy-piano-key" data-academy-note="${k.id}">${escapeHtml(k.label)}</button>`
            )
            .join('')}
        </div>
      `;
    }

    const feedbackHtml = academySession.feedback
      ? `<div class="academy-feedback ${academySession.feedback.ok ? 'is-ok' : 'is-try-again'}">${escapeHtml(academySession.feedback.text)}</div>`
      : '';

    return `
      <div class="academy-lesson-view">
        <div class="academy-lesson-topbar">
          <button type="button" class="action-btn secondary" data-academy-back="true">← Back</button>
          <strong>${subject.icon} ${escapeHtml(subject.title)}</strong>
        </div>
        ${bodyHtml}
        ${feedbackHtml}
      </div>
    `;
  }

  function renderTabPanel(state) {
    const p = state.princess;
    const palettes = config.palettes;
    const items = config.items;

    switch (state.activeTab) {
      case 'profile':
        return `
          <div class="panel-section">
            <label class="field-label" for="princess-name-input">Royal Name</label>
            <div class="name-row">
              <input id="princess-name-input" class="text-input" type="text" maxlength="60" value="${escapeHtml(p.name)}" placeholder="Enter princess name..." />
              <button type="button" class="action-btn secondary" data-action="random-name">🎲 Random Royal Name</button>
            </div>
          </div>
          <div class="panel-section">
            <h3 class="section-title">Skin Tone</h3>
            ${renderSwatches(palettes.skinTones, p.skinTone, 'skin-tone')}
          </div>
        `;
      case 'hair':
        return `
          <div class="panel-section">
            <h3 class="section-title">Hairstyle</h3>
            ${renderItemButtons(items.hairstyles, p.hairstyle, 'hairstyle')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Hair Color</h3>
            ${renderSwatches(palettes.hairColors, p.hairColor, 'hair-color')}
          </div>
        `;
      case 'gowns': {
        const isCustom = p.gownMode === 'custom';
        const customOpts = config.customGownOptions || {};
        const cg = p.customGown || {};
        const renderCustomColorSwatches = (selectedHex, colorField) => `
          <div class="swatch-grid">
            ${(customOpts.colors || [])
              .map((c) => {
                const active = c.hex.toLowerCase() === String(selectedHex || '').toLowerCase() ? 'is-active' : '';
                return `<button type="button" class="swatch-btn ${active}" data-custom-gown-color="${colorField}" data-color-hex="${c.hex}" title="${escapeHtml(c.label)}" aria-label="${escapeHtml(c.label)}" style="--swatch-bg: ${c.hex}"></button>`;
              })
              .join('')}
          </div>`;
        const renderCustomButtons = (list, selectedId, field) => `
          <div class="option-grid">
            ${(list || [])
              .map((item) => {
                const active = item.id === selectedId ? 'is-active' : '';
                return `<button type="button" class="option-btn ${active}" data-custom-gown-field="${field}" data-value="${item.id}">${escapeHtml(item.label)}</button>`;
              })
              .join('')}
          </div>`;

        return `
          <div class="panel-section">
            <div class="gown-mode-toggle" role="group" aria-label="Gown Design Mode">
              <button type="button" class="option-btn ${!isCustom ? 'is-active' : ''}" data-gown-mode="preset">👗 Preset Gowns</button>
              <button type="button" class="option-btn ${isCustom ? 'is-active' : ''}" data-gown-mode="custom">✨ Design Your Own</button>
            </div>
          </div>
          ${isCustom
            ? `
              <div class="panel-section">
                <h3 class="section-title">Bodice</h3>
                ${renderCustomButtons(customOpts.bodices, cg.bodiceId, 'bodiceId')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Skirt</h3>
                ${renderCustomButtons(customOpts.skirts, cg.skirtId, 'skirtId')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Sleeves</h3>
                ${renderCustomButtons(customOpts.sleeves, cg.sleevesId, 'sleevesId')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Waist Trim</h3>
                ${renderCustomButtons(customOpts.waistTrims, cg.waistTrimId, 'waistTrimId')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Pattern</h3>
                ${renderCustomButtons(customOpts.patterns, cg.patternId, 'patternId')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Skirt Color</h3>
                ${renderCustomColorSwatches(cg.skirtColor, 'skirtColor')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Bodice Color</h3>
                ${renderCustomColorSwatches(cg.bodiceColor, 'bodiceColor')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Trim &amp; Pattern Color</h3>
                ${renderCustomColorSwatches(cg.trimColor, 'trimColor')}
              </div>
            `
            : `
              <div class="panel-section">
                <h3 class="section-title">Royal Gown</h3>
                ${renderItemButtons(items.gowns, p.gown, 'gown')}
              </div>
              <div class="panel-section">
                <h3 class="section-title">Gown Color</h3>
                ${renderSwatches(palettes.gownColors, p.gownColor, 'gown-color', 'primary')}
              </div>
            `}
        `;
      }
      case 'tiaras':
        return `
          <div class="panel-section">
            <h3 class="section-title">Tiara & Crown</h3>
            ${renderItemButtons(items.tiaras, p.tiara, 'tiara')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Metal</h3>
            ${renderSwatches(palettes.tiaraMetals, p.tiaraMetal, 'tiara-metal')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Gemstone</h3>
            ${renderSwatches(palettes.tiaraGems, p.tiaraGem, 'tiara-gem')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Necklace</h3>
            ${renderItemButtons(items.accessories.necklaces, p.necklace, 'necklace')}
          </div>
        `;
      case 'accessories':
        return `
          <div class="panel-section">
            <h3 class="section-title">Handheld Magic</h3>
            ${renderItemButtons(items.accessories.handheld, p.handheld, 'handheld')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Fairy & Butterfly Wings</h3>
            ${renderItemButtons(items.accessories.wings, p.wings, 'wings')}
          </div>
        `;
      case 'makeup':
        return `
          <div class="panel-section">
            <div class="section-header-row">
              <h3 class="section-title">Lipstick</h3>
              <button type="button" class="action-btn small secondary" data-action="clear-makeup">✨ Clear Makeup</button>
            </div>
            ${renderSwatches(palettes.makeup.lipstick, p.makeup.lipstick, 'makeup-lipstick')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Blush</h3>
            ${renderSwatches(palettes.makeup.blush, p.makeup.blush, 'makeup-blush')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Eyeshadow</h3>
            ${renderSwatches(palettes.makeup.eyeshadow, p.makeup.eyeshadow, 'makeup-eyeshadow')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Face Gems</h3>
            ${renderItemButtons(palettes.makeup.faceGems, p.makeup.faceGems, 'makeup-facegems')}
          </div>
        `;
      case 'ballroom': {
        const b = state.ballroom || {};
        const renderBallroomOptions = (title, field, list) => `
          <div class="panel-section">
            <h3>${title}</h3>
            <div class="option-grid">
              ${(list || [])
                .map(
                  (item) =>
                    `<button type="button" class="option-btn ${item.id === b[field] ? 'is-active' : ''}" data-ballroom-field="${field}" data-ballroom-value="${item.id}">${escapeHtml(item.label)}</button>`
                )
                .join('')}
            </div>
          </div>
        `;
        return `
          <div class="panel-section">
            <h3>Dance with the Prince</h3>
            <div class="action-row">
              <button type="button" class="primary-btn ${b.dancing ? 'is-active' : ''}" data-action="toggle-dance">
                ${b.dancing ? '💃 Dancing Together!' : '💃 Dance with the Prince'}
              </button>
            </div>
            <div class="swatch-grid" style="margin-top: 10px;">
              ${PRINCE_OUTFIT_COLORS.map(
                (c) =>
                  `<button type="button" class="swatch-btn ${c.id === b.princeOutfitColor ? 'is-active' : ''}" data-ballroom-field="princeOutfitColor" data-ballroom-value="${c.id}" title="${escapeHtml(c.label)}" aria-label="Prince ${escapeHtml(c.label)}" style="--swatch-bg: ${c.primary}"></button>`
              ).join('')}
            </div>
            <div class="swatch-grid" style="margin-top: 8px;">
              ${(config?.palettes?.skinTones || [])
                .map(
                  (c) =>
                    `<button type="button" class="swatch-btn ${c.id === b.princeSkinToneId ? 'is-active' : ''}" data-ballroom-field="princeSkinToneId" data-ballroom-value="${c.id}" title="Prince Skin: ${escapeHtml(c.label)}" aria-label="Prince Skin ${escapeHtml(c.label)}" style="--swatch-bg: ${c.hex}"></button>`
                )
                .join('')}
            </div>
            <div class="swatch-grid" style="margin-top: 8px;">
              ${(config?.palettes?.hairColors || [])
                .map(
                  (c) =>
                    `<button type="button" class="swatch-btn ${c.id === b.princeHairColorId ? 'is-active' : ''}" data-ballroom-field="princeHairColorId" data-ballroom-value="${c.id}" title="Prince Hair: ${escapeHtml(c.label)}" aria-label="Prince Hair ${escapeHtml(c.label)}" style="--swatch-bg: ${c.hex}"></button>`
                )
                .join('')}
            </div>
          </div>
          ${renderBallroomOptions('Sky & Windows', 'skyTheme', ballroomConfig?.skyThemes)}
          ${renderBallroomOptions('Chandelier', 'chandelier', ballroomConfig?.chandeliers)}
          ${renderBallroomOptions('Banners & Drapes', 'bannerStyle', ballroomConfig?.bannerStyles)}
          <div class="panel-section">
            <h3>Banner Color</h3>
            <div class="swatch-grid">
              ${(ballroomConfig?.bannerColors || [])
                .map(
                  (c) =>
                    `<button type="button" class="swatch-btn ${c.id === b.bannerColor ? 'is-active' : ''}" data-ballroom-field="bannerColor" data-ballroom-value="${c.id}" title="${escapeHtml(c.label)}" aria-label="${escapeHtml(c.label)}" style="--swatch-bg: ${c.hex}"></button>`
                )
                .join('')}
            </div>
          </div>
          ${renderBallroomOptions('Floor & Carpet', 'floor', ballroomConfig?.floors)}
          ${renderBallroomOptions('Flowers & Pillars', 'decor', ballroomConfig?.decors)}
        `;
      }

      case 'coloring': {
        const activePage = coloringController.getPage(state.coloring.activePageId);
        const pageFills = state.coloring.fillsByPage[activePage.id] || {};
        return `
          <div class="panel-section">
            <h3 class="section-title">Choose a Page</h3>
            <div class="option-grid">
              ${coloringData.pages
                .map(
                  (pg) =>
                    `<button type="button" class="option-btn ${pg.id === activePage.id ? 'is-active' : ''}" data-coloring-page="${pg.id}">${escapeHtml(pg.title)}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="panel-section">
            <h3 class="section-title">Color Palette</h3>
            <div class="swatch-grid">
              ${coloringData.coloringPalette
                .map(
                  (c) =>
                    `<button type="button" class="swatch-btn ${c.hex === state.coloring.selectedColor ? 'is-active' : ''}" data-coloring-color="${c.hex}" title="${escapeHtml(c.label)}" aria-label="${escapeHtml(c.label)}" style="--swatch-bg: ${c.hex}"></button>`
                )
                .join('')}
            </div>
          </div>
          <div class="panel-section coloring-actions">
            <button type="button" class="action-btn secondary" data-action="coloring-undo" ${coloringController.canUndo(activePage.id) ? '' : 'disabled'}>↩️ Undo</button>
            <button type="button" class="action-btn secondary" data-action="coloring-clear">🧹 Clear Page</button>
          </div>
          <div class="coloring-canvas-wrap">
            ${renderColoringPageSvg(activePage, pageFills)}
          </div>
        `;
      }
      case 'powers-pets': {
        const charTypes = config.characterTypes || [];
        const powers = config.powers || [];
        const pets = config.pets || [];
        return `
          <div class="panel-section">
            <h3 class="section-title">Character Type</h3>
            <div class="option-grid">
              ${charTypes
                .map(
                  (ct) =>
                    `<button type="button" class="option-btn ${ct.id === state.princess.characterTypeId ? 'is-active' : ''}" data-princess-field="characterTypeId" data-value="${ct.id}">${ct.icon || ''} ${escapeHtml(ct.name)}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="panel-section">
            <h3 class="section-title">Magical Power</h3>
            <div class="option-grid">
              ${powers
                .map(
                  (pw) =>
                    `<button type="button" class="option-btn ${pw.id === state.princess.powerId ? 'is-active' : ''}" data-princess-field="powerId" data-value="${pw.id}">${pw.icon || ''} ${escapeHtml(pw.name)}</button>`
                )
                .join('')}
            </div>
            <div style="margin-top: 10px;">
              <button type="button" class="action-btn primary" data-action="use-power">✨ Use Power!</button>
            </div>
          </div>
          <div class="panel-section">
            <h3 class="section-title">Companion Pet</h3>
            <div class="option-grid">
              ${pets
                .map(
                  (pet) =>
                    `<button type="button" class="option-btn ${pet.id === state.princess.petId ? 'is-active' : ''}" data-princess-field="petId" data-value="${pet.id}">${pet.icon || ''} ${escapeHtml(pet.name)}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="panel-section">
            <label class="section-title" for="pet-name-input">Pet Name</label>
            <input id="pet-name-input" class="text-input" type="text" maxlength="24" placeholder="Name your pet..." value="${escapeHtml(state.princess.petName || '')}" />
          </div>
        `;
      }
      case 'academy':
        return renderAcademyTab(state);
      default:
        return '';
    }
  }

  function renderPianoHtml() {
    const whiteKeys = PIANO_KEYS.filter((k) => !k.isBlack);
    const blackKeys = PIANO_KEYS.filter((k) => k.isBlack);
    return `
      <div class="royal-piano-card" aria-label="Royal Piano">
        <div class="piano-header">
          <span class="piano-title">🎹 Royal Piano</span>
          <div class="piano-songs">
            ${PRESET_SONGS.map(
              (song) =>
                `<button type="button" class="song-btn ${activeSongId === song.id ? 'is-active' : ''}" data-song-id="${song.id}">${song.icon} ${escapeHtml(song.label)}</button>`
            ).join('')}
            ${
              activeSongId
                ? `<button type="button" class="song-btn song-stop-btn" data-action="stop-song">⏹ Stop</button>`
                : ''
            }
          </div>
        </div>
        <div class="piano-keyboard" role="group" aria-label="Piano Keys C4 to C5">
          <div class="piano-whites">
            ${whiteKeys
              .map(
                (k) =>
                  `<button type="button" class="piano-key piano-key-white" data-piano-key="${k.id}" aria-label="${k.id}">
                    <span class="piano-note-label">${k.label}</span>
                    <span class="piano-key-hint">${k.keyHint}</span>
                  </button>`
              )
              .join('')}
          </div>
          <div class="piano-blacks">
            ${blackKeys
              .map((k) => {
                const leftPct = ((k.whiteIndex + 0.68) / whiteKeys.length) * 100;
                return `<button type="button" class="piano-key piano-key-black" data-piano-key="${k.id}" style="left: ${leftPct.toFixed(2)}%" aria-label="${k.id}">
                  <span class="piano-key-hint">${k.keyHint}</span>
                </button>`;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    if (savedFocus) {
      const restored = root.querySelector(`#${savedFocus.id}`);
      if (restored) {
        restored.focus();
        if (typeof savedFocus.start === 'number' && typeof savedFocus.end === 'number') {
          restored.setSelectionRange(savedFocus.start, savedFocus.end);
        }
      }
    }
  }

  function render(state) {
    soundPlayer.setMuted(state.muted);
    pianoPlayer.setMuted(state.muted);
    const isColoring = state.activeTab === 'coloring';
    const isBallroom = state.activeTab === 'ballroom';
    const stageSvg = isBallroom
      ? renderBallroomSvg(state.ballroom, ballroomConfig, state.princess, config)
      : renderPaperDollSvg(state.princess, config, { powerBurst: powerBurstActive });

    const activeEl = document.activeElement;
    const savedFocus =
      activeEl && (activeEl.id === 'princess-name-input' || activeEl.id === 'pet-name-input')
        ? { id: activeEl.id, start: activeEl.selectionStart, end: activeEl.selectionEnd }
        : null;

    root.innerHTML = `
      <div class="studio-shell">
        <header class="studio-header">
          <div class="brand">
            <span class="brand-crown">👑</span>
            <h1>Princess Play Time</h1>
          </div>
          <div class="header-actions">
            <div class="royal-stars-badge" title="Royal Stars earned in Academy">⭐ <span>${state.academy?.stars ?? 0}</span></div>
            <button type="button" class="action-btn primary" data-action="announce">Announce Princess 🎺</button>
            <button type="button" class="icon-btn" data-action="toggle-mute" aria-label="${state.muted ? 'Unmute sound' : 'Mute sound'}" title="${state.muted ? 'Unmute' : 'Mute'}">
              ${state.muted ? '🔇' : '🔊'}
            </button>
          </div>
        </header>

        <main class="studio-main ${isColoring ? 'is-coloring-mode' : ''}">
          <section class="stage-card ${isBallroom ? 'is-ballroom-mode' : ''}" aria-label="Princess Stage">
            <div class="princess-banner">${escapeHtml(state.princess.name)}</div>
            <div class="doll-stage ${isBallroom ? 'is-ballroom-stage' : 'gentle-breathe'}">
              ${stageSvg}
              <div class="sparkle-burst-layer" aria-hidden="true">
                <span>✨</span><span>⭐</span><span>💖</span><span>✨</span>
              </div>
            </div>
            ${isBallroom ? renderPianoHtml() : ''}
          </section>

          <section class="controls-card" aria-label="Customization Studio">
            <nav class="tab-bar" role="tablist">
              ${TABS.map(
                (t) => `<button type="button" role="tab" aria-selected="${state.activeTab === t.id}" class="tab-btn ${state.activeTab === t.id ? 'is-active' : ''}" data-tab="${t.id}">
                  <span class="tab-icon">${t.icon}</span>
                  <span class="tab-label">${t.label}</span>
                </button>`
              ).join('')}
            </nav>
            <div class="tab-panel">
              ${renderTabPanel(state)}
            </div>
            ${isBallroom ? renderPianoHtml() : ''}
          </section>
        </main>
      </div>
    `;

    if (savedFocus) {
      const restored = root.querySelector(`#${savedFocus.id}`);
      if (restored) {
        restored.focus();
        if (typeof savedFocus.start === 'number' && typeof savedFocus.end === 'number') {
          restored.setSelectionRange(savedFocus.start, savedFocus.end);
        }
      }
    }
  }

  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target && target.id === 'princess-name-input') {
      store.update((s) => {
        s.princess.name = target.value;
        return s;
      });
    } else if (target && target.id === 'pet-name-input') {
      store.update((s) => {
        s.princess.petName = target.value;
        return s;
      });
    }
  });

  root.addEventListener('click', (event) => {
    const btn = event.target.closest('button, .coloring-region');
    if (!btn) return;

    if (btn.dataset.academySubject) {
      const subject = getSubjectById(lessonsConfig, btn.dataset.academySubject);
      if (subject) {
        soundPlayer.playCue('ui-click');
        academySession = {
          subjectId: subject.id,
          stepIndex: 0,
          feedback: null,
          completed: false,
          newlyAwarded: false,
          spellingTiles: subject.type === 'spelling' && subject.words?.[0] ? shuffleLetters(subject.words[0].word) : [],
          enteredLetters: [],
          usedTileIds: [],
          playedNotes: []
        };
        render(store.getState());
      }
      return;
    }

    if (btn.dataset.academyBack) {
      soundPlayer.playCue('ui-click');
      academySession.subjectId = null;
      academySession.feedback = null;
      render(store.getState());
      return;
    }

    if (btn.dataset.academyAnswer !== undefined) {
      const subject = getSubjectById(lessonsConfig, academySession.subjectId);
      const questions = subject?.questions || [];
      const q = questions[academySession.stepIndex];
      if (!q) return;
      if (checkQuizAnswer(q, btn.dataset.academyAnswer)) {
        soundPlayer.playCue('sparkle-magic');
        if (academySession.stepIndex + 1 < questions.length) {
          academySession.stepIndex += 1;
          academySession.feedback = { ok: true, text: 'Sparkling job! ✨' };
          render(store.getState());
        } else {
          academySession.completed = true;
          academySession.feedback = null;
          store.update((s) => {
            const res = awardLessonStars(s.academy, subject.id, lessonsConfig?.starRewardPerLesson || 3);
            s.academy = { stars: res.stars, completedLessons: res.completedLessons };
            academySession.newlyAwarded = res.newlyAwarded;
            return s;
          });
          triggerSparkle();
        }
      } else {
        soundPlayer.playCue('ui-click');
        academySession.feedback = { ok: false, text: 'Almost! Try another answer 💫' };
        render(store.getState());
      }
      return;
    }

    if (btn.dataset.academyHearWord) {
      speakWord(btn.dataset.academyHearWord);
      return;
    }

    if (btn.dataset.academyClearSpell) {
      soundPlayer.playCue('ui-click');
      academySession.enteredLetters = [];
      academySession.usedTileIds = [];
      academySession.feedback = null;
      render(store.getState());
      return;
    }

    if (btn.dataset.academyTileId) {
      const subject = getSubjectById(lessonsConfig, academySession.subjectId);
      const words = subject?.words || [];
      const entry = words[academySession.stepIndex];
      if (!entry) return;
      soundPlayer.playCue('ui-click');
      academySession.enteredLetters.push(btn.dataset.academyTileLetter);
      academySession.usedTileIds.push(btn.dataset.academyTileId);

      if (academySession.enteredLetters.length === entry.word.length) {
        if (checkSpellingWord(entry.word, academySession.enteredLetters)) {
          soundPlayer.playCue('sparkle-magic');
          if (academySession.stepIndex + 1 < words.length) {
            academySession.stepIndex += 1;
            academySession.enteredLetters = [];
            academySession.usedTileIds = [];
            academySession.spellingTiles = shuffleLetters(words[academySession.stepIndex].word);
            academySession.feedback = { ok: true, text: `Wonderful! You spelled ${entry.word}! ✨` };
            render(store.getState());
          } else {
            academySession.completed = true;
            academySession.feedback = null;
            store.update((s) => {
              const res = awardLessonStars(s.academy, subject.id, lessonsConfig?.starRewardPerLesson || 3);
              s.academy = { stars: res.stars, completedLessons: res.completedLessons };
              academySession.newlyAwarded = res.newlyAwarded;
              return s;
            });
            triggerSparkle();
          }
        } else {
          academySession.feedback = { ok: false, text: 'Not quite! Tap Clear ↺ and try again.' };
          render(store.getState());
        }
      } else {
        academySession.feedback = null;
        render(store.getState());
      }
      return;
    }

    if (btn.dataset.academyPlayMelody) {
      const subject = getSubjectById(lessonsConfig, academySession.subjectId);
      const mel = subject?.melodies?.[academySession.stepIndex];
      if (mel && Array.isArray(mel.notes)) {
        mel.notes.forEach((noteId, idx) => {
          setTimeout(() => {
            pianoPlayer.playNote(noteId, 0.35);
          }, idx * 420);
        });
      }
      return;
    }

    if (btn.dataset.academyClearMelody) {
      soundPlayer.playCue('ui-click');
      academySession.playedNotes = [];
      academySession.feedback = null;
      render(store.getState());
      return;
    }

    if (btn.dataset.academyNote) {
      const subject = getSubjectById(lessonsConfig, academySession.subjectId);
      const melodies = subject?.melodies || [];
      const mel = melodies[academySession.stepIndex];
      if (!mel) return;
      const noteId = btn.dataset.academyNote;
      pianoPlayer.playNote(noteId, 0.35);
      academySession.playedNotes.push(noteId);

      if (academySession.playedNotes.length === mel.notes.length) {
        if (checkMelodyEcho(mel.notes, academySession.playedNotes)) {
          soundPlayer.playCue('sparkle-magic');
          if (academySession.stepIndex + 1 < melodies.length) {
            academySession.stepIndex += 1;
            academySession.playedNotes = [];
            academySession.feedback = { ok: true, text: 'Bravo! Beautiful melody! 🎵' };
            render(store.getState());
          } else {
            academySession.completed = true;
            academySession.feedback = null;
            store.update((s) => {
              const res = awardLessonStars(s.academy, subject.id, lessonsConfig?.starRewardPerLesson || 3);
              s.academy = { stars: res.stars, completedLessons: res.completedLessons };
              academySession.newlyAwarded = res.newlyAwarded;
              return s;
            });
            triggerSparkle();
          }
        } else {
          academySession.feedback = { ok: false, text: 'Close! Tap Clear Notes ↺ and listen again.' };
          render(store.getState());
        }
      } else {
        academySession.feedback = null;
        render(store.getState());
      }
      return;
    }

    if (btn.dataset.action === 'use-power') {
      soundPlayer.playCue('power-cast');
      powerBurstActive = true;
      render(store.getState());
      if (powerBurstTimer) clearTimeout(powerBurstTimer);
      powerBurstTimer = setTimeout(() => {
        powerBurstActive = false;
        powerBurstTimer = null;
        render(store.getState());
      }, 2600);
      return;
    }

    if (btn.dataset.gownMode) {
      const mode = btn.dataset.gownMode === 'custom' ? 'custom' : 'preset';
      soundPlayer.playCue('ui-click');
      store.update((s) => {
        s.princess.gownMode = mode;
        return s;
      });
      return;
    }

    if (btn.dataset.customGownField && btn.dataset.value) {
      const field = btn.dataset.customGownField;
      const value = btn.dataset.value;
      soundPlayer.playCue('dress-change');
      store.update((s) => {
        s.princess.customGown[field] = value;
        return s;
      });
      return;
    }

    if (btn.dataset.customGownColor && btn.dataset.colorHex) {
      const field = btn.dataset.customGownColor;
      const hex = btn.dataset.colorHex;
      soundPlayer.playCue('dress-change');
      store.update((s) => {
        s.princess.customGown[field] = hex;
        return s;
      });
      return;
    }

    if (btn.dataset.princessField && btn.dataset.value) {
      const field = btn.dataset.princessField;
      const value = btn.dataset.value;
      soundPlayer.playCue('dress-change');
      store.update((s) => {
        s.princess[field] = value;
        return s;
      });
      return;
    }

    if (btn.classList.contains('coloring-region')) {
      const regionId = btn.dataset.regionId;
      const state = store.getState();
      const page = coloringController.getPage(state.coloring.activePageId);
      const { fillsByPage, changed } = coloringController.fillRegion(
        state.coloring.fillsByPage,
        page.id,
        regionId,
        state.coloring.selectedColor
      );
      if (changed) {
        soundPlayer.playCue('color-fill');
        store.update((s) => {
          s.coloring.fillsByPage = fillsByPage;
          return s;
        });
      }
      return;
    }

    if (btn.dataset.tab) {
      soundPlayer.playCue(btn.dataset.tab === 'ballroom' ? 'ballroom-enter' : 'ui-click');
      store.update((s) => {
        s.activeTab = btn.dataset.tab;
        return s;
      });
      return;
    }

    if (btn.dataset.ballroomField && btn.dataset.ballroomValue) {
      const field = btn.dataset.ballroomField;
      const value = btn.dataset.ballroomValue;
      soundPlayer.playCue('sparkle-chime');
      store.update((s) => {
        s.ballroom[field] = value;
        return s;
      });
      return;
    }

    const action = btn.dataset.action;
    if (action === 'toggle-mute') {
      store.update((s) => {
        s.muted = !s.muted;
        return s;
      });
      return;
    }

    if (action === 'announce') {
      const state = store.getState();
      soundPlayer.playCue('royal-fanfare');
      announcePrincess(state.princess.name, { muted: state.muted });
      triggerSparkle();
      return;
    }

    if (action === 'random-name') {
      soundPlayer.playCue('sparkle-chime');
      const nextName = generateRoyalName(config.royalNames);
      store.update((s) => {
        s.princess.name = nextName;
        return s;
      });
      triggerSparkle();
      return;
    }

    if (action === 'clear-makeup') {
      soundPlayer.playCue('makeup-clear');
      store.update((s) => {
        s.princess.makeup = {
          lipstick: 'none',
          blush: 'none',
          eyeshadow: 'none',
          faceGems: 'none'
        };
        return s;
      });
      return;
    }

    if (action === 'coloring-undo') {
      const state = store.getState();
      const page = coloringController.getPage(state.coloring.activePageId);
      const { fillsByPage, undone } = coloringController.undo(state.coloring.fillsByPage, page.id);
      if (undone) {
        soundPlayer.playCue('color-undo');
        store.update((s) => {
          s.coloring.fillsByPage = fillsByPage;
          return s;
        });
      }
      return;
    }

    if (action === 'coloring-clear') {
      const state = store.getState();
      const page = coloringController.getPage(state.coloring.activePageId);
      soundPlayer.playCue('makeup-clear');
      store.update((s) => {
        s.coloring.fillsByPage = coloringController.clearPage(s.coloring.fillsByPage, page.id);
        return s;
      });
      return;
    }

    if (btn.dataset.coloringPage) {
      soundPlayer.playCue('ui-click');
      store.update((s) => {
        s.coloring.activePageId = btn.dataset.coloringPage;
        return s;
      });
      return;
    }

    if (btn.dataset.coloringColor) {
      soundPlayer.playCue('ui-click');
      store.update((s) => {
        s.coloring.selectedColor = btn.dataset.coloringColor;
        return s;
      });
      return;
    }

    const princessUpdates = [
      ['skinTone', 'skinTone', 'dress-change'],
      ['hairstyle', 'hairstyle', 'dress-change'],
      ['hairColor', 'hairColor', 'dress-change'],
      ['gown', 'gown', 'dress-change'],
      ['gownColor', 'gownColor', 'dress-change'],
      ['tiara', 'tiara', 'sparkle-chime'],
      ['tiaraMetal', 'tiaraMetal', 'sparkle-chime'],
      ['tiaraGem', 'tiaraGem', 'sparkle-chime'],
      ['necklace', 'necklace', 'sparkle-chime'],
      ['handheld', 'handheld', 'sparkle-chime'],
      ['wings', 'wings', 'sparkle-chime']
    ];

    for (const [dataKey, stateKey, cue] of princessUpdates) {
      if (btn.dataset[dataKey]) {
        soundPlayer.playCue(cue);
        store.update((s) => {
          s.princess[stateKey] = btn.dataset[dataKey];
          return s;
        });
        triggerSparkle();
        return;
      }
    }

    if (btn.dataset.action === 'toggle-dance') {
      soundPlayer.playCue('sparkle-chime');
      store.update((s) => {
        s.ballroom.dancing = !s.ballroom.dancing;
        return s;
      });
      triggerSparkle();
      return;
    }

    if (btn.dataset.songId) {
      const songId = btn.dataset.songId;
      activeSongId = songId;
      render(store.getState());
      pianoPlayer.playSong(songId, {
        onNote: (keyId, durationMs) => {
          flashPianoKey(keyId, durationMs);
        },
        onDone: () => {
          activeSongId = null;
          render(store.getState());
        }
      });
      return;
    }

    if (btn.dataset.action === 'stop-song') {
      pianoPlayer.stopSong();
      activeSongId = null;
      render(store.getState());
      return;
    }

    const makeupUpdates = [
      ['makeupLipstick', 'lipstick'],
      ['makeupBlush', 'blush'],
      ['makeupEyeshadow', 'eyeshadow'],
      ['makeupFacegems', 'faceGems']
    ];

    for (const [dataKey, makeupKey] of makeupUpdates) {
      if (btn.dataset[dataKey]) {
        soundPlayer.playCue('makeup-apply');
        store.update((s) => {
          s.princess.makeup[makeupKey] = btn.dataset[dataKey];
          return s;
        });
        triggerSparkle();
        return;
      }
    }
  });

  root.addEventListener('pointerdown', (e) => {
    const keyBtn = e.target.closest('[data-piano-key]');
    if (!keyBtn) return;
    const keyId = keyBtn.dataset.pianoKey;
    pianoPlayer.playNote(keyId, 360);
    flashPianoKey(keyId, 260);
  });

  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('keydown', (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (store.getState().activeTab !== 'ballroom') return;
      const keyObj = getKeyByKeyboard(e.key);
      if (!keyObj) return;
      pianoPlayer.playNote(keyObj.id, 360);
      flashPianoKey(keyObj.id, 260);
    });
  }

  store.subscribe(render);
  render(store.getState());
}
