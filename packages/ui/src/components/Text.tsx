import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { colors, fontFamilies, fontSizes } from '../tokens';

export type TextVariant = 'body' | 'title' | 'caption';

export interface TextProps extends Omit<RNTextProps, 'children'> {
  children: ReactNode;
  variant?: TextVariant;
  muted?: boolean;
}

/**
 * Texte typographié accessible.
 * - `muted` utilise `textMuted` (contraste AA sur fond crème), pas un gris illisible.
 * - Les variantes (title/caption/body) sont réglables via les tokens de taille.
 */
export function Text({ children, variant = 'body', muted = false, style, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      style={[
        { color: muted ? colors.textMuted : colors.text },
        variantStyle[variant],
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const variantStyle = {
  body: { fontFamily: fontFamilies.body, fontSize: fontSizes.md, lineHeight: fontSizes.md * 1.5 },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    lineHeight: fontSizes.xl * 1.3,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.4,
  },
} as const;
