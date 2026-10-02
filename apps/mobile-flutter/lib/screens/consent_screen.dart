import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../router.dart';
import '../state/auth_controller.dart';
import '../theme/natanga_theme.dart';
import '../ui/api_error_message.dart';

/// Création du compte parent — connecte réellement à l'API Laravel.
///
/// Crée un compte parent et affiche une erreur RFC 7807 typée (ex. `ERR_REGISTER`)
/// en cas d'échec, sans exposer de détail interne.
class ConsentScreen extends ConsumerStatefulWidget {
  const ConsentScreen({super.key});

  @override
  ConsumerState<ConsentScreen> createState() => _ConsentScreenState();
}

class _ConsentScreenState extends ConsumerState<ConsentScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _submitted = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _register() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    if (email.isEmpty || password.isEmpty) return;
    setState(() => _submitted = true);
    ref.read(authControllerProvider.notifier).register(email, password);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Espace parent')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Créer un compte parent',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Mot de passe'),
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: authState.isLoading ? null : _register,
                child: authState.isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Créer le compte'),
              ),
              const SizedBox(height: 16),
              // Affichage de l'état async (succès / erreur typée).
              if (authState.hasError)
                ApiErrorBanner(error: authState.error ?? Exception('unknown'))
              else if (authState.hasValue && _submitted)
                const Text(
                  'Compte créé — vérifiez votre email, puis connectez-vous.',
                  style: TextStyle(color: NatangaColors.primary),
                ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => context.go(Routes.login),
                child: const Text('J’ai déjà un compte : me connecter'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
