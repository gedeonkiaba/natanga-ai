import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/api/api_client.dart';

import 'support/fake_adapter.dart';

void main() {
  late FakeAdapter adapter;
  late int unauthorizedCalls;
  String? token;

  ApiClient buildClient(ResponseBody Function(RequestOptions) handler) {
    adapter = FakeAdapter(handler);
    final dio = Dio()..httpClientAdapter = adapter;
    return ApiClient(
      baseUrl: 'http://api.test',
      dio: dio,
      readToken: () async => token,
      onUnauthorized: () => unauthorizedCalls++,
    );
  }

  setUp(() {
    unauthorizedCalls = 0;
    token = 'secret-token';
  });

  test('ajoute Authorization: Bearer sur une requête authentifiée', () async {
    final api = buildClient((_) => jsonResponse([], 200));

    await api.get('/children');

    expect(adapter.requests.single.headers['Authorization'], 'Bearer secret-token');
  });

  test('n’ajoute pas le jeton sur une route publique (auth: false)', () async {
    final api = buildClient((_) => jsonResponse({'token': 't', 'userId': 'u'}, 200));

    await api.post('/auth/login', {'email': 'a@b.c', 'password': 'x'}, auth: false);

    expect(adapter.requests.single.headers.containsKey('Authorization'), isFalse);
  });

  test('n’ajoute rien quand aucun jeton n’est stocké', () async {
    token = null;
    final api = buildClient((_) => jsonResponse([], 200));

    await api.get('/children');

    expect(adapter.requests.single.headers.containsKey('Authorization'), isFalse);
  });

  test('un 401 sur requête authentifiée déclenche onUnauthorized et une ApiException typée', () async {
    final api = buildClient((_) => problem(401, 'ERR_UNAUTHENTICATED'));

    Object? caught;
    try {
      await api.get('/children');
    } catch (e) {
      caught = e;
    }

    expect(unauthorizedCalls, 1);
    final apiError = ApiClient.errorOf(caught!);
    expect(apiError?.isSessionExpired, isTrue);
  });

  test('un 401 au login (ERR_LOGIN) ne ferme pas de session', () async {
    final api = buildClient((_) => problem(401, 'ERR_LOGIN'));

    await expectLater(
      api.post('/auth/login', {'email': 'a@b.c', 'password': 'x'}, auth: false),
      throwsA(isA<DioException>()),
    );
    expect(unauthorizedCalls, 0);
  });

  test('un 403 ERR_CONSENT_REQUIRED est typé et ne ferme pas la session', () async {
    final api = buildClient((_) => problem(403, 'ERR_CONSENT_REQUIRED'));

    Object? caught;
    try {
      await api.get('/children/c1/texts');
    } catch (e) {
      caught = e;
    }

    expect(unauthorizedCalls, 0);
    expect(ApiClient.errorOf(caught!)?.isConsentRequired, isTrue);
  });
}
