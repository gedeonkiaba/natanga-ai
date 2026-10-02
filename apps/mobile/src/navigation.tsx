import { createContext, useContext } from 'react';
import type { NavItem } from './design';

/** `tree` = arbre de compétences (« Mon parcours »), `lesson` = leçon d'exercices. */
export type Route = 'home' | 'profile' | 'reading' | 'achievement' | 'tree' | 'lesson';

export const NavigationContext = createContext<(route: Route) => void>(() => {});

export function useNavigate() {
  return useContext(NavigationContext);
}

/**
 * Barres d'onglets reprises telles quelles de la maquette (elles diffèrent d'un écran
 * à l'autre). Seuls les onglets qui mènent à un écran construit sont actifs ;
 * « Bibliothèque » / « Histoires » ouvrent l'arbre de compétences.
 */
export function tabs(go: (r: Route) => void) {
  return {
    home: [
      { key: 'accueil', label: 'Accueil', icon: 'house', onPress: () => go('home') },
      { key: 'bibliotheque', label: 'Bibliothèque', icon: 'library', onPress: () => go('tree') },
      { key: 'lecteur', label: 'Lecteur', icon: 'book-open', onPress: () => go('reading') },
      { key: 'succes', label: 'Succès', icon: 'award', onPress: () => go('achievement') },
      { key: 'reglages', label: 'Réglages', icon: 'sliders-horizontal' },
    ],
    profile: [
      { key: 'accueil', label: 'Accueil', icon: 'house', onPress: () => go('home') },
      { key: 'profil', label: 'Profil', icon: 'user', onPress: () => go('profile') },
      { key: 'histoires', label: 'Histoires', icon: 'book', onPress: () => go('tree') },
      { key: 'succes', label: 'Succès', icon: 'award', onPress: () => go('achievement') },
      { key: 'parents', label: 'Parents', icon: 'shield' },
    ],
    reading: [
      { key: 'accueil', label: 'Accueil', icon: 'house', onPress: () => go('home') },
      { key: 'lecture', label: 'Lecture', icon: 'book-open', onPress: () => go('reading') },
      { key: 'tresors', label: 'Trésors', icon: 'award', onPress: () => go('achievement') },
      { key: 'reglages', label: 'Réglages', icon: 'sliders-vertical' },
      { key: 'parents', label: 'Parents', icon: 'shield-check' },
    ],
    achievement: [
      { key: 'bibliotheque', label: 'Bibliothèque', icon: 'book', onPress: () => go('tree') },
      { key: 'lecture', label: 'Lecture', icon: 'circle-play', onPress: () => go('reading') },
      { key: 'succes', label: 'Succès', icon: 'award', onPress: () => go('achievement') },
      { key: 'parents', label: 'Parents', icon: 'shield-check' },
    ],
  } satisfies Partial<Record<Route, NavItem[]>>;
}
