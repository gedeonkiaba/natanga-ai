import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { IconName } from '../icons.generated';
import { radius } from '../tokens';
import { Icon } from './Icon';
import { tones, type Tone } from './tones';

/** Carré arrondi teinté portant une icône (atouts, statistiques, thèmes). */
export function IconTile({
  name,
  tone = 'indigo',
  size = 44,
  iconSize,
  background,
  color,
  rounded = radius.md,
  filled,
  style,
}: {
  name: IconName;
  tone?: Tone;
  size?: number;
  iconSize?: number;
  background?: string;
  color?: string;
  rounded?: number;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = tones[tone];
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: rounded,
          backgroundColor: background ?? t.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Icon
        name={name}
        size={iconSize ?? Math.round(size * 0.5)}
        color={color ?? t.fg}
        filled={filled}
      />
    </View>
  );
}
