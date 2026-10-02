<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Domain\Pedagogy\DiagnosticEngine;
use App\Models\Child;
use App\Services\DiagnosticService;
use App\Services\OnboardingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Diagnostics', description: 'Diagnostic adaptatif — test de positionnement A→E')]
class DiagnosticController extends Controller
{
    public function __construct(
        private readonly DiagnosticService $diagnostics,
        private readonly OnboardingService $onboarding,
    ) {}

    #[OA\Post(
        path: '/api/diagnostics',
        summary: 'Enregistrer un résultat de diagnostic',
        tags: ['Diagnostics'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['childId'],
                properties: [
                    new OA\Property(property: 'childId', type: 'string'),
                    new OA\Property(
                        property: 'scores',
                        type: 'object',
                        description: 'Score 0..1 par épreuve (A..E)',
                        example: ['A' => 0.9, 'B' => 0.8, 'C' => 0.7, 'D' => 0.6, 'E' => 0.6],
                    ),
                    new OA\Property(property: 'speedWpm', type: 'number', example: 65),
                    new OA\Property(property: 'errorCount', type: 'integer', example: 3),
                    new OA\Property(property: 'hesitationCount', type: 'integer', example: 2),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Diagnostic enregistré (niveau + explication)'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807, CHILD_NOT_FOUND)'),
            new OA\Response(response: 422, description: 'Score hors plage [0..1]'),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'childId' => ['required', 'string'],
            'scores' => ['sometimes', 'array'],
            'scores.*' => ['numeric', 'min:0', 'max:1'],
            'speedWpm' => ['nullable', 'numeric', 'min:0'],
            'errorCount' => ['nullable', 'integer', 'min:0'],
            'hesitationCount' => ['nullable', 'integer', 'min:0'],
        ]);

        $scores = $data['scores'] ?? [];
        $unknown = array_diff(array_keys($scores), DiagnosticEngine::LEVELS);
        if ($unknown !== []) {
            throw new DomainException('ERR_SCORES', 'épreuve inconnue : '.implode(', ', $unknown));
        }

        $diagnostic = $this->diagnostics->record(
            (string) $data['childId'],
            $scores,
            isset($data['speedWpm']) ? (float) $data['speedWpm'] : null,
            (int) ($data['errorCount'] ?? 0),
            (int) ($data['hesitationCount'] ?? 0),
        );

        // Module 1 LexiKids — attribution automatique du niveau '1'|'2'|'3'
        // depuis le résultat du diagnostic (le parent peut ensuite ajuster).
        $child = Child::find((string) $data['childId']);
        if ($child !== null && isset($diagnostic['level'])) {
            $child = $this->onboarding->applyDiagnosticLevel($child, (string) $diagnostic['level']);
            $diagnostic['placementLevel'] = $child->placement_level;
        }

        return response()->json($diagnostic, 201);
    }

    #[OA\Get(
        path: '/api/children/{childId}/diagnostics',
        summary: 'Historique des diagnostics (consultable par le parent)',
        tags: ['Diagnostics'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'Diagnostics du plus récent au plus ancien'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
        ]
    )]
    public function history(string $childId): JsonResponse
    {
        return response()->json($this->diagnostics->history($childId));
    }
}
