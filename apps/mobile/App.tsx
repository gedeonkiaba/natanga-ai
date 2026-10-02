import { useEffect, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/lexend';
import { colors } from './src/design';
import { NavigationContext, type Route } from './src/navigation';
import { AchievementScreen } from './src/screens/AchievementScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { ReadingScreen } from './src/screens/ReadingScreen';

const ROUTES: Route[] = ['home', 'profile', 'reading', 'achievement'];

/** Sur le web (aperçu), `#reading` ouvre directement un écran. */
function initialRoute(): Route {
  if (Platform.OS !== 'web') return 'home';
  const hash = globalThis.location?.hash.replace('#', '') as Route | undefined;
  return hash && ROUTES.includes(hash) ? hash : 'home';
}

const SCREENS: Record<Route, () => React.JSX.Element> = {
  home: HomeScreen,
  profile: ProfileSetupScreen,
  reading: ReadingScreen,
  achievement: AchievementScreen,
};

export default function App() {
  const [route, setRoute] = useState<Route>(initialRoute);
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  // Retour Android : revient à l'accueil plutôt que de quitter l'app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route === 'home') return false;
      setRoute('home');
      return true;
    });
    return () => sub.remove();
  }, [route]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  const Current = SCREENS[route];
  return (
    <SafeAreaProvider>
      <NavigationContext.Provider value={setRoute}>
        <StatusBar style="dark" />
        <Current key={route} />
      </NavigationContext.Provider>
    </SafeAreaProvider>
  );
}
