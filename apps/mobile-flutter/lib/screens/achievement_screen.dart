import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../content/demo.dart';
import '../design/avatar.dart';
import '../design/tokens.dart';
import '../design/widgets.dart';
import '../navigation.dart';
import '../router.dart';
import '../state/tts_provider.dart';

/// Écran de succès après une lecture.
class AchievementScreen extends ConsumerWidget {
  const AchievementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final word = AchievementContent.magicSyllables;
    return AppScreen(
      nav: BottomNav(items: Tabs.achievement(context), active: 'succes'),
      background: const Align(alignment: Alignment.topCenter, child: Confetti()),
      children: [
        Row(
          children: [
            const Expanded(child: Align(alignment: Alignment.centerLeft, child: BrandMark())),
            const SizedBox(width: Space.sm),
            Container(
              constraints: const BoxConstraints(minHeight: 36),
              padding: const EdgeInsets.only(left: 4, right: Space.md),
              decoration: BoxDecoration(
                color: Palette.surface,
                borderRadius: BorderRadius.circular(Radii.pill),
                border: Border.all(color: Palette.border),
                boxShadow: Shadows.card,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    alignment: Alignment.center,
                    decoration: const BoxDecoration(color: Palette.amber100, shape: BoxShape.circle),
                    child: const AppIcon('emoji:fox', size: 18),
                  ),
                  const SizedBox(width: Space.sm),
                  Text(Child.label, style: TypeScale.caption.copyWith(color: Palette.slate700)),
                ],
              ),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(Space.xl, Space.xxl, Space.xl, Space.xl),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(Radii.xl),
            gradient: const LinearGradient(
              colors: [Palette.white, Color(0xFFF7F7FF)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            boxShadow: Shadows.card,
          ),
          child: Column(
            children: [
              const _Medal(),
              const SizedBox(height: Space.lg),
              Semantics(
                header: true,
                child: Text(
                  AchievementContent.title,
                  style: TypeScale.celebration.copyWith(color: Palette.inkDeep),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: Space.sm),
              const Pill(AchievementContent.story),
              const SizedBox(height: Space.sm),
              Text.rich(
                TextSpan(
                  text: AchievementContent.messageBefore,
                  style: TypeScale.body.copyWith(color: Palette.slate700, height: 20 / 14),
                  children: [
                    TextSpan(
                      text: AchievementContent.messageStrong,
                      style: const TextStyle(fontWeight: FontWeight.w700, color: Palette.inkDeep),
                    ),
                    const TextSpan(text: AchievementContent.messageAfter),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        Row(
          children: [
            for (final s in AchievementContent.stats) ...[
              if (s != AchievementContent.stats.first) const SizedBox(width: Space.sm + 2),
              Expanded(child: _StatTile(stat: s)),
            ],
          ],
        ),
        const _TreasureCard(),
        AppCard(
          padding: const EdgeInsets.symmetric(horizontal: Space.lg, vertical: Space.md),
          child: Row(
            children: [
              const IconTile('wand-sparkles', tone: Tone.purple, size: 36, iconSize: 18, radius: Radii.sm + 2),
              const SizedBox(width: Space.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(AchievementContent.magicLabel, style: TypeScale.caption.copyWith(fontWeight: FontWeight.w600)),
                    Semantics(
                      label: word.join(),
                      excludeSemantics: true,
                      child: Text.rich(
                        TextSpan(
                          style: TypeScale.cardTitle.copyWith(fontWeight: FontWeight.w700),
                          children: [
                            for (var i = 0; i < word.length; i++) ...[
                              if (i > 0) const TextSpan(text: '·', style: TextStyle(color: Palette.inkFaint, fontWeight: FontWeight.w400)),
                              TextSpan(text: word[i], style: TextStyle(color: i.isEven ? Palette.indigo500 : Palette.teal600)),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Semantics(
                button: true,
                label: 'Écouter ${word.join()}',
                excludeSemantics: true,
                child: InkWell(
                  onTap: () => ref.read(ttsServiceProvider).speak(word.join()),
                  borderRadius: BorderRadius.circular(Radii.md - 2),
                  child: Container(
                    width: 44,
                    height: 44,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Palette.surfaceMuted,
                      borderRadius: BorderRadius.circular(Radii.md - 2),
                      border: Border.all(color: Palette.borderSoft),
                    ),
                    child: const AppIcon('volume-2', size: 18, color: Palette.inkBody),
                  ),
                ),
              ),
            ],
          ),
        ),
        Column(
          children: [
            AppButton(AchievementContent.continueLabel, leadingIcon: 'sparkle', onPressed: () => context.go(Routes.home)),
            const SizedBox(height: Space.sm + 2),
            AppButton(
              AchievementContent.parentLabel,
              variant: ButtonVariant.ghost,
              leadingIcon: 'chart-line',
              onPressed: () => context.go(Routes.parent),
              accessory: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '(${AchievementContent.parentCode} ',
                    style: TypeScale.micro.copyWith(color: Palette.inkFaint, fontWeight: FontWeight.w400),
                  ),
                  const AppIcon('emoji:locked', size: 11),
                  Text(' )', style: TypeScale.micro.copyWith(color: Palette.inkFaint, fontWeight: FontWeight.w400)),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _Medal extends StatelessWidget {
  const _Medal();

  @override
  Widget build(BuildContext context) => Stack(
    clipBehavior: Clip.none,
    children: [
      Container(
        width: 76,
        height: 76,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Palette.white, width: 3),
          gradient: const LinearGradient(
            colors: [Palette.indigo50, Palette.indigo100],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: Shadows.card,
        ),
        child: const AppIcon('emoji:glowing-star', size: 42),
      ),
      const Positioned(top: -6, right: -10, child: AppIcon('sparkles', size: 22, color: Palette.amber500)),
    ],
  );
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.stat});
  final Stat stat;

  @override
  Widget build(BuildContext context) => AppCard(
    padding: const EdgeInsets.symmetric(vertical: Space.lg, horizontal: Space.xs),
    color: stat.highlight ? Palette.fuchsia50 : null,
    border: stat.highlight ? Border.all(color: Palette.fuchsia200, width: 1.5) : null,
    child: Column(
      children: [
        IconTile(stat.icon, tone: Tone.named(stat.tone), size: 32, iconSize: 17, radius: Radii.sm + 2, filled: stat.filled),
        const SizedBox(height: Space.xs),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(stat.value, style: TypeScale.stat.copyWith(color: Palette.inkDeep)),
              if (stat.valueEmoji != null) ...[const SizedBox(width: 4), AppIcon(stat.valueEmoji!, size: 17)],
            ],
          ),
        ),
        const SizedBox(height: Space.xs),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(child: Text(stat.caption, style: TypeScale.caption.copyWith(color: Palette.slate500, fontWeight: FontWeight.w400))),
            if (stat.captionEmoji != null) ...[const SizedBox(width: 3), AppIcon(stat.captionEmoji!, size: 12)],
          ],
        ),
      ],
    ),
  );
}

class _TreasureCard extends StatelessWidget {
  const _TreasureCard();

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    label: '${AchievementContent.treasureBadge} : ${AchievementContent.treasureTitle}. ${AchievementContent.treasureText}',
    excludeSemantics: true,
    child: Container(
      padding: const EdgeInsets.all(Space.lg),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Radii.lg + 2),
        gradient: const LinearGradient(colors: [Palette.teal600, Palette.teal700], begin: Alignment.topLeft, end: Alignment.bottomRight),
        boxShadow: Shadows.teal,
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: const Color(0x24FFFFFF),
              borderRadius: BorderRadius.circular(Radii.md),
              border: Border.all(color: const Color(0x38FFFFFF)),
            ),
            child: const AppIcon('emoji:gem-stone', size: 26),
          ),
          const SizedBox(width: Space.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: Space.sm, vertical: 1),
                  decoration: BoxDecoration(color: Palette.yellow200, borderRadius: BorderRadius.circular(Radii.sm - 2)),
                  child: Text(
                    AchievementContent.treasureBadge.toUpperCase(),
                    style: TypeScale.micro.copyWith(color: Palette.yellow800, fontWeight: FontWeight.w700, letterSpacing: 0.6),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  AchievementContent.treasureTitle,
                  style: TypeScale.cardTitle.copyWith(color: Palette.white, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 3),
                Text(
                  AchievementContent.treasureText,
                  style: TypeScale.caption.copyWith(color: const Color(0xD1FFFFFF), fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          const AppIcon('chevron-right', size: 20, color: Palette.white),
        ],
      ),
    ),
  );
}
