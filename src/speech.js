const PREFERRED_VOICES = [
  'google us english',
  'google uk english female',
  'samantha (enhanced)',
  'ava (enhanced)',
  'allison (enhanced)',
  'zoe (enhanced)',
  'samantha',
  'ava',
  'allison',
  'zoe',
  'karen',
  'victoria',
  'serena',
  'moira',
  'tessa'
];

const AVOID_VOICES = new Set([
  'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
  'deranged', 'fred', 'good news', 'hysterical', 'junior', 'kathy',
  'pipe organ', 'ralph', 'trinoids', 'whisper', 'zarvox'
]);

let cachedVoices = [];
if (globalThis.speechSynthesis && typeof globalThis.speechSynthesis.getVoices === 'function') {
  cachedVoices = globalThis.speechSynthesis.getVoices();
  if (typeof globalThis.speechSynthesis.addEventListener === 'function') {
    globalThis.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoices = globalThis.speechSynthesis.getVoices();
    });
  }
}

export function pickBestVoice(voices) {
  if (!Array.isArray(voices) || voices.length === 0) return null;
  const english = voices.filter((v) => String(v?.lang || '').toLowerCase().startsWith('en'));
  const pool = english.length > 0 ? english : voices;

  let best = null;
  let bestScore = -Infinity;

  for (const voice of pool) {
    const name = String(voice?.name || '').toLowerCase();
    const lang = String(voice?.lang || '').toLowerCase();
    let score = 0;

    if (AVOID_VOICES.has(name)) score -= 50;
    if (name.includes('google us english')) score += 100;
    else if (name.includes('google uk english female')) score += 95;
    if (name.includes('natural') || name.includes('neural')) score += 85;
    if (name.includes('enhanced') || name.includes('premium')) score += 80;

    const prefIdx = PREFERRED_VOICES.findIndex((p) => name.includes(p));
    if (prefIdx !== -1) score += 60 - prefIdx;

    if (lang === 'en-us') score += 15;
    if (voice?.localService === false && name.includes('google')) score += 10;

    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  return best;
}

export function speakText(text, { muted = false } = {}) {
  if (muted) return false;
  const synth = globalThis.speechSynthesis;
  const Utterance = globalThis.SpeechSynthesisUtterance;
  if (!synth || !Utterance) return false;

  try {
    if (typeof synth.cancel === 'function') {
      synth.cancel();
    }
    const cleanText = String(text || '').trim();
    if (!cleanText) return false;
    const utterance = new Utterance(cleanText);
    if (typeof synth.getVoices === 'function') {
      const voice = pickBestVoice(synth.getVoices());
      if (voice) utterance.voice = voice;
    }
    utterance.rate = 0.98;
    utterance.pitch = 1.04;
    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function announcePrincess(name, { muted = false } = {}) {
  const cleanName = (name || 'Princess Luna').trim();
  return speakText(`Hear ye, hear ye! Presenting ${cleanName}!`, { muted });
}
