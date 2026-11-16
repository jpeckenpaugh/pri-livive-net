export const STORAGE_KEY = 'priplay.save.v1';
export const SAVE_DEBOUNCE_MS = 300;

export const DEFAULT_STATE = {
  version: 1,
  activeTab: 'profile',
  muted: false,
  princess: {
    name: 'Princess Luna of Starlight Castle',
    skinTone: 'peach',
    hairstyle: 'royal-waves',
    hairColor: 'butter-blonde',
    gown: 'classic-ballgown',
    gownColor: 'royal-pink',
    tiara: 'royal-crown',
    tiaraMetal: 'gold',
    tiaraGem: 'ruby',
    handheld: 'star-wand',
    necklace: 'pearl-strand',
    wings: 'none',
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
    fillsByPage: {}
  },
  ballroom: {
    skyTheme: 'starlight-night',
    chandelier: 'crystal-chandelier',
    bannerStyle: 'royal-swags',
    bannerColor: 'royal-pink',
    floor: 'marble-red-carpet',
    decor: 'rose-garlands',
    dancing: false,
    princeOutfitColor: 'royal-blue'
  }
};

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
      'handheld',
      'necklace',
      'wings'
    ];
    for (const key of strFields) {
      if (typeof p[key] === 'string' && p[key].trim().length > 0) {
        base.princess[key] = p[key];
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
    if (raw.coloring.fillsByPage && typeof raw.coloring.fillsByPage === 'object') {
      base.coloring.fillsByPage = clone(raw.coloring.fillsByPage);
    }
  }

  if (raw.ballroom && typeof raw.ballroom === 'object') {
    const b = raw.ballroom;
    const bFields = ['skyTheme', 'chandelier', 'bannerStyle', 'bannerColor', 'floor', 'decor', 'princeOutfitColor'];
    for (const key of bFields) {
      if (typeof b[key] === 'string' && b[key].trim().length > 0) {
        base.ballroom[key] = b[key];
      }
    }
    if (typeof b.dancing === 'boolean') {
      base.ballroom.dancing = b.dancing;
    }
  }

  return base;
}

export function loadState(storage = globalThis.localStorage) {
  try {
    if (!storage || typeof storage.getItem !== 'function') {
      return clone(DEFAULT_STATE);
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(DEFAULT_STATE);
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return clone(DEFAULT_STATE);
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

export function createStore(initialState = null, storage = globalThis.localStorage) {
  let state = normalizeState(initialState ?? loadState(storage));
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
