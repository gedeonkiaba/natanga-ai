import { describe, expect, it } from 'vitest';
import { darkTheme, getTheme, lightTheme, select } from './theme';
import { colors, darkColors } from './tokens';

describe('theme', () => {
  it('expose un thème clair et un thème sombre', () => {
    expect(lightTheme.mode).toBe('light');
    expect(lightTheme.colors).toEqual({ ...colors });
    expect(darkTheme.mode).toBe('dark');
    expect(darkTheme.colors).toEqual({ ...darkColors });
  });

  it('sélectionne la bonne palette selon le mode', () => {
    expect(getTheme('light').colors.background).toBe(colors.background);
    expect(getTheme('dark').colors.background).toBe(darkColors.background);
  });

  it('sélectionne un token individuel', () => {
    expect(select('primary', 'light')).toBe(colors.primary);
    expect(select('primary', 'dark')).toBe(darkColors.primary);
  });
});
