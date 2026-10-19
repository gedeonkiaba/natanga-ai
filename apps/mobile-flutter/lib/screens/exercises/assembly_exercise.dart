import 'package:flutter/material.dart';

import '../../design/tokens.dart';
import '../../domain/pedagogy.dart';

/// Assemblage de syllabes : la voix dit le mot, l'enfant touche les syllabes dans l'ordre.
/// Une syllabe piège (inversion « am », sosie « è ») est mêlée aux autres.
/// Toucher une case remplie la vide (tant que la réponse n'est pas envoyée).
class AssemblyExercise extends StatefulWidget {
  const AssemblyExercise({super.key, required this.exercise, required this.feedback, required this.onSubmit});
  final Exercise exercise;

  /// Retour affiché (réponse envoyée) : les cases se colorent et ne bougent plus.
  final AnswerCheck? feedback;
  final void Function(AnswerCheck check) onSubmit;

  @override
  State<AssemblyExercise> createState() => _AssemblyExerciseState();
}

class _AssemblyExerciseState extends State<AssemblyExercise> {
  late final List<PedagogyItem> _tiles = choicesOf(widget.exercise);
  late final int _slots = itemById(widget.exercise.correctItemId ?? '')?.syllables.length ?? 0;
  final List<int> _placed = [];

  bool get _locked => widget.feedback != null;

  void _add(int tile) {
    if (_locked || _placed.contains(tile) || _placed.length >= _slots) return;
    setState(() => _placed.add(tile));
    if (_placed.length == _slots) {
      widget.onSubmit(checkSyllableAssembly(widget.exercise, [for (final i in _placed) _tiles[i].id]));
    }
  }

  void _remove(int slot) {
    if (_locked || slot >= _placed.length) return;
    setState(() => _placed.removeAt(slot));
  }

  @override
  Widget build(BuildContext context) {
    final fb = widget.feedback;
    final (slotBg, slotBorder) = switch (fb?.correct) {
      true => (Palette.teal50, Palette.teal600),
      false => (Palette.amber100, Palette.amber500),
      null => (Palette.surfaceMuted, Palette.indigo300),
    };
    return Column(
      children: [
        Wrap(
          spacing: Space.sm,
          runSpacing: Space.sm,
          alignment: WrapAlignment.center,
          children: [
            for (var slot = 0; slot < _slots; slot++)
              Semantics(
                button: slot < _placed.length && !_locked,
                label: slot < _placed.length
                    ? 'Case ${slot + 1} : ${_tiles[_placed[slot]].label}${_locked ? '' : ', toucher pour retirer'}'
                    : 'Case ${slot + 1} vide',
                excludeSemantics: true,
                child: GestureDetector(
                  onTap: () => _remove(slot),
                  child: Container(
                    constraints: const BoxConstraints(minWidth: 72, minHeight: 60),
                    padding: const EdgeInsets.symmetric(horizontal: Space.md),
                    decoration: BoxDecoration(
                      color: slotBg,
                      borderRadius: BorderRadius.circular(Radii.lg),
                      border: Border.all(color: slotBorder, width: 2),
                    ),
                    child: Center(
                      widthFactor: 1,
                      heightFactor: 1,
                      child: Text(
                        slot < _placed.length ? _tiles[_placed[slot]].label : ' ',
                        // Syllabes bicolores, comme à la lecture.
                        style: TypeScale.title.copyWith(color: slot.isEven ? Palette.syllableA : Palette.syllableB),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: Space.lg),
        Wrap(
          spacing: Space.sm,
          runSpacing: Space.sm,
          alignment: WrapAlignment.center,
          children: [
            for (var i = 0; i < _tiles.length; i++)
              // La tuile posée laisse un emplacement vide : la grille ne saute pas.
              Opacity(
                opacity: _placed.contains(i) ? 0 : 1,
                child: Semantics(
                  button: true,
                  enabled: !_placed.contains(i) && !_locked,
                  label: 'Ajouter la syllabe ${_tiles[i].label}',
                  excludeSemantics: true,
                  child: InkWell(
                    onTap: _placed.contains(i) ? null : () => _add(i),
                    borderRadius: BorderRadius.circular(Radii.lg),
                    child: Container(
                      constraints: const BoxConstraints(minWidth: 72, minHeight: 56),
                      padding: const EdgeInsets.symmetric(horizontal: Space.lg),
                      decoration: BoxDecoration(
                        color: Palette.surface,
                        borderRadius: BorderRadius.circular(Radii.lg),
                        border: Border.all(color: Palette.indigo300, width: 2),
                      ),
                      child: Center(
                        widthFactor: 1,
                        heightFactor: 1,
                        child: Text(_tiles[i].label, style: TypeScale.title.copyWith(color: Palette.indigo500)),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
