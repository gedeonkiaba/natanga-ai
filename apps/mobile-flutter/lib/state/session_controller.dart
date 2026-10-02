import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_client.dart';
import '../api/auth_service.dart';
import '../api/models.dart';
import '../auth/token_storage.dart';

/// Session parent : `null` = déconnecté, [ParentAccount] = connecté.
///
/// - Au démarrage, un jeton stocké est validé via `GET /auth/me` ;
///   un 401 (jeton expiré/révoqué) efface le jeton et ouvre une session vide.
/// - Le router (`routerProvider`) écoute cet état pour protéger l'espace parent.
final sessionControllerProvider =
    AsyncNotifierProvider<SessionController, ParentAccount?>(SessionController.new);

class SessionController extends AsyncNotifier<ParentAccount?> {
  @override
  Future<ParentAccount?> build() async {
    final storage = ref.read(tokenStorageProvider);
    final token = await storage.read();
    if (token == null || token.isEmpty) return null;

    try {
      return await ref.read(authServiceProvider).me();
    } catch (e) {
      if (ApiClient.errorOf(e)?.isUnauthorized ?? false) {
        await storage.clear();
        return null;
      }
      rethrow; // Réseau indisponible, etc. : l'UI affiche l'erreur.
    }
  }

  /// Connexion : stocke le jeton puis charge le compte.
  /// En cas d'échec, l'état passe en erreur (ApiException : `ERR_LOGIN`,
  /// `ERR_NOT_VERIFIED`…) et aucun jeton n'est conservé.
  Future<void> login(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final auth = ref.read(authServiceProvider);
      final storage = ref.read(tokenStorageProvider);
      final result = await auth.login(email, password);
      await storage.write(result.token);
      try {
        return await auth.me();
      } catch (_) {
        await storage.clear();
        rethrow;
      }
    });
  }

  /// Déconnexion : révocation serveur (au mieux) puis effacement local.
  Future<void> logout() async {
    try {
      await ref.read(authServiceProvider).logout();
    } catch (_) {
      // Hors ligne ou jeton déjà invalide : on déconnecte localement quand même.
    }
    await ref.read(tokenStorageProvider).clear();
    state = const AsyncData(null);
  }

  /// Appelé par l'intercepteur sur un 401 : jeton expiré ou révoqué.
  /// Sans effet pendant le chargement initial ([build] gère lui-même le 401).
  Future<void> expire() async {
    if (state.valueOrNull == null) return;
    await ref.read(tokenStorageProvider).clear();
    state = const AsyncData(null);
  }
}
