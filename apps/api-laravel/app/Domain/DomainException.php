<?php

declare(strict_types=1);

namespace App\Domain;

use RuntimeException;

/**
 * Erreur de domaine métier — porte un code stable (string) pour la sérialisation HTTP.
 * Équivalent de `DomainError`/`DomainAuthError` côté NestJS.
 *
 * Note : la propriété `$code` de la classe parente `Exception` est un `int` réservé ;
 * on utilise donc `errorCode` (string) pour le code métier RFC 7807.
 */
class DomainException extends RuntimeException
{
    public function __construct(
        public readonly string $errorCode,
        string $message,
    ) {
        parent::__construct($message);
    }

    /**
     * Statut HTTP associé au code métier (contrat RFC 7807, miroir du
     * `mapToHttp` du `DomainExceptionFilter` NestJS).
     */
    public function httpStatus(): int
    {
        return match ($this->errorCode) {
            'CHILD_NOT_FOUND', 'ERR_NOT_FOUND' => 404,
            'ERR_FORBIDDEN', 'ERR_CONSENT_REQUIRED', 'ERR_NOT_VERIFIED' => 403,
            'ERR_AGE', 'INVALID_TRANSITION', 'ERR_PARENT' => 422,
            'ERR_REGISTER', 'ERR_TOKEN', 'ERR_LOGIN', 'ERR_UNAUTHENTICATED' => 401,
            default => 400,
        };
    }
}
