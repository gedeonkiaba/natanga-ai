<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'GDPR', description: 'Droits RGPD (export / suppression)')]
class GdprController extends Controller
{
    /** Droit d'accès/portabilité — export des données agrégées de l'enfant. */
    #[OA\Get(
        path: '/api/children/{childId}/export',
        summary: 'Exporter les données de l’enfant (droit d’accès/portabilité)',
        tags: ['GDPR'],
        parameters: [
            new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [new OA\Response(response: 200, description: 'Données exportées')]
    )]
    public function export(Request $request, string $childId): JsonResponse
    {
        /** @var Child $child résolu et autorisé par `child.owner` */
        $child = $request->attributes->get('child');

        return response()->json([
            'profile' => [
                'displayName' => $child->display_name,
                'birthYear' => $child->birth_year,
                'ageBand' => $child->age_band,
                'avatar' => $child->avatar,
            ],
            'consents' => $child->consents()->orderBy('version')->get()->map(fn ($c) => [
                'version' => $c->version,
                'status' => $c->status,
                'grantedAt' => $c->granted_at?->toIso8601String(),
                'revokedAt' => $c->revoked_at?->toIso8601String(),
            ]),
            'exportedAt' => now()->toIso8601String(),
        ]);
    }

    /** Droit à l'effacement (cascade), idempotent. */
    #[OA\Delete(
        path: '/api/children/{childId}',
        summary: 'Supprimer les données de l’enfant (droit à l’effacement)',
        tags: ['GDPR'],
        parameters: [
            new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [new OA\Response(response: 200, description: 'Données supprimées (idempotent)')]
    )]
    public function erase(Request $request, string $childId): JsonResponse
    {
        $child = Child::find($childId);

        // Idempotent et anti-énumération : un enfant inexistant ou appartenant à un
        // autre parent est, du point de vue de l'appelant, « déjà effacé ».
        if ($child !== null && $request->user()->can('manage', $child)) {
            $child->delete();
        }

        return response()->json(['erased' => true, 'childId' => $childId]);
    }
}
