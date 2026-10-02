import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/api/api_client.dart';
import 'package:natanga_mobile/api/api_exception.dart';

void main() {
  test('extrait une ApiException typée depuis une DioException', () {
    final apiError = ApiException(code: 'ERR_AGE', message: 'âge invalide', status: 422);
    final dioError = DioException(
      requestOptions: RequestOptions(path: '/api/children'),
      error: apiError,
      type: DioExceptionType.badResponse,
    );

    final extracted = ApiClient.errorOf(dioError);
    expect(extracted, isNotNull);
    expect(extracted!.code, 'ERR_AGE');
    expect(extracted.isUnprocessable, isTrue);
  });

  test('extrait une ApiException passée directement', () {
    final e = ApiException(code: 'ERR_TOKEN', message: 'invalide', status: 401);
    expect(ApiClient.errorOf(e)?.code, 'ERR_TOKEN');
  });

  test('retourne null pour une erreur non API', () {
    expect(ApiClient.errorOf(Exception('réseau')), isNull);
  });

  test('construit un ApiClient avec une URL de base personnalisée', () {
    final client = ApiClient(baseUrl: 'http://api.test');
    expect(client.baseUrl, 'http://api.test');
    expect(client.uri('/auth/register').toString(), 'http://api.test/api/auth/register');
  });
}
