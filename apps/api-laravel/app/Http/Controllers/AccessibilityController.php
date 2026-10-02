<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Services\AccessibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Accessibility', description: 'Réglages d’accessibilité (Module 2 LexiKids)')]
class AccessibilityController extends Controller
{
    public function __construct(private readonly AccessibilityService $accessibility) {}

    #[OA\Get(
        path: '/api/children/{childId}/settings',
        summary: 'Réglages d’accessibilité de l’enfant',
        tags: ['Accessibility'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'Réglages effectifs (défauts si l’enfant n’a rien choisi)'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
        ]
    )]
    public function show(string $childId): JsonResponse
    {
        return response()->json([
            'settings' => $this->accessibility->show($this->child($childId)),
        ]);
    }

    #[OA\Patch(
        path: '/api/children/{childId}/settings',
        summary: 'Modifier les réglages d’accessibilité (fusion partielle)',
        tags: ['Accessibility'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'voiceSpeed', type: 'number', description: '0.5 à 1.5', example: 1.0),
                    new OA\Property(property: 'syllableColoring', type: 'boolean', example: true),
                    new OA\Property(property: 'fontFamily', type: 'string', example: 'system', enum: ['system', 'dyslexic', 'lexend']),
                    new OA\Property(property: 'fontScale', type: 'number', description: '0.8 à 2.0', example: 1.0),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Réglages persistés'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
            new OA\Response(response: 422, description: 'Réglage hors plage (ACCESSIBILITY_INVALID_SETTING)'),
        ]
    )]
    public function update(Request $request, string $childId): JsonResponse
    {
        $child = $this->child($childId);

        try {
            $child = $this->accessibility->update($child, $request->all());
        } catch (DomainException $e) {
            if ($e->errorCode !== 'ACCESSIBILITY_INVALID_SETTING') {
                throw $e;
            }

            return $this->unprocessable($e);
        }

        return response()->json([
            'settings' => $this->accessibility->show($child),
        ]);
    }

    /** Rendu RFC 7807 pour un réglage refusé (422, code métier stable). */
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
