import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { IconName } from '../icons.generated';
import { colors, palette, radius, space } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

/** Logo Natanga : tuile dégradée indigo → violet + nom (point violet optionnel). */
export function BrandMark({
  icon = 'book-open',
  dot = false,
  size = 36,
}: {
  icon?: IconName;
  dot?: boolean;
  size?: number;
}) {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm + 2 }}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Natanga"
    >
      <LinearGradient
        colors={[palette.indigo500, palette.violet500]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: radius.md - 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={size * 0.55} color={palette.white} />
      </LinearGradient>
      <AppText variant="brand" color={colors.text}>
        Natanga
        {dot ? (
          <AppText variant="brand" color={palette.violet500}>
            .
          </AppText>
        ) : null}
      </AppText>
    </View>
  );
}
