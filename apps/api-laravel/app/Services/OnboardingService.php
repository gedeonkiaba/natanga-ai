<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;

/**
 * Erreur d'onboarding (MVP0 LexiKids, module 1) — code métier RFC 7807, statut 422.
 *
 * `App\Domain\DomainException::httpStatus()` ne connaît pas les codes
 * `ONBOARDING_*` (400 par défaut) et le fichier d'origine est figé :
 * on affine donc le statut via cette sous-classe, toujours rendue par le
 * renderer `DomainException` de `bootstrap/app.php` (instanceof respecté).
 */
class OnboardingDomainException extends DomainException
{
    public function httpStatus(): int
    {
        return 422;
    }
}

/**
 * Service d'onboarding enfant (MVP0 LexiKids, module 1).
 * Gère le profil léger (avatar, intérêts) et le niveau de placement
 * ('1' | '2' | '3') issu du diagnostic ou ajusté manuellement.
 */
class OnboardingService
{
    /** Whitelist des intérêts proposés à l'onboarding. */
    public const INTERESTS = ['animaux', 'espace', 'contes', 'dinosaures', 'nature', 'musique'];

    /** Niveaux de placement autorisés. */
    public const LEVELS = ['1', '2', '3'];

    /**
     * Met à jour le profil d'onboarding : avatar (nullable, ≤ 40 caractères —
     * longueur validée en amont, règle `max:40` du contrôleur) et liste
     * d'intérêts (whitelist `INTERESTS`). Sauvegarde l'enfant.
     *
     * @param  array{avatar?: ?string, interests?: ?array<int, mixed>}  $data
     *
     * @throws OnboardingDomainException si un intérêt est hors whitelist (ONBOARDING_INVALID_INTEREST, 422).
     */
    public function updateProfile(Child $child, array $data): Child
    {
        if (array_key_exists('avatar', $data)) {
            $child->avatar = $data['avatar'];
        }

        if (array_key_exists('interests', $data)) {
            if ($data['interests'] === null) {
                $child->interests = null;
            } else {
                foreach ($data['interests'] as $interest) {
                    if (! is_string($interest) || ! in_array($interest, self::INTERESTS, true)) {
                        throw new OnboardingDomainException(
                            'ONBOARDING_INVALID_INTEREST',
                            'intérêt hors whitelist : '.(is_string($interest) ? $interest : gettype($interest)),
                        );
                    }
                }

                $child->interests = array_values($data['interests']);
            }
        }

        $child->save();

        return $child;
    }

    /**
     * Mappe un résultat de diagnostic vers le niveau de placement (pur).
     *
     * @throws OnboardingDomainException si le résultat est inconnu (ONBOARDING_UNKNOWN_RESULT, 422).
     */
    public function attributeLevel(string $diagnosticResult): string
    {
        return match ($diagnosticResult) {
            'decouverte' => '1',
            'progression' => '2',
            'fluide' => '3',
            default => throw new OnboardingDomainException(
                'ONBOARDING_UNKNOWN_RESULT',
                'résultat de diagnostic inconnu : '.$diagnosticResult,
            ),
        };
    }

    /**
     * Applique le niveau dérivé du diagnostic et le persiste.
     *
     * @throws OnboardingDomainException si le résultat est inconnu (ONBOARDING_UNKNOWN_RESULT, 422).
     */
    public function applyDiagnosticLevel(Child $child, string $diagnosticResult): Child
    {
        $child->placement_level = $this->attributeLevel($diagnosticResult);
        $child->save();

        return $child;
    }

    /**
     * Ajuste manuellement le niveau de placement ('1' | '2' | '3').
     *
     * @throws OnboardingDomainException si le niveau est hors 1/2/3 (ONBOARDING_INVALID_LEVEL, 422).
     */
    public function adjustLevel(Child $child, string $level): Child
    {
        if (! in_array($level, self::LEVELS, true)) {
            throw new OnboardingDomainException(
                'ONBOARDING_INVALID_LEVEL',
                'niveau de placement invalide : '.$level,
            );
        }

        $child->placement_level = $level;
        $child->save();

        return $child;
    }
}
