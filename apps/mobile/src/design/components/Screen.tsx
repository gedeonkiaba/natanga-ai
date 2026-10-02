import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gutter, space } from '../tokens';

/**
 * Cadre d'écran : fond crème, zone sûre, contenu défilant, pied fixe optionnel
 * (bouton d'action) et barre d'onglets.
 */
export function Screen({
  children,
  footer,
  nav,
  scroll = true,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode;
  scroll?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const body = {
    paddingHorizontal: gutter,
    paddingTop: Math.max(insets.top, space.xl) + space.md,
    paddingBottom: space.xl,
    gap: space.lg,
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {scroll ? (
        <ScrollView contentContainerStyle={body} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[body, { flex: 1 }]}>{children}</View>
      )}
      {footer ? (
        <View style={{ paddingHorizontal: gutter, paddingBottom: space.lg }}>{footer}</View>
      ) : null}
      {nav}
    </View>
  );
}
