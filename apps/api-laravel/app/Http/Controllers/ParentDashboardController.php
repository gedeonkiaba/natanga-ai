<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Services\ParentDashboardService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'ParentDashboard', description: 'Espace parent — synthèse bienveillante (Module 5 LexiKids)')]
class ParentDashboardController extends Controller
{
    public function __construct(private readonly ParentDashboardService $dashboard) {}

    #[OA\Get(
        path: '/api/parent/dashboard/{childId}',
        summary: 'Tableau de bord parent (jour, totaux, progression, conseils)',
        tags: ['ParentDashboard'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'Synthèse du jour + progression + recommandations'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
        ]
    )]
    public function show(string $childId): JsonResponse
    {
        $child = Child::find($childId);
        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        return response()->json([
            'dashboard' => $this->dashboard->dashboard($child),
        ]);
    }
}
