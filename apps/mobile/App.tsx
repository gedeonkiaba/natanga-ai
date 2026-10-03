import { useEffect, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/lexend';
import { CURRICULUM_LESSONS, type Lesson, type SkillNode } from '@natanga/core';
import { setSpeakFunction } from '@natanga/ui';
import { BottomNav, colors } from './src/design';
import { recordLesson, treeProgress } from './src/features/progress';
import { say } from './src/features/speech';
import { ProgressProvider, useProgress } from './src/storage/progressStore';
import { NavigationContext, tabs, type Route } from './src/navigation';
import { AchievementScreen } from './src/screens/AchievementScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { ReadingScreen } from './src/screens/ReadingScreen';
import { SkillTreeScreen } from './src/screens/SkillTreeScreen';

const ROUTES: Route[] = ['home', 'profile', 'reading', 'achievement', 'tree', 'lesson'];

/** Sur le web (aperçu), `#reading` ouvre directement un écran. */
function initialRoute(): Route {
  if (Platform.OS !== 'web') return 'home';
  const hash = globalThis.location?.hash.replace('#', '') as Route | undefined;
  return hash && hash !== 'lesson' && ROUTES.includes(hash) ? hash : 'home';
}

// Les exercices de leçon (`@natanga/ui` TTSButton) parlent via expo-speech.
setSpeakFunction((text) => say(text));

const SCREENS: Record<'home' | 'profile' | 'reading' | 'achievement', () => React.JSX.Element> = {
  home: HomeScreen,
  profile: ProfileSetupScreen,
  reading: ReadingScreen,
  achievement: AchievementScreen,
};

/** Cadre des écrans du parcours pédagogique : fond, zone sûre, barre d'onglets optionnelle. */
function PathFrame({ children, nav }: { children: React.ReactNode; nav?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View style={{ flex: 1 }}>{children}</View>
      {nav}
    </View>
  );
}

function Router() {
  const [route, setRoute] = useState<Route>(initialRoute);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { progress, ready, update } = useProgress();

  // Retour Android : leçon → parcours → accueil, puis sortie de l'app.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route === 'home') return false;
      setRoute(route === 'lesson' ? 'tree' : 'home');
      return true;
    });
    return () => sub.remove();
  }, [route]);

  const openLesson = (node: SkillNode) => {
    const first = CURRICULUM_LESSONS.find((l) => l.nodeId === node.id);
    if (first) {
      setLesson(first);
      setRoute('lesson');
    }
  };

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  let screen: React.ReactNode;
  if (route === 'tree') {
    screen = (
      <PathFrame
        nav={<BottomNav items={tabs(setRoute).home} active="bibliotheque" indicator="dot" />}
      >
        <SkillTreeScreen onSelectNode={openLesson} progress={treeProgress(progress)} />
      </PathFrame>
    );
  } else if (route === 'lesson' && lesson) {
    screen = (
      <PathFrame>
        <LessonScreen
          lesson={lesson}
          onFinish={(result) => {
            update((s) =>
              recordLesson(s, {
                nodeId: lesson.nodeId,
                lessonId: lesson.id,
                correct: result.correct,
                total: result.total,
                gems: result.gems,
              }),
            );
            setRoute('tree');
          }}
          onQuit={() => setRoute('tree')}
        />
      </PathFrame>
    );
  } else {
    const Current = SCREENS[route === 'lesson' ? 'home' : route];
    screen = <Current key={route} />;
  }

  return <NavigationContext.Provider value={setRoute}>{screen}</NavigationContext.Provider>;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ProgressProvider>
        <Router />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
