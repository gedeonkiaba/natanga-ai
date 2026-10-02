/**
 * Synthèse vocale — abstraction pure, sans dépendance react-native.
 * L'application hôte injecte l'implémentation via `setSpeakFunction` :
 *   - Mobile (Expo) : `Speech.speak` de `expo-speech`.
 *   - Web : `window.speechSynthesis` (Web Speech API).
 */

export interface SpeakFn {
  (text: string, options?: { lang?: string }): void;
}

let speakImpl: SpeakFn | undefined;

export function setSpeakFunction(fn: SpeakFn): void {
  speakImpl = fn;
}

export function speak(text: string, options?: { lang?: string }): void {
  if (speakImpl) {
    speakImpl(text, options);
  }
  // Aucune implémentation → aucun son émis (aucun crash).
}
