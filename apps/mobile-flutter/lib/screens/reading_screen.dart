import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../content/demo.dart';
import '../design/tokens.dart';
import '../design/widgets.dart';
import '../features/progress.dart';
import '../features/reading.dart';
import '../navigation.dart';
import '../router.dart';
import '../state/progress_controller.dart';
import '../state/tts_provider.dart';

typedef WordId = (int paragraph, int word);

/// Lecture : texte syllabé, mot touché = lu à voix haute et noté comme difficile.
class ReadingScreen extends ConsumerStatefulWidget {
  const ReadingScreen({super.key});

  @override
  ConsumerState<ReadingScreen> createState() => _ReadingScreenState();
}

class _ReadingScreenState extends ConsumerState<ReadingScreen> {
  WordId? _active = ReadingContent.highlighted;
  bool _paused = false;
  final _started = DateTime.now();
  final _tapped = <WordId>{};

  int get _totalWords => ReadingContent.paragraphs.fold(0, (n, p) => n + p.length);

  void _tap(WordId id, Word word) {
    setState(() => _active = id);
    _tapped.add(id);
    if (!_paused) ref.read(ttsServiceProvider).speak(word.spoken);
  }

  void _finish() {
    ref.read(ttsServiceProvider).stop();
    ref
        .read(progressProvider.notifier)
        .update(
          (s) => recordReading(
            s,
            lessonId: ReadingContent.lessonId,
            durationSec: DateTime.now().difference(_started).inSeconds.clamp(1, 1 << 30),
            wordsRead: _totalWords,
            correctWords: _totalWords - _tapped.length,
          ),
        );
    context.go(Routes.achievement);
  }

  @override
  Widget build(BuildContext context) {
    return AppScreen(
      nav: BottomNav(items: Tabs.reading(context), active: 'lecture'),
      children: [
        Row(
          children: [
            const Expanded(child: Align(alignment: Alignment.centerLeft, child: BrandMark(icon: 'sparkles'))),
            Container(
              constraints: const BoxConstraints(minHeight: 34),
              padding: const EdgeInsets.symmetric(horizontal: Space.md),
              decoration: BoxDecoration(color: Palette.surface, borderRadius: BorderRadius.circular(Radii.pill), boxShadow: Shadows.card),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const AppIcon('star', size: 15, color: Palette.amber500, filled: true),
                  const SizedBox(width: 5),
                  Text(ReadingContent.stars, style: TypeScale.caption.copyWith(color: Palette.amber600, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const SizedBox(width: Space.sm),
            Semantics(
              button: true,
              label: _paused ? 'Reprendre' : 'Pause',
              excludeSemantics: true,
              child: InkResponse(
                onTap: () {
                  ref.read(ttsServiceProvider).stop();
                  setState(() => _paused = !_paused);
                },
                child: Container(
                  width: 40,
                  height: 40,
                  alignment: Alignment.center,
                  decoration: const BoxDecoration(color: Palette.surface, shape: BoxShape.circle, boxShadow: Shadows.card),
                  child: AppIcon(_paused ? 'play' : 'pause', size: 17, color: Palette.inkBody),
                ),
              ),
            ),
          ],
        ),
        Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    ReadingContent.goalLabel,
                    style: TypeScale.caption.copyWith(color: Palette.inkMeta, fontWeight: FontWeight.w600),
                  ),
                ),
                const SizedBox(width: Space.sm),
                const Pill(ReadingContent.pageLabel),
              ],
            ),
            const SizedBox(height: Space.sm),
            AppProgressBar(value: progressRatio(ReadingContent.goalDone, ReadingContent.goalTotal), label: ReadingContent.goalLabel),
            const SizedBox(height: Space.sm),
            Row(
              children: [
                const AppIcon('book-open', size: 16, color: Palette.indigo500),
                const SizedBox(width: Space.xs),
                Expanded(
                  child: Text(
                    ReadingContent.story,
                    style: TypeScale.bodySmall.copyWith(color: Palette.inkMeta, fontWeight: FontWeight.w500),
                  ),
                ),
                Pill(ReadingContent.untimed, tone: Tone.emerald, style: TypeScale.micro),
              ],
            ),
          ],
        ),
        Container(
          constraints: const BoxConstraints(minHeight: 440),
          padding: const EdgeInsets.fromLTRB(Space.xl, Space.xl, Space.xl, Space.lg),
          decoration: BoxDecoration(color: Palette.surface, borderRadius: BorderRadius.circular(Radii.xl), boxShadow: Shadows.card),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Semantics(
                label: "Texte de l'histoire",
                container: true,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var p = 0; p < ReadingContent.paragraphs.length; p++)
                      Padding(
                        padding: EdgeInsets.only(top: p == 0 ? 0 : Space.xxxl + Space.md + 2),
                        child: Wrap(
                          clipBehavior: Clip.none,
                          children: [
                            for (var w = 0; w < ReadingContent.paragraphs[p].length; w++)
                              _ReadingWord(
                                word: ReadingContent.paragraphs[p][w],
                                active: _active == (p, w),
                                onTap: () => _tap((p, w), ReadingContent.paragraphs[p][w]),
                              ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: Space.xxxl * 3),
              Container(
                padding: const EdgeInsets.only(top: Space.md),
                decoration: const BoxDecoration(border: Border(top: BorderSide(color: Palette.borderSlate))),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Expanded(child: _Hint('emoji:herb', ReadingContent.hintSyllables)),
                    const SizedBox(width: Space.lg),
                    const Expanded(child: _Hint('pointer', ReadingContent.hintTap)),
                  ],
                ),
              ),
            ],
          ),
        ),
        Row(
          children: [
            Expanded(
              flex: 85,
              child: AppButton(
                ReadingContent.listenAll,
                variant: ButtonVariant.outline,
                leadingIcon: 'volume-2',
                onPressed: () => ref.read(ttsServiceProvider).speak(passageText(ReadingContent.paragraphs)),
              ),
            ),
            const SizedBox(width: Space.md),
            Expanded(flex: 115, child: AppButton(ReadingContent.done, trailingIcon: 'arrow-right', onPressed: _finish)),
          ],
        ),
      ],
    );
  }
}

class _Hint extends StatelessWidget {
  const _Hint(this.icon, this.text);
  final String icon;
  final String text;

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      AppIcon(icon, size: 13, color: Palette.inkFaint),
      const SizedBox(width: Space.xs),
      Expanded(child: Text(text, style: TypeScale.caption.copyWith(color: Palette.inkFaint, fontWeight: FontWeight.w400))),
    ],
  );
}

/// Mot touchable (≥ 46 pt de haut), syllabes bicolores, infobulle « lu · ci · ole ».
class _ReadingWord extends StatelessWidget {
  const _ReadingWord({required this.word, required this.active, required this.onTap});
  final Word word;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final style = TypeScale.reading.copyWith(letterSpacing: 1);
    final text = Text.rich(
      TextSpan(
        style: style,
        children: [
          for (var i = 0; i < word.syllables.length; i++)
            TextSpan(
              text: word.syllables[i],
              style: TextStyle(color: syllableTone(i) == SyllableTone.a ? Palette.syllableA : Palette.syllableB),
            ),
          if (word.trailing != null) TextSpan(text: word.trailing, style: const TextStyle(color: Palette.syllableB)),
        ],
      ),
    );
    return Padding(
      padding: const EdgeInsets.only(right: Space.md),
      child: Semantics(
        button: true,
        label: word.spoken,
        hint: 'Écouter ce mot',
        excludeSemantics: true,
        child: GestureDetector(
          onTap: onTap,
          behavior: HitTestBehavior.opaque,
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.topCenter,
            children: [
              active
                  ? Container(
                    transform: Matrix4.translationValues(-4, 0, 0),
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: const BoxDecoration(
                      color: Palette.indigo100,
                      borderRadius: BorderRadius.all(Radius.circular(6)),
                      border: Border(bottom: BorderSide(color: Palette.indigo500, width: 2)),
                    ),
                    child: text,
                  )
                  : text,
              if (active) Positioned(bottom: 50, child: _Bubble(word: word)),
            ],
          ),
        ),
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.word});
  final Word word;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: Space.md, vertical: Space.xs),
          decoration: BoxDecoration(color: Palette.inkDeep, borderRadius: BorderRadius.circular(Radii.pill)),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AppIcon('volume-1', size: 12, color: Color(0xB3FFFFFF)),
              const SizedBox(width: Space.xs),
              Text(
                word.syllableLabel,
                style: TypeScale.caption.copyWith(color: Palette.white, fontWeight: FontWeight.w700, letterSpacing: 0.3),
              ),
              const SizedBox(width: Space.xs),
              const AppIcon('audio-lines', size: 12, color: Color(0xB3FFFFFF)),
            ],
          ),
        ),
        CustomPaint(size: const Size(10, 5), painter: _CaretPainter()),
      ],
    ),
  );
}

class _CaretPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) => canvas.drawPath(
    Path()
      ..lineTo(size.width, 0)
      ..lineTo(size.width / 2, size.height)
      ..close(),
    Paint()..color = Palette.inkDeep,
  );

  @override
  bool shouldRepaint(_CaretPainter oldDelegate) => false;
}
