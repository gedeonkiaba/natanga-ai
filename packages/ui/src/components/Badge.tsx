import { StyleSheet, Text as RNText, View } from 'react-native';
import { colors, fontFamilies, fontSizes, radii, spacing } from '../tokens';

export type BadgeKind = 'streak' | 'gems' | 'badge';

export interface BadgeProps {
  label: string;
  kind?: BadgeKind;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * Badge d'indicateur doux (streak, gemmes, badges).
 * - Icône + libellé accessibles (un seul `accessibilityLabel` annoncé).
 * - Couleurs non saturées, jamais punitives.
 */
export function Badge({ label, kind = 'badge', accessibilityLabel, testID }: BadgeProps) {
  const icon = badgeIcon[kind];
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `${icon} ${label}`}
      testID={testID}
      style={styles.pill}
    >
      <RNText style={styles.icon}>{icon}</RNText>
      <RNText style={styles.label}>{label}</RNText>
    </View>
  );
}

const badgeIcon: Record<BadgeKind, string> = {
  streak: '🔥',
  gems: '💎',
  badge: '⭐',
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: fontSizes.md,
    marginRight: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    color: colors.text,
  },
});
