import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_STATE,
  STORAGE_KEY,
  createStore,
  loadState,
  normalizeState
} from '../src/state.js';

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
