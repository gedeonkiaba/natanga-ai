import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/api/api_exception.dart';

void main() {
  group('ApiException (RFC 7807)', () {
    test('désérialise un corps d’erreur standard', () {
      final e = ApiException.fromBody({
        'type': 'about:blank',
        'title': 'ce contenu s’adresse aux enfants de 6 à 12 ans',
        'status': 422,
        'code': 'ERR_AGE',
      });

      expect(e, isNotNull);
      expect(e!.code, 'ERR_AGE');
      expect(e.status, 422);
      expect(e.isUnprocessable, isTrue);
    });

    test('retourne null pour un corps non-reconnu', () {
      expect(ApiException.fromBody('pas un json'), isNull);
      expect(ApiException.fromBody({'foo': 'bar'}), isNull);
    });

    test('utilise le fallback status si absent', () {
      final e = ApiException.fromBody({'code': 'ERR_TOKEN', 'title': 'x'}, fallbackStatus: 401);
      expect(e!.status, 401);
      expect(e.isUnauthorized, isTrue);
    });
  });
}
