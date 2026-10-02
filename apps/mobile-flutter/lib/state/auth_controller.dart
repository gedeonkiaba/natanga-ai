import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/auth_service.dart';
import '../api/api_exception.dart';

/// StateNotifier d'authentification — expose un état `AsyncValue`.
/// Les erreurs API sont exposées (via `AsyncValue.error`) ; l'UI extrait
/// l'[ApiException] typée via `ApiClient.errorOf`.
final authControllerProvider =
    AsyncNotifierProvider<AuthController, void>(AuthController.new);

class AuthController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> register(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(authServiceProvider);
      await service.register(email, password);
    });
  }

  Future<void> verifyEmail(String token) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(authServiceProvider);
      await service.verifyEmail(token);
    });
  }
}
