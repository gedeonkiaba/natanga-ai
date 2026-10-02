<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\AttemptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Attempts', description: 'Session de leçon — tentatives et récompenses')]
class AttemptController extends Controller
{
    public function __construct(private readonly AttemptService $attempts) {}

    #[OA\Post(
        path: '/api/attempts',
        summary: 'Enregistrer une tentative (récompense + progression)',
        tags: ['Attempts'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['childId', 'exerciseId', 'isCorrect'],
                properties: [
                    new OA\Property(property: 'childId', type: 'string'),
                    new OA\Property(property: 'exerciseId', type: 'string'),
                    new OA\Property(property: 'itemId', type: 'string', nullable: true),
                    new OA\Property(property: 'isCorrect', type: 'boolean'),
                    new OA\Property(property: 'errorKind', type: 'string', nullable: true, example: 'confusion-b-d'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Tentative enregistrée {attempt, reward, progress}'),
            new OA\Response(response: 404, description: 'Enfant ou exercice introuvable (RFC 7807)'),
            new OA\Response(response: 422, description: 'Corps invalide'),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'childId' => ['required', 'string'],
            'exerciseId' => ['required', 'string'],
            'itemId' => ['nullable', 'string'],
            'isCorrect' => ['required', 'boolean'],
            'errorKind' => ['nullable', 'string', 'max:50'],
        ]);

        return response()->json($this->attempts->submit($data), 201);
    }
}
