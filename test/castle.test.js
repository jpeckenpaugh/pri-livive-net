import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  renderCastleSceneSvg,
  isCastleItemOwned,
  getShopItems,
  purchaseCastleItem
} from '../src/castle.js';
import { DEFAULT_STATE, normalizeState } from '../src/state.js';

const castleConfig = JSON.parse(
  readFileSync(new URL('../data/castle_config.json', import.meta.url), 'utf8')
);

test('renderCastleSceneSvg renders exterior and throne room SVGs', () => {
  const exteriorSvg = renderCastleSceneSvg(
    { activeView: 'exterior', exterior: DEFAULT_STATE.castle.exterior },
    castleConfig
  );
  assert.match(exteriorSvg, /<svg[^>]+aria-label="Castle Exterior"/);

  const throneSvg = renderCastleSceneSvg(
    { activeView: 'throne', throne: DEFAULT_STATE.castle.throne },
    castleConfig,
    { princessSvg: '<g id="mock-princess"></g>' }
  );
  assert.match(throneSvg, /<svg[^>]+aria-label="Castle Throne Room"/);
  assert.match(throneSvg, /id="mock-princess"/);
});

test('getShopItems returns all priced items and isCastleItemOwned checks starter vs unlocked', () => {
  const shopItems = getShopItems(castleConfig);
  assert.ok(shopItems.length >= 12);
  assert.ok(shopItems.every((item) => item.price > 0));

  const starter = castleConfig.exterior.styles[0];
  assert.equal(isCastleItemOwned(DEFAULT_STATE, starter), true);

  const paid = shopItems[0];
  assert.equal(isCastleItemOwned(DEFAULT_STATE, paid), false);

  const withUnlock = { ...DEFAULT_STATE, unlockedCastleItems: [paid.id] };
  assert.equal(isCastleItemOwned(withUnlock, paid), true);
});

test('purchaseCastleItem handles insufficient stars, successful purchase, and already owned', () => {
  const shopItems = getShopItems(castleConfig);
  const item = shopItems.find((i) => i.price >= 3);
  assert.ok(item);

  const poorState = {
    ...DEFAULT_STATE,
    academy: { stars: item.price - 1, completedLessons: ['l1'] },
    episodes: { completed: ['ep1'] }
  };
  const failRes = purchaseCastleItem(poorState, item);
  assert.equal(failRes.ok, false);
  assert.equal(failRes.reason, 'insufficient-stars');
  assert.equal(failRes.nextState.academy.stars, item.price - 1);

  const richState = {
    ...DEFAULT_STATE,
    academy: { stars: item.price + 2, completedLessons: ['l1'] },
    episodes: { completed: ['ep1'] }
  };
  const okRes = purchaseCastleItem(richState, item);
  assert.equal(okRes.ok, true);
  assert.equal(okRes.reason, 'purchased');
  assert.equal(okRes.nextState.academy.stars, 2);
  assert.deepEqual(okRes.nextState.academy.completedLessons, ['l1']);
  assert.deepEqual(okRes.nextState.episodes.completed, ['ep1']);
  assert.ok(okRes.nextState.unlockedCastleItems.includes(item.id));

  const dupRes = purchaseCastleItem(okRes.nextState, item);
  assert.equal(dupRes.ok, false);
  assert.equal(dupRes.reason, 'already-owned');
});

test('normalizeState migrates older saves without castle and preserves valid castle state', () => {
  const migrated = normalizeState({ version: 1, academy: { stars: 5, completedLessons: [] } });
  assert.equal(migrated.castle.activeView, 'exterior');
  assert.equal(migrated.castle.exterior.style, 'classic-keep');
  assert.deepEqual(migrated.unlockedCastleItems, []);

  const preserved = normalizeState({
    version: 1,
    castle: {
      activeView: 'throne',
      exterior: { style: 'crystal-palace' },
      throne: { thrones: 'crystal-butterfly' }
    },
    unlockedCastleItems: ['crystal-palace', 'crystal-butterfly', 'crystal-palace', '']
  });
  assert.equal(preserved.castle.activeView, 'throne');
  assert.equal(preserved.castle.exterior.style, 'crystal-palace');
  assert.equal(preserved.castle.throne.thrones, 'crystal-butterfly');
  assert.deepEqual(preserved.unlockedCastleItems, ['crystal-palace', 'crystal-butterfly']);
});
