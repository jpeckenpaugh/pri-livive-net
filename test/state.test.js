import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  DEFAULT_STATE,
  STORAGE_KEY,
  createInitialState,
  createStore,
  loadState,
  normalizeState
} from '../src/state.js';

const princessConfig = JSON.parse(
  fs.readFileSync(new URL('../data/princess_config.json', import.meta.url), 'utf8')
);

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    }
  };
}

test('normalizeState falls back safely on invalid input', () => {
  const normalized = normalizeState(null);
  assert.deepEqual(normalized, DEFAULT_STATE);

  const partial = normalizeState({
    activeTab: 'makeup',
    princess: { name: 'Princess Aurora', hairColor: 'rose-pink' }
  });
  assert.equal(partial.activeTab, 'makeup');
  assert.equal(partial.princess.name, 'Princess Aurora');
  assert.equal(partial.princess.hairColor, 'rose-pink');
  assert.equal(partial.princess.gown, DEFAULT_STATE.princess.gown);
});

test('loadState handles corrupt JSON in storage without throwing', () => {
  const storage = createMemoryStorage();
  storage.setItem(STORAGE_KEY, '{bad-json');
  const loaded = loadState(storage);
  assert.deepEqual(loaded, DEFAULT_STATE);
});

test('createStore debounces autosave to priplay.save.v1 and flushSave persists immediately', async () => {
  const storage = createMemoryStorage();
  const store = createStore(null, storage);

  store.update((s) => {
    s.princess.name = 'Queen Celeste';
    return s;
  });

  assert.equal(storage.getItem(STORAGE_KEY), null);
  store.flushSave();
  const saved = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(saved.princess.name, 'Queen Celeste');
});

test('normalizeState migrates Phase 1 saves without ballroom to default ballroom decor', () => {
  const migrated = normalizeState({ version: 1, princess: { name: 'Princess Star' } });
  assert.equal(migrated.princess.name, 'Princess Star');
  assert.equal(migrated.ballroom.skyTheme, DEFAULT_STATE.ballroom.skyTheme);
  assert.equal(migrated.ballroom.chandelier, DEFAULT_STATE.ballroom.chandelier);
  assert.equal(migrated.ballroom.floor, DEFAULT_STATE.ballroom.floor);
});

test('normalizeState preserves valid ballroom decor fields', () => {
  const custom = normalizeState({
    ballroom: {
      skyTheme: 'sunset-rose',
      chandelier: 'golden-candelabra',
      bannerStyle: 'velvet-curtains',
      bannerColor: 'gold',
      floor: 'rose-petal-aisle',
      decor: 'lily-vases'
    }
  });
  assert.equal(custom.ballroom.skyTheme, 'sunset-rose');
  assert.equal(custom.ballroom.chandelier, 'golden-candelabra');
  assert.equal(custom.ballroom.bannerStyle, 'velvet-curtains');
  assert.equal(custom.ballroom.bannerColor, 'gold');
  assert.equal(custom.ballroom.floor, 'rose-petal-aisle');
  assert.equal(custom.ballroom.decor, 'lily-vases');
});

test('normalizeState migrates Phase 2 saves without dancing/princeOutfitColor and preserves valid values', () => {
  const migrated = normalizeState({
    ballroom: {
      skyTheme: 'crystal-ice'
    }
  });
  assert.equal(migrated.ballroom.dancing, false);
  assert.equal(migrated.ballroom.princeOutfitColor, 'royal-blue');

  const custom = normalizeState({
    ballroom: {
      dancing: true,
      princeOutfitColor: 'emerald',
      princeSkinToneId: 'espresso',
      princeHairColorId: 'midnight'
    }
  });
  assert.equal(custom.ballroom.dancing, true);
  assert.equal(custom.ballroom.princeOutfitColor, 'emerald');
  assert.equal(custom.ballroom.princeSkinToneId, 'espresso');
  assert.equal(custom.ballroom.princeHairColorId, 'midnight');
});

test('createInitialState and loadState randomize fresh defaults from config while preserving saved state', () => {
  // Deterministic rng picking the last item in each array
  const pickLast = () => 0.9999;
  const fresh = createInitialState(princessConfig, pickLast);
  const lastSkin = princessConfig.palettes.skinTones.at(-1).id;
  const lastHairColor = princessConfig.palettes.hairColors.at(-1).id;
  const lastHairstyle = princessConfig.items.hairstyles.at(-1).id;
  const lastGown = princessConfig.items.gowns.at(-1).id;
  const lastGownColor = princessConfig.palettes.gownColors.at(-1).id;

  assert.equal(fresh.princess.skinTone, lastSkin);
  assert.equal(fresh.princess.hairColor, lastHairColor);
  assert.equal(fresh.princess.hairstyle, lastHairstyle);
  assert.equal(fresh.princess.gown, lastGown);
  assert.equal(fresh.princess.gownColor, lastGownColor);
  assert.equal(fresh.ballroom.princeSkinToneId, lastSkin);
  assert.equal(fresh.ballroom.princeHairColorId, lastHairColor);

  // Empty storage returns randomized initial state from config
  const emptyStorage = { getItem: () => null };
  const loadedFresh = loadState(emptyStorage, princessConfig);
  assert.ok(princessConfig.palettes.skinTones.some((s) => s.id === loadedFresh.princess.skinTone));
  assert.ok(princessConfig.palettes.skinTones.some((s) => s.id === loadedFresh.ballroom.princeSkinToneId));
  assert.ok(princessConfig.palettes.hairColors.some((h) => h.id === loadedFresh.ballroom.princeHairColorId));

  // Existing save in storage is preserved
  const savedStorage = {
    getItem: (key) =>
      key === STORAGE_KEY
        ? JSON.stringify({
            princess: { skinTone: 'porcelain', hairColor: 'strawberry' },
            ballroom: { princeSkinToneId: 'caramel', princeHairColorId: 'silver-star' }
          })
        : null
  };
  const loadedSaved = loadState(savedStorage, princessConfig);
  assert.equal(loadedSaved.princess.skinTone, 'porcelain');
  assert.equal(loadedSaved.princess.hairColor, 'strawberry');
  assert.equal(loadedSaved.ballroom.princeSkinToneId, 'caramel');
  assert.equal(loadedSaved.ballroom.princeHairColorId, 'silver-star');
});

test('Phase 4: normalizeState preserves characterTypeId, powerId, petId, petName and migrates older saves', () => {
  const migrated = normalizeState({ princess: { name: 'Princess Aria' } });
  assert.equal(migrated.princess.characterTypeId, 'princess');
  assert.equal(migrated.princess.powerId, 'starlight');
  assert.equal(migrated.princess.petId, 'none');
  assert.equal(migrated.princess.petName, '');

  const custom = normalizeState({
    princess: {
      characterTypeId: 'mermaid',
      powerId: 'bubbles',
      petId: 'seahorse',
      petName: 'Coral'
    }
  });
  assert.equal(custom.princess.characterTypeId, 'mermaid');
  assert.equal(custom.princess.powerId, 'bubbles');
  assert.equal(custom.princess.petId, 'seahorse');
  assert.equal(custom.princess.petName, 'Coral');
});
