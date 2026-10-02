import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { IconName } from '../icons.generated';
import { radius, space, type TypeVariant } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { tones, type Tone } from './tones';

/** Pastille arrondie (statut, compteur, badge) avec icône optionnelle. */
export function Pill({
  label,
  tone = 'indigo',
  icon,
  iconColor,
  variant = 'caption',
  upper,
  style,
}: {
  label: string;
  tone?: Tone;
  icon?: IconName;
  iconColor?: string;
  variant?: TypeVariant;
  upper?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = tones[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xxs + 1,
          alignSelf: 'flex-start',
          backgroundColor: t.bg,
          borderRadius: radius.pill,
          paddingHorizontal: space.sm + 2,
          paddingVertical: space.xxs,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={13} color={iconColor ?? t.fg} />}
      <AppText variant={variant} weight="semibold" color={t.fg} upper={upper}>
        {label}
      </AppText>
    </View>
  );
}
