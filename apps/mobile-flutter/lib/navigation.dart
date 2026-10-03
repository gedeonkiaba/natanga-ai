import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

import 'design/widgets.dart';
import 'router.dart';

/// Barres d'onglets reprises telles quelles de la maquette (elles diffèrent d'un écran
/// à l'autre). « Bibliothèque » / « Histoires » ouvrent l'arbre de compétences,
/// « Parents » l'espace parent (connexion à l'API).
class Tabs {
  static List<NavItem> home(BuildContext c) => [
    NavItem('accueil', 'Accueil', 'house', onTap: () => c.go(Routes.home)),
    NavItem('bibliotheque', 'Bibliothèque', 'library', onTap: () => c.go(Routes.tree)),
    NavItem('lecteur', 'Lecteur', 'book-open', onTap: () => c.go(Routes.reading)),
    NavItem('succes', 'Succès', 'award', onTap: () => c.go(Routes.achievement)),
    const NavItem('reglages', 'Réglages', 'sliders-horizontal'),
  ];

  static List<NavItem> profile(BuildContext c) => [
    NavItem('accueil', 'Accueil', 'house', onTap: () => c.go(Routes.home)),
    NavItem('profil', 'Profil', 'user', onTap: () => c.go(Routes.profile)),
    NavItem('histoires', 'Histoires', 'book', onTap: () => c.go(Routes.tree)),
    NavItem('succes', 'Succès', 'award', onTap: () => c.go(Routes.achievement)),
    NavItem('parents', 'Parents', 'shield', onTap: () => c.go(Routes.parent)),
  ];

  static List<NavItem> reading(BuildContext c) => [
    NavItem('accueil', 'Accueil', 'house', onTap: () => c.go(Routes.home)),
    NavItem('lecture', 'Lecture', 'book-open', onTap: () => c.go(Routes.reading)),
    NavItem('tresors', 'Trésors', 'award', onTap: () => c.go(Routes.achievement)),
    const NavItem('reglages', 'Réglages', 'sliders-vertical'),
    NavItem('parents', 'Parents', 'shield-check', onTap: () => c.go(Routes.parent)),
  ];

  static List<NavItem> achievement(BuildContext c) => [
    NavItem('bibliotheque', 'Bibliothèque', 'book', onTap: () => c.go(Routes.tree)),
    NavItem('lecture', 'Lecture', 'circle-play', onTap: () => c.go(Routes.reading)),
    NavItem('succes', 'Succès', 'award', onTap: () => c.go(Routes.achievement)),
    NavItem('parents', 'Parents', 'shield-check', onTap: () => c.go(Routes.parent)),
  ];
}
