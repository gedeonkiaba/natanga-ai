import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text as RNText } from 'react-native';
import { colors, fontFamilies, fontSizes, radii, spacing } from '../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'ghost';

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

/**
 * Bouton accessible (cross-platform via react-native / react-native-web).
 * - Cible tactile ≥ 44px (touche-able), espacée.
 * - `warning` = orange doux (jamais de rouge agressif).
 * - `accessibilityRole="button"` + label pour les lecteurs d'écran.
 */
export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const palette = variantPalette[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: disabled ? colors.border : palette.background },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <RNText
        style={[styles.label, { color: disabled ? colors.textMuted : palette.foreground }]}
      >
        {children}
      </RNText>
    </Pressable>
  );
}

const variantPalette: Record<ButtonVariant, { background: string; foreground: string }> = {
  primary: { background: colors.primary, foreground: colors.primaryContrast },
  secondary: { background: colors.secondary, foreground: colors.secondaryContrast },
  warning: { background: colors.warning, foreground: colors.warningContrast },
  ghost: { background: 'transparent', foreground: colors.text },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
