import 'package:dio/dio.dart';
import 'api_exception.dart';
import 'auth_interceptor.dart';

/// Configuration du client HTTP vers l'API Laravel (`apps/api-laravel`,
/// source de vérité métier — ADR docs/18).
///
/// L'application Flutter est un **client pur** : aucune logique métier
/// (pédagogie, consentement RGPD, SRS) n'est réimplémentée ici.
///
/// - Authentification : jeton Bearer ajouté par [AuthInterceptor] (docs/25).
/// - Erreurs HTTP converties en [ApiException] typée (RFC 7807), afin que
///   l'UI affiche des messages exacts sans exposer de détail interne.
///
/// URL de base : `--dart-define=API_BASE_URL=...`
/// (émulateur Android : `http://10.0.2.2:8000`).
class ApiClient {
  ApiClient({
    String? baseUrl,
    Dio? dio,
    TokenReader? readToken,
    void Function()? onUnauthorized,
  })  : _dio = dio ?? Dio(),
        baseUrl = baseUrl ??
            const String.fromEnvironment('API_BASE_URL',
                defaultValue: 'http://localhost:8000') {
    _configureInterceptors(readToken, onUnauthorized);
  }

  final Dio _dio;
  final String baseUrl;

  Dio get dio => _dio;

  void _configureInterceptors(TokenReader? readToken, void Function()? onUnauthorized) {
    // 1. Authentification (avant la conversion d'erreur : voit le 401 brut).
    if (readToken != null) {
      _dio.interceptors.add(
        AuthInterceptor(readToken: readToken, onUnauthorized: onUnauthorized),
      );
    }

    // 2. Conversion des erreurs RFC 7807 en ApiException typée.
    _dio.interceptors.add(
      InterceptorsWrapper(
        onError: (e, handler) {
          final response = e.response;
          final apiError = response != null
              ? ApiException.fromBody(response.data, fallbackStatus: response.statusCode)
              : null;
          if (apiError != null) {
            handler.reject(
              DioException(
                requestOptions: e.requestOptions,
                response: response,
                error: apiError,
                type: e.type,
              ),
            );
            return;
          }
          handler.next(e);
        },
      ),
    );
  }

  /// Construit l'URL complète d'un endpoint (préfixe `/api` inclus).
  Uri uri(String path) => Uri.parse('$baseUrl/api$path');

  Options _options(Map<String, String>? headers, bool auth) => Options(
        headers: headers,
        extra: {AuthInterceptor.skipAuthKey: !auth},
      );

  /// [auth] : `false` pour les routes publiques (login, inscription…).
  Future<dynamic> post(
    String path,
    Map<String, dynamic> body, {
    Map<String, String>? headers,
    bool auth = true,
  }) async {
    final res = await _dio.post<dynamic>(
      uri(path).toString(),
      data: body,
      options: _options(headers, auth),
    );
    return res.data;
  }

  Future<dynamic> patch(
    String path,
    Map<String, dynamic> body, {
    Map<String, String>? headers,
    bool auth = true,
  }) async {
    final res = await _dio.patch<dynamic>(
      uri(path).toString(),
      data: body,
      options: _options(headers, auth),
    );
    return res.data;
  }

  Future<dynamic> get(String path, {Map<String, String>? headers, bool auth = true}) async {
    final res = await _dio.get<dynamic>(
      uri(path).toString(),
      options: _options(headers, auth),
    );
    return res.data;
  }

  Future<dynamic> delete(String path, {Map<String, String>? headers, bool auth = true}) async {
    final res = await _dio.delete<dynamic>(
      uri(path).toString(),
      options: _options(headers, auth),
    );
    return res.data;
  }

  /// Récupère l'[ApiException] typée depuis une erreur Dio, si disponible.
  static ApiException? errorOf(Object error) {
    if (error is ApiException) return error;
    if (error is DioException && error.error is ApiException) {
      return error.error as ApiException;
    }
    return null;
  }
}
