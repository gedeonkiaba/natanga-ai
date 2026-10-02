<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\ConsentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Consent', description: 'Consentement parental RGPD/COPPA (grant/deny/revoke)')]
class ConsentController extends Controller
{
    public function __construct(private readonly ConsentService $consent)
    {
    }

    #[OA\Post(
        path: '/api/children/{childId}/consents',
        summary: 'Appliquer une action de consentement',
        tags: ['Consent'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['action'],
                properties: [new OA\Property(property: 'action', type: 'string', enum: ['grant', 'deny', 'revoke'])]
            )
        ),
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 201, description: 'Consentement enregistré (append-only)'),
            new OA\Response(response: 422, description: 'Transition interdite (INVALID_TRANSITION)'),
        ]
    )]
    public function apply(Request $request, string $childId): JsonResponse
    {
        $data = $request->validate(['action' => ['required', 'in:grant,deny,revoke']]);

        $record = $this->consent->apply($childId, $data['action'], [
            'source' => $this->detectSource($request),
            'userAgent' => (string) $request->header('user-agent', 'unknown'),
            'ipPrefix' => $this->truncateIp($request),
        ]);

        return response()->json([
            'id' => $record->id,
            'childId' => $record->child_id,
            'version' => $record->version,
            'status' => $record->status,
            'grantedAt' => $record->granted_at?->toIso8601String(),
            'revokedAt' => $record->revoked_at?->toIso8601String(),
        ], 201);
    }

    #[OA\Get(
        path: '/api/children/{childId}/consents',
        summary: 'Historique append-only des consentements',
        tags: ['Consent'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [new OA\Response(response: 200, description: 'Liste versionnée des consentements')]
    )]
    public function history(string $childId): JsonResponse
    {
        $records = $this->consent->history($childId)->map(fn ($c) => [
            'id' => $c->id,
            'childId' => $c->child_id,
            'version' => $c->version,
            'status' => $c->status,
            'grantedAt' => $c->granted_at?->toIso8601String(),
            'revokedAt' => $c->revoked_at?->toIso8601String(),
        ]);

        return response()->json($records);
    }

    private function detectSource(Request $request): string
    {
        $ua = strtolower((string) $request->header('user-agent'));

        return str_contains($ua, 'natanga-mobile') ? 'mobile' : 'web';
    }

    /** Tronque l'IP au premier octet (minimisation — jamais d'IP complète). */
    private function truncateIp(Request $request): string
    {
        $ip = (string) $request->ip();
        $ip = str_replace('::ffff:', '', $ip);
        $parts = explode('.', $ip);

        return isset($parts[0]) ? $parts[0].'.0.0.0' : '0.0.0.0';
    }
}
