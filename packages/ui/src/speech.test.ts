import { describe, expect, it } from 'vitest';
import { setSpeakFunction, speak } from './speech';

describe('speak (TTS)', () => {
  it('ne plante pas sans implémentation', () => {
    expect(() => speak('bonjour')).not.toThrow();
  });

  it('délègue à l’implémentation fournie', () => {
    const calls: string[] = [];
    setSpeakFunction((text) => calls.push(text));
    speak('coucou');
    expect(calls).toEqual(['coucou']);
  });
});
