import { renderPaperDollSvg } from './paper_doll.js';
import { renderColoringPageSvg } from './coloring_book.js';
import { renderBallroomSvg, PRINCE_OUTFIT_COLORS } from './ballroom.js';
import { PIANO_KEYS, PRESET_SONGS, getKeyByKeyboard, createPianoPlayer } from './piano.js';
import { generateRoyalName } from './names.js';
import { announcePrincess } from './speech.js';

const TABS = [
  { id: 'profile', icon: '👑', label: 'Profile' },
  { id: 'hair', icon: '💇‍♀️', label: 'Hair' },
  { id: 'gowns', icon: '👗', label: 'Gowns' },
  { id: 'tiaras', icon: '💎', label: 'Tiaras' },
  { id: 'accessories', icon: '🪄', label: 'Magic' },
  { id: 'makeup', icon: '💄', label: 'Makeup' },
  { id: 'powers-pets', icon: '✨', label: 'Powers & Pets' },
  { id: 'ballroom', icon: '🏰', label: 'Ballroom' },
  { id: 'coloring', icon: '🎨', label: 'Coloring' }
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

export function mountApp({ root, store, config, coloringData, coloringController, soundPlayer, ballroomConfig }) {
  let powerBurstActive = false;
  let powerBurstTimer = null;
  const pianoPlayer = createPianoPlayer();
  let activeSongId = null;
  const sparkleLayer = () => root.querySelector('.sparkle-burst-layer');

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
      case 'gowns':
        return `
          <div class="panel-section">
            <h3 class="section-title">Royal Gown</h3>
            ${renderItemButtons(items.gowns, p.gown, 'gown')}
          </div>
          <div class="panel-section">
            <h3 class="section-title">Gown Color</h3>
            ${renderSwatches(palettes.gownColors, p.gownColor, 'gown-color', 'primary')}
          </div>
        `;
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

    if (btn.dataset.action === 'use-power') {
      soundPlayer.playCue('power-cast');
      powerBurstActive = true;
      render();
      triggerSparkleBurst();
      if (powerBurstTimer) clearTimeout(powerBurstTimer);
      powerBurstTimer = setTimeout(() => {
        powerBurstActive = false;
        powerBurstTimer = null;
        render();
      }, 1800);
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
      triggerSparkleBurst();
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
