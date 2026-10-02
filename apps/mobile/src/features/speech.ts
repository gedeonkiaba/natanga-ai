import * as Speech from 'expo-speech';

/** Débit « Vitesse douce » : légèrement plus lent que la voix par défaut. */
export const GENTLE_RATE = 0.85;

/** Lit un texte en français ; interrompt la lecture précédente. */
export function say(text: string, rate = GENTLE_RATE): void {
  Speech.stop();
  Speech.speak(text, { language: 'fr-FR', rate });
}

export function stopSpeaking(): void {
  Speech.stop();
}
