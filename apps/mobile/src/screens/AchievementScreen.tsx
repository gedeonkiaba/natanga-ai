import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AppText,
  BottomNav,
  BrandMark,
  Button,
  Card,
  Confetti,
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
import { achievement, child } from '../content/demo';
import { say } from '../features/speech';
import { tabs, useNavigate } from '../navigation';

function ChildChip() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: palette.border,
        paddingLeft: 4,
        paddingRight: space.md,
        minHeight: 36,
        ...shadow.card,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: palette.amber100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="emoji:fox" size={18} />
      </View>
      <AppText variant="caption" weight="medium" color={palette.slate700}>
        {child.label}
      </AppText>
    </View>
  );
}

function Medal() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient
        colors={[palette.indigo50, palette.indigo100]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          borderWidth: 3,
          borderColor: palette.white,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadow.card,
        }}
      >
        <Icon name="emoji:glowing-star" size={42} />
      </LinearGradient>
      <View style={{ position: 'absolute', top: -6, right: -10 }}>
        <Icon name="sparkles" size={22} color={palette.amber500} />
      </View>
    </View>
  );
}

export function AchievementScreen() {
  const go = useNavigate();
  const word = achievement.magicWord.syllables;
  return (
    <Screen nav={<BottomNav items={tabs(go).achievement} active="succes" />}>
      <Confetti height={300} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BrandMark icon="book-open" />
        <ChildChip />
      </View>

      <LinearGradient
        colors={[palette.white, '#F7F7FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          borderRadius: radius.xl,
          padding: space.xl,
          paddingTop: space.xxl,
          alignItems: 'center',
          gap: space.sm,
          ...shadow.card,
        }}
      >
        <Medal />
        <AppText
          variant="celebration"
          color={palette.inkDeep}
          align="center"
          accessibilityRole="header"
          style={{ marginTop: space.md }}
        >
          {achievement.title}
        </AppText>
        <Pill label={achievement.story} tone="indigo" style={{ alignSelf: 'center' }} />
        <AppText variant="body" color={palette.slate700} align="center" style={{ lineHeight: 20 }}>
          {achievement.message.before}
          <AppText variant="body" weight="bold" color={palette.inkDeep}>
            {achievement.message.strong}
          </AppText>
          {achievement.message.after}
        </AppText>
      </LinearGradient>

      <View style={{ flexDirection: 'row', gap: space.sm + 2 }}>
        {achievement.stats.map((s) => {
          const highlight = 'highlight' in s && s.highlight;
          return (
            <Card
              key={s.caption}
              style={{
                flex: 1,
                alignItems: 'center',
                gap: space.xs,
                paddingVertical: space.lg,
                paddingHorizontal: space.xs,
                ...(highlight
                  ? {
                      backgroundColor: palette.fuchsia50,
                      borderWidth: 1.5,
                      borderColor: palette.fuchsia200,
                    }
                  : null),
              }}
            >
              <IconTile
                name={s.icon}
                tone={s.tone}
                size={32}
                iconSize={17}
                rounded={radius.sm + 2}
                filled={s.icon !== 'timer'}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <AppText variant="stat" color={palette.inkDeep}>
                  {s.value}
                </AppText>
                {'valueEmoji' in s && <Icon name={s.valueEmoji} size={17} />}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <AppText variant="caption" weight="regular" color={palette.slate500}>
                  {s.caption}
                </AppText>
                {'captionEmoji' in s && <Icon name={s.captionEmoji} size={12} />}
              </View>
            </Card>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${achievement.treasure.badge} : ${achievement.treasure.title}. ${achievement.treasure.text}`}
        style={[{ borderRadius: radius.lg + 2 }, shadow.teal]}
      >
        <LinearGradient
          colors={[palette.teal600, palette.teal700]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: radius.lg + 2,
            padding: space.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.md,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: radius.md,
              backgroundColor: 'rgba(255,255,255,0.14)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="emoji:gem-stone" size={26} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: palette.yellow200,
                borderRadius: radius.sm - 2,
                paddingHorizontal: space.sm,
                paddingVertical: 1,
              }}
            >
              <AppText variant="micro" weight="bold" color={palette.yellow800} upper>
                {achievement.treasure.badge}
              </AppText>
            </View>
            <AppText variant="cardTitle" weight="bold" color={palette.white}>
              {achievement.treasure.title}
            </AppText>
            <AppText variant="caption" weight="semibold" color="rgba(255,255,255,0.82)">
              {achievement.treasure.text}
            </AppText>
          </View>
          <Icon name="chevron-right" size={20} color={palette.white} />
        </LinearGradient>
      </Pressable>

      <Card
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.md,
          paddingVertical: space.md,
        }}
      >
        <IconTile
          name="wand-sparkles"
          tone="purple"
          size={36}
          iconSize={18}
          rounded={radius.sm + 2}
        />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" weight="semibold" color={palette.ink}>
            {achievement.magicWord.label}
          </AppText>
          <AppText variant="cardTitle" weight="bold" accessibilityLabel={word.join('')}>
            {word.map((syl, i) => (
              <AppText
                key={i}
                variant="cardTitle"
                weight="bold"
                color={i % 2 === 0 ? palette.indigo500 : palette.teal600}
              >
                {i > 0 ? (
                  <AppText variant="cardTitle" color={palette.inkFaint}>
                    ·
                  </AppText>
                ) : null}
                {syl}
              </AppText>
            ))}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Écouter ${word.join('')}`}
          onPress={() => say(word.join(''))}
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.md - 2,
            backgroundColor: palette.surfaceMuted,
            borderWidth: 1,
            borderColor: palette.borderSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="volume-2" size={18} color={palette.inkBody} />
        </Pressable>
      </Card>

      <View style={{ gap: space.sm + 2 }}>
        <Button label={achievement.continue} leadingIcon="sparkle" onPress={() => go('home')} />
        <Button
          variant="ghost"
          label={achievement.parent.label}
          leadingIcon="chart-line"
          accessory={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <AppText variant="micro" weight="regular" color={palette.inkFaint}>
                ({achievement.parent.code}
              </AppText>
              <Icon name="emoji:locked" size={11} />
              <AppText variant="micro" weight="regular" color={palette.inkFaint}>
                )
              </AppText>
            </View>
          }
        />
      </View>
    </Screen>
  );
}
