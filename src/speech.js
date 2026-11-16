export function announcePrincess(name, { muted = false } = {}) {
  if (muted) return false;
  const synth = globalThis.speechSynthesis;
  const Utterance = globalThis.SpeechSynthesisUtterance;
  if (!synth || !Utterance) return false;

  try {
    if (typeof synth.cancel === 'function') {
      synth.cancel();
    }
    const cleanName = (name || 'Princess Luna').trim();
    const utterance = new Utterance(`Hear ye, hear ye! Presenting ${cleanName}!`);
    utterance.rate = 0.96;
    utterance.pitch = 1.1;
    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
