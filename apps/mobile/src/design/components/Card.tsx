import { View, type ViewProps } from 'react-native';
import { colors, radius, shadow, space } from '../tokens';

/** Surface blanche arrondie à ombre douce. */
export function Card({ style, padded = true, ...rest }: ViewProps & { padded?: boolean }) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: padded ? space.lg : 0,
        },
        shadow.card,
        style,
      ]}
    />
  );
}
