import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../auth/token_storage.dart';
import '../state/session_controller.dart';
import 'api_client.dart';
import 'models.dart';

/// Provider global du client API (injectable, remplaçable en test).
///
/// - Le jeton est lu dans [tokenStorageProvider] à chaque requête.
/// - Un 401 sur une requête authentifiée ferme la session locale.
final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(tokenStorageProvider);
  return ApiClient(
    readToken: storage.read,
    onUnauthorized: () => ref.read(sessionControllerProvider.notifier).expire(),
  );
});

/// Service d'authentification — **client pur** vers l'API Laravel.
/// Aucune logique métier (hachage, anti-énumération, vérification) n'est
/// réimplémentée ici : tout vit dans le backend (docs/25).
class AuthService {
  final ApiClient _api;
  AuthService(this._api);

  Future<Map<String, dynamic>> register(String email, String password) async {
    final json = await _api.post(
      '/auth/register',
      {'email': email, 'password': password},
      auth: false,
    );
    return (json as Map).cast<String, dynamic>();
  }

  Future<Map<String, dynamic>> verifyEmail(String token) async {
    final json = await _api.post('/auth/verify-email', {'token': token}, auth: false);
    return (json as Map).cast<String, dynamic>();
  }

  /// `POST /auth/login` → jeton Bearer (à stocker immédiatement).
  Future<LoginResult> login(
    String email,
    String password, {
    String deviceName = 'natanga-flutter',
  }) async {
    final json = await _api.post(
      '/auth/login',
      {'email': email, 'password': password, 'deviceName': deviceName},
      auth: false,
    );
    return LoginResult.fromJson((json as Map).cast<String, dynamic>());
  }

  /// `GET /auth/me` → compte parent associé au jeton courant.
  Future<ParentAccount> me() async {
    final json = await _api.get('/auth/me');
    return ParentAccount.fromJson((json as Map).cast<String, dynamic>());
  }

  /// `POST /auth/logout` → révoque le jeton de cet appareil côté serveur.
  Future<void> logout() async {
    await _api.post('/auth/logout', const {});
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.watch(apiClientProvider));
});
