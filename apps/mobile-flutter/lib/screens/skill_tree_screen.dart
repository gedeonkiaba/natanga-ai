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
    final states = computeTreeState(curriculumNodes, progress.treeProgress);
    final byId = {for (final s in states) s.node.id: s};
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
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Progression globale · $mastered / ${curriculumNodes.length} leçons', style: TypeScale.caption.copyWith(color: Palette.inkBody)),
            const SizedBox(height: Space.sm),
            AppProgressBar(value: mastered / curriculumNodes.length, label: 'Progression globale'),
          ],
        ),
        for (final level in curriculumLevels) ...[
          _LevelHeader(level: level, states: [for (final n in nodesOfLevel(level.key)) byId[n.id]!]),
          // Un niveau pas encore atteint reste replié : l'enfant voit où il va, sans liste écrasante.
          if (nodesOfLevel(level.key).any((n) => byId[n.id]!.status != NodeStatus.locked))
            for (final n in nodesOfLevel(level.key))
              _NodeCard(state: byId[n.id]!, label: _labels[byId[n.id]!.status]!, onOpen: () => context.go('${Routes.lesson}?node=${n.id}')),
        ],
      ],
    );
  }
}

class _LevelHeader extends StatelessWidget {
  const _LevelHeader({required this.level, required this.states});
  final CurriculumLevel level;
  final List<NodeState> states;

  @override
  Widget build(BuildContext context) {
    final done = states.where((s) => s.status == NodeStatus.mastered).length;
    final reached = states.any((s) => s.status != NodeStatus.locked);
    return Padding(
      padding: const EdgeInsets.only(top: Space.md),
      child: Semantics(
        header: true,
        label: 'Niveau ${level.rank} : ${level.name}. ${level.objective}. $done leçons terminées sur ${states.length}${reached ? '' : ', verrouillé'}',
        excludeSemantics: true,
        child: Row(
          children: [
            IconTile(reached ? (done == states.length ? 'circle-check' : 'sparkles') : 'lock', tone: reached ? Tone.violet : Tone.slate, size: 36, iconSize: 18),
            const SizedBox(width: Space.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Niveau ${level.rank} · ${level.name}', style: TypeScale.cardTitle),
                  Text(level.objective, style: TypeScale.caption.copyWith(color: Palette.inkSoft)),
                ],
              ),
            ),
            const SizedBox(width: Space.sm),
            Pill('$done/${states.length}', tone: done == states.length ? Tone.teal : Tone.indigo),
          ],
        ),
      ),
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
