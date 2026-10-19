import 'package:flutter/material.dart';

import '../../design/tokens.dart';
import '../../design/widgets.dart';
import '../../domain/pedagogy.dart';

/// Lis et trouve l'image : l'enfant lit un mot ou une phrase **sans l'entendre**,
/// puis touche l'image qui correspond (question de compréhension pour une phrase).
class PictureMatchExercise extends StatelessWidget {
  const PictureMatchExercise({super.key, required this.exercise, required this.feedback, required this.chosenId, required this.onChoose});
  final Exercise exercise;
  final AnswerCheck? feedback;
  final String? chosenId;
  final void Function(String itemId) onChoose;

  @override
  Widget build(BuildContext context) {
    final text = itemById(exercise.textItemId ?? exercise.correctItemId ?? '');
    final sentence = text?.type == ItemType.sentence;
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: Space.lg, vertical: Space.lg),
          decoration: BoxDecoration(
            color: Palette.surfaceMuted,
            borderRadius: BorderRadius.circular(Radii.lg),
            border: Border.all(color: Palette.borderSlate),
          ),
          // À lire seul : la voix ne dit que la consigne.
          child: Semantics(
            label: sentence ? 'Phrase à lire : ${text!.label}' : 'Mot à lire : ${text?.label ?? ''}',
            excludeSemantics: true,
            child: Text.rich(
              _bicolor(text, (sentence ? TypeScale.title : TypeScale.hero.copyWith(fontSize: 36, height: 1.2))),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        if (exercise.question != null) ...[
          const SizedBox(height: Space.md),
          Semantics(header: true, child: Text(exercise.question!, style: TypeScale.cardTitle.copyWith(fontSize: 18), textAlign: TextAlign.center)),
        ],
        const SizedBox(height: Space.lg),
        Wrap(
          spacing: Space.md,
          runSpacing: Space.md,
          alignment: WrapAlignment.center,
          children: [
            for (final id in exercise.itemIds)
              if (itemById(id) case final item?) _ImageChoice(item: item, state: _stateOf(id), onTap: () => onChoose(id)),
          ],
        ),
      ],
    );
  }

  _ImageState _stateOf(String id) {
    final fb = feedback;
    if (fb == null) return _ImageState.idle;
    if (id == fb.correctId) return _ImageState.right;
    if (id == chosenId) return _ImageState.wrong;
    return _ImageState.idle;
  }

  /// Syllabes bicolores (mot) ou mot par mot (phrase : « Pa-pa lit un li-vre. »).
  static TextSpan _bicolor(PedagogyItem? item, TextStyle style) {
    if (item == null) return const TextSpan();
    final words = item.type == ItemType.sentence ? item.syllables : [item.syllables.join('-')];
    return TextSpan(
      children: [
        for (final (w, word) in words.indexed) ...[
          if (w > 0) TextSpan(text: ' ', style: style),
          for (final (i, syl) in word.split('-').indexed)
            TextSpan(text: syl, style: style.copyWith(color: i.isEven ? Palette.syllableA : Palette.syllableB)),
        ],
      ],
    );
  }
}

enum _ImageState { idle, right, wrong }

class _ImageChoice extends StatelessWidget {
  const _ImageChoice({required this.item, required this.state, required this.onTap});
  final PedagogyItem item;
  final _ImageState state;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final (bg, border) = switch (state) {
      _ImageState.right => (Palette.teal50, Palette.teal600),
      _ImageState.wrong => (Palette.amber100, Palette.amber500),
      _ImageState.idle => (Palette.surface, Palette.indigo300),
    };
    return Semantics(
      button: true,
      label: 'Image : ${item.label}',
      excludeSemantics: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(Radii.lg),
        child: Container(
          width: 96,
          height: 96,
          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(Radii.lg), border: Border.all(color: border, width: 2)),
          child: Center(child: AppIcon(item.image!, size: 60)),
        ),
      ),
    );
  }
}
