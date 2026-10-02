# Maquettes textuelles — Sprint 1 (écrans complémentaires)

> Complément de `05-maquette-accueil-enfant.md`. Trois écrans clés du parcours MVP :
> onboarding, leçon, tableau de bord parent. Chaque maquette est suivie de ses choix
> UX/accessibilité justifiés.

---

## 1. Onboarding (3 écrans maximum)

### Écran 1/3 — Bienvenue
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              (👾 Compagnon qui salue, animé)                │
│                                                             │
│            « Bonjour ! Je suis Natanga.                    │
│              On va jouer avec les mots. »  🔊              │
│                                                             │
│                                                             │
│                    [ ▶ C'EST PARTI ! ]                      │   ← 1 seul CTA
│                                                             │
│   ●────○────○                                               │   ← pagination douce
└─────────────────────────────────────────────────────────────┘
```

### Écran 2/3 — Comment ça marche
```
┌─────────────────────────────────────────────────────────────┐
│              « 🎧 Tu écoutes, tu regardes,                  │
│                et tu touches la réponse. »  🔊              │
│                                                             │
│        ┌──────────────┐        ┌──────────────┐            │
│        │  🔊  [é]      │   →    │  [👂] ────────│            │
│        │  (son joué)   │        │  (touche pour  │            │
│        │               │        │   réécouter)  │            │
│        └──────────────┘        └──────────────┘            │
│                                                             │
│   « À chaque bonne réponse, tu gagnes des 💎.              │
│     Et si tu te trompes ? Pas grave, on réessaie ! » 🔊     │
│                                                             │
│                    [ ▶ CONTINUER ]                          │
│   ○────●────○                                               │
└─────────────────────────────────────────────────────────────┘
```

### Écran 3/3 — Personnalisation
```
┌─────────────────────────────────────────────────────────────┐
│              « Choisis ton compagnon ! »  🔊                │
│                                                             │
│     ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐             │
│     │ 🦊   │   │ 🐢   │   │ 🐙   │   │ 🦉   │             │
│     │ Renard│   │ Tortue│   │Poulpe │   │Hibou │             │
│     └──────┘   └──────┘   └──────┘   └──────┘             │
│           (sélection → halo doux + sol)                     │
│                                                             │
│              [ 🎨 Personnaliser les couleurs ]              │
│                                                             │
│                    [ ✓ COMMENCER ]                          │
│   ○────○────●                                               │
└─────────────────────────────────────────────────────────────┘
```

**Choix UX/accessibilité justifiés :** 3 écrans, 1 CTA par écran, narration vocale
systématique (TTS), phrases courtes en 2e personne, concept « toucher » démontré à l'écran 2,
personnalisation immédiate (lien émotionnel), pagination non bloquante (retour possible).

---

## 2. Écran de leçon

```
┌─────────────────────────────────────────────────────────────┐
│  ↩ Quitter   Leçon 2 · Les sons « b » et « d »      💎 12   │  ← top, TTS
├─────────────────────────────────────────────────────────────┤
│   [███████████░░░░░░░░░]  Progrès           3 / 8            │  ← progrès doux, jamais de timer
│                                                             │
│              ✋ Consigne (voix + texte) :                     │
│              « Écoute, puis touche le son “d”. »  🔊         │
│                                                             │
│        ┌─────────┐      ┌─────────┐                         │
│        │ 🎵 d     │      │ 🎵 b     │      (2 options,      │
│        └─────────┘      └─────────┘       gros boutons      │
│                                                             │
│      [👂 Réécouter]          → feedback immédiat :          │
│       ✓ « Bravo ! »  (vert doux, sans son strident)        │
│       ≈ « Presque ! C'est “b”, on le barre comme ça »      │
│         (orange doux + reformulation, jamais de rouge)      │
│                                                             │
│            (👾 Compagnon encourage à chaque écran)          │
│                                                             │
│   💡 Astuce : « le “d”, c'est la bosse en arrière » 🔊      │  ← aide contextuelle
└─────────────────────────────────────────────────────────────┘
```

**Choix UX/accessibilité justifiés :** pas de timer ni de croix rouge ; répétitions non
limitées ; distracteurs **pédagogiques** (b/d volontairement confondus pour cibler la
confusion) ; progrès visible sans pression ; compagnon toujours présent ; astuce
mnémotechnique (b/d → bosse).

---

## 3. Tableau de bord parent

```
┌─────────────────────────────────────────────────────────────┐
│  👤 Espace Parent · {Prénom de l'enfant}        [⚙] [🚪]    │
├─────────────────────────────────────────────────────────────┤
│  Cette semaine (sans jargon, phrases courtes) :             │
│                                                             │
│   ⏱️  Temps d'apprentissage :  2 h 15            ▸ détail   │
│   📅  Série en cours :         5 jours                       │
│   🟢  Leçons terminées :       12   (↑ +3 cette semaine)    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🗺️ Progression dans le parcours                     │    │
│  │   [🔤 Lettres ▓▓▓▓▓▓░░░ 65%] → [🔡 Syllabes ▓▓░░... 40%]│   │
│  │   → [📖 Mots ░░░░░░░░░░ 0%]                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  🟢 Points forts            🟠 À renforcer (jamais « fail »)│
│   • Associe bien les sons    • Confond encore « b » et « d »│
│   • Reste concentré          • Mots avec « an/en »          │
│                                                             │
│  📥 [Exporter PDF]   📤 [Exporter CSV]   🗑 [Supprimer]     │
│                                                             │
│  ℹ️ « Ces progrès sont indicatifs. Pour un diagnostic,     │
│      consultez un orthophoniste. »  🔊                       │
└─────────────────────────────────────────────────────────────┘
```

**Choix UX/accessibilité justifiés :** vocabulaire **sans jargon**, points forts/faibles
formulés **positivement** (« à renforcer » plutôt que « erreurs »), exports en un clic,
suppression RGPD visible, **disclaimer éthique** renvoyant vers un professionnel, chiffres
simples et comparatifs doux (↑).
