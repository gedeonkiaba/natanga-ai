<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Domain\DomainException;
use App\Models\Child;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

/**
 * Vérifie que l'enfant ciblé appartient au parent authentifié (ChildPolicy::manage).
 *
 * L'identifiant est lu, dans l'ordre : paramètre de route `childId`, puis `id`,
 * puis champ `childId` du corps (routes POST /diagnostics, /attempts).
 *
 * Anti-énumération : un enfant inexistant ET un enfant d'un autre parent renvoient
 * la même réponse 404 CHILD_NOT_FOUND.
 *
 * L'enfant résolu est exposé via `$request->attributes->get('child')`.
 */
class EnsureChildOwnership
{
    public function handle(Request $request, Closure $next): Response
    {
        $route = $request->route();
        $childId = $route?->parameter('childId') ?? $route?->parameter('id') ?? $request->input('childId');

        $child = is_string($childId) && $childId !== '' ? Child::find($childId) : null;
        $user = $request->user();

        if ($child === null || $user === null || Gate::forUser($user)->denies('manage', $child)) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $request->attributes->set('child', $child);

        return $next($request);
    }
}
