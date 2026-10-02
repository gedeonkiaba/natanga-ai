# Backlog produit priorisé — Natanga

**Légende :** P0 = MVP must · P1 = MVP should · P2 = Phase 2+ · (E) effort S/M/L/XL

| # | Priorité | User story | Critères d'acceptation |
|---|---|---|---|
| US-01 | P0 (S) | En tant que **parent**, je veux créer un compte et donner mon **consentement** afin de garantir une utilisation conforme RGPD/COPPA. | Consentement explicite enregistré ; refus bloque le compte enfant ; consentement révocable ; journal d'audit. |
| US-02 | P0 (S) | En tant qu'**enfant**, je veux avoir un profil dédié (avatar, âge) afin de vivre une expérience adaptée. | Profil lié au compte adulte ; choix d'avatar ; âge détermine l'univers graphique. |
| US-03 | P0 (S) | En tant qu'**enfant**, je veux un **onboarding ≤ 3 écrans** afin de démarrer sans surcharge cognitive. | 3 écrans max ; narration vocale ; aucun texte long. |
| US-04 | P0 (M) | En tant qu'**enfant**, je veux un **test de positionnement** afin de démarrer au bon niveau. | Test adaptatif court ; place dans l'arbre ; rejouable ; résultat explicable au parent. |
| US-05 | P0 (L) | En tant qu'**enfant**, je veux un **arbre de compétences niveau 1** (lettres→syllabes→mots simples) afin de visualiser ma progression. | 5 niveaux visibles ; déblocage séquentiel ; progression persistée. |
| US-06 | P0 (M) | En tant qu'**enfant**, je veux des **leçons de 5–10 min** afin de rester concentré et motivé. | Durée bornée ; sauvegarde d'état en sortie de leçon. |
| US-07 | P0 (M) | En tant qu'**enfant**, je veux associer un **son à un graphème** (audio + visuel) afin de renforcer le décodage. | Feedback audio immédiat ; répétition possible ; TTS systématique. |
| US-08 | P0 (M) | En tant qu'**enfant**, je veux **reconnaître des mots** (QCM / glisser-déposer) afin de consolider la lecture. | ≥ 4 distracteurs bienveillants ; erreur → reformulation sans pénalité. |
| US-09 | P0 (M) | En tant qu'**enfant**, je veux un **système de vies/streak adouci** afin de rester motivé sans anxiété. | Pas de blocage ; encouragement systématique ; streak ne se perd jamais brutalement. |
| US-10 | P0 (S) | En tant qu'**enfant**, je veux gagner des **gemmes/badges pour l'effort** afin d'être récompensé même en cas d'erreur. | Récompense d'effort traçable ; badge décerné à la persévérance. |
| US-11 | P0 (M) | En tant qu'**enfant**, je veux un **personnage compagnon** personnalisable afin de créer un lien émotionnel. | Avatar modifiable ; réactions positives ; univers lié à l'âge. |
| US-12 | P0 (M) | En tant qu'**enfant**, je veux une **révision espacée (SRS)** afin de consolider durablement. | Rappels programmés ; échéances adaptées aux erreurs. |
| US-13 | P0 (M) | En tant qu'**enfant**, je veux les **consignes en audio (TTS)** et une **police adaptée** afin de lire sans frein. | TTS sur 100 % consignes ; OpenDyslexic/Lexend ; taille/contraste réglables. |
| US-14 | P0 (S) | En tant que **parent**, je veux un **tableau de bord** (temps, progrès, points forts/faibles) afin de suivre sans jargon. | Indicateurs clairs ; vocabulaire accessible ; actualisation quotidienne. |
| US-15 | P0 (S) | En tant que **parent**, je veux **consulter/supprimer les données** de mon enfant afin de respecter le RGPD. | Export et suppression en un clic ; délai < 30 jours garanti. |
| US-16 | P1 (M) | En tant qu'**enfant**, je veux une **dictée progressive** (mots puis phrases) afin de travailler l'orthographe. | Difficulté croissante ; feedback phonétique visuel. |
| US-17 | P1 (M) | En tant qu'**enseignant/ortho**, je veux **assigner des leçons** afin de cibler les besoins. | Assignation individuelle/collective ; l'enfant voit les leçons assignées. |
| US-18 | P1 (M) | En tant qu'**enseignant/ortho**, je veux un **suivi de groupe** afin d'identifier les élèves en difficulté. | Vue groupe ; indicateurs comparables ; alerte douce. |
| US-19 | P1 (S) | En tant qu'**adulte**, je veux **exporter PDF/CSV** des progrès afin de partager avec l'équipe. | Export fiable ; format lisible ; données agrégées. |
| US-20 | P1 (M) | En tant qu'**enfant**, je veux une **adaptation dynamique de difficulté** afin de rester dans ma zone proximale. | Difficulté ajustée selon le taux d'erreur ; jamais d'échec bloquant. |
| US-21 | P1 (M) | En tant qu'**enfant**, je veux travailler **hors-ligne** (leçons téléchargeables) afin de progresser partout. | Téléchargement ; résolution des conflits à la reconnexion. |
| US-22 | P1 (S) | En tant qu'**utilisateur**, je veux un **mode sombre** et un **contraste ajustable** afin de lire confortablement. | Réglages persistants ; conforme WCAG AA. |
| US-23 | P1 (M) | En tant qu'**enfant**, je veux un **feedback positif immédiat** (animations courtes, sons doux) afin de rester engagé. | Animations < 500 ms ; sons désactivables ; pas de rouge agressif (orange/jaune). |
| US-24 | P2 (L) | En tant qu'**enfant**, je veux une **lecture à voix haute (ASR)** avec feedback phonétique afin de travailler la fluence. | Reconnaissance française ; feedback phonème précis ; aspect non bloquant. |
| US-25 | P2 (L) | En tant qu'**enfant**, je veux une **écriture manuscrite** (reconnaissance de tracé) sur tablette afin de travailler le geste. | Reconnaissance de tracé ; tolérance aux tracés imparfaits. |
| US-26 | P2 (M) | En tant qu'**enfant**, je veux des **recommandations personnalisées** afin de cibler mes lacunes (b/d, p/q, inversions). | Détection des confusions ; suggestions d'exercices ciblés. |
| US-27 | P2 (M) | En tant qu'**enseignant/ortho**, je veux un **espace pro complet** (groupes, rapports) afin de piloter l'accompagnement. | Gestion multi-groupes ; rapports périodiques. |
| US-28 | P2 (M) | En tant qu'**enfant**, je veux un **multijoueur coopératif** (pas compétitif) afin de progresser avec mes pairs. | Coopération bienveillante ; aucun classement public. |
| US-29 | P2 (L) | En tant qu'**utilisateur**, je veux un **contenu 13–16 ans** (interface mature) afin de ne pas être infantilisé. | Univers graphique dédié ; ton non infantilisant. |
| US-30 | P2 (M) | En tant que **responsable**, je veux un **analytics privacy-first** afin de suivre l'usage sans tracking publicitaire. | Aucun cookie publicitaire ; agrégation/anonymisation ; transparence. |
| US-31 | Transverse (M) | En tant que **développeur**, je veux un **design system dédié** (couleurs non saturées, tokens) afin de garantir cohérence et accessibilité. | Tokens documentés ; composants testés ; contrastes AA par défaut. |
| US-32 | Transverse (L) | En tant qu'**équipe**, je veux une **CI/CD + tests** afin de garantir qualité et non-régression accessibilité. | Tests unitaires + intégration ; lint a11y en CI ; coverage cible. |
