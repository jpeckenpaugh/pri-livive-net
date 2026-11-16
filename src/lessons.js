export function getSubjectById(lessonsConfig, subjectId) {
  if (!lessonsConfig || !Array.isArray(lessonsConfig.subjects)) return null;
  return lessonsConfig.subjects.find((s) => s.id === subjectId) || null;
}

export function checkQuizAnswer(question, selectedOption) {
  if (!question || typeof question.answer !== 'string') return false;
  return selectedOption === question.answer;
}

export function checkSpellingWord(targetWord, enteredLetters) {
  if (typeof targetWord !== 'string' || !Array.isArray(enteredLetters)) return false;
  return enteredLetters.join('') === targetWord;
}

export function shuffleLetters(word, rng = Math.random) {
  if (typeof word !== 'string') return [];
  const tiles = word.split('').map((letter, idx) => ({
    id: `tile-${idx}`,
    letter
  }));
  for (let i = tiles.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = tiles[i];
    tiles[i] = tiles[j];
    tiles[j] = tmp;
  }
  return tiles;
}

export function checkMelodyEcho(targetNotes, playedNotes) {
  if (!Array.isArray(targetNotes) || !Array.isArray(playedNotes)) return false;
  if (targetNotes.length === 0 || playedNotes.length !== targetNotes.length) return false;
  return targetNotes.every((note, idx) => playedNotes[idx] === note);
}

export function awardLessonStars(academyState, lessonId, starsToAward = 3) {
  const current = academyState && typeof academyState === 'object' ? academyState : {};
  const stars = typeof current.stars === 'number' && current.stars >= 0 ? Math.floor(current.stars) : 0;
  const completedLessons = Array.isArray(current.completedLessons) ? [...current.completedLessons] : [];

  if (typeof lessonId !== 'string' || lessonId.trim().length === 0) {
    return { stars, completedLessons, newlyCompleted: false };
  }

  if (completedLessons.includes(lessonId)) {
    return { stars, completedLessons, newlyCompleted: false };
  }

  completedLessons.push(lessonId);
  const reward = typeof starsToAward === 'number' && starsToAward > 0 ? Math.floor(starsToAward) : 0;
  return {
    stars: stars + reward,
    completedLessons,
    newlyCompleted: true
  };
}

export function getAcademyProgress(academyState, lessonsConfig) {
  const stars =
    academyState && typeof academyState.stars === 'number' && academyState.stars >= 0
      ? Math.floor(academyState.stars)
      : 0;
  const completed =
    academyState && Array.isArray(academyState.completedLessons) ? academyState.completedLessons : [];
  const subjects = lessonsConfig && Array.isArray(lessonsConfig.subjects) ? lessonsConfig.subjects : [];
  const totalCount = subjects.length;
  const completedCount = subjects.filter((s) => completed.includes(s.id)).length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    stars,
    completedCount,
    totalCount,
    percent
  };
}
