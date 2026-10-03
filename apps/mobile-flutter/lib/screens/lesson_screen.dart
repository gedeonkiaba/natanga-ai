import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../design/tokens.dart';
import '../design/widgets.dart';
import '../domain/pedagogy.dart';
import '../features/progress.dart';
import '../router.dart';
import '../state/progress_controller.dart';
import '../state/tts_provider.dart';

/// Durée d'affichage du retour avant l'exercice suivant.
const feedbackDuration = Duration(milliseconds: 1200);

/// Leçon (US-06) : exercices son ⇄ graphème (US-07) et reconnaissance de mots (US-08).
class LessonScreen extends ConsumerStatefulWidget {
  const LessonScreen({super.key, required this.nodeId});
  final String nodeId;

  @override
  ConsumerState<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends ConsumerState<LessonScreen> {
  late final Lesson? _lesson = firstLessonOf(widget.nodeId);
  late final LessonRun _run = LessonRun(_lesson == null ? const [] : exercisesOf(_lesson.id));
  AnswerCheck? _feedback;
  String? _chosenId;
  Timer? _pending;

  @override
  void dispose() {
    _pending?.cancel();
    super.dispose();
  }

  /// Dernier exercice dont la consigne a été dite (une seule fois par exercice).
  String? _spokenFor;

  void _backToTree() => context.go(Routes.tree);

  /// Pose la question à voix haute à l'arrivée de chaque exercice.
  void _speakOnce(Exercise ex) {
    if (_spokenFor == ex.id) return;
    _spokenFor = ex.id;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) ref.read(ttsServiceProvider).speak(spokenPrompt(ex));
    });
  }

  /// Le retour reste affiché sur l'exercice en cours ; les touches en trop sont ignorées.
  void _choose(String itemId) {
    final ex = _run.current;
    if (ex == null || _pending != null) return;
    final check = ex.type == ExerciseType.soundGrapheme ? checkSoundGrapheme(ex, curriculumItems, itemId) : checkWordRecognition(ex, itemId);
    setState(() {
      _feedback = check;
      _chosenId = itemId;
    });
    _pending = Timer(feedbackDuration, () {
      _pending = null;
      if (!mounted) return;
      setState(() {
        _run.answer(check.correct);
        _feedback = null;
        _chosenId = null;
      });
    });
  }

  void _finish() {
    final r = _run.result;
    ref
        .read(progressProvider.notifier)
        .update((s) => recordLesson(s, nodeId: widget.nodeId, lessonId: _lesson!.id, correct: r.correct, total: r.total, gems: r.gems));
    _backToTree();
  }

  @override
  Widget build(BuildContext context) {
    final lesson = _lesson;
    if (lesson == null || _run.exercises.isEmpty) {
      // Leçon sans exercice (contenu pas encore rédigé) : jamais d'impasse.
      return AppScreen(
        children: [
          Semantics(header: true, child: Text(lesson?.title ?? 'Leçon', style: TypeScale.title)),
          Text('Cette leçon arrive bientôt. Reviens vite !', style: TypeScale.body),
          AppButton('Retour au parcours', onPressed: _backToTree),
        ],
      );
    }
    if (_run.finished) {
      final r = _run.result;
      return AppScreen(
        children: [
          Semantics(header: true, child: Text('Leçon terminée !', style: TypeScale.title)),
          Align(alignment: Alignment.centerLeft, child: Pill('${r.gems}', tone: Tone.sky, icon: 'emoji:gem-stone')),
          Text('${r.correct} bonne${r.correct > 1 ? 's' : ''} réponse${r.correct > 1 ? 's' : ''} sur ${r.total}.', style: TypeScale.body),
          AppButton('Continuer', onPressed: _finish),
        ],
      );
    }

    final ex = _run.current!;
    final choices = choicesOf(ex);
    final kind = choices.first.type;
    final (instruction, replay) = switch (kind) {
      ItemType.grapheme => ('Écoute, puis touche la lettre entendue :', 'Réécouter le son'),
      ItemType.syllable => ('Écoute, puis touche la syllabe entendue :', 'Réécouter la syllabe'),
      ItemType.word => ('Écoute, puis touche le mot entendu :', 'Réécouter le mot'),
      ItemType.sentence => ('Écoute, puis touche la phrase entendue :', 'Réécouter la phrase'),
    };
    final tts = ref.read(ttsServiceProvider);
    _speakOnce(ex);
    return AppScreen(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(width: 120, child: AppButton('Quitter', variant: ButtonVariant.ghost, onPressed: _backToTree)),
            Pill('${_run.gems}', tone: Tone.sky, icon: 'emoji:gem-stone'),
          ],
        ),
        AppProgressBar(value: _run.answered / _run.exercises.length, label: 'Progression de la leçon'),
        Semantics(header: true, child: Text(lesson.title, style: TypeScale.title)),
        if (lesson.objective.isNotEmpty) Text(lesson.objective, style: TypeScale.bodySmall.copyWith(color: Palette.inkSoft)),
        AppCard(
          padding: const EdgeInsets.all(Space.xl),
          child: Column(
            children: [
              Text(instruction, style: TypeScale.body, textAlign: TextAlign.center),
              const SizedBox(height: Space.md),
              Semantics(
                button: true,
                label: replay,
                excludeSemantics: true,
                child: InkResponse(
                  onTap: () => tts.speak(spokenPrompt(ex)),
                  child: const IconTile('volume-2', tone: Tone.violet, size: 56, iconSize: 28, radius: 28),
                ),
              ),
              const SizedBox(height: Space.lg),
              // Phrases : une par ligne, pleine largeur. Lettres, syllabes, mots : grille compacte.
              Wrap(
                direction: kind == ItemType.sentence ? Axis.vertical : Axis.horizontal,
                spacing: Space.sm,
                runSpacing: Space.sm,
                alignment: WrapAlignment.center,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  for (final item in choices)
                    _Choice(
                      item: item,
                      semantic: switch (kind) {
                        ItemType.grapheme => 'Choisir la lettre ${item.label}',
                        ItemType.syllable => 'Choisir la syllabe ${item.label}',
                        ItemType.word => 'Choisir le mot ${item.label}',
                        ItemType.sentence => 'Choisir la phrase ${item.label}',
                      },
                      state:
                          _feedback == null
                              ? _ChoiceState.idle
                              : item.id == _feedback!.correctId
                              ? _ChoiceState.right
                              : item.id == _chosenId
                              ? _ChoiceState.wrong
                              : _ChoiceState.idle,
                      onTap: () => _choose(item.id),
                    ),
                ],
              ),
              if (_feedback != null) ...[
                const SizedBox(height: Space.lg),
                Semantics(
                  liveRegion: true,
                  child: Text(
                    _feedback!.feedback,
                    style: TypeScale.cardTitle.copyWith(color: _feedback!.correct ? Palette.teal700 : Palette.amber600),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

enum _ChoiceState { idle, right, wrong }

class _Choice extends StatelessWidget {
  const _Choice({required this.item, required this.semantic, required this.state, required this.onTap});
  final PedagogyItem item;
  final String semantic;
  final _ChoiceState state;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final (bg, fg, border) = switch (state) {
      _ChoiceState.right => (Palette.teal50, Palette.teal700, Palette.teal600),
      _ChoiceState.wrong => (Palette.amber100, Palette.amber600, Palette.amber500),
      _ChoiceState.idle => (Palette.surface, Palette.indigo500, Palette.indigo300),
    };
    final sentence = item.type == ItemType.sentence;
    final style = (sentence ? TypeScale.cardTitle.copyWith(fontSize: 18, height: 1.4) : TypeScale.title).copyWith(color: fg);
    // Mots : syllabes bicolores (comme l'écran de lecture) tant que l'enfant n'a pas répondu.
    final bicolor = state == _ChoiceState.idle && item.type == ItemType.word && item.syllables.length > 1;
    final text =
        bicolor
            ? Text.rich(
              TextSpan(
                children: [
                  for (final (i, syl) in item.syllables.indexed)
                    TextSpan(text: syl, style: style.copyWith(color: i.isEven ? Palette.syllableA : Palette.syllableB)),
                ],
              ),
            )
            : Text(item.label, style: style, textAlign: TextAlign.center);
    return Semantics(
      button: true,
      label: semantic,
      excludeSemantics: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(Radii.lg),
        child: Container(
          constraints: const BoxConstraints(minWidth: 72, minHeight: 56),
          padding: EdgeInsets.symmetric(horizontal: Space.lg, vertical: sentence ? Space.md : 0),
          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(Radii.lg), border: Border.all(color: border, width: 2)),
          // Center à facteurs 1 : le bouton garde la taille de son contenu (grille compacte).
          child: Center(widthFactor: 1, heightFactor: 1, child: text),
        ),
      ),
    );
  }
}
