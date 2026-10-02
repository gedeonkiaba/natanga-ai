/** Messages compréhensibles par un parent pour les codes d'erreur RFC 7807 de l'API. */
const MESSAGES: Record<string, string> = {
  ERR_LOGIN: 'Email ou mot de passe incorrect.',
  ERR_NOT_VERIFIED:
    "Votre adresse email n'est pas encore confirmée. Cliquez sur le lien reçu par email.",
  ERR_UNAUTHENTICATED: 'Votre session a expiré. Merci de vous reconnecter.',
  ERR_REGISTER: 'Impossible de créer ce compte. Essayez de vous connecter.',
  ERR_TOKEN: 'Ce lien de confirmation est invalide ou a expiré. Demandez-en un nouveau.',
  ERR_AGE: "L'application est conçue pour les enfants de 6 à 12 ans.",
  ERR_PARENT: "Confirmez d'abord votre adresse email.",
  ERR_CONSENT_REQUIRED: "Votre accord parental est nécessaire avant que votre enfant puisse lire.",
  CHILD_NOT_FOUND: 'Profil enfant introuvable.',
  ERR_NOT_FOUND: 'Page ou ressource introuvable.',
  RATE_LIMITED: 'Trop de tentatives. Patientez une minute puis réessayez.',
  NETWORK: 'Connexion impossible. Vérifiez votre accès à Internet.',
  VALIDATION: 'Certaines informations sont invalides.',
};

export function messageFor(code: string | undefined, fallback?: string): string {
  if (code && MESSAGES[code]) return MESSAGES[code];
  return fallback ?? 'Une erreur est survenue. Réessayez dans un instant.';
}
