import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  AppText,
  BottomNav,
  BrandMark,
  Button,
  Icon,
  Pill,
  ProgressBar,
  Screen,
  colors,
  fonts,
  palette,
  radius,
  shadow,
  space,
  type,
} from '../design';
import { reading } from '../content/demo';
import {
  passageText,
  progressRatio,
  spokenWord,
  syllableLabel,
  syllableTone,
  type Word,
} from '../features/reading';
import { recordReading } from '../features/progress';
import { say, stopSpeaking } from '../features/speech';
import { useProgress } from '../storage/progressStore';
import { tabs, useNavigate } from '../navigation';

type WordId = { paragraph: number; word: number };

/** Infobulle « 🔈 lu · ci · ole ⦀ » au-dessus du mot touché. */
function SyllableBubble({ word }: { word: Word }) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        position: 'absolute',
        bottom: '100%',
        left: -60,
        right: -60,
        alignItems: 'center',
        marginBottom: 6,
        zIndex: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xs,
          backgroundColor: palette.inkDeep,
          borderRadius: radius.pill,
          paddingHorizontal: space.md,
          paddingVertical: space.xs,
        }}
      >
        <Icon name="volume-1" size={12} color="rgba(255,255,255,0.7)" />
        <AppText
          variant="caption"
          weight="bold"
          color={palette.white}
          style={{ letterSpacing: 0.3 }}
        >
          {syllableLabel(word)}
        </AppText>
        <Icon name="audio-lines" size={12} color="rgba(255,255,255,0.7)" />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 5,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: palette.inkDeep,
        }}
      />
    </View>
  );
}

function ReadingWord({
  word,
  active,
  onPress,
}: {
  word: Word;
  active: boolean;
  onPress: () => void;
}) {
  const t = type.reading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={spokenWord(word)}
      accessibilityHint="Écouter ce mot"
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      style={{ marginRight: space.md, zIndex: active ? 10 : 0 }}
    >
      {active && <SyllableBubble word={word} />}
      <View
        style={
          active
            ? {
                backgroundColor: palette.indigo100,
                borderRadius: 6,
                borderBottomWidth: 2,
                borderBottomColor: palette.indigo500,
                marginHorizontal: -4,
                paddingHorizontal: 4,
              }
            : undefined
        }
      >
        <Text
          style={{
            fontFamily: fonts[t.weight],
            fontSize: t.size,
            lineHeight: t.line,
            letterSpacing: 1,
          }}
        >
          {word.syllables.map((s, i) => (
            <Text
              key={i}
              style={{ color: syllableTone(i) === 'A' ? colors.syllableA : colors.syllableB }}
            >
              {s}
            </Text>
          ))}
          {word.trailing ? <Text style={{ color: colors.syllableB }}>{word.trailing}</Text> : null}
        </Text>
      </View>
    </Pressable>
  );
}

export function ReadingScreen() {
  const go = useNavigate();
  const [active, setActive] = useState<WordId | null>(reading.highlighted);
  const [paused, setPaused] = useState(false);
  const { update } = useProgress();
  const startedAt = useRef(Date.now());
  const tapped = useRef(new Set<string>()); // mots touchés = mots difficiles
  const totalWords = reading.paragraphs.reduce((n, p) => n + p.length, 0);

  useEffect(() => stopSpeaking, []);

  const tap = (id: WordId, word: Word) => {
    setActive(id);
    tapped.current.add(`${id.paragraph}:${id.word}`);
    if (!paused) say(spokenWord(word));
  };

  return (
    <Screen nav={<BottomNav items={tabs(go).reading} active="lecture" />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <View style={{ flex: 1 }}>
          <BrandMark icon="sparkles" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: colors.surface,
            borderRadius: radius.pill,
            paddingHorizontal: space.md,
            minHeight: 34,
            ...shadow.card,
          }}
        >
          <Icon name="star" size={15} color={palette.amber500} filled />
          <AppText variant="caption" weight="semibold" color={palette.amber600}>
            {reading.stars}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={paused ? 'Reprendre' : 'Pause'}
          onPress={() => {
            stopSpeaking();
            setPaused((p) => !p);
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadow.card,
          }}
        >
          <Icon name={paused ? 'play' : 'pause'} size={17} color={palette.inkBody} />
        </Pressable>
      </View>

      <View style={{ gap: space.sm }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <AppText variant="caption" weight="semibold" color={palette.inkMeta}>
            {reading.goal.label}
          </AppText>
          <Pill label={reading.page.label} tone="indigo" />
        </View>
        <ProgressBar
          value={progressRatio(reading.goal.done, reading.goal.total)}
          label={reading.goal.label}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
          <Icon name="book-open" size={16} color={palette.indigo500} />
          <AppText variant="bodySmall" weight="medium" color={palette.inkMeta} style={{ flex: 1 }}>
            {reading.story}
          </AppText>
          <Pill label={reading.untimed} tone="emerald" variant="micro" />
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          paddingHorizontal: space.xl,
          paddingTop: space.xl,
          paddingBottom: space.lg,
          minHeight: 440,
          ...shadow.card,
        }}
      >
        <View style={{ flex: 1 }} accessibilityLabel="Texte de l'histoire">
          {reading.paragraphs.map((paragraph, p) => (
            <View
              key={p}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: p === 0 ? 0 : space.xxxl + space.md + 2,
              }}
            >
              {paragraph.map((word, w) => (
                <ReadingWord
                  key={w}
                  word={word}
                  active={active?.paragraph === p && active.word === w}
                  onPress={() => tap({ paragraph: p, word: w }, word)}
                />
              ))}
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: space.lg,
            borderTopWidth: 1,
            borderStyle: 'dashed',
            borderTopColor: palette.borderSlate,
            paddingTop: space.md,
            marginTop: space.xl,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', gap: space.xs, alignItems: 'flex-start' }}>
            <Icon name="emoji:herb" size={13} />
            <AppText
              variant="caption"
              weight="regular"
              color={palette.inkFaint}
              style={{ flex: 1 }}
            >
              {reading.hints.syllables}
            </AppText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: space.xs, alignItems: 'flex-start' }}>
            <Icon name="pointer" size={13} color={palette.inkFaint} />
            <AppText
              variant="caption"
              weight="regular"
              color={palette.inkFaint}
              style={{ flex: 1 }}
            >
              {reading.hints.tap}
            </AppText>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: space.md }}>
        <Button
          variant="outline"
          label={reading.listenAll}
          leadingIcon="volume-2"
          onPress={() => say(passageText(reading.paragraphs))}
          style={{ flex: 0.85 }}
        />
        <Button
          label={reading.done}
          trailingIcon="arrow-right"
          onPress={() => {
            stopSpeaking();
            update((s) =>
              recordReading(s, {
                lessonId: 'nino-foret-doree',
                durationSec: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
                wordsRead: totalWords,
                correctWords: totalWords - tapped.current.size,
              }),
            );
            go('achievement');
          }}
          style={{ flex: 1.15 }}
        />
      </View>
    </Screen>
  );
}
