# Natanga — application mobile (Expo)

React Native + Expo (**SDK 57**) + TypeScript. Reproduction des 4 écrans de la maquette
approuvée (Sleek) : **Accueil**, **Profil enfant**, **Lecture**, **Succès** — et le cœur
pédagogique : **Mon parcours** (arbre de compétences) et les **leçons d'exercices**
(son ⇄ lettre, reconnaissance de mots), moteur `@natanga/core`.

```bash
pnpm --filter @natanga/mobile start        # Expo Go / simulateurs
pnpm --filter @natanga/mobile export:web   # vérifie que l'app se bundle (utilisé en CI)
```

Aperçu web d'un écran précis : `#home`, `#profile`, `#reading`, `#achievement`, `#tree` dans l'URL.

## Parcours pédagogique

- **Mon parcours** s'ouvre depuis les onglets *Bibliothèque* (Accueil, Succès) et *Histoires* (Profil).
- Nœud → leçon (`LEVEL1_LESSONS`) → exercices → « Leçon terminée » → retour au parcours ;
  « Quitter » et le retour Android ramènent aussi au parcours.
- Après chaque réponse, le retour (« Bravo ! », « Presque ! C'est « a » ») reste 1,2 s sur
  l'exercice en cours ; les touches en trop sont ignorées (une réponse comptée).
- 4 nœuds jouables (`packages/core/src/pedagogy/content.ts`) : voyelles, b ou d ?, p ou q ?,
  mots simples. b/d et p/q ne proposent que les lettres en miroir, avec un mot-repère dit par
  la voix (« b, comme ballon ») ; en reconnaissance de mots, la voix dit le mot à trouver.
  ⚠️ Contenu à faire valider par l'orthophoniste avant la bêta.

## Tester sur un téléphone

### Option 1 — Expo Go (le plus rapide, 5 minutes)

Sur le téléphone : installer **Expo Go** (Play Store / App Store ; il exécute le SDK 57).
Sur un ordinateur (Node ≥ 20, pnpm 12) :

```bash
git clone https://github.com/gedeonkiaba/natanga-ai.git && cd natanga-ai
git checkout claude/optimistic-ride-tduuap
pnpm install
cd apps/mobile && npx expo start          # même Wi-Fi que le téléphone
# réseaux séparés ou Wi-Fi d'entreprise : npx expo start --tunnel
```

Scanner le QR code : avec **Expo Go** sur Android, avec l'**appareil photo** sur iPhone.

> En mode Expo Go, l'app est chargée depuis l'ordinateur au lancement : pour tester le
> **hors connexion**, ouvrir l'app, puis passer en mode avion et l'utiliser (leçons,
> profil, lecture) ; la progression reste après fermeture tant qu'Expo Go n'est pas vidé.
> Pour une app réellement installée qui démarre sans réseau, utiliser l'option 2.

### Option 2 — APK Android installable (démarre 100 % hors connexion)

Build dans le cloud Expo (compte gratuit sur expo.dev, environ 15 minutes) :

```bash
npm install -g eas-cli
cd apps/mobile
eas login
eas init                                   # relie le projet à votre compte (une fois)
eas build -p android --profile preview     # produit un .apk
```

EAS affiche un lien et un QR code : ouvrir sur le téléphone Android, télécharger l'APK,
autoriser « sources inconnues », installer. iPhone : `eas build -p ios --profile preview`
(compte Apple Developer requis) ou rester sur Expo Go.

### Hors connexion : ce qui marche

| Élément | Hors connexion |
|---|---|
| Écrans, histoires, parcours, leçons, polices, icônes | ✅ embarqués dans l'app |
| Progression (profil, nœuds maîtrisés, gemmes, étoiles) | ✅ sauvegardée sur l'appareil (`natanga.progress.v1`) |
| Voix (lecture des mots et des sons) | ✅ iPhone ; Android : voix française de l'appareil à installer une fois (*Paramètres → Synthèse vocale*) |
| Envoi des progrès au serveur | ⏳ file d'événements prête (`outbox`), synchronisation à brancher quand l'app sera reliée à l'API |

## Design system (`src/design`)

| Élément | Rôle |
|---|---|
| `tokens.ts` | Couleurs relevées au pixel sur la maquette, échelle typographique Lexend, espacements, rayons, ombres |
| `components/` | `AppText`, `Card`, `Pill`, `IconTile`, `Button`, `BrandMark`, `BottomNav`, `ProgressBar`, `Avatar`, `Checkbox`, `Confetti`, `Screen` |
| `icons.generated.ts` | SVG Lucide + Fluent Emoji Flat embarqués (`pnpm --filter @natanga/mobile icons`) — rendu identique iOS / Android, aucun appel réseau |

Les écrans (`src/screens`) n'utilisent que ces composants et les rôles de `colors`.

## Contenu et logique

- `src/content/demo.ts` : textes de la maquette, mot pour mot — point unique à brancher sur l'API.
- `src/features/reading.ts` : syllabes écrites à la main (« lu·ci·ole »), coloration bicolore
  (1ʳᵉ syllabe de chaque mot en teal, puis ardoise), texte lu à voix haute. Testé (`pnpm test`).
- Synthèse vocale : `expo-speech`, débit « Vitesse douce » (0,85).

## Écarts assumés avec la maquette

- La ligne « Léo (8 ans) » de l'accueil est affichée en entier (la maquette la coupe) ; sa
  pastille « 🔥 5 jours » reprend la série de l'écran Succès.
- Les barres d'onglets diffèrent d'un écran à l'autre dans la maquette : reproduites telles
  quelles ; les onglets encore sans écran (Réglages, Parents…) sont annoncés
  « Bientôt disponible » aux lecteurs d'écran.
- Les écrans du parcours et des leçons gardent leur style d'origine (`@natanga/ui`), pas
  encore celui de la maquette.
