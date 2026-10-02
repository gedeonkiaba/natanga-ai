import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/api/models.dart';
import 'package:natanga_mobile/router.dart';

void main() {
  const account = ParentAccount(userId: 'u1', email: 'a@b.c', status: 'ACTIVE');
  const loggedOut = AsyncData<ParentAccount?>(null);
  const loggedIn = AsyncData<ParentAccount?>(account);
  const loading = AsyncLoading<ParentAccount?>();

  group('authRedirect', () {
    test('espace parent sans session → /login', () {
      expect(authRedirect(loggedOut, Routes.parent), Routes.login);
    });

    test('espace parent avec session → pas de redirection', () {
      expect(authRedirect(loggedIn, Routes.parent), isNull);
    });

    test('/login avec session → espace parent', () {
      expect(authRedirect(loggedIn, Routes.login), Routes.parent);
    });

    test('pendant le chargement de la session → pas de redirection', () {
      expect(authRedirect(loading, Routes.parent), isNull);
    });

    test('session en erreur (ex. hors ligne) → /login', () {
      final error = AsyncError<ParentAccount?>(Exception('réseau'), StackTrace.empty);
      expect(authRedirect(error, Routes.parent), Routes.login);
    });

    test('routes publiques jamais redirigées', () {
      for (final route in [Routes.home, Routes.tree, Routes.register, Routes.lesson]) {
        expect(authRedirect(loggedOut, route), isNull, reason: route);
      }
    });
  });
}
