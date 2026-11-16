export function createSoundPlayer(soundsMap = {}) {
  let audioCtx = null;
  let muted = false;

  function getContext() {
    if (audioCtx) return audioCtx;
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    return audioCtx;
  }

  function playCue(cueId) {
    if (muted) return false;
    const cue = soundsMap?.[cueId];
    if (!cue || !Array.isArray(cue.notes) || cue.notes.length === 0) {
      return false;
    }

    const ctx = getContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    for (const note of cue.notes) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const start = now + (note.delay || 0);
      const duration = note.duration || 0.1;
      const peakGain = note.gain ?? 0.14;

      osc.type = note.type || 'sine';
      osc.frequency.setValueAtTime(note.freq || 523.25, start);

      gainNode.gain.setValueAtTime(0.0001, start);
      gainNode.gain.exponentialRampToValueAtTime(peakGain, start + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.02);
    }
    return true;
  }

  return {
    playCue,
    setMuted(nextMuted) {
      muted = Boolean(nextMuted);
    },
    isMuted() {
      return muted;
    }
  };
}
