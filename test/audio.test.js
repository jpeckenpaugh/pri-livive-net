import test from 'node:test';
import assert from 'node:assert/strict';
import { createSoundPlayer } from '../src/audio.js';
import { announcePrincess, pickBestVoice } from '../src/speech.js';

test('createSoundPlayer is import-safe in Node and respects mute toggle', () => {
  const player = createSoundPlayer({
    'ui-click': { notes: [{ freq: 587.33, duration: 0.06 }] }
  });
  assert.equal(player.isMuted(), false);
  player.setMuted(true);
  assert.equal(player.isMuted(), true);
  assert.equal(player.playCue('ui-click'), false);
});

test('announcePrincess is import-safe in Node when speechSynthesis is absent', () => {
  assert.equal(announcePrincess('Princess Luna', { muted: false }), false);
  assert.equal(announcePrincess('Princess Luna', { muted: true }), false);
});

test('pickBestVoice prefers Google/Enhanced English voices over novelty voices', () => {
  const voices = [
    { name: 'Albert', lang: 'en-US', localService: true },
    { name: 'Samantha', lang: 'en-US', localService: true },
    { name: 'Google US English', lang: 'en-US', localService: false }
  ];
  assert.equal(pickBestVoice(voices)?.name, 'Google US English');
  assert.equal(pickBestVoice([]), null);
});
