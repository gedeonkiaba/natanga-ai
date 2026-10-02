<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Domain\Gamification\GamificationEngine;
use App\Models\Attempt;
use App\Models\Child;
use App\Models\Exercise;
use App\Models\Progress;
use App\Models\Reward;
use Illuminate\Support\Str;

/**
 * Session de leçon côté serveur (P1, `docs/23` §7) — tâche T4.
 * À chaque tentative :
 *   1. la tente est persistée (métrique d'apprentissage, **jamais** un diagnostic),
 *   2. la gamification bienveillante récompense l'effort comme la réussite,
 *   3. la progression du nœud est recalculée (déblocage séquentiel de l'arbre).
 */
class AttemptService
{
    /** Seuil de maîtrise d'un nœud (aligné sur le placement `@natanga/core` : 0.7). */
    private const MASTERY_THRESHOLD = 0.7;

    /** Nombre minimal de tentatives pour qu'un nœud soit « maîtrisé ». */
    private const MASTERY_MIN_ATTEMPTS = 3;

    public function __construct(private readonly GamificationEngine $gamification) {}

    /**
     * Enregistre une tentative et retourne {attempt, reward, progress}.
     *
     * @param  array<string, mixed>  $data
     * @return array{attempt: array, reward: array, progress: array}
     *
     * @throws DomainException si l'enfant ou l'exercice est inconnu.
     */
    public function submit(array $data): array
    {
        $childId = (string) $data['childId'];

        if (Child::find($childId) === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $exercise = Exercise::find($data['exerciseId']);
        if ($exercise === null) {
            throw new DomainException('ERR_NOT_FOUND', 'exercice introuvable');
        }

        $attempt = Attempt::create([
            'id' => (string) Str::uuid(),
            'child_id' => $childId,
            'exercise_id' => $exercise->id,
            'item_id' => $data['itemId'] ?? null,
            'is_correct' => (bool) $data['isCorrect'],
            'error_kind' => $data['errorKind'] ?? null,
        ]);

        $rewardSpec = $this->gamification->rewardForAnswer((bool) $data['isCorrect']);
        $reward = Reward::create([
            'id' => (string) Str::uuid(),
            'child_id' => $childId,
            'kind' => $rewardSpec['kind'],
            'amount' => $rewardSpec['amount'],
            'reason' => $rewardSpec['reason'],
        ]);

        $progress = $this->updateProgress($childId, $exercise->lesson->node_id);

        return [
            'attempt' => [
                'id' => $attempt->id,
                'childId' => $attempt->child_id,
                'exerciseId' => $attempt->exercise_id,
                'itemId' => $attempt->item_id,
                'isCorrect' => (bool) $attempt->is_correct,
                'errorKind' => $attempt->error_kind,
            ],
            'reward' => [
                'id' => $reward->id,
                'kind' => $reward->kind,
                'amount' => (int) $reward->amount,
                'reason' => $reward->reason,
            ],
            'progress' => [
                'nodeId' => $progress->node_id,
                'status' => $progress->status,
                'masteredScore' => (float) $progress->mastered_score,
            ],
        ];
    }

    /**
     * Recalcule la progression du nœud (invariant bienveillant :
     * une maîtrise acquise n'est jamais retirée).
     */
    private function updateProgress(string $childId, string $nodeId): Progress
    {
        $progress = Progress::firstOrNew(
            ['child_id' => $childId, 'node_id' => $nodeId],
            ['id' => (string) Str::uuid(), 'status' => 'in_progress', 'mastered_score' => 0],
        );

        if ($progress->status !== PedagogyService::STATUS_MASTERED) {
            $stats = Attempt::query()
                ->where('child_id', $childId)
                ->whereHas('exercise.lesson', fn ($query) => $query->where('node_id', $nodeId))
                ->selectRaw('COUNT(*) as total, COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0) as correct')
                ->first();

            $total = (int) ($stats->total ?? 0);
            $correct = (int) ($stats->correct ?? 0);
            $ratio = $total > 0 ? $correct / $total : 0.0;

            $progress->mastered_score = round($ratio, 4);
            $progress->status = ($total >= self::MASTERY_MIN_ATTEMPTS && $ratio >= self::MASTERY_THRESHOLD)
                ? PedagogyService::STATUS_MASTERED
                : PedagogyService::STATUS_IN_PROGRESS;
        }

        $progress->save();

        return $progress;
    }
}
