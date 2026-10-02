import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_client.dart';
import 'auth_service.dart' show apiClientProvider;
import 'models.dart';

/// Service enfants & consentement — **client pur** vers l'API Laravel.
///
/// Le parent est identifié par le jeton Bearer (ajouté par l'intercepteur) :
/// plus aucun identifiant utilisateur n'est transmis par le client.
/// La machine à états RGPD/COPPA vit dans le backend ; ici on ne fait que
/// transmettre les actions (grant/deny/revoke) et lire l'historique.
class ConsentService {
  final ApiClient _api;
  ConsentService(this._api);

  Future<Child> createChild(String displayName, int birthYear) async {
    final json = await _api.post(
      '/children',
      {'displayName': displayName, 'birthYear': birthYear},
    );
    return Child.fromJson((json as Map).cast<String, dynamic>());
  }

  /// Enfants du parent connecté uniquement (filtré côté serveur).
  Future<List<Child>> listChildren() async {
    final json = await _api.get('/children');
    final list = (json as List).cast<Map<String, dynamic>>();
    return list.map(Child.fromJson).toList();
  }

  /// [action] : `grant` | `deny` | `revoke`.
  Future<Consent> applyConsent(String childId, String action) async {
    final json = await _api.post('/children/$childId/consents', {'action': action});
    return Consent.fromJson((json as Map).cast<String, dynamic>());
  }

  Future<List<Consent>> history(String childId) async {
    final json = await _api.get('/children/$childId/consents');
    final list = (json as List).cast<Map<String, dynamic>>();
    return list.map(Consent.fromJson).toList();
  }
}

final consentServiceProvider = Provider<ConsentService>((ref) {
  return ConsentService(ref.watch(apiClientProvider));
});
