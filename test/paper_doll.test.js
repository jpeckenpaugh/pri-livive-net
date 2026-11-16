import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderPaperDollSvg } from '../src/paper_doll.js';
import { DEFAULT_STATE } from '../src/state.js';

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'data/princess_config.json'), 'utf8')
);

test('renderPaperDollSvg outputs 17-layer SVG with CSS variables', () => {
  const svg = renderPaperDollSvg(DEFAULT_STATE.princess, config);
  assert.ok(svg.startsWith('<svg class="paper-doll-svg"'));
  assert.ok(svg.includes('--skin-color:'));
  assert.ok(svg.includes('--hair-color:'));
  assert.ok(svg.includes('--gown-primary:'));
  assert.ok(svg.includes('id="layer-aura"'));
  assert.ok(svg.includes('id="layer-wings"'));
  assert.ok(svg.includes('id="layer-hair-back"'));
  assert.ok(svg.includes('id="layer-gown"'));
  assert.ok(svg.includes('id="layer-tiara"'));
  assert.ok(svg.includes('id="layer-handheld"'));
});

test('renderPaperDollSvg updates wings, faceGems, and makeup colors', () => {
  const princess = {
    ...DEFAULT_STATE.princess,
    wings: 'fairy-wings',
    makeup: {
      lipstick: 'berry',
      blush: 'soft-pink',
      eyeshadow: 'lavender',
      faceGems: 'stars'
    }
  };
  const svg = renderPaperDollSvg(princess, config);
  assert.ok(svg.includes('class="doll-wings"'));
  assert.ok(svg.includes('--lip-color: #E63946'));
  assert.ok(svg.includes('id="layer-face-gems"'));
});

test('Phase 4: renderPaperDollSvg renders character types, pet companion, and power burst', () => {
  const mermaidSvg = renderPaperDollSvg(
    { ...DEFAULT_STATE.princess, characterTypeId: 'mermaid', petId: 'seahorse', petName: 'Bubbles' },
    config,
    { powerBurst: true }
  );
  assert.ok(mermaidSvg.includes('id="layer-mermaid-tail"'));
  assert.ok(mermaidSvg.includes('id="layer-pet"'));
  assert.ok(mermaidSvg.includes('Bubbles'));
  assert.ok(mermaidSvg.includes('id="layer-power-burst"'));

  const angelSvg = renderPaperDollSvg({ ...DEFAULT_STATE.princess, characterTypeId: 'angel' }, config);
  assert.ok(angelSvg.includes('character-angel-halo'));
  assert.ok(angelSvg.includes('character-angel-wings'));

  const demonSvg = renderPaperDollSvg({ ...DEFAULT_STATE.princess, characterTypeId: 'demon' }, config);
  assert.ok(demonSvg.includes('character-demon-horns'));
  assert.ok(demonSvg.includes('character-demon-wings'));
});

test('Make Your Own Gown: renderPaperDollSvg renders custom bodice, skirt, sleeves, waist trim, and SVG pattern', () => {
  const customPrincess = {
    ...DEFAULT_STATE.princess,
    gownMode: 'custom',
    customGown: {
      bodiceId: 'corset',
      skirtId: 'petal',
      sleevesId: 'bell',
      waistTrimId: 'bow',
      patternId: 'stars',
      skirtColor: '#A06CD5',
      bodiceColor: '#FFD166',
      trimColor: '#FFF8F0'
    }
  };
  const svg = renderPaperDollSvg(customPrincess, config);
  assert.ok(svg.includes('<pattern id="custom-gown-pattern"'));
  assert.ok(svg.includes('fill="url(#custom-gown-pattern)"'));
  assert.ok(svg.includes('id="layer-waist-trim"'));
  assert.ok(svg.includes('fill="#A06CD5"'));
  assert.ok(svg.includes('fill="#FFD166"'));
  assert.ok(svg.includes('fill="#FFF8F0"'));
});
