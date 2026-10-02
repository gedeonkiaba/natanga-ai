<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Events', description: 'Événements produit privacy-first (Module 5 LexiKids)')]
class EventController extends Controller
{
    /** Codes métier qui se traduisent par un 422 (RFC 7807). */
    private const INVALID_CODES = ['EVENT_INVALID_NAME', 'EVENT_INVALID_PROPS'];

    public function __construct(private readonly EventService $events) {}

    #[OA\Post(
        path: '/api/children/{childId}/events',
        summary: 'Enregistrer un événement produit (aucun PII)',
        tags: ['Events'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(
                        property: 'name',
                        type: 'string',
                        enum: EventService::ALLOWED_EVENTS,
                        description: 'Nom d’événement (liste blanche)',
                        example: 'help_requested',
                    ),
                    new OA\Property(property: 'props', type: 'object', description: 'Propriétés ≤ 2000 caractères encodés, sans PII'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Événement enregistré'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
            new OA\Response(response: 422, description: 'Nom hors liste blanche (EVENT_INVALID_NAME)'),
        ]
    )]
    public function store(Request $request, string $childId): JsonResponse
    {
        $child = $this->child($childId);

        $data = $request->validate([
            'name' => ['required', 'string'],
            'props' => ['nullable', 'array'],
        ]);

        try {
            $event = $this->events->store($child, $data);
        } catch (DomainException $e) {
            if (! in_array($e->errorCode, self::INVALID_CODES, true)) {
                throw $e;
            }

            return $this->unprocessable($e);
        }

        return response()->json([
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'createdAt' => $event->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    /** Rendu RFC 7807 pour un événement refusé (422, code métier stable). */
    private function unprocessable(DomainException $e): JsonResponse
    {
        return response()->json([
            'type' => 'about:blank',
            'title' => $e->getMessage(),
            'status' => 422,
            'code' => $e->errorCode,
        ], 422);
    }

    private function child(string $childId): Child
    {
        $child = Child::find($childId);
        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        return $child;
    }
}
