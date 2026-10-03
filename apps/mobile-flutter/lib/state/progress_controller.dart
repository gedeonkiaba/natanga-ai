import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../features/progress.dart';

/// Clé de sauvegarde sur l'appareil (même nom que l'app Expo).
const progressStorageKey = 'natanga.progress.v1';

/// Stockage local, initialisé dans `main()` avant le lancement (remplacé en test).
final sharedPreferencesProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('sharedPreferencesProvider doit être fourni au démarrage'),
);

/// Progression de l'enfant : lue au démarrage, enregistrée à chaque changement.
/// Aucune connexion requise ; si l'écriture échoue, l'app continue en mémoire.
class ProgressController extends Notifier<ProgressState> {
  @override
  ProgressState build() => ProgressState.parse(ref.read(sharedPreferencesProvider).getString(progressStorageKey));

  void update(ProgressState Function(ProgressState) change) {
    state = change(state);
    ref.read(sharedPreferencesProvider).setString(progressStorageKey, state.toJsonString()).catchError((_) => false);
  }
}

final progressProvider = NotifierProvider<ProgressController, ProgressState>(ProgressController.new);
