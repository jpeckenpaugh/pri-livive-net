export const STORAGE_KEY = 'priplay.save.v1';
export const SAVE_DEBOUNCE_MS = 300;

export const DEFAULT_STATE = {
  version: 1,
  activeTab: 'profile',
  muted: false,
  princess: {
    name: 'Princess Tamara of Starlight Castle',
    skinTone: 'peach',
    hairstyle: 'royal-waves',
    hairColor: 'butter-blonde',
    gown: 'classic-ballgown',
    gownColor: 'royal-pink',
    gownMode: 'preset',
    customGown: {
      bodiceId: 'sweetheart',
      skirtId: 'ballgown',
      sleevesId: 'puff',
      waistTrimId: 'bow',
      patternId: 'none',
      skirtColor: '#FF70A6',
      bodiceColor: '#FF70A6',
      trimColor: '#FFE5EC'
    },
    tiara: 'royal-crown',
    tiaraMetal: 'gold',
    tiaraGem: 'ruby',
    tiaraSizeId: 'classic',
    tiaraEffectId: 'twinkle',
    handheld: 'star-wand',
    necklace: 'pearl-strand',
    wings: 'none',
    characterTypeId: 'princess',
    powerId: 'starlight',
    petId: 'none',
    petName: '',
    petColorId: 'default',
    petAccessoryId: 'none',
    shoesId: 'glass-slippers',
    shoeColorId: 'glass',
    makeup: {
      lipstick: 'none',
      blush: 'none',
      eyeshadow: 'none',
      faceGems: 'none'
    }
  },
  coloring: {
    activePageId: 'royal-princess-ballgown',
    selectedColor: '#FF70A6',
    mode: 'fill',
    brushSize: 6,
    fillsByPage: {},
    drawingsByPage: {}
  },
  ballroom: {
    skyTheme: 'starlight-night',
    chandelier: 'crystal-chandelier',
    bannerStyle: 'royal-swags',
    bannerColor: 'royal-pink',
    floor: 'marble-red-carpet',
    decor: 'rose-garlands',
    dancing: false,
    princeOutfitColor: 'royal-blue',
    princeSkinToneId: 'peach',
    princeHairColorId: 'chestnut-brown',
    invitedGuests: [],
    danceStyle: 'waltz'
  },
  academy: {
    stars: 0,
    completedLessons: []
  },
  episodes: {
    completed: []
  }
};

function pickRandom(items, rng = Math.random) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const idx = Math.floor(rng() * items.length);
  return items[Math.min(Math.max(idx, 0), items.length - 1)];
}

export function createInitialState(config = null, rng = Math.random) {
  const base = clone(DEFAULT_STATE);
  if (!config || typeof config !== 'object') {
    return base;
  }

  const palettes = config.palettes || {};
  const items = config.items || {};

  const skinTone = pickRandom(palettes.skinTones, rng);
  if (skinTone?.id) base.princess.skinTone = skinTone.id;

  const hairstyle = pickRandom(items.hairstyles, rng);
  if (hairstyle?.id) base.princess.hairstyle = hairstyle.id;

  const hairColor = pickRandom(palettes.hairColors, rng);
  if (hairColor?.id) base.princess.hairColor = hairColor.id;

  const gown = pickRandom(items.gowns, rng);
  if (gown?.id) base.princess.gown = gown.id;

  const gownColor = pickRandom(palettes.gownColors, rng);
  if (gownColor?.id) base.princess.gownColor = gownColor.id;

  const tiara = pickRandom(items.tiaras, rng);
  if (tiara?.id) base.princess.tiara = tiara.id;

  const tiaraMetal = pickRandom(palettes.tiaraMetals, rng);
  if (tiaraMetal?.id) base.princess.tiaraMetal = tiaraMetal.id;

  const tiaraGem = pickRandom(palettes.tiaraGems, rng);
  if (tiaraGem?.id) base.princess.tiaraGem = tiaraGem.id;

  const accessories = items.accessories || {};
  const handheld = pickRandom(accessories.handhelds, rng);
  if (handheld?.id) base.princess.handheld = handheld.id;

  const necklace = pickRandom(accessories.necklaces, rng);
  if (necklace?.id) base.princess.necklace = necklace.id;

  const wings = pickRandom(accessories.wings, rng);
  if (wings?.id) base.princess.wings = wings.id;

  const princeSkin = pickRandom(palettes.skinTones, rng);
  if (princeSkin?.id) base.ballroom.princeSkinToneId = princeSkin.id;

  const princeHair = pickRandom(palettes.hairColors, rng);
  if (princeHair?.id) base.ballroom.princeHairColorId = princeHair.id;

  return base;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function normalizeState(raw) {
  const base = clone(DEFAULT_STATE);
  if (!raw || typeof raw !== 'object') {
    return base;
  }

  if (typeof raw.activeTab === 'string') {
    base.activeTab = raw.activeTab;
  }
  if (typeof raw.muted === 'boolean') {
    base.muted = raw.muted;
  }

  if (raw.princess && typeof raw.princess === 'object') {
    const p = raw.princess;
    const strFields = [
      'name',
      'skinTone',
      'hairstyle',
      'hairColor',
      'gown',
      'gownColor',
      'tiara',
      'tiaraMetal',
      'tiaraGem',
      'tiaraSizeId',
      'tiaraEffectId',
      'handheld',
      'necklace',
      'wings',
      'characterTypeId',
      'powerId',
      'petId',
      'petColorId',
      'petAccessoryId',
      'shoesId',
      'shoeColorId'
    ];
    for (const key of strFields) {
      if (typeof p[key] === 'string' && p[key].trim().length > 0) {
        base.princess[key] = p[key];
      }
    }
    if (typeof p.petName === 'string') {
      base.princess.petName = p.petName.slice(0, 24);
    }
    if (p.gownMode === 'preset' || p.gownMode === 'custom') {
      base.princess.gownMode = p.gownMode;
    }
    if (p.customGown && typeof p.customGown === 'object') {
      const cgFields = [
        'bodiceId',
        'skirtId',
        'sleevesId',
        'waistTrimId',
        'patternId',
        'skirtColor',
        'bodiceColor',
        'trimColor'
      ];
      for (const cgKey of cgFields) {
        if (typeof p.customGown[cgKey] === 'string' && p.customGown[cgKey].trim().length > 0) {
          base.princess.customGown[cgKey] = p.customGown[cgKey];
        }
      }
    }
    if (p.makeup && typeof p.makeup === 'object') {
      for (const mKey of ['lipstick', 'blush', 'eyeshadow', 'faceGems']) {
        if (typeof p.makeup[mKey] === 'string') {
          base.princess.makeup[mKey] = p.makeup[mKey];
        }
      }
    }
  }

  if (raw.coloring && typeof raw.coloring === 'object') {
    if (typeof raw.coloring.activePageId === 'string') {
      base.coloring.activePageId = raw.coloring.activePageId;
    }
    if (typeof raw.coloring.selectedColor === 'string') {
      base.coloring.selectedColor = raw.coloring.selectedColor;
    }
    if (raw.coloring.mode === 'fill' || raw.coloring.mode === 'draw') {
      base.coloring.mode = raw.coloring.mode;
    }
    if (typeof raw.coloring.brushSize === 'number' && Number.isFinite(raw.coloring.brushSize) && raw.coloring.brushSize > 0) {
      base.coloring.brushSize = raw.coloring.brushSize;
    }
    if (raw.coloring.fillsByPage && typeof raw.coloring.fillsByPage === 'object') {
      base.coloring.fillsByPage = clone(raw.coloring.fillsByPage);
    }
    if (raw.coloring.drawingsByPage && typeof raw.coloring.drawingsByPage === 'object') {
      base.coloring.drawingsByPage = clone(raw.coloring.drawingsByPage);
    }
  }

  if (raw.ballroom && typeof raw.ballroom === 'object') {
    const b = raw.ballroom;
    const bFields = [
      'skyTheme',
      'chandelier',
      'bannerStyle',
      'bannerColor',
      'floor',
      'decor',
      'princeOutfitColor',
      'princeSkinToneId',
      'princeHairColorId'
    ];
    for (const key of bFields) {
      if (typeof b[key] === 'string' && b[key].trim().length > 0) {
        base.ballroom[key] = b[key];
      }
    }
    if (typeof b.dancing === 'boolean') {
      base.ballroom.dancing = b.dancing;
    }
    if (typeof b.danceStyle === 'string' && ['waltz', 'twirl', 'bounce'].includes(b.danceStyle)) {
      base.ballroom.danceStyle = b.danceStyle;
    }
    if (Array.isArray(b.invitedGuests)) {
      const seen = new Set();
      base.ballroom.invitedGuests = b.invitedGuests.filter((id) => {
        if (typeof id !== 'string' || id.trim().length === 0 || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }
  }

  if (raw.academy && typeof raw.academy === 'object') {
    const a = raw.academy;
    if (typeof a.stars === 'number' && Number.isFinite(a.stars) && a.stars >= 0) {
      base.academy.stars = Math.floor(a.stars);
    }
    if (Array.isArray(a.completedLessons)) {
      const seen = new Set();
      base.academy.completedLessons = a.completedLessons.filter((id) => {
        if (typeof id !== 'string' || id.trim().length === 0 || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }
  }

  if (raw.episodes && typeof raw.episodes === 'object') {
    const ep = raw.episodes;
    if (Array.isArray(ep.completed)) {
      const seen = new Set();
      base.episodes.completed = ep.completed.filter((id) => {
        if (typeof id !== 'string' || id.trim().length === 0 || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }
  }

  return base;
}

export function loadState(storage = globalThis.localStorage, config = null) {
  try {
    if (!storage || typeof storage.getItem !== 'function') {
      return createInitialState(config);
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState(config);
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return createInitialState(config);
  }
}

export function saveStateImmediate(state, storage = globalThis.localStorage) {
  try {
    if (!storage || typeof storage.setItem !== 'function') {
      return false;
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function createStore(initialState = null, storage = globalThis.localStorage, config = null) {
  let state = normalizeState(initialState ?? loadState(storage, config));
  let saveTimer = null;
  const listeners = new Set();

  function notify() {
    for (const fn of listeners) {
      fn(state);
    }
  }

  function scheduleSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    saveTimer = setTimeout(() => {
      saveTimer = null;
      saveStateImmediate(state, storage);
    }, SAVE_DEBOUNCE_MS);
  }

  return {
    getState() {
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    update(updater) {
      const next = typeof updater === 'function' ? updater(clone(state)) : updater;
      state = normalizeState(next);
      scheduleSave();
      notify();
      return state;
    },
    flushSave() {
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
      return saveStateImmediate(state, storage);
    }
  };
}
