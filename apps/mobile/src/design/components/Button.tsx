import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import type { IconName } from '../icons.generated';
import { colors, palette, radius, shadow, space, touch } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Variant = 'primary' | 'outline' | 'ghost';

/** Bouton ≥ 52 pt : primaire (indigo plein), contour indigo, ou neutre. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  leadingIcon,
  trailingIcon,
  accessory,
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Élément ajouté après le libellé (ex. « (Code 🔒) »). */
  accessory?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const fg =
    variant === 'primary'
      ? colors.onPrimary
      : variant === 'outline'
        ? colors.primary
        : palette.slate700;
  const iconColor = variant === 'ghost' ? colors.primary : fg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: Math.max(touch, 52),
          borderRadius: radius.lg,
          paddingHorizontal: space.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        variant === 'primary' && [{ backgroundColor: colors.primary }, shadow.primary],
        variant === 'outline' && {
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: palette.indigo300,
        },
        variant === 'ghost' && {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: palette.borderSlate,
        },
        style,
      ]}
    >
      {leadingIcon && <Icon name={leadingIcon} size={19} color={iconColor} />}
      <AppText
        variant="button"
        weight={variant === 'ghost' ? 'medium' : 'bold'}
        color={fg}
        style={variant === 'ghost' ? { fontSize: 14 } : undefined}
      >
        {label}
      </AppText>
      {accessory ? <View>{accessory}</View> : null}
      {trailingIcon && <Icon name={trailingIcon} size={19} color={iconColor} />}
    </Pressable>
  );
}
