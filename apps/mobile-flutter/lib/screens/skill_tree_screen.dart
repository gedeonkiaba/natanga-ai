import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../design/tokens.dart';
import '../design/widgets.dart';
import '../domain/pedagogy.dart';
import '../navigation.dart';
import '../router.dart';
import '../state/progress_controller.dart';

/// « Mon parcours » (US-05) : nœuds de l'arbre, débloqués au fil de la maîtrise.
class SkillTreeScreen extends ConsumerWidget {
  const SkillTreeScreen({super.key});

  static const _labels = {
    NodeStatus.locked: 'Verrouillé',
    NodeStatus.available: 'Disponible',
    NodeStatus.inProgress: 'En cours',
    NodeStatus.mastered: 'Terminé',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);
    final states = computeTreeState(level1Nodes, progress.treeProgress);
    final mastered = states.where((s) => s.status == NodeStatus.mastered).length;
    return AppScreen(
      nav: BottomNav(items: Tabs.home(context), active: 'bibliotheque', indicator: NavIndicator.dot),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Semantics(header: true, child: Text('Mon parcours', style: TypeScale.title)),
            Pill('${progress.gems}', tone: Tone.sky, icon: 'emoji:gem-stone'),
          ],
        ),
        for (final s in states)
          _NodeCard(state: s, label: _labels[s.status]!, onOpen: () => context.go('${Routes.lesson}?node=${s.node.id}')),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Progression globale', style: TypeScale.caption.copyWith(color: Palette.inkBody)),
            const SizedBox(height: Space.sm),
            AppProgressBar(value: mastered / level1Nodes.length, label: 'Progression globale'),
          ],
        ),
      ],
    );
  }
}

class _NodeCard extends StatelessWidget {
  const _NodeCard({required this.state, required this.label, required this.onOpen});
  final NodeState state;
  final String label;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final locked = state.status == NodeStatus.locked;
    final mastered = state.status == NodeStatus.mastered;
    final (icon, tone) = switch (state.status) {
      NodeStatus.mastered => ('circle-check', Tone.teal),
      NodeStatus.locked => ('lock', Tone.slate),
      _ => ('book-open', Tone.indigo),
    };
    return Opacity(
      opacity: locked ? 0.6 : 1,
      child: AppCard(
        child: Row(
          children: [
            IconTile(icon, tone: tone, size: 44, iconSize: 22),
            const SizedBox(width: Space.lg),
            Expanded(
              child: Semantics(
                label: '${state.node.title} — $label',
                excludeSemantics: true,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(state.node.title, style: TypeScale.cardTitle),
                    const SizedBox(height: 2),
                    Text(label, style: TypeScale.caption.copyWith(color: mastered ? Palette.teal700 : Palette.inkSoft)),
                  ],
                ),
              ),
            ),
            if (!locked)
              SizedBox(
                width: 132,
                child: AppButton(
                  mastered ? 'Revoir' : 'Commencer',
                  variant: mastered ? ButtonVariant.outline : ButtonVariant.primary,
                  onPressed: onOpen,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
