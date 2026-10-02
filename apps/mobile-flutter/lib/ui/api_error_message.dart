import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../api/api_client.dart';
import '../theme/natanga_theme.dart';

/// Message utilisateur (FR, sans jargon) pour une erreur d'API.
///
/// Les codes connus reçoivent une formulation adaptée au parent ; sinon on
/// affiche le titre RFC 7807 du serveur, jamais un détail technique.
String apiErrorMessage(Object error) {
  final apiError = ApiClient.errorOf(error);
  if (apiError != null) {
    switch (apiError.code) {
      case 'ERR_LOGIN':
        return 'Email ou mot de passe incorrect.';
      case 'ERR_NOT_VERIFIED':
        return 'Vérifiez d’abord votre adresse email (lien reçu par email).';
      case 'ERR_UNAUTHENTICATED':
        return 'Votre session a expiré. Reconnectez-vous.';
      case 'ERR_CONSENT_REQUIRED':
        return 'Votre accord parental est nécessaire avant que votre enfant puisse jouer.';
      case 'CHILD_NOT_FOUND':
        return 'Profil enfant introuvable.';
      default:
        return apiError.message;
    }
  }
  if (error is DioException) {
    if (error.response?.statusCode == 429) {
      return 'Trop de tentatives. Patientez une minute puis réessayez.';
    }
    if (error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout) {
      return 'Connexion impossible. Vérifiez votre accès internet.';
    }
  }
  return 'Une erreur est survenue.';
}

/// Bandeau d'erreur accessible (orange doux, jamais rouge — charte Natanga).
class ApiErrorBanner extends StatelessWidget {
  final Object error;
  const ApiErrorBanner({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      liveRegion: true,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: NatangaColors.warning.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          apiErrorMessage(error),
          style: const TextStyle(color: NatangaColors.warningContrast),
        ),
      ),
    );
  }
}
