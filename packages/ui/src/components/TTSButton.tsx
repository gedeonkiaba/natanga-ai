import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text as RNText } from 'react-native';
import { colors, fontSizes, radii } from '../tokens';
import { speak } from '../speech';

export interface TTSButtonProps {
  text: string;
  label?: string;
  icon?: string;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * Bouton de synthèse vocale : lit un texte à voix haute.
 * Utilisé pour toutes les consignes (exigence d'accessibilité US-13).
 */
export function TTSButton({
  text,
  label,
  icon = '🔊',
  accessibilityLabel,
  testID,
}: TTSButtonProps) {
  const latestText = useRef(text);
  useEffect(() => {
    latestText.current = text;
  }, [text]);

  return (
    <Pressable
      onPress={() => speak(latestText.current)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Écouter : ${label ?? text}`}
      testID={testID}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <RNText style={styles.iconText}>{icon}</RNText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: fontSizes.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
