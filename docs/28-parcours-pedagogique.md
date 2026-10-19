# 28 — Parcours pédagogique (base de connaissances)

Le parcours de l'enfant vient d'une **base de connaissances en 3 fichiers CSV**, éditable
par l'équipe pédagogique sans toucher au code :

| Fichier | Contenu |
|---|---|
| `content/curriculum/niveaux.csv` | 7 niveaux : nom, objectif |
| `content/curriculum/lecons.csv` | 68 leçons : niveau, titre, son ou syllabe ciblé, objectif, durée, ordre |
| `content/curriculum/mots.csv` | le mot, la syllabe ou la phrase de chaque leçon, avec son **découpage syllabique** |
| `content/curriculum/questions.csv` | les questions de compréhension des phrases et des textes : question, réponse, 2 pièges (`papa\|lapin`), tous des mots illustrés |
| `content/curriculum/images.csv` | l'image de chaque mot illustrable (nom d'emoji Fluent, ex. `chat,cat-face`) |

Après une modification de `images.csv`, relancer aussi `node apps/mobile/scripts/generate-icons.mjs`
(les images sont embarquées dans les applis, aucune requête réseau).

`node content/curriculum/generate.mjs` (ou `pnpm content:generate`) construit les exercices
et écrit le **même** contenu pour les trois clients :

- `apps/mobile-flutter/lib/domain/curriculum.g.dart` (app Flutter) ;
- `packages/core/src/pedagogy/curriculum.generated.ts` (app Expo) ;
- `apps/api-laravel/database/seeders/data/curriculum.json` (API, lu par `PedagogySeeder`).

La CI échoue si ces fichiers ne correspondent plus aux CSV (`generate.mjs --check`).
Après une modification des CSV : relancer le script, puis `php artisan db:seed` côté API.

## Organisation

- **77 leçons** = les 68 de la base, plus 2 **leçons miroir** ajoutées par Natanga en fin
  de niveau 2 (« b ou d ? » et « p ou q ? », confusions typiques de la dyslexie), plus un
  **bilan à la fin de chaque niveau**.
- La base d'origine (50 leçons) a été complétée par Natanga, à faire valider :
  - niveau 2 : les consonnes **c** (/k/, carotte), **g** (/g/, gâteau), **z** (zèbre) ;
  - niveau 5 : **ai** (lait), **ei** (neige), **au** (auto), **eu** (feu), **en** (dent),
    **gn** (montagne), **ill** (fille), **ph** (phoque), **qu** (quatre), **gu** (guitare) ;
  - niveau 7 **Textes courts** : 5 petits textes de 3 phrases (Le petit chat, À la mer,
    La fête de bébé, La neige, Au zoo), avec 2 questions chacun.
- Une leçon = un nœud de l'arbre. Déblocage strictement dans l'ordre : niveau, puis colonne
  `ordre`. Une leçon est **maîtrisée** à partir de 3 réponses et 70 % de réussite.
- Dans l'app, « Mon parcours » regroupe les leçons par niveau. Les niveaux pas encore
  atteints restent repliés (en-tête seul).
- Les mots sont affichés en **syllabes bicolores**, comme dans l'écran de lecture.

## Exercices générés (3 à 6 par leçon, 387 au total)

La voix pose chaque question à l'arrivée de l'exercice ; le bouton 🔊 la répète. Une erreur
n'est jamais punie : « Presque ! C'est « b ». On réessaie. »

| Type de leçon | Exercices |
|---|---|
| **Son** (niveaux 1, 2, 5, et ch/ou) | 1. « a, comme dans avion » → choisir parmi 2 lettres proches · 2. écouter le mot-repère, le retrouver parmi 3 mots · 3. le son seul, parmi 3 lettres · 4. un 2ᵉ mot contenant le son, quand la banque en a un · 5. **tracer la lettre au doigt** · niveaux 3 et 5 : **lire le mot-repère** et trouver son image |
| **Syllabe** (niveau 3) | 1. syllabe voisine (ma / pa) · 2. **inversion** (ma / am) · 3. parmi 3 syllabes · 4. un mot qui la contient (ma → maman), quand il existe · 5. **le lire** et trouver son image · 6. **assembler ce mot** à partir de ses syllabes |
| **Mot** (niveau 4) | 0. **lire le mot seul** (avant de l'entendre) et toucher son image · 1–2. retrouver le mot parmi des mots qui lui ressemblent (même début) · 3. le mot ou son **sosie à une lettre près** (maman / naman) · 4. **assembler le mot** (mots de 2 syllabes ou plus) |
| **Phrase** (niveau 6) | 1. retrouver la phrase entendue parmi 3 · 2. **compréhension** : lire la phrase, répondre à une question en touchant une image (« Le chat dort. » → *Qui dort ?*) · 3–4. retrouver 2 mots de la phrase (« chat », « dort ») |
| **Texte court** (niveau 7) | 1. lire le texte seul, répondre à une 1ʳᵉ question en image · 2. écouter une phrase du texte, la retrouver parmi les 3 · 3. 2ᵉ question de compréhension · 4. retrouver un mot du texte à l'oreille |
| **Bilan** (fin de chaque niveau) | 6 exercices repris de tout le niveau, du plus exigeant au plus simple : lire et trouver l'image, assembler, le son seul (sans mot-repère), reconnaître. Pas de tracé. |

### Lis et trouve l'image

C'est le seul exercice où **la voix ne dit pas le mot** : elle dit seulement la consigne.
L'enfant doit décoder seul, de l'écrit vers le sens. Le mot (ou la phrase) s'affiche en
syllabes bicolores ; les choix sont des images sans légende. Une erreur montre la bonne
image : « Presque ! C'est « chat ». On réessaie. » Les questions de compréhension des
phrases et des textes sont dans `questions.csv`.

Les leçons miroir se terminent par le tracé de **d** et de **q**.

### Assembler les syllabes

La voix dit le mot ; l'enfant touche ses syllabes dans l'ordre. Une **syllabe piège** est
ajoutée : l'inversion de la première syllabe (ma → am) ou, à défaut, son sosie (é → è).
Toucher une case remplie la vide, pour corriger avant de valider. En cas d'erreur, l'ordre
attendu est montré : « Presque ! C'est « ma · man ». On réessaie. »

### Tracer les lettres (app Flutter)

L'enfant repasse au doigt sur la lettre grise, puis touche « J'ai fini ». La lettre est
dessinée hors écran sur une grille de 48 × 48 cases pour noter le tracé
(`lib/domain/tracing.dart`) :
- **couverture** ≥ 50 % : part de la lettre que le doigt a parcourue ;
- **précision** ≥ 60 % : part du tracé restée près de la lettre (un gribouillage échoue).

La tolérance est de 3 cases autour du trait : un tracé tremblé réussit. « Effacer »
recommence et **« Passer »** est toujours proposé (motricité fine, lecteur d'écran). Le sens
d'écriture des traits n'est pas encore vérifié. L'app Expo saute les tracés.

Les lettres proposées comme distracteurs sont des **lettres proches** : en miroir (b/d, p/q),
de son voisin (f/v, m/n, an/on…). La table est `CONFUSABLE` dans `generate.mjs`.
**Jamais d'homophones** parmi les choix d'un exercice d'écoute : ai/ei/è, en/an, au/o/eau,
ph/f, qu/c/q, gu/g se prononcent pareil, l'enfant ne pourrait pas choisir à l'oreille (un
test le vérifie). Le tracé nomme les lettres (« trace les lettres a, i »), pas le son.

## Corrections apportées à la base

À faire valider par l'orthophoniste :

| Leçon | Base | Utilisé | Raison |
|---|---|---|---|
| Le son /e/ | éléphant | **cheval** | « éléphant » contient le son /é/, pas /e/ |
| Le son /an/ | banane | **maman** | dans « ba-na-ne », on n'entend pas /an/ |
| Tous les mots | colonne `syllabes` = mot entier | **découpage réel** (a-vi-on, é-lé-phant…) | nécessaire aux syllabes bicolores |
| Le son /eau/ | distracteur « o » | **ou**, **an** | « o » et « eau » se prononcent pareil |

Mots ajoutés à la banque : bon, don, bébé, dodo, pomme, poule, quatre, coq, doigt (leçons
miroir), cheval (son /e/), cadeau, gorille, baleine, chaussure, enfant, araignée, chenille,
requin, bague (2ᵉ mots des sons ajoutés). Les 2ᵉ mots par son sont choisis à la main (`SECOND_WORD`).

## Points à trancher par l'équipe pédagogique

- **ch** et **ou** sont au niveau 3 (Syllabes) dans la base. Ce sont des sons complexes :
  les déplacer au niveau 5 ? (changer `niveau_id` dans `lecons.csv`.)
- Le **tracé** ne vérifie pas encore le sens et l'ordre des traits (ex. « b » qui commence
  par la barre). À décider avec l'orthophoniste si c'est utile.
- Les images sont des emojis (Fluent Emoji, licence MIT), choisis dans `images.csv` ;
  « domino » et « jupe » n'en ont pas. De vraies illustrations (colonne `image_suggeree`)
  pourront les remplacer.
- Les questions de compréhension des 5 phrases sont à faire relire.
- La voix de synthèse lit les consonnes isolées par leur nom (« èm », « pé ») ; c'est
  pourquoi chaque son est d'abord dit avec un mot-repère. Des enregistrements audio
  d'orthophoniste seraient plus justes.

## Mise à jour d'une base existante (API)

`TreeSeeder` retire les nœuds des versions précédentes (`n-letters-a`, `n-mots-simples`,
`n-phrases`). Les textes de lecture qui y étaient rattachés sont d'abord rattachés aux
nouveaux nœuds : l'historique de lecture est conservé. La progression des enfants sur ces
anciens nœuds disparaît, puisque les leçons n'existent plus. Les applis mobiles ignorent la
progression locale sur un nœud retiré.
