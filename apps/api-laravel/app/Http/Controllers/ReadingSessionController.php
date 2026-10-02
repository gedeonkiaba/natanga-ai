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
            $this->sessions->store($this->child($childId), $this->normalize($request->all())),
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

    /**
     * Accepte le corps en camelCase (contrat documenté, comme les autres routes)
     * ou en snake_case (clients historiques) ; le snake_case l'emporte s'il est présent.
     *
     * @param  array<string, mixed>  $body
     * @return array<string, mixed>
     */
    private function normalize(array $body): array
    {
        $aliases = [
            'durationSec' => 'duration_sec',
            'wordsRead' => 'words_read',
            'correctWords' => 'correct_words',
            'lessonId' => 'lesson_id',
        ];

        foreach ($aliases as $camel => $snake) {
            if (array_key_exists($camel, $body) && ! array_key_exists($snake, $body)) {
                $body[$snake] = $body[$camel];
            }
        }

        return $body;
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
