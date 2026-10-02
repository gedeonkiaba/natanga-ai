import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../router.dart';
import '../theme/natanga_theme.dart';

/// Donnée statique de nœuds de l'arbre (miroir du contenu niveau 1 côté API).
/// La source de vérité pédagogique reste le backend ; ici on affiche une vue
/// simple pour la navigation (la vraie liste viendra de l'API).
class _SkillNode {
  final String id;
  final String title;
  final bool unlocked;
  const _SkillNode(this.id, this.title, this.unlocked);
}

const _nodes = [
  _SkillNode('n-letters-a', 'Les voyelles', true),
  _SkillNode('n-letters-bd', 'Les sons b / d', true),
  _SkillNode('n-letters-pq', 'Les sons p / q', false),
];

/// Écran arbre de compétences (US-05) — liste des nœuds avec leur statut.
class SkillTreeScreen extends StatelessWidget {
  const SkillTreeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mon parcours')),
      body: ListView.separated(
        padding: const EdgeInsets.all(24),
        itemCount: _nodes.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final node = _nodes[index];
          return Card(
            color: node.unlocked ? NatangaColors.surface : NatangaColors.border,
            child: ListTile(
              title: Text(node.title),
              subtitle: Text(node.unlocked ? 'Disponible' : 'Verrouillé'),
              enabled: node.unlocked,
              trailing: const Icon(Icons.chevron_right),
              onTap: node.unlocked
                  ? () => context.go('${Routes.lesson}?node=${node.id}')
                  : null,
            ),
          );
        },
      ),
    );
  }
}
