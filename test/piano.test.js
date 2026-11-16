import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PIANO_KEYS,
  PRESET_SONGS,
  getNoteFrequency,
  getKeyByKeyboard,
  createPianoPlayer
} from '../src/piano.js';

test('PIANO_KEYS defines 13 keys from C4 to C5 with 8 white and 5 black keys', () => {
  assert.equal(PIANO_KEYS.length, 13);
  assert.equal(PIANO_KEYS.filter((k) => !k.isBlack).length, 8);
  assert.equal(PIANO_KEYS.filter((k) => k.isBlack).length, 5);
  assert.equal(PIANO_KEYS[0].id, 'C4');
  assert.equal(PIANO_KEYS[PIANO_KEYS.length - 1].id, 'C5');
});

test('getNoteFrequency and getKeyByKeyboard resolve valid notes and shortcuts', () => {
  assert.equal(getNoteFrequency('A4'), 440);
  assert.equal(getNoteFrequency('C5'), 523.25);
  assert.equal(getNoteFrequency('UNKNOWN'), null);

  assert.equal(getKeyByKeyboard('a')?.id, 'C4');
  assert.equal(getKeyByKeyboard('W')?.id, 'C#4');
  assert.equal(getKeyByKeyboard('k')?.id, 'C5');
  assert.equal(getKeyByKeyboard('z'), null);
});

test('PRESET_SONGS contains 3 songs with valid piano keys', () => {
  assert.equal(PRESET_SONGS.length, 3);
  for (const song of PRESET_SONGS) {
    assert.ok(song.id && song.label && song.notes.length > 0);
    for (const note of song.notes) {
      assert.ok(getNoteFrequency(note.key) !== null, `Invalid note ${note.key} in ${song.id}`);
    }
  }
});

test('createPianoPlayer is import-safe in Node and respects mute toggle', () => {
  const player = createPianoPlayer();
  assert.equal(player.isMuted(), false);
  assert.equal(player.playNote('C4'), false);
  player.setMuted(true);
  assert.equal(player.isMuted(), true);
  assert.equal(player.playNote('C4'), false);
  player.stopSong();
});
