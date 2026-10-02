/// DTO Dart — miroir des entités de l'API Laravel (`apps/api-laravel`).
///
/// Ces modèles sont des **reflets** du contrat API, pas des sources de logique.
library;

/// Compte parent (titulaire).
class User {
  final String id;
  final String email;
  final String role;
  final String status;

  const User({required this.id, required this.email, required this.role, required this.status});

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] as String,
        email: json['email'] as String,
        role: json['role'] as String,
        status: json['status'] as String,
      );
}

/// Compte parent connecté — réponse de `GET /api/auth/me`.
class ParentAccount {
  final String userId;
  final String email;
  final String status;

  const ParentAccount({required this.userId, required this.email, required this.status});

  factory ParentAccount.fromJson(Map<String, dynamic> json) => ParentAccount(
        userId: json['userId'] as String,
        email: json['email'] as String,
        status: json['status'] as String,
      );
}

/// Réponse de `POST /api/auth/login` (le jeton n'est visible qu'une fois).
class LoginResult {
  final String token;
  final String userId;
  final int expiresInDays;

  const LoginResult({required this.token, required this.userId, required this.expiresInDays});

  factory LoginResult.fromJson(Map<String, dynamic> json) => LoginResult(
        token: json['token'] as String,
        userId: json['userId'] as String,
        expiresInDays: (json['expiresInDays'] as num?)?.toInt() ?? 30,
      );
}

/// Profil enfant.
class Child {
  final String id;
  final String userId;
  final String displayName;
  final int birthYear;
  final String? avatar;
  final String ageBand;
  final String status;

  const Child({
    required this.id,
    required this.userId,
    required this.displayName,
    required this.birthYear,
    this.avatar,
    required this.ageBand,
    required this.status,
  });

  /// Consentement parental accordé : l'enfant peut utiliser l'application.
  bool get hasConsent => status == 'ACTIVE';

  /// Accepte le DTO camelCase (`POST /children`) comme le modèle brut
  /// snake_case (`GET /children`, `GET /children/{id}`).
  factory Child.fromJson(Map<String, dynamic> json) => Child(
        id: json['id'] as String,
        userId: (json['userId'] ?? json['user_id']) as String,
        displayName: (json['displayName'] ?? json['display_name']) as String,
        birthYear: ((json['birthYear'] ?? json['birth_year']) as num).toInt(),
        avatar: json['avatar'] as String?,
        ageBand: (json['ageBand'] ?? json['age_band']) as String,
        status: json['status'] as String,
      );
}

/// Enregistrement de consentement.
class Consent {
  final String id;
  final String childId;
  final int version;
  final String status;
  final String? grantedAt;
  final String? revokedAt;

  const Consent({
    required this.id,
    required this.childId,
    required this.version,
    required this.status,
    this.grantedAt,
    this.revokedAt,
  });

  factory Consent.fromJson(Map<String, dynamic> json) => Consent(
        id: json['id'] as String,
        childId: json['childId'] as String,
        version: json['version'] as int,
        status: json['status'] as String,
        grantedAt: json['grantedAt'] as String?,
        revokedAt: json['revokedAt'] as String?,
      );
}
