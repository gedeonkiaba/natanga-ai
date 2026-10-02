<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;
use App\Models\User;
use App\Domain\Consent\ConsentStateMachine;
use Illuminate\Support\Str;

/**
 * Service de consentement — transposition du `ConsentService` NestJS.
 * La machine à états RGPD/COPPA est ici LA source de vérité.
 */
class ConsentService
{
    public function __construct(private readonly ConsentStateMachine $stateMachine)
    {
    }

    /**
     * Applique une action (grant/deny/revoke) et retourne le consentement créé.
     */
    public function apply(string $childId, string $action, array $ctx): \App\Models\Consent
    {
        $child = Child::find($childId);
        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $latest = \App\Models\Consent::where('child_id', $childId)->orderByDesc('version')->first();
        $from = $latest?->status ?? ConsentStateMachine::PENDING;

        $target = $this->stateMachine->apply($from, $action);

        $now = now();
        $record = \App\Models\Consent::create([
            'id' => $childId.':'.Str::uuid(),
            'child_id' => $childId,
            'version' => $this->nextVersion($childId),
            'status' => $target,
            'granted_at' => $target === ConsentStateMachine::GRANTED ? $now : $latest?->granted_at,
            'revoked_at' => $target === ConsentStateMachine::REVOKED ? $now : null,
            'audit' => [
                'source' => $ctx['source'] ?? 'web',
                'userAgent' => $ctx['userAgent'] ?? 'unknown',
                'ipPrefix' => $ctx['ipPrefix'] ?? '0.0.0.0',
                'timestamp' => $now->toIso8601String(),
            ],
        ]);

        // Invariant C2 : l'accès de l'enfant est dérivé du consentement actif.
        $child->update([
            'status' => ConsentStateMachine::isChildActive($target) ? 'ACTIVE' : 'INACTIVE',
        ]);

        return $record;
    }

    /** Historique append-only. */
    public function history(string $childId): \Illuminate\Database\Eloquent\Collection
    {
        return \App\Models\Consent::where('child_id', $childId)->orderBy('version')->get();
    }

    private function nextVersion(string $childId): int
    {
        $max = \App\Models\Consent::where('child_id', $childId)->max('version');

        return ($max ?? 0) + 1;
    }
}
