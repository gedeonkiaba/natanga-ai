<?php

declare(strict_types=1);

namespace App\Domain\Consent;

use InvalidArgumentException;

/**
 * Machine à états du consentement — transposition fidèle de
 * `packages/core/src/consent/index.ts` (spec Lot C §3).
 *
 * États : PENDING → GRANTED | DENIED
 *          GRANTED → REVOKED | EXPIRED
 *          REVOKED → GRANTED (nouvelle version)
 *          EXPIRED → GRANTED
 *          DENIED  → GRANTED
 *
 * Chaque transition produit un NOUVEL enregistrement append-only ;
 * on n'écrase jamais un historique.
 */
final class ConsentStateMachine
{
    public const PENDING = 'PENDING';
    public const GRANTED = 'GRANTED';
    public const REVOKED = 'REVOKED';
    public const EXPIRED = 'EXPIRED';
    public const DENIED = 'DENIED';

    /** @var array<string, string[]> Transitions autorisées. */
    private const TRANSITIONS = [
        self::PENDING => [self::GRANTED, self::DENIED],
        self::GRANTED => [self::REVOKED, self::EXPIRED],
        self::REVOKED => [self::GRANTED],
        self::EXPIRED => [self::GRANTED],
        self::DENIED => [self::GRANTED],
    ];

    /** @var array<string, string> Action → état cible. */
    private const ACTION_TO_TARGET = [
        'grant' => self::GRANTED,
        'deny' => self::DENIED,
        'revoke' => self::REVOKED,
        'expire' => self::EXPIRED,
    ];

    /**
     * Applique une action depuis un état et retourne l'état cible.
     *
     * @throws InvalidArgumentException si la transition est illégale.
     */
    public function apply(string $from, string $action): string
    {
        $target = self::ACTION_TO_TARGET[$action] ?? null;
        if ($target === null) {
            throw new InvalidArgumentException("Action inconnue : {$action}");
        }

        $allowed = self::TRANSITIONS[$from] ?? [];
        if (! in_array($target, $allowed, true)) {
            throw new InvalidArgumentException("Transition interdite : {$from} → {$target}");
        }

        return $target;
    }

    /** Indique si une transition est autorisée. */
    public function canTransition(string $from, string $to): bool
    {
        return in_array($to, self::TRANSITIONS[$from] ?? [], true);
    }

    /** Un enfant est « utilisable » uniquement si le consentement est GRANTED. */
    public static function isChildActive(string $status): bool
    {
        return $status === self::GRANTED;
    }
}
