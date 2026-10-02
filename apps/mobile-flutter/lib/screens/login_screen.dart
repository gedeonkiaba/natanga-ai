import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../router.dart';
import '../state/session_controller.dart';
import '../ui/api_error_message.dart';

/// Connexion parent (`POST /api/auth/login`).
///
/// En cas de succès, le router redirige automatiquement vers l'espace parent
/// (écoute de [sessionControllerProvider]).
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _submitted = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    if (email.isEmpty || password.isEmpty) return;
    setState(() => _submitted = true);
    ref.read(sessionControllerProvider.notifier).login(email, password);
  }

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(sessionControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Espace parent')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const Text(
              'Se connecter',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              autofillHints: const [AutofillHints.email],
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passwordController,
              obscureText: true,
              autofillHints: const [AutofillHints.password],
              decoration: const InputDecoration(labelText: 'Mot de passe'),
              onSubmitted: (_) => _login(),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: session.isLoading ? null : _login,
              child: session.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Se connecter'),
            ),
            const SizedBox(height: 16),
            // L'erreur n'est affichée qu'après une tentative de l'utilisateur.
            if (_submitted && session.hasError && !session.isLoading)
              ApiErrorBanner(error: session.error!),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => context.go(Routes.register),
              child: const Text('Pas encore de compte ? Créer un compte'),
            ),
          ],
        ),
      ),
    );
  }
}
