# Natanga — application mobile Flutter

Flutter (testé avec **Flutter 3.47 / Dart 3.13**), iOS et Android. Même produit que l'app
Expo (`apps/mobile`) : mêmes écrans, mêmes règles, même contenu.

| Partie | Écrans | Hors connexion |
|---|---|---|
| Maquette approuvée | Accueil, Profil enfant, Lecture, Succès | ✅ |
| Cœur pédagogique | Mon parcours (arbre), leçons : son ⇄ lettre, reconnaissance de mots | ✅ |
| Espace parent (API Laravel) | Connexion, inscription, accord parental | ⛔ réseau requis |

## Tester sur un téléphone

Prérequis : [Flutter](https://docs.flutter.dev/get-started/install) + Android Studio (SDK Android)
ou Xcode (iPhone, sur Mac).

```bash
cd apps/mobile-flutter
flutter pub get
flutter devices                 # téléphone branché en USB, « débogage USB » activé
flutter run                     # installe et lance l'app sur le téléphone
```

APK Android à installer / partager (s'ouvre ensuite sans réseau) :

```bash
flutter build apk --release
# → build/app/outputs/flutter-apk/app-release.apk
```

> L'APK de test est signé avec la clé de débogage (modèle Flutter) : suffisant pour tester,
> pas pour le Play Store (configurer une clé de publication avant).

L'espace parent appelle l'API (`http://localhost:8000` par défaut). Sur téléphone :
`flutter run --dart-define=API_BASE_URL=http://<IP-du-PC>:8000` (même Wi-Fi).

## Hors connexion

- Histoires, parcours, leçons, police Lexend (embarquée, `assets/fonts`), icônes : dans l'app.
- Progression (profil, nœuds maîtrisés, gemmes, étoiles) sauvegardée sur l'appareil
  (`shared_preferences`, clé `natanga.progress.v1`) ; maîtrise = ≥ 3 réponses et ≥ 70 %,
  comme l'API. Une file d'événements (`outbox`) est prête pour la synchronisation.
- Voix : `flutter_tts` utilise la voix de l'appareil (Android : voix française à installer
  une fois dans *Paramètres → Synthèse vocale*).

## Code

| Dossier | Rôle |
|---|---|
| `lib/design` | Design system : `tokens.dart` (couleurs relevées sur la maquette, échelle Lexend), `widgets.dart`, `avatar.dart`, `icons.g.dart` (généré par `apps/mobile/scripts/generate-icons.mjs`, même source que l'app Expo) |
| `lib/domain/pedagogy.dart` | Moteur pédagogique (portage de `packages/core`) : arbre, leçons, correction, gemmes |
| `lib/features` | Lecture (syllabes), profil, progression hors connexion — logique pure, testée |
| `lib/content/demo.dart` | Textes de la maquette, mot pour mot |
| `lib/screens` | Écrans ; `lib/router.dart` (go_router, espace parent protégé) |

## Vérifications

```bash
flutter analyze
flutter test        # 54 tests : API, session, logique, parcours complet (leçon, hors connexion, redémarrage)
flutter build web --release --no-web-resources-cdn   # aperçu navigateur, sans CDN
```

⚠️ La leçon « b ou d ? » n'a pas encore d'exercices (contenu à rédiger et valider par
l'équipe pédagogique) : l'app affiche « Cette leçon arrive bientôt » avec un retour.
