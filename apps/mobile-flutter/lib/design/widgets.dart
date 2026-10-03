/// Composants partagés du design system Natanga (Flutter).
library;

import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'icons.g.dart';
import 'tokens.dart';

/// Icône vectorielle embarquée (Lucide pour l'interface, `emoji:*` pour les pictogrammes).
class AppIcon extends StatelessWidget {
  const AppIcon(this.name, {super.key, this.size = 20, this.color, this.strokeWidth, this.filled = false});
  final String name;
  final double size;
  final Color? color;
  final double? strokeWidth;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    var xml = kIcons[name];
    assert(xml != null, 'icône inconnue : $name');
    xml ??= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"/>';
    if (strokeWidth != null) xml = xml.replaceAll('stroke-width="2"', 'stroke-width="$strokeWidth"');
    if (filled) xml = xml.replaceFirst('fill="none"', 'fill="currentColor"');
    return ExcludeSemantics(child: SvgPicture.string(xml, width: size, height: size, theme: SvgTheme(currentColor: color ?? Palette.ink)));
  }
}

/// Surface blanche arrondie à ombre douce.
class AppCard extends StatelessWidget {
  const AppCard({super.key, required this.child, this.padding = const EdgeInsets.all(Space.lg), this.color, this.border});
  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? color;
  final BoxBorder? border;

  @override
  Widget build(BuildContext context) => Container(
    padding: padding,
    decoration: BoxDecoration(
      color: color ?? Palette.surface,
      borderRadius: BorderRadius.circular(Radii.lg),
      border: border,
      boxShadow: Shadows.card,
    ),
    child: child,
  );
}

/// Pastille arrondie (statut, compteur, badge) avec icône optionnelle.
class Pill extends StatelessWidget {
  const Pill(this.label, {super.key, this.tone = Tone.indigo, this.icon, this.style, this.upper = false, this.padding});
  final String label;
  final Tone tone;
  final String? icon;
  final TextStyle? style;
  final bool upper;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) => Container(
    padding: padding ?? const EdgeInsets.symmetric(horizontal: Space.sm + 2, vertical: Space.xxs),
    decoration: BoxDecoration(color: tone.bg, borderRadius: BorderRadius.circular(Radii.pill)),
    // Un seul texte (icône en ligne) : se tronque proprement au lieu de déborder.
    child: Text.rich(
      TextSpan(
        children: [
          if (icon != null)
            WidgetSpan(
              alignment: PlaceholderAlignment.middle,
              child: Padding(padding: const EdgeInsets.only(right: 5), child: AppIcon(icon!, size: 13, color: tone.fg)),
            ),
          TextSpan(text: upper ? label.toUpperCase() : label),
        ],
      ),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: (style ?? TypeScale.caption).copyWith(color: tone.fg, fontWeight: FontWeight.w600),
    ),
  );
}

/// Carré arrondi teinté portant une icône.
class IconTile extends StatelessWidget {
  const IconTile(
    this.name, {
    super.key,
    this.tone = Tone.indigo,
    this.size = 44,
    this.iconSize,
    this.background,
    this.color,
    this.radius = Radii.md,
    this.filled = false,
  });
  final String name;
  final Tone tone;
  final double size;
  final double? iconSize;
  final Color? background;
  final Color? color;
  final double radius;
  final bool filled;

  @override
  Widget build(BuildContext context) => Container(
    width: size,
    height: size,
    alignment: Alignment.center,
    decoration: BoxDecoration(color: background ?? tone.bg, borderRadius: BorderRadius.circular(radius)),
    child: AppIcon(name, size: iconSize ?? (size * 0.5).roundToDouble(), color: color ?? tone.fg, filled: filled),
  );
}

enum ButtonVariant { primary, outline, ghost }

/// Bouton ≥ 52 pt : primaire (indigo plein), contour indigo, ou neutre.
class AppButton extends StatelessWidget {
  const AppButton(
    this.label, {
    super.key,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.leadingIcon,
    this.trailingIcon,
    this.accessory,
  });
  final String label;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final String? leadingIcon;
  final String? trailingIcon;
  final Widget? accessory;

  @override
  Widget build(BuildContext context) {
    final fg = switch (variant) {
      ButtonVariant.primary => Palette.white,
      ButtonVariant.outline => Palette.indigo500,
      ButtonVariant.ghost => Palette.slate700,
    };
    final iconColor = variant == ButtonVariant.ghost ? Palette.indigo500 : fg;
    final disabled = onPressed == null;
    return Semantics(
      button: true,
      enabled: !disabled,
      label: label,
      excludeSemantics: true,
      child: Opacity(
        opacity: disabled ? 0.5 : 1,
        child: Material(
          color: Colors.transparent,
          child: Ink(
            decoration: BoxDecoration(
              color: variant == ButtonVariant.primary ? Palette.indigo500 : Palette.surface,
              borderRadius: BorderRadius.circular(Radii.lg),
              border: switch (variant) {
                ButtonVariant.primary => null,
                ButtonVariant.outline => Border.all(color: Palette.indigo300, width: 1.5),
                ButtonVariant.ghost => Border.all(color: Palette.borderSlate),
              },
              boxShadow: variant == ButtonVariant.primary && !disabled ? Shadows.primary : null,
            ),
            child: InkWell(
              onTap: onPressed,
              borderRadius: BorderRadius.circular(Radii.lg),
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 52),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: Space.lg),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (leadingIcon != null) ...[AppIcon(leadingIcon!, size: 19, color: iconColor), const SizedBox(width: Space.sm)],
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(
                            label,
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            style:
                                variant == ButtonVariant.ghost
                                    ? TypeScale.button.copyWith(fontSize: 14, fontWeight: FontWeight.w500, color: fg)
                                    : TypeScale.button.copyWith(color: fg),
                          ),
                        ),
                      ),
                      if (accessory != null) ...[const SizedBox(width: Space.sm), accessory!],
                      if (trailingIcon != null) ...[const SizedBox(width: Space.sm), AppIcon(trailingIcon!, size: 19, color: iconColor)],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Logo Natanga : tuile dégradée indigo → violet + nom (point violet optionnel).
class BrandMark extends StatelessWidget {
  const BrandMark({super.key, this.icon = 'book-open', this.dot = false, this.size = 36});
  final String icon;
  final bool dot;
  final double size;

  @override
  Widget build(BuildContext context) => Semantics(
    header: true,
    label: 'Natanga',
    excludeSemantics: true,
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(Radii.md - 2),
            gradient: const LinearGradient(
              colors: [Palette.indigo500, Palette.violet500],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: AppIcon(icon, size: size * 0.55, color: Palette.white),
        ),
        const SizedBox(width: Space.sm + 2),
        Flexible(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text.rich(
              TextSpan(
                text: 'Natanga',
                style: TypeScale.brand,
                children: [if (dot) TextSpan(text: '.', style: TypeScale.brand.copyWith(color: Palette.violet500))],
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

/// Barre de progression (dégradé violet → indigo sur piste crème).
class AppProgressBar extends StatelessWidget {
  const AppProgressBar({super.key, required this.value, required this.label});
  final double value;
  final String label;

  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    value: '${(value * 100).round()} %',
    child: ClipRRect(
      borderRadius: BorderRadius.circular(Radii.pill),
      child: Container(
        height: 6,
        color: Palette.track,
        alignment: Alignment.centerLeft,
        child: FractionallySizedBox(
          widthFactor: value.clamp(0, 1),
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [Palette.violet500, Palette.indigo500]),
              borderRadius: BorderRadius.all(Radius.circular(Radii.pill)),
            ),
          ),
        ),
      ),
    ),
  );
}

/// Case à cocher visuelle (l'état accessible est porté par le parent).
class CheckMark extends StatelessWidget {
  const CheckMark({super.key, required this.checked});
  final bool checked;

  @override
  Widget build(BuildContext context) => Container(
    width: 22,
    height: 22,
    alignment: Alignment.center,
    decoration: BoxDecoration(
      color: checked ? Palette.teal600 : Palette.white,
      borderRadius: BorderRadius.circular(6),
      border: checked ? null : Border.all(color: Palette.borderSlate, width: 1.5),
    ),
    child: checked ? const AppIcon('check', size: 14, color: Palette.white, strokeWidth: 3) : null,
  );
}

class NavItem {
  const NavItem(this.key, this.label, this.icon, {this.onTap});
  final String key;
  final String label;
  final String icon;

  /// Absent : destination pas encore construite (annoncée « Bientôt disponible »).
  final VoidCallback? onTap;
}

enum NavIndicator { dot, bar }

/// Barre d'onglets inférieure (onglet actif indigo, point ou trait sous le libellé).
class BottomNav extends StatelessWidget {
  const BottomNav({super.key, required this.items, required this.active, this.indicator = NavIndicator.bar});
  final List<NavItem> items;
  final String active;
  final NavIndicator indicator;

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.paddingOf(context).bottom;
    return Container(
      decoration: const BoxDecoration(color: Palette.surface, border: Border(top: BorderSide(color: Palette.borderSoft))),
      padding: EdgeInsets.only(top: Space.sm + 2, bottom: math.max(bottom, Space.md)),
      child: Row(
        children: [for (final item in items) Expanded(child: _NavButton(item: item, active: item.key == active, indicator: indicator))],
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  const _NavButton({required this.item, required this.active, required this.indicator});
  final NavItem item;
  final bool active;
  final NavIndicator indicator;

  @override
  Widget build(BuildContext context) {
    final tint = active ? Palette.indigo500 : Palette.navIdle;
    final unavailable = item.onTap == null && !active;
    return Semantics(
      button: true,
      selected: active,
      enabled: !unavailable,
      label: item.label,
      hint: unavailable ? 'Bientôt disponible' : null,
      excludeSemantics: true,
      child: InkResponse(
        onTap: item.onTap,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: touch),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AppIcon(item.icon, size: 22, color: tint, strokeWidth: active ? 2.1 : 1.7),
              const SizedBox(height: 3),
              Text(
                item.label,
                style: TypeScale.nav.copyWith(color: tint, fontWeight: active ? FontWeight.w600 : FontWeight.w400),
                maxLines: 1,
                overflow: TextOverflow.visible,
              ),
              const SizedBox(height: 3),
              if (active && indicator == NavIndicator.dot)
                Container(width: 4, height: 4, decoration: const BoxDecoration(color: Palette.indigo500, shape: BoxShape.circle))
              else if (active)
                Container(width: 18, height: 3, decoration: BoxDecoration(color: Palette.indigo500, borderRadius: BorderRadius.circular(2)))
              else
                const SizedBox(height: 4),
            ],
          ),
        ),
      ),
    );
  }
}

/// Cadre d'écran : fond crème, zone sûre, contenu défilant, pied fixe optionnel, onglets.
class AppScreen extends StatelessWidget {
  const AppScreen({super.key, required this.children, this.footer, this.nav, this.scroll = true, this.background});
  final List<Widget> children;
  final Widget? footer;
  final Widget? nav;
  final bool scroll;
  final Widget? background;

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top;
    final body = Padding(
      padding: EdgeInsets.fromLTRB(gutter, math.max(top, Space.xl) + Space.md, gutter, Space.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var i = 0; i < children.length; i++) ...[if (i > 0) const SizedBox(height: Space.lg), children[i]],
        ],
      ),
    );
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: Palette.cream,
        body: Column(
          children: [
            Expanded(
              child: Stack(
                children: [if (background != null) Positioned.fill(child: background!), scroll ? SingleChildScrollView(child: body) : body],
              ),
            ),
            if (footer != null) Padding(padding: const EdgeInsets.fromLTRB(gutter, 0, gutter, Space.lg), child: footer),
            if (nav != null) nav!,
          ],
        ),
      ),
    );
  }
}
