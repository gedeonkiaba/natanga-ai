/// Lecture : texte syllabé à la main, coloration bicolore, texte lu à voix haute.
/// Logique pure et testée (même règles que l'app Expo).
library;

class Word {
  const Word(this.syllables, {this.trailing});

  /// Syllabes, ponctuation exclue (« Sou », « dain »).
  final List<String> syllables;

  /// Ponctuation collée au mot (« , », « . »).
  final String? trailing;

  String get spoken => syllables.join();

  /// Libellé de l'infobulle : « lu · ci · ole ».
  String get syllableLabel => syllables.join(' · ');

  @override
  bool operator ==(Object other) => other is Word && other.trailing == trailing && other.syllables.join('|') == syllables.join('|');

  @override
  int get hashCode => Object.hash(syllables.join('|'), trailing);

  @override
  String toString() => 'Word($syllables, $trailing)';
}

typedef Paragraph = List<Word>;

enum SyllableTone { a, b }

/// 1ʳᵉ syllabe de chaque mot en teinte A (teal), puis alternance avec B (ardoise).
SyllableTone syllableTone(int index) => index.isEven ? SyllableTone.a : SyllableTone.b;

/// « Ni-no le pe-tit re-nard. » → mots syllabés ; « ‑ » (insécable) = trait d'union du français.
Paragraph parseSyllabified(String source) {
  final punct = RegExp(r'^(.*?)([.,;:!?…]+)?$');
  return source.trim().split(RegExp(r'\s+')).map((token) {
    final m = punct.firstMatch(token)!;
    final body = m.group(1) ?? token;
    final syllables = body.split('-').map((s) => s.replaceAll('‑', '-')).where((s) => s.isNotEmpty).toList();
    return Word(syllables, trailing: m.group(2));
  }).toList();
}

String passageText(List<Paragraph> paragraphs) => paragraphs.map((p) => p.map((w) => w.spoken + (w.trailing ?? '')).join(' ')).join(' ');

double progressRatio(num done, num goal) => goal > 0 ? (done / goal).clamp(0, 1).toDouble() : 0;
