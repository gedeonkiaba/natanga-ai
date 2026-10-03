import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../content/demo.dart';
import '../design/avatar.dart';
import '../design/tokens.dart';
import '../design/widgets.dart';
import '../features/profile.dart';
import '../features/progress.dart';
import '../navigation.dart';
import '../router.dart';
import '../state/progress_controller.dart';

/// Profil enfant : avatar + thèmes préférés (enregistrés sur l'appareil).
class ProfileSetupScreen extends ConsumerStatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  late String? _avatar;
  late List<ThemeKey> _themes;

  @override
  void initState() {
    super.initState();
    final saved = ref.read(progressProvider).profile;
    _avatar = saved?.avatar ?? ProfileContent.initialAvatar;
    _themes = [...(saved?.themes ?? ProfileContent.initialThemes)];
  }

  void _submit() {
    final avatar = _avatar;
    if (avatar == null) return;
    ref.read(progressProvider.notifier).update((s) => saveProfile(s, avatar, _themes));
    context.go(Routes.reading);
  }

  @override
  Widget build(BuildContext context) {
    return AppScreen(
      nav: BottomNav(items: Tabs.profile(context), active: 'profil'),
      footer: AppButton(ProfileContent.cta, trailingIcon: 'arrow-right', onPressed: canSubmitProfile(_avatar, _themes) ? _submit : null),
      children: [
        _Header(onBack: () => context.go(Routes.home)),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Semantics(header: true, child: Text(ProfileContent.title, style: TypeScale.title)),
            const SizedBox(height: 2),
            Text(ProfileContent.subtitle, style: TypeScale.body.copyWith(color: Palette.inkBody)),
          ],
        ),
        AppCard(
          child: Column(
            children: [
              const _SectionHeader(ProfileContent.avatarLabel, ProfileContent.avatarCount, Tone.indigo),
              const SizedBox(height: Space.md),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  for (final a in ProfileContent.avatars)
                    Semantics(
                      inMutuallyExclusiveGroup: true,
                      checked: a.key == _avatar,
                      label: a.name,
                      button: true,
                      excludeSemantics: true,
                      child: InkResponse(
                        onTap: () => setState(() => _avatar = a.key),
                        child: Column(
                          children: [
                            Avatar(a.key, selected: a.key == _avatar),
                            const SizedBox(height: Space.xxs),
                            Text(
                              a.name,
                              style: TypeScale.caption.copyWith(
                                fontWeight: FontWeight.w600,
                                color: a.key == _avatar ? Palette.teal700 : Palette.slate500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
        AppCard(
          child: Column(
            children: [
              _SectionHeader(ProfileContent.themesLabel, selectionLabel(_themes.length), Tone.teal),
              const SizedBox(height: Space.md),
              LayoutBuilder(
                builder: (context, box) {
                  final w = (box.maxWidth - Space.sm - 2) / 2;
                  return Wrap(
                    spacing: Space.sm + 2,
                    runSpacing: Space.sm + 2,
                    children: [
                      for (final t in ProfileContent.themes)
                        SizedBox(
                          width: w,
                          child: _ThemeChip(
                            theme: t,
                            on: _themes.contains(t.key),
                            onTap: () => setState(() => _themes = toggleTheme(_themes, t.key)),
                          ),
                        ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(Space.md),
          decoration: BoxDecoration(
            color: Palette.purple50,
            borderRadius: BorderRadius.circular(Radii.md + 2),
            border: Border.all(color: Palette.purple200),
          ),
          child: Row(
            children: [
              const IconTile('sparkles', background: Palette.violet500, color: Palette.white, size: 32, iconSize: 17, radius: Radii.sm),
              const SizedBox(width: Space.md),
              Expanded(
                child: Text.rich(
                  TextSpan(
                    text: ProfileContent.infoBefore,
                    style: TypeScale.caption.copyWith(color: Palette.violet900, fontWeight: FontWeight.w400, height: 1.5),
                    children: [
                      TextSpan(text: ProfileContent.infoStrong, style: const TextStyle(fontWeight: FontWeight.w700)),
                      const TextSpan(text: ProfileContent.infoAfter),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.onBack});
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Semantics(
        button: true,
        label: 'Retour',
        excludeSemantics: true,
        child: InkWell(
          onTap: onBack,
          borderRadius: BorderRadius.circular(Radii.md),
          child: Container(
            width: touch - 4,
            height: touch - 4,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Palette.surface,
              borderRadius: BorderRadius.circular(Radii.md),
              border: Border.all(color: Palette.borderSoft),
              boxShadow: Shadows.card,
            ),
            child: const AppIcon('arrow-left', size: 20, color: Palette.inkBody),
          ),
        ),
      ),
      const SizedBox(width: Space.sm),
      Flexible(
        child: Semantics(
          header: true,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: Space.lg, vertical: Space.xs + 1),
            decoration: BoxDecoration(color: Palette.indigo50, borderRadius: BorderRadius.circular(Radii.pill)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const AppIcon('book-open-check', size: 16, color: Palette.indigo500),
                const SizedBox(width: Space.xs),
                Flexible(
                  child: Text(
                    'Natanga',
                    overflow: TextOverflow.ellipsis,
                    style: TypeScale.cardTitle.copyWith(color: Palette.indigo500, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      const SizedBox(width: Space.sm),
      const Pill(ProfileContent.step, tone: Tone.teal, padding: EdgeInsets.symmetric(horizontal: Space.md, vertical: Space.xs)),
    ],
  );
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader(this.title, this.badge, this.tone);
  final String title;
  final String badge;
  final Tone tone;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Expanded(child: Text(title.toUpperCase(), style: TypeScale.label.copyWith(color: Palette.slate700))),
      const SizedBox(width: Space.sm),
      Pill(badge, tone: tone, style: TypeScale.micro),
    ],
  );
}

class _ThemeChip extends StatelessWidget {
  const _ThemeChip({required this.theme, required this.on, required this.onTap});
  final ThemeInfo theme;
  final bool on;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    checked: on,
    label: theme.label,
    button: true,
    excludeSemantics: true,
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(Radii.md + 2),
      child: Container(
        constraints: const BoxConstraints(minHeight: 52),
        padding: const EdgeInsets.symmetric(horizontal: Space.md),
        decoration: BoxDecoration(
          color: on ? Palette.teal50 : Palette.surfaceMuted,
          borderRadius: BorderRadius.circular(Radii.md + 2),
          border: Border.all(color: on ? Palette.teal300 : Palette.borderSoft, width: 1.5),
          boxShadow: on ? Shadows.teal : null,
        ),
        child: Row(
          children: [
            IconTile(theme.emoji, background: Color(theme.tint), size: 32, iconSize: 18, radius: Radii.sm),
            const SizedBox(width: Space.sm + 2),
            Expanded(
              child: Text(theme.label, style: TypeScale.cardTitle.copyWith(fontSize: 14, color: on ? Palette.teal700 : Palette.slate700)),
            ),
            CheckMark(checked: on),
          ],
        ),
      ),
    ),
  );
}
