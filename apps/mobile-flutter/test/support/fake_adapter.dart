import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';

/// Adaptateur HTTP factice pour Dio : aucune requête réseau réelle.
/// Chaque requête est enregistrée dans [requests] puis servie par [handler].
class FakeAdapter implements HttpClientAdapter {
  FakeAdapter(this.handler);

  final ResponseBody Function(RequestOptions options) handler;
  final List<RequestOptions> requests = [];

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(options);
    return handler(options);
  }

  @override
  void close({bool force = false}) {}
}

/// Réponse JSON (Content-Type application/json).
ResponseBody jsonResponse(Object? body, int status) => ResponseBody.fromString(
      jsonEncode(body),
      status,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );

/// Corps d'erreur RFC 7807 tel que renvoyé par l'API Laravel.
ResponseBody problem(int status, String code, [String title = 'erreur']) => jsonResponse(
      {'type': 'about:blank', 'title': title, 'status': status, 'code': code},
      status,
    );
