import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '../icons.generated';
import { colors, palette, space } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

export interface NavItem {
  key: string;
  label: string;
  icon: IconName;
  /** Absent : destination pas encore construite (annoncée comme indisponible). */
  onPress?: () => void;
}

/**
 * Barre d'onglets inférieure. L'onglet actif est indigo, marqué d'un point ou
 * d'un trait sous le libellé (les deux variantes existent dans la maquette).
 */
export function BottomNav({
  items,
  active,
  indicator = 'bar',
}: {
  items: NavItem[];
  active: string;
  indicator?: 'dot' | 'bar';
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: palette.borderSoft,
        paddingTop: space.sm + 2,
        paddingBottom: Math.max(insets.bottom, space.md),
      }}
    >
      {items.map((item) => {
        const isActive = item.key === active;
        const tint = isActive ? colors.primary : colors.navIdle;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive, disabled: !item.onPress && !isActive }}
            accessibilityHint={!item.onPress && !isActive ? 'Bientôt disponible' : undefined}
            onPress={item.onPress}
            style={{ flex: 1, alignItems: 'center', minHeight: 48, gap: 3 }}
          >
            <Icon name={item.icon} size={22} color={tint} strokeWidth={isActive ? 2.1 : 1.7} />
            <AppText variant="nav" weight={isActive ? 'semibold' : 'regular'} color={tint}>
              {item.label}
            </AppText>
            <View
              style={
                isActive
                  ? indicator === 'dot'
                    ? { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary }
                    : { width: 18, height: 3, borderRadius: 2, backgroundColor: colors.primary }
                  : { height: 4 }
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}
