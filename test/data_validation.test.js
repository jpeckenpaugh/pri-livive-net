import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function readJson(relPath) {
  const fullPath = path.resolve(process.cwd(), relPath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

test('princess_config.json has required palettes, items, and royalNames', () => {
  const config = readJson('data/princess_config.json');
  assert.ok(config.palettes.skinTones.length >= 4);
  assert.ok(config.palettes.hairColors.length >= 6);
  assert.ok(config.palettes.gownColors.length >= 6);
  assert.ok(config.palettes.tiaraMetals.length >= 3);
  assert.ok(config.palettes.tiaraGems.length >= 4);
  assert.ok(config.palettes.makeup.lipstick.length >= 4);
  assert.ok(config.palettes.makeup.blush.length >= 3);
  assert.ok(config.palettes.makeup.eyeshadow.length >= 4);
  assert.ok(config.palettes.makeup.faceGems.length >= 3);

  assert.ok(config.items.hairstyles.length >= 4);
  assert.ok(config.items.gowns.length >= 4);
  assert.ok(config.items.tiaras.length >= 3);
  assert.ok(config.items.accessories.handheld.length >= 3);
  assert.ok(config.items.accessories.necklaces.length >= 2);
  assert.ok(config.items.accessories.wings.length >= 2);

  assert.ok(config.royalNames.prefixes.length >= 2);
  assert.ok(config.royalNames.firstNames.length >= 6);
  assert.ok(config.royalNames.realms.length >= 4);
});

test('coloring_pages.json has 16-color palette and 5 distinct coloring pages including Blank Canvas', () => {
  const data = readJson('data/coloring_pages.json');
  assert.equal(data.coloringPalette.length, 16);
  assert.equal(data.pages.length, 5);
  const ids = data.pages.map((p) => p.id);
  assert.deepEqual(ids, [
    'royal-princess-ballgown',
    'enchanted-castle',
    'magical-tiara-cushion',
    'winged-unicorn',
    'blank-canvas'
  ]);
  for (const page of data.pages) {
    assert.ok(page.regions.length >= 1, `${page.id} should have clickable regions`);
    assert.ok(Array.isArray(page.lines), `${page.id} should have lines`);
  }
});

test('sounds.json has all 8 required Web Audio cues', () => {
  const sounds = readJson('data/sounds.json');
  const expectedCues = [
    'ui-click',
    'dress-change',
    'sparkle-chime',
    'makeup-apply',
    'makeup-clear',
    'color-fill',
    'color-undo',
    'royal-fanfare'
  ];
  for (const cue of expectedCues) {
    assert.ok(sounds[cue], `Missing cue: ${cue}`);
    assert.ok(Array.isArray(sounds[cue].notes) && sounds[cue].notes.length >= 1);
  }
});

test('ballroom_config.json has skyThemes, chandeliers, bannerStyles, bannerColors, floors, and decors', () => {
  const ballroom = JSON.parse(fs.readFileSync(new URL('../data/ballroom_config.json', import.meta.url), 'utf8'));
  assert.ok(Array.isArray(ballroom.skyThemes) && ballroom.skyThemes.length >= 4);
  assert.ok(Array.isArray(ballroom.chandeliers) && ballroom.chandeliers.length >= 3);
  assert.ok(Array.isArray(ballroom.bannerStyles) && ballroom.bannerStyles.length >= 3);
  assert.ok(Array.isArray(ballroom.bannerColors) && ballroom.bannerColors.length >= 6);
  assert.ok(Array.isArray(ballroom.floors) && ballroom.floors.length >= 3);
  assert.ok(Array.isArray(ballroom.decors) && ballroom.decors.length >= 3);
});

test('sounds.json includes ballroom-enter cue', () => {
  const sounds = JSON.parse(fs.readFileSync(new URL('../data/sounds.json', import.meta.url), 'utf8'));
  assert.ok(sounds['ballroom-enter'] && Array.isArray(sounds['ballroom-enter'].notes) && sounds['ballroom-enter'].notes.length > 0);
});

test('Phase 4: princess_config.json has characterTypes, powers, pets and sounds.json has power-cast', async () => {
  const { readFile } = await import('node:fs/promises');
  const config = JSON.parse(await readFile(new URL('../data/princess_config.json', import.meta.url), 'utf8'));
  const sounds = JSON.parse(await readFile(new URL('../data/sounds.json', import.meta.url), 'utf8'));

  assert.ok(Array.isArray(config.characterTypes) && config.characterTypes.length >= 5);
  assert.ok(Array.isArray(config.powers) && config.powers.length >= 5);
  assert.ok(Array.isArray(config.pets) && config.pets.length >= 6);
  assert.ok(sounds['power-cast'] && Array.isArray(sounds['power-cast'].notes));
});

test('Make Your Own Gown: princess_config.json has customGownOptions', () => {
  const config = readJson('data/princess_config.json');
  const opts = config.customGownOptions;
  assert.ok(opts && typeof opts === 'object');
  assert.ok(Array.isArray(opts.bodices) && opts.bodices.length >= 4);
  assert.ok(Array.isArray(opts.skirts) && opts.skirts.length >= 4);
  assert.ok(Array.isArray(opts.sleeves) && opts.sleeves.length >= 4);
  assert.ok(Array.isArray(opts.waistTrims) && opts.waistTrims.length >= 4);
  assert.ok(Array.isArray(opts.patterns) && opts.patterns.length >= 5);
  assert.ok(Array.isArray(opts.colors) && opts.colors.length >= 8);
});

test('Phase 5: lessons_config.json defines 5 valid subjects and 25 lessons for Royal Academy', () => {
  const lessons = readJson('data/lessons_config.json');
  assert.equal(typeof lessons.starRewardPerLesson, 'number');
  assert.equal(lessons.subjects.length, 5);
  assert.deepEqual(
    lessons.subjects.map((s) => s.id),
    ['math', 'spelling', 'science', 'music', 'geography']
  );

  const allLessons = lessons.subjects.flatMap((s) => s.lessons || []);
  assert.equal(allLessons.length, 25);
  for (const subj of lessons.subjects) {
    assert.equal(subj.lessons.length, 5);
    assert.equal(subj.lessons[0].id, subj.id);
    for (let i = 1; i < 5; i += 1) {
      assert.equal(subj.lessons[i].id, `${subj.id}-${i + 1}`);
    }
  }

  const spelling = lessons.subjects.find((s) => s.id === 'spelling');
  assert.deepEqual(
    spelling.lessons[0].words.map((w) => w.word),
    ['CASTLE', 'SPARKLE', 'TIARA', 'DRAGON']
  );
  assert.deepEqual(
    spelling.lessons[1].words.map((w) => w.word),
    ['UNICORN', 'MERMAID', 'PHOENIX', 'PEGASUS']
  );

  const music = lessons.subjects.find((s) => s.id === 'music');
  for (const mel of music.lessons[0].melodies) {
    assert.equal(mel.notes.length, 3);
  }
  for (const mel of music.lessons[1].melodies) {
    assert.equal(mel.notes.length, 4);
  }
});

test('Pet Customization & Shoes: princess_config.json has petColors, petAccessories, items.shoes, and palettes.shoeColors', () => {
  const config = readJson('data/princess_config.json');
  assert.ok(Array.isArray(config.petColors) && config.petColors.length >= 6);
  assert.ok(Array.isArray(config.petAccessories) && config.petAccessories.length >= 6);
  assert.ok(Array.isArray(config.items?.shoes) && config.items.shoes.length >= 5);
  assert.ok(Array.isArray(config.palettes?.shoeColors) && config.palettes.shoeColors.length >= 5);
});

test('Ballroom Guests & Dance Styles: ballroom_config.json has guests and danceStyles', () => {
  const ballroom = readJson('data/ballroom_config.json');
  assert.ok(Array.isArray(ballroom.guests) && ballroom.guests.length >= 6);
  for (const guest of ballroom.guests) {
    assert.ok(guest.id && guest.label && guest.type);
    assert.ok(guest.skinHex && guest.hairHex && guest.outfitHex && guest.accentHex);
  }
  assert.ok(Array.isArray(ballroom.danceStyles) && ballroom.danceStyles.length >= 3);
  assert.deepEqual(
    ballroom.danceStyles.map((d) => d.id),
    ['waltz', 'twirl', 'bounce']
  );
});

test('Tiara Settings: princess_config.json has expanded tiaraMetals, tiaraGems, tiaraSizes, and tiaraEffects', () => {
  const config = readJson('data/princess_config.json');
  assert.ok(config.palettes.tiaraMetals.length >= 5);
  assert.ok(config.palettes.tiaraGems.length >= 8);
  assert.deepEqual(
    config.palettes.tiaraSizes.map((s) => s.id),
    ['delicate', 'classic', 'grand']
  );
  assert.deepEqual(
    config.palettes.tiaraEffects.map((e) => e.id),
    ['none', 'twinkle', 'glow']
  );
});
