/// Exception API typée — alignée sur le format RFC 7807 renvoyé par l'API
/// Laravel (renderer `DomainException` dans `bootstrap/app.php`).
///
/// Corps d'erreur : `{ "type": "about:blank", "title": "...", "status": 4xx, "code": "..." }`.
class ApiException implements Exception {
  /// Code métier stable (ex. `ERR_AGE`, `ERR_LOGIN`, `ERR_CONSENT_REQUIRED`).
  final String code;

  /// Message lisible (titre RFC 7807).
  final String message;

  /// Statut HTTP (4xx).
  final int status;

  const ApiException({
    required this.code,
    required this.message,
    required this.status,
  });

  bool get isUnauthorized => status == 401;
  bool get isUnprocessable => status == 422;
  bool get isNotFound => status == 404;
  bool get isForbidden => status == 403;

  /// Jeton absent, invalide ou expiré (session à rouvrir).
  bool get isSessionExpired => code == 'ERR_UNAUTHENTICATED';

  /// Activité enfant refusée : consentement parental non accordé (docs/25 §4).
  bool get isConsentRequired => code == 'ERR_CONSENT_REQUIRED';

  /// Connexion refusée : email du parent pas encore vérifié.
  bool get isEmailNotVerified => code == 'ERR_NOT_VERIFIED';

  /// Construit une [ApiException] depuis un corps JSON RFC 7807.
  /// Retourne `null` si le corps n'est pas une erreur reconnue.
  static ApiException? fromBody(dynamic body, {int? fallbackStatus}) {
    if (body is! Map) return null;
    final code = body['code'];
    final title = body['title'];
    final status = body['status'];
    if (code is! String) return null;
    return ApiException(
      code: code,
      message: title is String ? title : 'Erreur inconnue',
      status: status is int ? status : (fallbackStatus ?? 400),
    );
  }

  @override
  String toString() => 'ApiException($status $code): $message';
}
