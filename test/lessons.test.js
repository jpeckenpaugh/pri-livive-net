import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  getSubjectById,
  getSubjectLessons,
  getLessonById,
  checkQuizAnswer,
  checkSpellingWord,
  shuffleLetters,
  checkMelodyEcho,
  awardLessonStars,
  getAcademyProgress
} from '../src/lessons.js';

const lessonsConfig = JSON.parse(fs.readFileSync(new URL('../data/lessons_config.json', import.meta.url), 'utf8'));

test('getSubjectById and getLessonById return matching entries or null', () => {
  const math = getSubjectById(lessonsConfig, 'math');
  assert.equal(math?.title, 'Royal Treasury');
  assert.equal(getSubjectLessons(math).length, 5);
  assert.equal(getSubjectById(lessonsConfig, 'nonexistent'), null);

  const math2 = getLessonById(lessonsConfig, 'math-2');
  assert.equal(math2?.title, 'Crown Sharing & Fractions');
  assert.equal(math2?.icon, '💎');
  assert.equal(getLessonById(lessonsConfig, 'nonexistent'), null);
});

test('checkQuizAnswer validates multiple-choice answers', () => {
  const q = { id: 'q1', answer: '9' };
  assert.equal(checkQuizAnswer(q, '9'), true);
  assert.equal(checkQuizAnswer(q, '8'), false);
  assert.equal(checkQuizAnswer(null, '9'), false);
});

test('checkSpellingWord and shuffleLetters work for royal words', () => {
  const tiles = shuffleLetters('CASTLE', () => 0.5);
  assert.equal(tiles.length, 6);
  assert.deepEqual(
    tiles.map((t) => t.letter).sort(),
    ['A', 'C', 'E', 'L', 'S', 'T']
  );
  assert.equal(checkSpellingWord('CASTLE', ['C', 'A', 'S', 'T', 'L', 'E']), true);
  assert.equal(checkSpellingWord('CASTLE', ['C', 'A', 'S', 'T', 'L']), false);
});

test('checkMelodyEcho matches 3-note sequences', () => {
  assert.equal(checkMelodyEcho(['C4', 'E4', 'G4'], ['C4', 'E4', 'G4']), true);
  assert.equal(checkMelodyEcho(['C4', 'E4', 'G4'], ['C4', 'E4', 'C5']), false);
  assert.equal(checkMelodyEcho(['C4', 'E4', 'G4'], ['C4', 'E4']), false);
});

test('awardLessonStars awards stars once per lesson and getAcademyProgress summarizes', () => {
  const first = awardLessonStars({ stars: 0, completedLessons: [] }, 'math', 3);
  assert.equal(first.stars, 3);
  assert.deepEqual(first.completedLessons, ['math']);
  assert.equal(first.newlyCompleted, true);

  const repeat = awardLessonStars(first, 'math', 3);
  assert.equal(repeat.stars, 3);
  assert.equal(repeat.newlyCompleted, false);

  const second = awardLessonStars(repeat, 'math-2', 3);
  assert.equal(second.stars, 6);
  assert.deepEqual(second.completedLessons, ['math', 'math-2']);
  assert.equal(second.newlyCompleted, true);

  const progress = getAcademyProgress(second, lessonsConfig);
  assert.equal(progress.stars, 6);
  assert.equal(progress.completedCount, 2);
  assert.equal(progress.totalCount, 25);
  assert.equal(progress.percent, 8);
});
