import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderBallroomSvg } from '../src/ballroom.js';
import { DEFAULT_STATE } from '../src/state.js';

const princessConfig = JSON.parse(fs.readFileSync(new URL('../data/princess_config.json', import.meta.url), 'utf8'));
const ballroomConfig = JSON.parse(fs.readFileSync(new URL('../data/ballroom_config.json', import.meta.url), 'utf8'));

test('renderBallroomSvg renders the ballroom scene with composited princess doll', () => {
  const svg = renderBallroomSvg(DEFAULT_STATE.ballroom, ballroomConfig, DEFAULT_STATE.princess, princessConfig);
  assert.ok(svg.includes('class="ballroom-svg"'));
  assert.ok(svg.includes('class="ballroom-princess-slot"'));
  assert.ok(svg.includes('class="paper-doll-svg"'));
  assert.ok(svg.includes('data-floor="marble-red-carpet"'));
  assert.ok(svg.includes('data-chandelier="crystal-chandelier"'));
});

test('renderBallroomSvg reflects customized skyTheme, chandelier, bannerStyle, floor, and decor', () => {
  const customBallroom = {
    skyTheme: 'crystal-ice',
    chandelier: 'fairy-lanterns',
    bannerStyle: 'heart-pennants',
    bannerColor: 'lavender',
    floor: 'starry-dance-floor',
    decor: 'glowing-columns'
  };
  const svg = renderBallroomSvg(customBallroom, ballroomConfig, DEFAULT_STATE.princess, princessConfig);
  assert.ok(svg.includes('#0284C7'));
  assert.ok(svg.includes('data-chandelier="fairy-lanterns"'));
  assert.ok(svg.includes('data-banner-style="heart-pennants"'));
  assert.ok(svg.includes('#C084FC'));
  assert.ok(svg.includes('data-floor="starry-dance-floor"'));
  assert.ok(svg.includes('data-decor="glowing-columns"'));
});

test('renderBallroomSvg renders the Prince and musical notes when dancing is true', () => {
  const dancingBallroom = {
    ...DEFAULT_STATE.ballroom,
    dancing: true,
    princeOutfitColor: 'crimson'
  };
  const svg = renderBallroomSvg(dancingBallroom, ballroomConfig, DEFAULT_STATE.princess, princessConfig);
  assert.ok(svg.includes('class="ballroom-prince-slot is-dancing"'));
  assert.ok(svg.includes('data-prince-outfit="crimson"'));
  assert.ok(svg.includes('class="ballroom-music-notes"'));
  assert.ok(svg.includes('class="ballroom-princess-slot is-dancing"'));
});

test('renderBallroomSvg renders the Prince with custom princeSkinToneId and princeHairColorId', () => {
  const espressoSkin = princessConfig.palettes.skinTones.find((s) => s.id === 'espresso');
  const midnightHair = princessConfig.palettes.hairColors.find((h) => h.id === 'midnight');
  const dancingBallroom = {
    ...DEFAULT_STATE.ballroom,
    dancing: true,
    princeSkinToneId: 'espresso',
    princeHairColorId: 'midnight'
  };
  const svg = renderBallroomSvg(dancingBallroom, ballroomConfig, DEFAULT_STATE.princess, princessConfig);
  assert.ok(svg.includes('data-prince-skin="espresso"'));
  assert.ok(svg.includes('data-prince-hair="midnight"'));
  assert.ok(svg.includes(`fill="${espressoSkin.hex}"`));
  assert.ok(svg.includes(`fill="${midnightHair.hex}"`));
});

test('Phase 4: renderBallroomSvg includes the Princess pet companion when petId is set', () => {
  const svg = renderBallroomSvg(
    DEFAULT_STATE.ballroom,
    ballroomConfig,
    { ...DEFAULT_STATE.princess, petId: 'dragon', petName: 'Sparky' },
    princessConfig
  );
  assert.ok(svg.includes('id="layer-pet"'));
  assert.ok(svg.includes('Sparky'));
});
