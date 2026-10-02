<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Models\Reward;
use App\Models\Unlock;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Rewards', description: 'Récompenses et déblocages (gamification bienveillante)')]
class RewardController extends Controller
{
    #[OA\Get(
        path: '/api/children/{childId}/rewards',
        summary: "Récompenses et déblocages de l'enfant",
        tags: ['Rewards'],
        parameters: [new OA\Parameter(name: 'childId', in: 'path', required: true, schema: new OA\Schema(type: 'string'))],
        responses: [
            new OA\Response(response: 200, description: 'Récompenses + déblocages (seuils 3/5/10/20 lectures)'),
            new OA\Response(response: 404, description: 'Enfant introuvable (RFC 7807)'),
        ]
    )]
    public function index(string $childId): JsonResponse
    {
        if (Child::find($childId) === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $rewards = Reward::where('child_id', $childId)
            ->orderBy('created_at')
            ->get()
            ->map(fn (Reward $reward) => [
                'id' => $reward->id,
                'kind' => $reward->kind,
                'amount' => (int) $reward->amount,
                'reason' => $reward->reason,
                'createdAt' => $reward->created_at?->toIso8601String(),
            ])
            ->values();

        $unlocks = Unlock::where('child_id', $childId)
            ->orderBy('unlocked_at')
            ->get()
            ->map(fn (Unlock $unlock) => [
                'kind' => $unlock->kind,
                'key' => $unlock->key,
                'unlockedAt' => $unlock->unlocked_at?->toIso8601String(),
            ])
            ->values();

        return response()->json([
            'rewards' => $rewards,
            'unlocks' => $unlocks,
        ]);
    }
}
