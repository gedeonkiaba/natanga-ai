<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Services\ReadingSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * MVP0 LexiKids — Modules 2 + 4 : sessions de lecture assistée et récompenses.
 *
 * POST /api/children/{childId}/sessions — enregistre une session (201).
 * GET  /api/children/{childId}/sessions — historique des sessions (200).
 */
class ReadingSessionController extends Controller
{
    public function __construct(private readonly ReadingSessionService $sessions) {}

    /**
     * Enregistre une session et retourne {session, reward, unlocked}.
     *
     * @throws DomainException CHILD_NOT_FOUND (404) si l'enfant est inconnu.
     */
    public function store(Request $request, string $childId): JsonResponse
    {
        return response()->json(
            $this->sessions->store($this->child($childId), $request->all()),
            201,
        );
    }

    /**
     * Historique des sessions, du plus récent au plus ancien.
     *
     * @throws DomainException CHILD_NOT_FOUND (404) si l'enfant est inconnu.
     */
    public function index(Request $request, string $childId): JsonResponse
    {
        return response()->json([
            'sessions' => $this->sessions->index($this->child($childId)),
        ]);
    }

    /** @throws DomainException CHILD_NOT_FOUND (404) si l'enfant est inconnu. */
    private function child(string $childId): Child
    {
        $child = Child::find($childId);

        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        return $child;
    }
}
