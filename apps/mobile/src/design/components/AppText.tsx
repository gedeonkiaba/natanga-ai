import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, fonts, type FontWeight, type, type TypeVariant } from '../tokens';

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  weight?: FontWeight;
  color?: string;
  align?: TextStyle['textAlign'];
  upper?: boolean;
}

/** Texte Lexend : toujours une variante de l'échelle typographique. */
export function AppText({
  variant = 'body',
  weight,
  color = colors.text,
  align,
  upper,
  style,
  ...rest
}: AppTextProps) {
  const t = type[variant];
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: fonts[weight ?? t.weight],
          fontSize: t.size,
          lineHeight: t.line,
          color,
          textAlign: align,
          ...(upper ? { textTransform: 'uppercase', letterSpacing: 0.6 } : null),
        },
        style,
      ]}
    />
  );
}
