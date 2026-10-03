import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../content/demo.dart';
import '../design/tokens.dart';
import '../design/widgets.dart';
import '../navigation.dart';
import '../router.dart';

/// Accueil — reproduction de la maquette approuvée (Sleek).
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScreen(
      nav: BottomNav(items: Tabs.home(context), active: 'accueil', indicator: NavIndicator.dot),
      children: [
        Row(
          children: [
            const Expanded(child: Align(alignment: Alignment.centerLeft, child: BrandMark(icon: 'book-open-check', dot: true))),
            const SizedBox(width: Space.sm),
            _ParentSpaceButton(onTap: () => context.go(Routes.parent)),
          ],
        ),
        _WelcomeCard(onProfile: () => context.go(Routes.profile)),
        Text(HomeContent.sectionLabel.toUpperCase(), style: TypeScale.label.copyWith(color: Palette.inkLabel)),
        Column(
          children: [
            for (final b in HomeContent.benefits) ...[
              if (b != HomeContent.benefits.first) const SizedBox(height: Space.md),
              _BenefitCard(benefit: b),
            ],
          ],
        ),
        _StoryOfTheDay(onTap: () => context.go(Routes.reading)),
        _Footnote(),
      ],
    );
  }
}

class _ParentSpaceButton extends StatelessWidget {
  const _ParentSpaceButton({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    label: 'Espace Parent',
    hint: 'Accès réservé aux parents',
    excludeSemantics: true,
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(Radii.pill),
      child: Container(
        constraints: const BoxConstraints(minHeight: 34),
        padding: const EdgeInsets.symmetric(horizontal: Space.md),
        decoration: BoxDecoration(
          color: Palette.surface,
          borderRadius: BorderRadius.circular(Radii.pill),
          border: Border.all(color: Palette.border),
          boxShadow: Shadows.card,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AppIcon('shield-check', size: 15, color: Palette.inkBody),
            const SizedBox(width: Space.xs),
            Text('Espace Parent', style: TypeScale.caption.copyWith(color: Palette.inkBody)),
          ],
        ),
      ),
    ),
  );
}

class _WelcomeCard extends StatelessWidget {
  const _WelcomeCard({required this.onProfile});
  final VoidCallback onProfile;

  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(Radii.lg),
    child: AppCard(
      padding: const EdgeInsets.all(Space.xl),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Halo violet très doux en haut à droite.
          Positioned(
            top: -40,
            right: -40,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [Palette.violet500.withValues(alpha: 0.16), Palette.violet500.withValues(alpha: 0)]),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Wrap(spacing: Space.sm, runSpacing: Space.sm, children: [Pill(HomeContent.timeChip, icon: 'clock'), _PrivacyChip()]),
              const SizedBox(height: Space.md),
              Semantics(header: true, child: Text(HomeContent.promise, style: TypeScale.hero)),
              const SizedBox(height: Space.md),
              Text(HomeContent.pitch, style: TypeScale.body.copyWith(color: Palette.inkBody)),
              const SizedBox(height: Space.md),
              Semantics(
                button: true,
                label: '${Child.label}, modifier le profil',
                excludeSemantics: true,
                child: InkWell(
                  onTap: onProfile,
                  borderRadius: BorderRadius.circular(Radii.md),
                  child: Container(
                    constraints: const BoxConstraints(minHeight: 52),
                    padding: const EdgeInsets.all(Space.md),
                    decoration: BoxDecoration(color: Palette.surfaceMuted, borderRadius: BorderRadius.circular(Radii.md)),
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          alignment: Alignment.center,
                          decoration: const BoxDecoration(color: Palette.indigo50, shape: BoxShape.circle),
                          child: const AppIcon('emoji:fox', size: 20),
                        ),
                        const SizedBox(width: Space.md),
                        Expanded(child: Text(Child.label, style: TypeScale.cardTitle)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: Space.sm, vertical: 3),
                          decoration: BoxDecoration(color: Palette.amber100, borderRadius: BorderRadius.circular(Radii.pill)),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const AppIcon('emoji:fire', size: 12),
                              const SizedBox(width: 4),
                              Text(
                                HomeContent.streak,
                                style: TypeScale.caption.copyWith(color: Palette.amber600, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class _PrivacyChip extends StatelessWidget {
  const _PrivacyChip();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: Space.sm + 2, vertical: Space.xxs),
    decoration: BoxDecoration(color: Palette.green50, borderRadius: BorderRadius.circular(Radii.pill)),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const AppIcon('emoji:herb', size: 13),
        const SizedBox(width: 5),
        Text(HomeContent.privacyChip, style: TypeScale.caption.copyWith(color: Palette.green800, fontWeight: FontWeight.w600)),
      ],
    ),
  );
}

class _BenefitCard extends StatelessWidget {
  const _BenefitCard({required this.benefit});
  final Benefit benefit;

  @override
  Widget build(BuildContext context) => AppCard(
    child: Row(
      children: [
        IconTile(benefit.icon, tone: Tone.named(benefit.tone), size: 44, iconSize: 22),
        const SizedBox(width: Space.lg),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: Text(benefit.title, style: TypeScale.cardTitle)),
                  const SizedBox(width: Space.sm),
                  Pill(
                    benefit.badge,
                    tone: Tone.slate,
                    style: TypeScale.micro,
                    padding: const EdgeInsets.symmetric(horizontal: Space.sm, vertical: 2),
                  ),
                ],
              ),
              const SizedBox(height: 3),
              Text(benefit.text, style: TypeScale.bodySmall.copyWith(color: Palette.inkSoft)),
            ],
          ),
        ),
      ],
    ),
  );
}

class _StoryOfTheDay extends StatelessWidget {
  const _StoryOfTheDay({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    const white88 = Color(0xE0FFFFFF);
    return Semantics(
      button: true,
      label: '${HomeContent.storyLabel} : ${HomeContent.storyTitle}, ${HomeContent.storyMeta}. Lancer la lecture',
      excludeSemantics: true,
      child: Container(
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(Radii.lg), boxShadow: Shadows.primary),
        child: Material(
          color: Colors.transparent,
          child: Ink(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(Radii.lg),
              gradient: const LinearGradient(colors: [Palette.indigo600, Palette.indigo500]),
            ),
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(Radii.lg),
              child: Padding(
                padding: const EdgeInsets.all(Space.lg),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(HomeContent.storyLabel.toUpperCase(), style: TypeScale.label.copyWith(color: const Color(0xC7FFFFFF))),
                          const SizedBox(height: 2),
                          Text(HomeContent.storyTitle, style: TypeScale.button.copyWith(color: Palette.white)),
                          const SizedBox(height: 2),
                          Wrap(
                            crossAxisAlignment: WrapCrossAlignment.center,
                            children: [
                              Text(HomeContent.storyMeta, style: TypeScale.caption.copyWith(color: white88, fontWeight: FontWeight.w600)),
                              const SizedBox(width: Space.sm),
                              Text('•', style: TypeScale.caption.copyWith(color: const Color(0x99FFFFFF))),
                              const SizedBox(width: Space.sm),
                              const AppIcon('emoji:star', size: 13),
                              const SizedBox(width: 4),
                              Text(HomeContent.storyReward, style: TypeScale.caption.copyWith(color: white88, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: Space.md),
                    Container(
                      width: 40,
                      height: 40,
                      alignment: Alignment.center,
                      decoration: const BoxDecoration(color: Palette.white, shape: BoxShape.circle),
                      child: const AppIcon('play', size: 18, color: Palette.indigo500),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Footnote extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: Space.md, vertical: Space.sm + 2),
    decoration: BoxDecoration(
      color: Palette.footnote,
      borderRadius: BorderRadius.circular(Radii.md),
      border: Border.all(color: Palette.border),
    ),
    child: Row(
      children: [
        const AppIcon('circle-check', size: 18, color: Palette.ink),
        const SizedBox(width: Space.sm + 2),
        Expanded(
          child: Text.rich(
            TextSpan(
              text: HomeContent.footnoteBefore,
              style: TypeScale.caption.copyWith(color: Palette.inkBody, fontWeight: FontWeight.w400),
              children: [
                TextSpan(
                  text: HomeContent.footnoteStrong,
                  style: TypeScale.caption.copyWith(color: Palette.ink, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ),
      ],
    ),
  );
}
