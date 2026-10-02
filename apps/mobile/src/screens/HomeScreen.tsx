import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import {
  AppText,
  BottomNav,
  BrandMark,
  Card,
  Icon,
  IconTile,
  Pill,
  Screen,
  colors,
  palette,
  radius,
  shadow,
  space,
} from '../design';
import { child, home } from '../content/demo';
import { tabs, useNavigate } from '../navigation';

function ParentSpaceButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Espace Parent"
      accessibilityHint="Accès réservé aux parents"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.xs,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: palette.border,
        paddingHorizontal: space.md,
        minHeight: 34,
        ...shadow.card,
      }}
    >
      <Icon name="shield-check" size={15} color={palette.inkBody} />
      <AppText variant="caption" weight="medium" color={palette.inkBody}>
        Espace Parent
      </AppText>
    </Pressable>
  );
}

/** Halo violet très doux, en haut à droite de la carte de bienvenue. */
function Glow() {
  return (
    <Svg
      width={120}
      height={120}
      style={{ position: 'absolute', top: -20, right: -20 }}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={palette.violet500} stopOpacity={0.16} />
          <Stop offset="1" stopColor={palette.violet500} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={60} cy={60} r={60} fill="url(#glow)" />
    </Svg>
  );
}

export function HomeScreen() {
  const go = useNavigate();
  return (
    <Screen nav={<BottomNav items={tabs(go).home} active="accueil" indicator="dot" />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BrandMark icon="book-open-check" dot />
        <ParentSpaceButton />
      </View>

      <Card style={{ overflow: 'hidden', gap: space.md, padding: space.xl }}>
        <Glow />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          <Pill label={home.chips.time} tone="indigo" icon="clock" />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.xxs + 1,
              backgroundColor: palette.green50,
              borderRadius: radius.pill,
              paddingHorizontal: space.sm + 2,
              paddingVertical: space.xxs,
            }}
          >
            <Icon name="emoji:herb" size={13} />
            <AppText variant="caption" weight="semibold" color={palette.green800}>
              {home.chips.privacy}
            </AppText>
          </View>
        </View>
        <AppText variant="hero" accessibilityRole="header">
          {home.promise}
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          {home.pitch}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${child.label}, modifier le profil`}
          onPress={() => go('profile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.md,
            backgroundColor: palette.surfaceMuted,
            borderRadius: radius.md,
            padding: space.md,
            minHeight: 52,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: palette.indigo50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="emoji:fox" size={20} />
          </View>
          <AppText variant="cardTitle" style={{ flex: 1 }}>
            {child.label}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: palette.amber100,
              borderRadius: radius.pill,
              paddingHorizontal: space.sm,
              paddingVertical: 3,
            }}
          >
            <Icon name="emoji:fire" size={12} />
            <AppText variant="caption" weight="semibold" color={palette.amber600}>
              {home.streak}
            </AppText>
          </View>
        </Pressable>
      </Card>

      <AppText variant="label" color={colors.label} upper>
        {home.sectionLabel}
      </AppText>

      <View style={{ gap: space.md }}>
        {home.benefits.map((b) => (
          <Card key={b.title} style={{ flexDirection: 'row', gap: space.lg, alignItems: 'center' }}>
            <IconTile name={b.icon} tone={b.tone} size={44} iconSize={22} />
            <View style={{ flex: 1, gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.sm }}>
                <AppText variant="cardTitle" style={{ flex: 1 }}>
                  {b.title}
                </AppText>
                <Pill
                  label={b.badge}
                  tone="slate"
                  variant="micro"
                  style={{ paddingHorizontal: space.sm, paddingVertical: 2 }}
                />
              </View>
              <AppText variant="bodySmall" color={colors.textSoft}>
                {b.text}
              </AppText>
            </View>
          </Card>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${home.storyOfTheDay.label} : ${home.storyOfTheDay.title}, ${home.storyOfTheDay.meta}. Lancer la lecture`}
        onPress={() => go('reading')}
        style={({ pressed }) => [
          { borderRadius: radius.lg, transform: [{ scale: pressed ? 0.99 : 1 }] },
          shadow.primary,
        ]}
      >
        <LinearGradient
          colors={[palette.indigo600, palette.indigo500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: radius.lg,
            padding: space.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.md,
          }}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="label" color="rgba(255,255,255,0.78)" upper>
              {home.storyOfTheDay.label}
            </AppText>
            <AppText variant="button" color={palette.white}>
              {home.storyOfTheDay.title}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <AppText variant="caption" weight="semibold" color="rgba(255,255,255,0.88)">
                {home.storyOfTheDay.meta}
              </AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.6)">
                •
              </AppText>
              <Icon name="emoji:star" size={13} />
              <AppText variant="caption" weight="semibold" color="rgba(255,255,255,0.88)">
                {home.storyOfTheDay.reward}
              </AppText>
            </View>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: palette.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="play" size={18} color={palette.indigo500} />
          </View>
        </LinearGradient>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.sm + 2,
          backgroundColor: palette.footnote,
          borderRadius: radius.md,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: palette.border,
          paddingHorizontal: space.md,
          paddingVertical: space.sm + 2,
        }}
      >
        <Icon name="circle-check" size={18} color={palette.ink} />
        <AppText variant="caption" weight="regular" color={palette.inkBody} style={{ flex: 1 }}>
          {home.footnote.before}
          <AppText variant="caption" weight="semibold" color={palette.ink}>
            {home.footnote.strong}
          </AppText>
        </AppText>
      </View>
    </Screen>
  );
}
