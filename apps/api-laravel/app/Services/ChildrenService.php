<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Service de gestion des profils enfants — transposition du `ChildrenService` NestJS.
 * Garde-fou COPPA : âge hors 6-12 ans rejeté.
 */
class ChildrenService
{
    public function create(string $userId, string $displayName, int $birthYear): Child
    {
        $parent = User::find($userId);
        if ($parent === null || $parent->status !== 'ACTIVE') {
            throw new DomainException('ERR_PARENT', 'compte parent introuvable ou non vérifié');
        }

        $ageBand = $this->deriveAgeBand($birthYear);
        if ($ageBand === null) {
            throw new DomainException('ERR_AGE', 'ce contenu s’adresse aux enfants de 6 à 12 ans');
        }

        return Child::create([
            'id' => Str::uuid(),
            'user_id' => $userId,
            'display_name' => $displayName,
            'birth_year' => $birthYear,
            'age_band' => $ageBand,
            'status' => 'INACTIVE',
        ]);
    }

    /** Dérive la tranche d'âge (6-8 | 9-12) depuis l'année de naissance. */
    private function deriveAgeBand(int $birthYear, ?int $referenceYear = null): ?string
    {
        $age = ($referenceYear ?? (int) date('Y')) - $birthYear;
        if ($age >= 6 && $age <= 8) {
            return '6-8';
        }
        if ($age >= 9 && $age <= 12) {
            return '9-12';
        }

        return null;
    }
}
