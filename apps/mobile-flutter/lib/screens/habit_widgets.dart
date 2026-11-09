import 'package:flutter/material.dart';

import '../design/tokens.dart';
import '../design/widgets.dart';
import '../domain/pedagogy.dart';
import '../features/habit.dart';

String daysLabel(int n) => n <= 1 ? '$n jour' : '$n jours';

/// Grande carte d'accueil : la prochaine leçon du parcours, en un geste (comme Duolingo).
class TodayLessonCard extends StatelessWidget {
  const TodayLessonCard({super.key, required this.next, required this.onStart, required this.onPath});

  /// Prochaine leçon ; null quand tout le parcours est terminé.
  final NodeState? next;
  final VoidCallback onStart;
  final VoidCallback onPath;

  @override
  Widget build(BuildContext context) {
    final node = next?.node;
    final level = node == null ? null : levelOf(node);
    final title = node?.title ?? 'Tout le parcours est terminé !';
    final meta = level == null ? 'Revois une leçon pour rester en forme' : 'Niveau ${level.rank} · ${level.name}';
    final started = next?.status == NodeStatus.inProgress;
    return Semantics(
      button: true,
      label: node == null ? '$title $meta' : 'Ma leçon du jour : $title, $meta. ${started ? 'Reprendre' : 'Commencer'}',
      excludeSemantics: true,
      child: InkWell(
        onTap: node == null ? onPath : onStart,
        borderRadius: BorderRadius.circular(Radii.lg),
        child: Container(
          padding: const EdgeInsets.all(Space.lg),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(Radii.lg),
            gradient: const LinearGradient(colors: [Palette.indigo600, Palette.indigo500]),
            boxShadow: Shadows.primary,
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('MA LEÇON DU JOUR', style: TypeScale.label.copyWith(color: Colors.white.withValues(alpha: 0.78))),
                    const SizedBox(height: 2),
                    Text(title, style: TypeScale.button.copyWith(color: Colors.white, fontSize: 18)),
                    const SizedBox(height: 2),
                    Text(meta, style: TypeScale.caption.copyWith(color: Colors.white.withValues(alpha: 0.88))),
                  ],
                ),
              ),
              const SizedBox(width: Space.md),
              Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                child: Center(child: AppIcon(node == null ? 'library' : 'play', size: 22, color: Palette.indigo500)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Série, semaine en cours, objectif du jour et jokers.
class StreakCard extends StatelessWidget {
  const StreakCard({super.key, required this.habit, required this.today, required this.onChangeGoal});
  final Habit habit;
  final DateTime today;
  final VoidCallback onChangeGoal;

  static const _letters = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  static const _names = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  String _message(int streak, int done, int goal) {
    if (done >= goal) return 'Objectif atteint ! Reviens demain pour faire grandir ta série.';
    if (done > 0) return 'Encore ${goal - done} pour atteindre ton objectif du jour.';
    if (streak > 0) return 'Fais une leçon aujourd’hui pour garder ta série de ${daysLabel(streak)}.';
    return 'Une leçon par jour, et ta série grandit !';
  }

  @override
  Widget build(BuildContext context) {
    final streak = habit.streak(today);
    final done = habit.doneOn(today);
    final goal = habit.dailyGoal;
    final week = habit.week(today);
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Semantics(
                label: streak == 0 ? 'Pas encore de série' : 'Série : ${daysLabel(streak)} d’affilée',
                excludeSemantics: true,
                child: Row(
                  children: [
                    Opacity(opacity: streak == 0 ? 0.4 : 1, child: const AppIcon('emoji:fire', size: 34)),
                    const SizedBox(width: Space.sm),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(streak == 0 ? 'Nouvelle série' : daysLabel(streak), style: TypeScale.title.copyWith(fontSize: 22, height: 1.1)),
                        Text('de suite', style: TypeScale.caption.copyWith(color: Palette.inkSoft)),
                      ],
                    ),
                  ],
                ),
              ),
              const Spacer(),
              if (habit.jokers > 0)
                Semantics(
                  label: '${habit.jokers} joker${habit.jokers > 1 ? 's' : ''} : protège ta série si tu oublies un jour',
                  excludeSemantics: true,
                  child: Pill('${habit.jokers}', tone: Tone.sky, icon: 'shield-check'),
                ),
            ],
          ),
          const SizedBox(height: Space.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              for (final (i, d) in week.indexed) _Day(letter: _letters[i], name: _names[i], state: d.state),
            ],
          ),
          const SizedBox(height: Space.lg),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Objectif du jour : ${done > goal ? goal : done} / $goal',
                  style: TypeScale.caption.copyWith(color: Palette.inkBody, fontWeight: FontWeight.w600),
                ),
              ),
              Semantics(
                button: true,
                label: 'Changer mon objectif (${dailyGoals[goal]})',
                excludeSemantics: true,
                child: InkWell(
                  onTap: onChangeGoal,
                  borderRadius: BorderRadius.circular(Radii.pill),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: Space.sm, vertical: Space.xs),
                    child: Text('Changer', style: TypeScale.caption.copyWith(color: Palette.indigo500, fontWeight: FontWeight.w700)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: Space.xs),
          AppProgressBar(value: goal == 0 ? 0 : (done / goal).clamp(0, 1).toDouble(), label: 'Objectif du jour'),
          const SizedBox(height: Space.sm),
          Semantics(liveRegion: true, child: Text(_message(streak, done, goal), style: TypeScale.bodySmall.copyWith(color: Palette.inkBody))),
        ],
      ),
    );
  }
}

class _Day extends StatelessWidget {
  const _Day({required this.letter, required this.name, required this.state});
  final String letter;
  final String name;
  final DayState state;

  @override
  Widget build(BuildContext context) {
    final (bg, border, child, said) = switch (state) {
      DayState.done => (Palette.amber100, Palette.amber500, const AppIcon('emoji:fire', size: 18) as Widget, 'fait'),
      DayState.frozen => (Palette.sky100, Palette.sky600, const AppIcon('shield-check', size: 16, color: Palette.sky600), 'protégé par un joker'),
      DayState.today => (Palette.indigo50, Palette.indigo500, const SizedBox.shrink(), 'aujourd’hui, à faire'),
      DayState.missed => (Palette.surfaceMuted, Palette.borderSlate, const SizedBox.shrink(), 'pas de leçon'),
      DayState.future => (Palette.surface, Palette.borderSoft, const SizedBox.shrink(), 'à venir'),
    };
    return Semantics(
      label: '$name : $said',
      excludeSemantics: true,
      child: Column(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(color: bg, shape: BoxShape.circle, border: Border.all(color: border, width: 2)),
            child: Center(child: child),
          ),
          const SizedBox(height: 4),
          Text(letter, style: TypeScale.caption.copyWith(color: state == DayState.today ? Palette.indigo500 : Palette.inkSoft)),
        ],
      ),
    );
  }
}

/// Choix de l'objectif du jour : 1, 2 ou 3 activités.
Future<int?> showGoalPicker(BuildContext context, int current) => showModalBottomSheet<int>(
  context: context,
  backgroundColor: Palette.cream,
  showDragHandle: true,
  builder: (context) => SafeArea(
    child: Padding(
      padding: const EdgeInsets.fromLTRB(Space.xl, 0, Space.xl, Space.xl),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Semantics(header: true, child: Text('Mon objectif du jour', style: TypeScale.title)),
          const SizedBox(height: Space.xs),
          Text('Une leçon dure environ 7 minutes. Une histoire compte aussi.', style: TypeScale.bodySmall.copyWith(color: Palette.inkBody)),
          const SizedBox(height: Space.lg),
          for (final e in dailyGoals.entries) ...[
            Semantics(
              button: true,
              selected: e.key == current,
              label: '${e.value} : ${e.key} leçon${e.key > 1 ? 's' : ''} par jour',
              excludeSemantics: true,
              child: InkWell(
                onTap: () => Navigator.of(context).pop(e.key),
                borderRadius: BorderRadius.circular(Radii.md),
                child: Container(
                  padding: const EdgeInsets.all(Space.md),
                  decoration: BoxDecoration(
                    color: e.key == current ? Palette.teal50 : Palette.surface,
                    borderRadius: BorderRadius.circular(Radii.md),
                    border: Border.all(color: e.key == current ? Palette.teal600 : Palette.borderSlate, width: 2),
                  ),
                  child: Row(
                    children: [
                      Text(e.value, style: TypeScale.cardTitle),
                      const Spacer(),
                      Text('${e.key} leçon${e.key > 1 ? 's' : ''} / jour', style: TypeScale.caption.copyWith(color: Palette.inkBody)),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: Space.sm),
          ],
        ],
      ),
    ),
  ),
);

/// Fête de fin de leçon : série, objectif du jour, joker gagné ou utilisé, palier.
class HabitCelebration extends StatelessWidget {
  const HabitCelebration({super.key, required this.change});
  final HabitChange change;

  @override
  Widget build(BuildContext context) {
    final c = change;
    final lines = <(String, String)>[
      if (c.milestone != null) ('emoji:glowing-star', '${daysLabel(c.milestone!)} d’affilée : bravo, champion !'),
      if (c.jokersUsed > 0) ('shield-check', 'Ton joker a protégé ta série pendant ton absence.'),
      if (c.jokerEarned) ('shield-check', 'Tu gagnes un joker : il protégera ta série si tu oublies un jour.'),
      if (c.goalJustReached) ('emoji:gem-stone', 'Objectif du jour atteint !'),
    ];
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Semantics(
            liveRegion: true,
            label: c.streakExtended ? 'Ta série passe à ${daysLabel(c.streakAfter)}' : 'Série : ${daysLabel(c.streakAfter)}',
            excludeSemantics: true,
            child: Row(
              children: [
                const AppIcon('emoji:fire', size: 34),
                const SizedBox(width: Space.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(daysLabel(c.streakAfter), style: TypeScale.title.copyWith(height: 1.1)),
                      Text(
                        c.streakExtended ? (c.streakAfter == 1 ? 'Ta série commence !' : '+1 : ta série continue !') : 'Ta série est déjà comptée aujourd’hui',
                        style: TypeScale.caption.copyWith(color: c.streakExtended ? Palette.amber600 : Palette.inkSoft, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: Space.md),
          Text(
            'Objectif du jour : ${c.doneToday > c.goal ? c.goal : c.doneToday} / ${c.goal}',
            style: TypeScale.caption.copyWith(color: Palette.inkBody, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: Space.xs),
          AppProgressBar(value: (c.doneToday / c.goal).clamp(0, 1).toDouble(), label: 'Objectif du jour'),
          for (final (icon, text) in lines) ...[
            const SizedBox(height: Space.sm),
            Row(
              children: [
                AppIcon(icon, size: 18, color: icon.startsWith('emoji:') ? null : Palette.sky600),
                const SizedBox(width: Space.sm),
                Expanded(child: Text(text, style: TypeScale.bodySmall.copyWith(color: Palette.ink, fontWeight: FontWeight.w600))),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
