import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/api/api_client.dart';
import 'package:natanga_mobile/api/auth_service.dart';
import 'package:natanga_mobile/auth/token_storage.dart';
import 'package:natanga_mobile/state/session_controller.dart';

import 'support/fake_adapter.dart';

/// Faux backend : un seul parent, un seul jeton valide.
ResponseBody fakeBackend(RequestOptions o) {
  final path = o.uri.path;
  final auth = o.headers['Authorization'];

  if (o.method == 'POST' && path == '/api/auth/login') {
    final body = o.data as Map;
    if (body['email'] == 'lea@parent.test' && body['password'] == 'secret1234') {
      return jsonResponse(
        {'token': 'good-token', 'tokenType': 'Bearer', 'expiresInDays': 30, 'userId': 'u1'},
        200,
      );
    }
    return problem(401, 'ERR_LOGIN', 'identifiants invalides');
  }
  if (auth != 'Bearer good-token') return problem(401, 'ERR_UNAUTHENTICATED');
  if (o.method == 'GET' && path == '/api/auth/me') {
    return jsonResponse({'userId': 'u1', 'email': 'lea@parent.test', 'status': 'ACTIVE'}, 200);
  }
  if (o.method == 'POST' && path == '/api/auth/logout') return jsonResponse(null, 204);
  return problem(404, 'ERR_NOT_FOUND');
}

ProviderContainer makeContainer(InMemoryTokenStorage storage, FakeAdapter adapter) {
  final container = ProviderContainer(overrides: [
    tokenStorageProvider.overrideWithValue(storage),
    apiClientProvider.overrideWith((ref) {
      final dio = Dio()..httpClientAdapter = adapter;
      return ApiClient(
        baseUrl: 'http://api.test',
        dio: dio,
        readToken: storage.read,
        onUnauthorized: () => ref.read(sessionControllerProvider.notifier).expire(),
      );
    }),
  ]);
  addTearDown(container.dispose);
  return container;
}

void main() {
  test('sans jeton stocké, la session démarre déconnectée', () async {
    final c = makeContainer(InMemoryTokenStorage(), FakeAdapter(fakeBackend));

    expect(await c.read(sessionControllerProvider.future), isNull);
  });

  test('login stocke le jeton et charge le compte', () async {
    final storage = InMemoryTokenStorage();
    final c = makeContainer(storage, FakeAdapter(fakeBackend));
    await c.read(sessionControllerProvider.future);

    await c.read(sessionControllerProvider.notifier).login('lea@parent.test', 'secret1234');

    final account = c.read(sessionControllerProvider).valueOrNull;
    expect(account?.userId, 'u1');
    expect(await storage.read(), 'good-token');
  });

  test('login refusé : état en erreur ERR_LOGIN, aucun jeton stocké', () async {
    final storage = InMemoryTokenStorage();
    final c = makeContainer(storage, FakeAdapter(fakeBackend));
    await c.read(sessionControllerProvider.future);

    await c.read(sessionControllerProvider.notifier).login('lea@parent.test', 'mauvais');

    final state = c.read(sessionControllerProvider);
    expect(state.hasError, isTrue);
    expect(ApiClient.errorOf(state.error!)?.code, 'ERR_LOGIN');
    expect(await storage.read(), isNull);
  });

  test('un jeton stocké valide restaure la session au démarrage', () async {
    final c = makeContainer(InMemoryTokenStorage('good-token'), FakeAdapter(fakeBackend));

    final account = await c.read(sessionControllerProvider.future);
    expect(account?.email, 'lea@parent.test');
  });

  test('un jeton expiré au démarrage est effacé et la session est vide', () async {
    final storage = InMemoryTokenStorage('expired-token');
    final c = makeContainer(storage, FakeAdapter(fakeBackend));

    expect(await c.read(sessionControllerProvider.future), isNull);
    expect(await storage.read(), isNull);
  });

  test('logout révoque côté serveur puis efface localement', () async {
    final storage = InMemoryTokenStorage('good-token');
    final adapter = FakeAdapter(fakeBackend);
    final c = makeContainer(storage, adapter);
    await c.read(sessionControllerProvider.future);

    await c.read(sessionControllerProvider.notifier).logout();

    expect(adapter.requests.any((r) => r.uri.path == '/api/auth/logout'), isTrue);
    expect(c.read(sessionControllerProvider).valueOrNull, isNull);
    expect(await storage.read(), isNull);
  });

  test('un 401 en cours de session (jeton révoqué ailleurs) ferme la session', () async {
    final storage = InMemoryTokenStorage('good-token');
    final c = makeContainer(storage, FakeAdapter(fakeBackend));
    await c.read(sessionControllerProvider.future);

    // Le jeton est révoqué côté serveur (ex. logout depuis un autre appareil).
    await storage.write('revoked-token');
    await expectLater(c.read(authServiceProvider).me(), throwsA(isA<DioException>()));
    await Future<void>.delayed(Duration.zero);

    expect(c.read(sessionControllerProvider).valueOrNull, isNull);
    expect(await storage.read(), isNull);
  });
}
