import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/api/models.dart';

void main() {
  group('DTO Child', () {
    test('désérialise un profil enfant depuis le JSON API (camelCase, POST /children)', () {
      final child = Child.fromJson({
        'id': 'c1',
        'userId': 'u1',
        'displayName': 'Léa',
        'birthYear': 2018,
        'avatar': null,
        'ageBand': '6-8',
        'status': 'INACTIVE',
      });

      expect(child.id, 'c1');
      expect(child.displayName, 'Léa');
      expect(child.ageBand, '6-8');
      expect(child.status, 'INACTIVE');
      expect(child.hasConsent, isFalse);
    });

    test('désérialise le modèle brut snake_case (GET /children)', () {
      final child = Child.fromJson({
        'id': 'c2',
        'user_id': 'u1',
        'display_name': 'Noé',
        'birth_year': 2016,
        'avatar': 'fox',
        'age_band': '9-12',
        'status': 'ACTIVE',
      });

      expect(child.userId, 'u1');
      expect(child.displayName, 'Noé');
      expect(child.birthYear, 2016);
      expect(child.ageBand, '9-12');
      expect(child.hasConsent, isTrue);
    });
  });

  group('DTO Consent', () {
    test('désérialise un consentement versionné', () {
      final consent = Consent.fromJson({
        'id': 'c1:uuid',
        'childId': 'c1',
        'version': 2,
        'status': 'REVOKED',
        'grantedAt': '2025-01-01T00:00:00Z',
        'revokedAt': '2025-01-02T00:00:00Z',
      });

      expect(consent.version, 2);
      expect(consent.status, 'REVOKED');
      expect(consent.revokedAt, isNotNull);
    });
  });

  group('DTO auth', () {
    test('désérialise la réponse de login', () {
      final r = LoginResult.fromJson({
        'token': 'abc',
        'tokenType': 'Bearer',
        'expiresInDays': 30,
        'userId': 'u1',
      });
      expect(r.token, 'abc');
      expect(r.expiresInDays, 30);
    });

    test('désérialise le compte parent (GET /auth/me)', () {
      final a = ParentAccount.fromJson({'userId': 'u1', 'email': 'a@b.c', 'status': 'ACTIVE'});
      expect(a.userId, 'u1');
      expect(a.email, 'a@b.c');
    });
  });
}
