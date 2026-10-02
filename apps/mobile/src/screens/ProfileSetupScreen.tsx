import { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  AppText,
  Avatar,
  BottomNav,
  Button,
  Card,
  Checkbox,
  Icon,
  IconTile,
  Pill,
  Screen,
  colors,
  palette,
  radius,
  shadow,
  space,
  touch,
} from '../design';
import { avatars, profileSetup, themes, type AvatarKey } from '../content/demo';
import { canSubmitProfile, selectionLabel, toggleTheme, type ThemeKey } from '../features/profile';
import { saveProfile } from '../features/progress';
import { useProgress } from '../storage/progressStore';
import { tabs, useNavigate } from '../navigation';

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        onPress={onBack}
        style={{
          width: touch - 4,
          height: touch - 4,
          borderRadius: radius.md,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: palette.borderSoft,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadow.card,
        }}
      >
        <Icon name="arrow-left" size={20} color={palette.inkBody} />
      </Pressable>
      <View
        accessibilityRole="header"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xs,
          backgroundColor: palette.indigo50,
          borderRadius: radius.pill,
          paddingHorizontal: space.lg,
          paddingVertical: space.xs + 1,
        }}
      >
        <Icon name="book-open-check" size={16} color={palette.indigo500} />
        <AppText variant="cardTitle" weight="bold" color={palette.indigo500}>
          Natanga
        </AppText>
      </View>
      <Pill
        label={profileSetup.step}
        tone="teal"
        variant="caption"
        style={{ alignSelf: 'center', paddingHorizontal: space.md, paddingVertical: space.xs }}
      />
    </View>
  );
}

function SectionHeader({
  title,
  badge,
  tone,
}: {
  title: string;
  badge: string;
  tone: 'indigo' | 'teal';
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppText variant="label" color={palette.slate700} upper>
        {title}
      </AppText>
      <Pill label={badge} tone={tone} variant="micro" />
    </View>
  );
}

export function ProfileSetupScreen() {
  const go = useNavigate();
  const { progress, update } = useProgress();
  const saved = progress.profile;
  const [avatar, setAvatar] = useState<AvatarKey | null>(
    (saved?.avatar as AvatarKey | undefined) ?? profileSetup.initialAvatar,
  );
  const [selected, setSelected] = useState<ThemeKey[]>(saved?.themes ?? profileSetup.initialThemes);

  return (
    <Screen
      nav={<BottomNav items={tabs(go).profile} active="profil" />}
      footer={
        <Button
          label={profileSetup.cta}
          trailingIcon="arrow-right"
          disabled={!canSubmitProfile(avatar, selected)}
          onPress={() => {
            if (avatar) update((s) => saveProfile(s, { avatar, themes: selected }));
            go('reading');
          }}
        />
      }
    >
      <Header onBack={() => go('home')} />

      <View style={{ gap: 2 }}>
        <AppText variant="title" accessibilityRole="header">
          {profileSetup.title}
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          {profileSetup.subtitle}
        </AppText>
      </View>

      <Card style={{ gap: space.md }}>
        <SectionHeader
          title={profileSetup.avatarLabel}
          badge={profileSetup.avatarCount}
          tone="indigo"
        />
        <View
          accessibilityRole="radiogroup"
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          {avatars.map((a) => {
            const isSelected = a.key === avatar;
            return (
              <Pressable
                key={a.key}
                accessibilityRole="radio"
                accessibilityLabel={a.name}
                aria-checked={isSelected}
                onPress={() => setAvatar(a.key)}
                style={{ alignItems: 'center', gap: space.xxs, minWidth: touch }}
              >
                <Avatar kind={a.key} selected={isSelected} />
                <AppText
                  variant="caption"
                  weight="semibold"
                  color={isSelected ? palette.teal700 : palette.slate500}
                >
                  {a.name}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={{ gap: space.md }}>
        <SectionHeader
          title={profileSetup.themesLabel}
          badge={selectionLabel(selected.length)}
          tone="teal"
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm + 2 }}>
          {themes.map((t) => {
            const isOn = selected.includes(t.key);
            return (
              <Pressable
                key={t.key}
                accessibilityRole="checkbox"
                accessibilityLabel={t.label}
                aria-checked={isOn}
                onPress={() => setSelected((s) => toggleTheme(s, t.key))}
                style={({ pressed }) => [
                  {
                    width: '48%',
                    flexGrow: 1,
                    minHeight: 52,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: space.sm + 2,
                    paddingHorizontal: space.md,
                    borderRadius: radius.md + 2,
                    borderWidth: 1.5,
                    backgroundColor: isOn ? palette.teal50 : palette.surfaceMuted,
                    borderColor: isOn ? palette.teal300 : palette.borderSoft,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                  isOn && shadow.teal,
                ]}
              >
                <IconTile
                  name={t.emoji}
                  background={t.tint}
                  size={32}
                  iconSize={18}
                  rounded={radius.sm}
                />
                <AppText
                  variant="cardTitle"
                  weight="semibold"
                  color={isOn ? palette.teal700 : palette.slate700}
                  style={{ flex: 1, fontSize: 14 }}
                >
                  {t.label}
                </AppText>
                <Checkbox checked={isOn} />
              </Pressable>
            );
          })}
        </View>
      </Card>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.md,
          backgroundColor: palette.purple50,
          borderRadius: radius.md + 2,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: palette.purple200,
          padding: space.md,
        }}
      >
        <IconTile
          name="sparkles"
          background={palette.violet500}
          color={palette.white}
          size={32}
          iconSize={17}
          rounded={radius.sm}
        />
        <AppText
          variant="caption"
          weight="regular"
          color={palette.violet900}
          style={{ flex: 1, lineHeight: 18 }}
        >
          {profileSetup.info.before}
          <AppText variant="caption" weight="bold" color={palette.violet900}>
            {profileSetup.info.strong}
          </AppText>
          {profileSetup.info.after}
        </AppText>
      </View>
    </Screen>
  );
}
