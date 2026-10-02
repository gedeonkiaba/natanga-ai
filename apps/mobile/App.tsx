import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Speech from 'expo-speech';
import { Badge, Button, ProgressBar, Text, setSpeakFunction } from '@natanga/ui';
import { colors, spacing } from '@natanga/ui/tokens';
import { LEVEL1_LESSONS, type SkillNode, type Lesson } from '@natanga/core';
import { SkillTreeScreen } from './src/screens/SkillTreeScreen';
import { LessonScreen } from './src/screens/LessonScreen';

type Screen = 'home' | 'tree' | 'lesson';

/**
 * Racine de l'application mobile (socle d'intégration UI).
 * Navigation simple sans dépendance : home → arbre de compétences → leçon.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lesson, setLesson] = useState<Lesson | null>(null);

  // Injection du TTS : expo-speech côté mobile.
  useEffect(() => {
    setSpeakFunction((text, options) => {
      Speech.speak(text, { language: options?.lang ?? 'fr-FR' });
    });
  }, []);

  const openLesson = (node: SkillNode) => {
    const firstLesson = LEVEL1_LESSONS.find((l) => l.nodeId === node.id);
    if (firstLesson) {
      setLesson(firstLesson);
      setScreen('lesson');
    }
  };

  if (screen === 'tree') {
    return <SkillTreeScreen onSelectNode={openLesson} />;
  }

  if (screen === 'lesson' && lesson) {
    return (
      <LessonScreen
        lesson={lesson}
        onFinish={() => setScreen('tree')}
        onQuit={() => setScreen('tree')}
      />
    );
  }

  // Écran d'accueil
  return (
    <View style={styles.container}>
      <Text variant="title" accessibilityRole="header">
        Natanga
      </Text>
      <Text variant="body" muted>
        Apprendre à lire et à écrire, à son rythme.
      </Text>

      <View style={styles.row}>
        <Badge label="5 jours" kind="streak" />
        <Badge label="120" kind="gems" />
        <Badge label="8" kind="badge" />
      </View>

      <ProgressBar value={0.4} accessibilityLabel="Progression de la leçon" />

      <Button onPress={() => setScreen('tree')} accessibilityLabel="Commencer le parcours">
        C’est parti !
      </Button>

      <Text variant="caption" muted>
        Cette application entraîne et soutient ; elle ne remplace pas un orthophoniste.
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
