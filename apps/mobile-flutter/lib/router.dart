import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'api/models.dart';
import 'screens/achievement_screen.dart';
import 'screens/consent_screen.dart';
import 'screens/home_screen.dart';
import 'screens/lesson_screen.dart';
import 'screens/login_screen.dart';
import 'screens/parent_screen.dart';
import 'screens/profile_setup_screen.dart';
import 'screens/reading_screen.dart';
import 'screens/skill_tree_screen.dart';
import 'state/session_controller.dart';

/// Routes nommées de l'application.
abstract class Routes {
  static const home = '/';
  static const tree = '/tree';
  static const lesson = '/lesson';

  /// Écrans de la maquette approuvée (profil enfant, lecture, succès).
  static const profile = '/profile';
  static const reading = '/reading';
  static const achievement = '/achievement';

  /// Création du compte parent.
  static const register = '/register';

  /// Ancien chemin de l'écran d'inscription (conservé pour compatibilité).
  static const consent = register;

  static const login = '/login';

  /// Espace parent (protégé : session requise).
  static const parent = '/parent';
}

/// Routes nécessitant une session parent.
///
/// L'activité de l'enfant (`/tree`, `/lesson`, `/reading`…) fonctionne hors connexion,
/// sur l'appareil : elle n'exige pas de session. Quand elle sera synchronisée avec
/// l'API (jeton ET consentement parental requis), la synchro passera par l'espace parent.
const _protectedPrefixes = [Routes.parent];

/// Règle de redirection (pure, testable) :
/// - route protégée sans session → `/login` ;
/// - `/login` avec session → `/parent` ;
/// - pendant le chargement de la session, on ne redirige pas (l'écran
///   protégé affiche un indicateur de chargement).
@visibleForTesting
String? authRedirect(AsyncValue<ParentAccount?> session, String location) {
  final loggedIn = session.valueOrNull != null;
  final isProtected = _protectedPrefixes.any(location.startsWith);

  if (isProtected && !loggedIn && !session.isLoading) return Routes.login;
  if (location == Routes.login && loggedIn) return Routes.parent;
  return null;
}

/// Router go_router, réévalué à chaque changement de session.
final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(sessionControllerProvider, (_, __) => refresh.value++);
  ref.onDispose(refresh.dispose);

  return GoRouter(
    initialLocation: Routes.home,
    refreshListenable: refresh,
    redirect: (_, state) => authRedirect(ref.read(sessionControllerProvider), state.matchedLocation),
    routes: [
      GoRoute(path: Routes.home, builder: (_, __) => const HomeScreen()),
      GoRoute(path: Routes.tree, builder: (_, __) => const SkillTreeScreen()),
      GoRoute(path: Routes.profile, builder: (_, __) => const ProfileSetupScreen()),
      GoRoute(path: Routes.reading, builder: (_, __) => const ReadingScreen()),
      GoRoute(path: Routes.achievement, builder: (_, __) => const AchievementScreen()),
      GoRoute(path: Routes.register, builder: (_, __) => const ConsentScreen()),
      GoRoute(path: Routes.login, builder: (_, __) => const LoginScreen()),
      GoRoute(path: Routes.parent, builder: (_, __) => const ParentScreen()),
      GoRoute(
        path: Routes.lesson,
        builder: (_, state) {
          // `nodeId` optionnel (ex. /lesson?node=n-letters-a).
          final nodeId = state.uri.queryParameters['node'] ?? '';
          return LessonScreen(nodeId: nodeId);
        },
      ),
    ],
  );
});
