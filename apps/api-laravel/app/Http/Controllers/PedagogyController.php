<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\PedagogyService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Pedagogy', description: 'Arbre de compétences et leçons')]
class PedagogyController extends Controller
{
    public function __construct(private readonly PedagogyService $pedagogy) {}

    #[OA\Get(
        path: '/api/children/{childId}/skill-tree',
        summary: "Arbre de compétences de l'enfant (statuts + déblocage séquentiel)",
        tags: ['Pedagogy'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'Nœuds ordonnés (locked | available | in_progress | mastered)'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
        ]
    )]
    public function skillTree(string $childId): JsonResponse
    {
        return response()->json($this->pedagogy->skillTree($childId));
    }

    #[OA\Get(
        path: '/api/lessons/{id}',
        summary: 'Leçon complète (exercices + items résolus)',
        tags: ['Pedagogy'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'Leçon prête à jouer côté client'),
            new OA\Response(response: 404, description: 'Leçon introuvable (RFC 7807, ERR_NOT_FOUND)'),
        ]
    )]
    public function lesson(string $id): JsonResponse
    {
        return response()->json($this->pedagogy->lesson($id));
    }
}
