import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getEpisodeById, resolveEpisodeEnding, renderEpisodeSceneSvg } from '../src/episodes.js';
import { DEFAULT_STATE } from '../src/state.js';

const episodesConfig = JSON.parse(
  fs.readFileSync(new URL('../data/episodes_config.json', import.meta.url), 'utf8')
);
const princessConfig = JSON.parse(
  fs.readFileSync(new URL('../data/princess_config.json', import.meta.url), 'utf8')
);

test('getEpisodeById returns matching episode or null', () => {
  const ep = getEpisodeById(episodesConfig, 'new-princess-at-school');
  assert.ok(ep);
  assert.equal(ep.title, 'The New Princess at School');
  assert.equal(getEpisodeById(episodesConfig, 'non-existent'), null);
});

test('resolveEpisodeEnding returns welcoming ending when kindnessCount >= 3 and exclusionary otherwise', () => {
  const ep = getEpisodeById(episodesConfig, 'new-princess-at-school');
  const welcoming = resolveEpisodeEnding(ep, 3);
  assert.equal(welcoming.type, 'welcoming');
  assert.equal(welcoming.mayaMood, 'happy');

  const exclusionary = resolveEpisodeEnding(ep, 2);
  assert.equal(exclusionary.type, 'exclusionary');
  assert.equal(exclusionary.mayaMood, 'shy');
});

test('renderEpisodeSceneSvg composites player paper doll, Princess Maya, and reaction overlay', () => {
  const ep = getEpisodeById(episodesConfig, 'new-princess-at-school');
  const svg = renderEpisodeSceneSvg(ep, 0, DEFAULT_STATE, princessConfig, {
    mayaMood: 'happy',
    reactionType: 'sparkle'
  });
  assert.ok(svg.includes('class="episode-scene-svg"'));
  assert.ok(svg.includes('id="episode-maya"'));
  assert.ok(svg.includes('episode-maya--happy'));
  assert.ok(svg.includes('episode-reaction--sparkle'));
  assert.ok(svg.includes('<svg'));
});

test('4 new pal episodes resolve endings and render their pal names', () => {
  const newEpisodeIds = [
    ['crystal-cave-adventure', 'Princess Crystal'],
    ['starlight-lantern-festival', 'Princess Aurora'],
    ['coral-reef-treasure', 'Princess Coral'],
    ['whispering-woods-picnic', 'Princess Willow']
  ];
  for (const [id, palName] of newEpisodeIds) {
    const ep = getEpisodeById(episodesConfig, id);
    assert.ok(ep, `Expected episode ${id}`);
    const welcoming = resolveEpisodeEnding(ep, ep.kindnessThreshold);
    assert.equal(welcoming.type, 'welcoming');
    const svg = renderEpisodeSceneSvg(ep, 0, DEFAULT_STATE, princessConfig, {
      mayaMood: 'happy',
      reactionType: 'sparkle'
    });
    assert.ok(svg.includes(palName), `Expected ${palName} in SVG for ${id}`);
  }
});
