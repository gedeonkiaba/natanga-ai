import 'package:dio/dio.dart';

/// Lecture asynchrone du jeton courant (ex. `TokenStorage.read`).
typedef TokenReader = Future<String?> Function();

/// Intercepteur d'authentification :
///
/// - ajoute `Authorization: Bearer <jeton>` à chaque requête, sauf si
///   `Options.extra[skipAuthKey] == true` (login, inscription, vérification) ;
/// - sur une réponse **401** à une requête authentifiée (jeton expiré ou
///   révoqué), déclenche [onUnauthorized] pour fermer la session locale.
///
/// `QueuedInterceptor` : les lectures asynchrones du jeton sont sérialisées.
class AuthInterceptor extends QueuedInterceptor {
  AuthInterceptor({required this.readToken, this.onUnauthorized});

  /// Clé `Options.extra` pour désactiver l'ajout du jeton sur une requête.
  static const skipAuthKey = 'natanga.skipAuth';

  final TokenReader readToken;
  final void Function()? onUnauthorized;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    if (options.extra[skipAuthKey] != true) {
      String? token;
      try {
        token = await readToken();
      } catch (_) {
        token = null;
      }
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final wasAuthenticated = err.requestOptions.headers.containsKey('Authorization');
    if (err.response?.statusCode == 401 && wasAuthenticated) {
      onUnauthorized?.call();
    }
    handler.next(err);
  }
}
