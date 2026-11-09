# 29 — Motivation quotidienne (série, objectif, jokers)

But : donner envie à l'enfant de revenir **chaque jour un peu**, comme Duolingo, sans
pression ni culpabilité (enfants dyslexiques ou TDAH : l'échec et la honte sont à éviter).
Implémenté dans l'app Flutter, hors connexion (`lib/features/habit.dart`, logique pure testée).

## La boucle du jour

1. **Accueil** : en haut, la carte **« Ma leçon du jour »** lance la prochaine leçon du
   parcours en un geste (la première commencée ou disponible).
2. Juste dessous, la carte de **série** : nombre de jours d'affilée, la semaine du lundi au
   dimanche (🔥 fait, 🛡️ protégé par un joker, cercle bleu = aujourd'hui), l'**objectif du
   jour** avec sa barre, et une phrase d'encouragement.
3. **Fin de leçon** : la leçon est enregistrée tout de suite ; l'écran montre la série
   (« +1 : ta série continue ! »), l'objectif du jour, le joker gagné ou utilisé, les paliers
   (3, 7, 14, 30, 50, 100 jours), puis **« Leçon suivante »** pour enchaîner. Leçon pas encore
   réussie (moins de 70 %) : **« Recommencer »**, sans reproche.

## Règles

| Règle | Valeur |
|---|---|
| Activité qui compte | une leçon **ou** une histoire terminée |
| Série | jours d'affilée avec au moins une activité ; la journée en cours ne casse rien avant minuit |
| Objectif du jour | Tranquille 1 · Régulier 2 (par défaut) · Champion 3 activités, choisi par l'enfant (« Changer ») |
| Joker | 1 gagné tous les 7 jours de série, 2 au plus ; il protège **automatiquement** un jour oublié (le jour protégé garde la série sans l'allonger) |
| Série perdue | elle repart à 1, message neutre (« Une leçon par jour, et ta série grandit ! ») |
| Historique | 90 jours, sur l'appareil, dans la même sauvegarde que la progression |

Les anciennes sauvegardes (sans ces données) restent valides : la série démarre à zéro, le
reste de la progression est gardé.

## Pas encore fait

- **Rappel quotidien** (notification à l'heure choisie par le parent) : c'est le levier le plus
  fort de Duolingo ; demande une extension de notifications locales et l'accord du parent.
- **Espace parent** : afficher la série et l'objectif (la file d'événements les contient déjà
  via `lesson_completed` / `reading_completed`, datés).
- **App Expo** : la boucle n'y est pas reprise.
