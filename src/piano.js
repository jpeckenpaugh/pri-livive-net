export const PIANO_KEYS = [
  { id: 'C4', label: 'C', freq: 261.63, isBlack: false, keyHint: 'A', whiteIndex: 0 },
  { id: 'C#4', label: 'C#', freq: 277.18, isBlack: true, keyHint: 'W', whiteIndex: 0 },
  { id: 'D4', label: 'D', freq: 293.66, isBlack: false, keyHint: 'S', whiteIndex: 1 },
  { id: 'D#4', label: 'D#', freq: 311.13, isBlack: true, keyHint: 'E', whiteIndex: 1 },
  { id: 'E4', label: 'E', freq: 329.63, isBlack: false, keyHint: 'D', whiteIndex: 2 },
  { id: 'F4', label: 'F', freq: 349.23, isBlack: false, keyHint: 'F', whiteIndex: 3 },
  { id: 'F#4', label: 'F#', freq: 369.99, isBlack: true, keyHint: 'T', whiteIndex: 3 },
  { id: 'G4', label: 'G', freq: 392.0, isBlack: false, keyHint: 'G', whiteIndex: 4 },
  { id: 'G#4', label: 'G#', freq: 415.3, isBlack: true, keyHint: 'Y', whiteIndex: 4 },
  { id: 'A4', label: 'A', freq: 440.0, isBlack: false, keyHint: 'H', whiteIndex: 5 },
  { id: 'A#4', label: 'A#', freq: 466.16, isBlack: true, keyHint: 'U', whiteIndex: 5 },
  { id: 'B4', label: 'B', freq: 493.88, isBlack: false, keyHint: 'J', whiteIndex: 6 },
  { id: 'C5', label: 'C5', freq: 523.25, isBlack: false, keyHint: 'K', whiteIndex: 7 }
];

export const PRESET_SONGS = [
  {
    id: 'twinkle',
    label: 'Twinkle Star',
    icon: '⭐',
    notes: [
      { key: 'C4', delayMs: 0, durationMs: 320 },
      { key: 'C4', delayMs: 380, durationMs: 320 },
      { key: 'G4', delayMs: 760, durationMs: 320 },
      { key: 'G4', delayMs: 1140, durationMs: 320 },
      { key: 'A4', delayMs: 1520, durationMs: 320 },
      { key: 'A4', delayMs: 1900, durationMs: 320 },
      { key: 'G4', delayMs: 2280, durationMs: 640 },
      { key: 'F4', delayMs: 3040, durationMs: 320 },
      { key: 'F4', delayMs: 3420, durationMs: 320 },
      { key: 'E4', delayMs: 3800, durationMs: 320 },
      { key: 'E4', delayMs: 4180, durationMs: 320 },
      { key: 'D4', delayMs: 4560, durationMs: 320 },
      { key: 'D4', delayMs: 4940, durationMs: 320 },
      { key: 'C4', delayMs: 5320, durationMs: 680 }
    ]
  },
  {
    id: 'royal-waltz',
    label: 'Royal Waltz',
    icon: '👑',
    notes: [
      { key: 'E4', delayMs: 0, durationMs: 360 },
      { key: 'G4', delayMs: 380, durationMs: 260 },
      { key: 'C5', delayMs: 660, durationMs: 420 },
      { key: 'B4', delayMs: 1140, durationMs: 280 },
      { key: 'A4', delayMs: 1460, durationMs: 280 },
      { key: 'G4', delayMs: 1780, durationMs: 460 },
      { key: 'F4', delayMs: 2300, durationMs: 320 },
      { key: 'A4', delayMs: 2660, durationMs: 280 },
      { key: 'G4', delayMs: 2980, durationMs: 320 },
      { key: 'E4', delayMs: 3340, durationMs: 320 },
      { key: 'D4', delayMs: 3700, durationMs: 320 },
      { key: 'C4', delayMs: 4060, durationMs: 640 }
    ]
  },
  {
    id: 'royal-birthday',
    label: 'Royal Birthday',
    icon: '🎂',
    notes: [
      { key: 'C4', delayMs: 0, durationMs: 240 },
      { key: 'C4', delayMs: 270, durationMs: 240 },
      { key: 'D4', delayMs: 540, durationMs: 420 },
      { key: 'C4', delayMs: 1000, durationMs: 420 },
      { key: 'F4', delayMs: 1460, durationMs: 420 },
      { key: 'E4', delayMs: 1920, durationMs: 700 },
      { key: 'C4', delayMs: 2720, durationMs: 240 },
      { key: 'C4', delayMs: 2990, durationMs: 240 },
      { key: 'D4', delayMs: 3260, durationMs: 420 },
      { key: 'C4', delayMs: 3720, durationMs: 420 },
      { key: 'G4', delayMs: 4180, durationMs: 420 },
      { key: 'F4', delayMs: 4640, durationMs: 720 }
    ]
  }
];

const KEY_BY_ID = new Map(PIANO_KEYS.map((k) => [k.id, k]));
const KEY_BY_SHORTCUT = new Map(PIANO_KEYS.map((k) => [k.keyHint.toLowerCase(), k]));

export function getNoteFrequency(noteId) {
  return KEY_BY_ID.get(noteId)?.freq ?? null;
}

export function getKeyByKeyboard(keyChar) {
  if (typeof keyChar !== 'string') return null;
  return KEY_BY_SHORTCUT.get(keyChar.trim().toLowerCase()) ?? null;
}

export function createPianoPlayer() {
  let audioCtx = null;
  let muted = false;
  let activeTimers = [];

  function getContext() {
    if (audioCtx) return audioCtx;
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    return audioCtx;
  }

  function playNote(noteId, durationMs = 360) {
    if (muted) return false;
    const freq = getNoteFrequency(noteId);
    if (!freq) return false;

    const ctx = getContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const durationSec = Math.max(0.08, durationMs / 1000);

    // Warm piano/celesta blend: triangle fundamental + soft sine octave
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.25, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc1.connect(gainNode);
    osc2.connect(harmonicGain);
    harmonicGain.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSec + 0.03);
    osc2.stop(now + durationSec + 0.03);
    return true;
  }

  function stopSong() {
    for (const timer of activeTimers) {
      clearTimeout(timer);
    }
    activeTimers = [];
  }

  function playSong(songId, { onNote, onDone } = {}) {
    stopSong();
    const song = PRESET_SONGS.find((s) => s.id === songId);
    if (!song) {
      if (typeof onDone === 'function') onDone();
      return () => {};
    }

    let maxEndMs = 0;
    for (const note of song.notes) {
      const endMs = note.delayMs + note.durationMs;
      if (endMs > maxEndMs) maxEndMs = endMs;

      const timer = setTimeout(() => {
        playNote(note.key, note.durationMs);
        if (typeof onNote === 'function') {
          onNote(note.key, note.durationMs);
        }
      }, note.delayMs);
      activeTimers.push(timer);
    }

    const doneTimer = setTimeout(() => {
      activeTimers = [];
      if (typeof onDone === 'function') onDone();
    }, maxEndMs + 120);
    activeTimers.push(doneTimer);

    return stopSong;
  }

  return {
    playNote,
    playSong,
    stopSong,
    setMuted(nextMuted) {
      muted = Boolean(nextMuted);
    },
    isMuted() {
      return muted;
    }
  };
}
