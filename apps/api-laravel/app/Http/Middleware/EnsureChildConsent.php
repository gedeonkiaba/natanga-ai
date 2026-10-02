<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Domain\DomainException;
use App\Models\Child;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Garde RGPD/COPPA : aucune activité enfant (collecte ou usage) sans consentement
 * parental actif. S'appuie sur l'invariant C2 : `children.status` est ACTIVE si et
 * seulement si le dernier consentement est GRANTED (cf. ConsentService).
 *
 * Doit être placé APRÈS `child.owner` (qui résout l'enfant).
 */
class EnsureChildConsent
{
    public function handle(Request $request, Closure $next): Response
    {
        $child = $request->attributes->get('child');

        if (! $child instanceof Child) {
            // Mauvais câblage des routes : on échoue fermé.
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        if ($child->status !== 'ACTIVE') {
            throw new DomainException(
                'ERR_CONSENT_REQUIRED',
                'le consentement parental est requis pour cette activité',
            );
        }

        return $next($request);
    }
}
