import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/consent_service.dart';
import '../api/models.dart';
import '../state/session_controller.dart';
import '../theme/natanga_theme.dart';
import '../ui/api_error_message.dart';

/// Enfants du parent connecté (`GET /api/children`, filtré côté serveur).
final childrenProvider = FutureProvider.autoDispose<List<Child>>((ref) {
  // Recharge si la session change (connexion d'un autre parent).
  ref.watch(sessionControllerProvider);
  return ref.read(consentServiceProvider).listChildren();
});

/// Espace parent (route protégée) : profils enfants + consentement parental.
///
/// Tant que le consentement n'est pas accordé, l'API refuse toute activité de
/// l'enfant (403 `ERR_CONSENT_REQUIRED`) : c'est ici que le parent le donne
/// ou le retire.
class ParentScreen extends ConsumerWidget {
  const ParentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionControllerProvider);
    final children = ref.watch(childrenProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Espace parent'),
        actions: [
          IconButton(
            tooltip: 'Se déconnecter',
            icon: const Icon(Icons.logout),
            onPressed: () => ref.read(sessionControllerProvider.notifier).logout(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _addChild(context, ref),
        icon: const Icon(Icons.add),
        label: const Text('Ajouter un enfant'),
      ),
      body: SafeArea(
        child: session.isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: () => ref.refresh(childrenProvider.future),
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
                  children: [
                    if (session.valueOrNull != null)
                      Text(
                        session.valueOrNull!.email,
                        style: const TextStyle(color: NatangaColors.textMuted),
                      ),
                    const SizedBox(height: 12),
                    ...children.when<List<Widget>>(
                      loading: () => [const Center(child: CircularProgressIndicator())],
                      error: (e, _) => [ApiErrorBanner(error: e)],
                      data: (list) => list.isEmpty
                          ? [
                              const Padding(
                                padding: EdgeInsets.symmetric(vertical: 32),
                                child: Text(
                                  'Ajoutez le profil de votre enfant pour commencer.',
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ]
                          : [for (final child in list) _ChildCard(child: child)],
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Future<void> _addChild(BuildContext context, WidgetRef ref) async {
    final created = await showDialog<bool>(
      context: context,
      builder: (_) => const _AddChildDialog(),
    );
    if (created == true) ref.invalidate(childrenProvider);
  }
}

class _ChildCard extends ConsumerStatefulWidget {
  final Child child;
  const _ChildCard({required this.child});

  @override
  ConsumerState<_ChildCard> createState() => _ChildCardState();
}

class _ChildCardState extends ConsumerState<_ChildCard> {
  bool _busy = false;
  Object? _error;

  Future<void> _apply(String action) async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(consentServiceProvider).applyConsent(widget.child.id, action);
      ref.invalidate(childrenProvider);
    } catch (e) {
      if (mounted) setState(() => _error = e);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final child = widget.child;
    final active = child.hasConsent;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              child.displayName,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 4),
            Text(
              '${child.ageBand} ans · '
              '${active ? 'accord parental donné' : 'accord parental en attente'}',
              style: TextStyle(color: active ? NatangaColors.primary : NatangaColors.warningContrast),
            ),
            const SizedBox(height: 12),
            if (active)
              OutlinedButton(
                onPressed: _busy ? null : () => _apply('revoke'),
                child: const Text('Retirer mon accord'),
              )
            else
              FilledButton(
                onPressed: _busy ? null : () => _apply('grant'),
                child: const Text('Donner mon accord parental'),
              ),
            if (_error != null) ...[
              const SizedBox(height: 8),
              ApiErrorBanner(error: _error!),
            ],
          ],
        ),
      ),
    );
  }
}

class _AddChildDialog extends ConsumerStatefulWidget {
  const _AddChildDialog();

  @override
  ConsumerState<_AddChildDialog> createState() => _AddChildDialogState();
}

class _AddChildDialogState extends ConsumerState<_AddChildDialog> {
  final _nameController = TextEditingController();
  final _yearController = TextEditingController();
  bool _busy = false;
  Object? _error;

  @override
  void dispose() {
    _nameController.dispose();
    _yearController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final year = int.tryParse(_yearController.text.trim());
    if (name.isEmpty || year == null) return;

    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(consentServiceProvider).createChild(name, year);
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) setState(() => _error = e);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Ajouter un enfant'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _nameController,
            textCapitalization: TextCapitalization.words,
            decoration: const InputDecoration(labelText: 'Prénom (ou surnom)'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _yearController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Année de naissance'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            ApiErrorBanner(error: _error!),
          ],
        ],
      ),
      actions: [
        TextButton(
          onPressed: _busy ? null : () => Navigator.of(context).pop(false),
          child: const Text('Annuler'),
        ),
        FilledButton(
          onPressed: _busy ? null : _submit,
          child: const Text('Ajouter'),
        ),
      ],
    );
  }
}
