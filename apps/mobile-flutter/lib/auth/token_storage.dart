import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Stockage du jeton d'accès API (Bearer) émis par `POST /api/auth/login`.
///
/// Le jeton est un secret : il est rangé dans le stockage sécurisé de la
/// plateforme (Keychain iOS, Keystore Android), jamais en clair dans des
/// préférences partagées.
abstract class TokenStorage {
  Future<String?> read();
  Future<void> write(String token);
  Future<void> clear();
}

/// Implémentation plateforme (flutter_secure_storage) avec cache mémoire,
/// pour éviter un aller-retour natif à chaque requête HTTP.
class SecureTokenStorage implements TokenStorage {
  SecureTokenStorage([FlutterSecureStorage? storage])
      : _storage = storage ?? const FlutterSecureStorage();

  static const _key = 'natanga.api_token';

  final FlutterSecureStorage _storage;
  String? _cache;
  bool _loaded = false;

  @override
  Future<String?> read() async {
    if (_loaded) return _cache;
    try {
      _cache = await _storage.read(key: _key);
    } catch (_) {
      // Stockage indisponible (ex. environnement de test) : pas de session.
      _cache = null;
    }
    _loaded = true;
    return _cache;
  }

  @override
  Future<void> write(String token) async {
    _cache = token;
    _loaded = true;
    await _storage.write(key: _key, value: token);
  }

  @override
  Future<void> clear() async {
    _cache = null;
    _loaded = true;
    try {
      await _storage.delete(key: _key);
    } catch (_) {
      // Rien à effacer côté plateforme : le cache mémoire est déjà vidé.
    }
  }
}

/// Implémentation mémoire — tests et prototypage.
class InMemoryTokenStorage implements TokenStorage {
  InMemoryTokenStorage([this._token]);

  String? _token;

  @override
  Future<String?> read() async => _token;

  @override
  Future<void> write(String token) async => _token = token;

  @override
  Future<void> clear() async => _token = null;
}

/// Provider du stockage de jeton (remplaçable en test par [InMemoryTokenStorage]).
final tokenStorageProvider = Provider<TokenStorage>((ref) => SecureTokenStorage());
