/** Synthèse vocale (Web Speech API), voix française, débit réglable (réglage `voiceSpeed`). */

export function speechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function frenchVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'fr-FR') ?? voices.find((v) => v.lang.startsWith('fr'));
}

export function speak(text: string, rate = 1): void {
  if (!speechAvailable()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = Math.min(1.5, Math.max(0.5, rate));
  const voice = frenchVoice();
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (speechAvailable()) window.speechSynthesis.cancel();
}
