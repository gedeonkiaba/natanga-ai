# 28 — Parcours pédagogique (base de connaissances)

Le parcours de l'enfant vient d'une **base de connaissances en 3 fichiers CSV**, éditable
par l'équipe pédagogique sans toucher au code :

| Fichier | Contenu |
|---|---|
| `content/curriculum/niveaux.csv` | 6 niveaux : nom, objectif |
| `content/curriculum/lecons.csv` | 50 leçons : niveau, titre, son ou syllabe ciblé, objectif, durée, ordre |
| `content/curriculum/mots.csv` | le mot, la syllabe ou la phrase de chaque leçon, avec son **découpage syllabique** |

`node content/curriculum/generate.mjs` (ou `pnpm content:generate`) construit les exercices
et écrit le **même** contenu pour les trois clients :

- `apps/mobile-flutter/lib/domain/curriculum.g.dart` (app Flutter) ;
- `packages/core/src/pedagogy/curriculum.generated.ts` (app Expo) ;
- `apps/api-laravel/database/seeders/data/curriculum.json` (API, lu par `PedagogySeeder`).

La CI échoue si ces fichiers ne correspondent plus aux CSV (`generate.mjs --check`).
Après une modification des CSV : relancer le script, puis `php artisan db:seed` côté API.

## Organisation

- **52 leçons** = les 50 de la base, plus 2 **leçons miroir** ajoutées par Natanga en fin
  de niveau 2 : « b ou d ? » et « p ou q ? » (confusions typiques de la dyslexie).
- Une leçon = un nœud de l'arbre. Déblocage strictement dans l'ordre : niveau, puis colonne
  `ordre`. Une leçon est **maîtrisée** à partir de 3 réponses et 70 % de réussite.
- Dans l'app, « Mon parcours » regroupe les leçons par niveau. Les niveaux pas encore
  atteints restent repliés (en-tête seul).
- Les mots sont affichés en **syllabes bicolores**, comme dans l'écran de lecture.

## Exercices générés (3 à 5 par leçon, 185 au total)

La voix pose chaque question à l'arrivée de l'exercice ; le bouton 🔊 la répète. Une erreur
n'est jamais punie : « Presque ! C'est « b ». On réessaie. »

| Type de leçon | Exercices |
|---|---|
| **Son** (niveaux 1, 2, 5, et ch/ou) | 1. « a, comme dans avion » → choisir parmi 2 lettres proches · 2. écouter le mot-repère, le retrouver parmi 3 mots · 3. le son seul, parmi 3 lettres · 4. un 2ᵉ mot contenant le son, quand la banque en a un |
| **Syllabe** (niveau 3) | 1. syllabe voisine (ma / pa) · 2. **inversion** (ma / am) · 3. parmi 3 syllabes · 4. un mot qui la contient (ma → maman), quand il existe |
| **Mot** (niveau 4) | 1–2. retrouver le mot parmi des mots qui lui ressemblent (même début) · 3. le mot ou son **sosie à une lettre près** (maman / naman) |
| **Phrase** (niveau 6) | 1. retrouver la phrase entendue parmi 3 · 2–3. retrouver 2 mots de la phrase (« chat », « dort ») |

Les lettres proposées comme distracteurs sont des **lettres proches** : en miroir (b/d, p/q),
de son voisin (f/v, m/n, an/on…). La table est `CONFUSABLE` dans `generate.mjs`.

## Corrections apportées à la base

À faire valider par l'orthophoniste :

| Leçon | Base | Utilisé | Raison |
|---|---|---|---|
| Le son /e/ | éléphant | **cheval** | « éléphant » contient le son /é/, pas /e/ |
| Le son /an/ | banane | **maman** | dans « ba-na-ne », on n'entend pas /an/ |
| Tous les mots | colonne `syllabes` = mot entier | **découpage réel** (a-vi-on, é-lé-phant…) | nécessaire aux syllabes bicolores |

Mots ajoutés à la banque : bon, don, bébé, dodo, pomme, poule, quatre, coq, doigt (leçons
miroir), cheval (son /e/). Les 2ᵉ mots par son sont choisis à la main (`SECOND_WORD`).

## Points à trancher par l'équipe pédagogique

- **ch** et **ou** sont au niveau 3 (Syllabes) dans la base. Ce sont des sons complexes :
  les déplacer au niveau 5 ? (changer `niveau_id` dans `lecons.csv`.)
- Les objectifs parlent de **tracer** les lettres et d'**assembler** les syllabes : ces
  exercices n'existent pas encore dans l'app (seulement écouter / reconnaître).
- La colonne `image_suggeree` n'est pas encore utilisée : il faudra des illustrations.
- La voix de synthèse lit les consonnes isolées par leur nom (« èm », « pé ») ; c'est
  pourquoi chaque son est d'abord dit avec un mot-repère. Des enregistrements audio
  d'orthophoniste seraient plus justes.

## Mise à jour d'une base existante (API)

`TreeSeeder` retire les nœuds des versions précédentes (`n-letters-a`, `n-mots-simples`,
`n-phrases`). Les textes de lecture qui y étaient rattachés sont d'abord rattachés aux
nouveaux nœuds : l'historique de lecture est conservé. La progression des enfants sur ces
anciens nœuds disparaît, puisque les leçons n'existent plus. Les applis mobiles ignorent la
progression locale sur un nœud retiré.
