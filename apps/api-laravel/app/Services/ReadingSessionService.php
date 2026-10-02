<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\Gamification\GamificationEngine;
use App\Models\Child;
use App\Models\ReadingSession;
use App\Models\Reward;
use App\Models\Unlock;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Sessions de lecture assistée (Module 2) et gamification minimale (Module 4).
 *
 * À chaque session **terminée** :
 *   1. étoiles : 1 pour la complétion, +1 si la précision (corrects / lus) ≥ 80 %,
 *   2. récompense `star` persistée ( raison : « session terminée »),
 *   3. déblocages aux seuils 3 / 5 / 10 / 20 lectures du `GamificationEngine`,
 *      annoncés une seule fois (comparaison avec les `Unlock` déjà persistés).
 */
class ReadingSessionService
{
    /** Précision minimale (mots corrects / mots lus) pour la 2ᵉ étoile. */
    private const ACCURACY_BONUS = 0.8;

    /** Motif porté par la récompense de session (contrat M4). */
    private const REWARD_REASON = 'session terminée';

    public function __construct(private readonly GamificationEngine $gamification) {}

    /**
     * Enregistre une session de lecture et retourne {session, reward, unlocked}.
     *
     * @param  array<string, mixed>  $data  duration_sec / words_read / correct_words (≥ 0),
     *                                      completed (bool), lesson_id (nullable).
     * @return array{session: array<string, mixed>, reward: ?array{kind: string, amount: int}, unlocked: array<int, array{kind: string, key: string}>}
     *
     * @throws ValidationException si une mesure est hors plage (HTTP 422).
     */
    public function store(Child $child, array $data): array
    {
        $validated = Validator::make($data, [
            'duration_sec' => ['required', 'integer', 'min:0'],
            'words_read' => ['required', 'integer', 'min:0'],
            'correct_words' => ['required', 'integer', 'min:0'],
            'completed' => ['required', 'boolean'],
            'lesson_id' => ['nullable', 'string'],
        ])->validate();

        $wordsRead = (int) $validated['words_read'];
        $correctWords = (int) $validated['correct_words'];
        $completed = (bool) $validated['completed'];

        // Règle M4 : zéro étoile tant que la session n'est pas terminée.
        $stars = $completed ? $this->starsFor($wordsRead, $correctWords) : 0;

        $session = ReadingSession::create([
            'id' => (string) Str::uuid(),
            'child_id' => $child->id,
            'lesson_id' => $validated['lesson_id'] ?? null,
            'duration_sec' => (int) $validated['duration_sec'],
            'words_read' => $wordsRead,
            'correct_words' => $correctWords,
            'completed' => $completed,
            'stars' => $stars,
        ]);

        if ($stars > 0) {
            Reward::create([
                'id' => (string) Str::uuid(),
                'child_id' => $child->id,
                'kind' => GamificationEngine::KIND_STAR,
                'amount' => $stars,
                'reason' => self::REWARD_REASON,
            ]);
        }

        return [
            'session' => $this->toDto($session),
            'reward' => $stars > 0
                ? ['kind' => GamificationEngine::KIND_STAR, 'amount' => $stars]
                : null,
            'unlocked' => $this->registerUnlocks($child),
        ];
    }

    /**
     * Historique des sessions (KPI parent, Module 5) — du plus récent au plus ancien.
     *
     * @return array<int, array<string, mixed>>
     */
    public function index(Child $child): array
    {
        return ReadingSession::query()
            ->where('child_id', $child->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ReadingSession $session) => $this->toDto($session))
            ->values()
            ->all();
    }

    /** Règle M4 : 1 étoile pour une session terminée, +1 si précision ≥ 80 %. */
    private function starsFor(int $wordsRead, int $correctWords): int
    {
        $accurate = $wordsRead > 0 && ($correctWords / $wordsRead) >= self::ACCURACY_BONUS;

        return 1 + ($accurate ? 1 : 0);
    }

    /**
     * Compare les seuils atteints (lectures terminées) aux `Unlock` déjà persistés
     * et insère uniquement les déblocages nouveaux (contrainte unique child + key).
     *
     * @return array<int, array{kind: string, key: string}> Déblocages nouvellement franchis.
     */
    private function registerUnlocks(Child $child): array
    {
        $readsDone = ReadingSession::query()
            ->where('child_id', $child->id)
            ->where('completed', true)
            ->count();

        $existingKeys = Unlock::where('child_id', $child->id)->pluck('key')->all();

        $newly = [];

        foreach ($this->gamification->unlocksFor($readsDone) as $unlocked) {
            if (in_array($unlocked['key'], $existingKeys, true)) {
                continue;
            }

            Unlock::create([
                'id' => (string) Str::uuid(),
                'child_id' => $child->id,
                'kind' => $unlocked['kind'],
                'key' => $unlocked['key'],
                'unlocked_at' => now(),
            ]);

            $newly[] = $unlocked;
        }

        return $newly;
    }

    /** @return array<string, mixed> */
    private function toDto(ReadingSession $session): array
    {
        return [
            'id' => $session->id,
            'childId' => $session->child_id,
            'lessonId' => $session->lesson_id,
            'durationSec' => (int) $session->duration_sec,
            'wordsRead' => (int) $session->words_read,
            'correctWords' => (int) $session->correct_words,
            'completed' => (bool) $session->completed,
            'stars' => (int) $session->stars,
            'createdAt' => $session->created_at?->toIso8601String(),
        ];
    }
}
