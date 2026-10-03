<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;
use App\Models\Exercise;
use App\Models\Item;
use App\Models\Lesson;
use App\Models\Progress;
use App\Models\SkillNode;

/**
 * Lecture pédagogique côté serveur (P1, `docs/23` §5) — tâche T4.
 * - Arbre de compétences : statuts dérivés de la progression + déblocage
 *   séquentiel (`unlocked_when` = nœuds précédents à maîtriser).
 * - Leçon détaillée : exercices + items résolus (prêts pour l'écran Flutter).
 */
class PedagogyService
{
    public const STATUS_LOCKED = 'locked';

    public const STATUS_AVAILABLE = 'available';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_MASTERED = 'mastered';

    /**
     * Arbre de compétences d'un enfant, dans l'ordre de progression.
     *
     * @return array{childId: string, nodes: array<int, array<string, mixed>>}
     */
    public function skillTree(string $childId): array
    {
        if (Child::find($childId) === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $progressByNode = Progress::where('child_id', $childId)
            ->get()
            ->keyBy('node_id');

        $nodes = SkillNode::with('lessons')->orderBy('order')->get();

        $nodesDto = [];
        $prevMastered = 0;

        foreach ($nodes as $node) {
            $progress = $progressByNode->get($node->id);
            $nodesDto[] = $this->nodeDto($node, $progress, $prevMastered);

            if ($progress?->status === self::STATUS_MASTERED) {
                $prevMastered++;
            }
        }

        return ['childId' => $childId, 'nodes' => $nodesDto];
    }

    /**
     * Leçon complète (contenu, exercices, items) — source unique pour le client.
     *
     * @return array<string, mixed>
     */
    public function lesson(string $lessonId): array
    {
        $lesson = Lesson::with('exercises')->find($lessonId);
        if ($lesson === null) {
            throw new DomainException('ERR_NOT_FOUND', 'leçon introuvable');
        }

        // Résolution en une seule requête (items référencés par les params).
        $allItemIds = $lesson->exercises
            ->flatMap(fn (Exercise $exercise) => $exercise->params['itemIds'] ?? [])
            ->unique()
            ->all();
        $itemsById = Item::whereIn('id', $allItemIds)->get()->keyBy('id');

        $exercises = $lesson->exercises
            ->map(function (Exercise $exercise) use ($itemsById) {
                $params = $exercise->params ?? [];
                $itemIds = array_values($params['itemIds'] ?? []);

                return [
                    'id' => $exercise->id,
                    'type' => $exercise->type,
                    'order' => (int) $exercise->order,
                    'params' => $params,
                    'items' => $itemsById
                        ->only($itemIds)
                        ->map(fn (Item $item) => $this->itemDto($item))
                        ->values(),
                ];
            })
            ->values();

        return [
            'id' => $lesson->id,
            'nodeId' => $lesson->node_id,
            'title' => $lesson->title,
            'objective' => $lesson->objective,
            'kind' => $lesson->kind,
            'durationMin' => (int) $lesson->duration_min,
            'ageMin' => $lesson->age_min,
            'text' => $lesson->text,
            'phonemes' => $lesson->phonemes,
            'order' => (int) $lesson->order,
            'exercises' => $exercises,
        ];
    }

    /** @return array<string, mixed> */
    private function nodeDto(SkillNode $node, ?Progress $progress, int $prevMastered): array
    {
        $status = match (true) {
            $progress?->status === self::STATUS_MASTERED => self::STATUS_MASTERED,
            $progress !== null => self::STATUS_IN_PROGRESS,
            $prevMastered >= (int) $node->unlocked_when => self::STATUS_AVAILABLE,
            default => self::STATUS_LOCKED,
        };

        return [
            'id' => $node->id,
            'level' => $node->level,
            'title' => $node->title,
            'order' => (int) $node->order,
            'unlockedWhen' => (int) $node->unlocked_when,
            'status' => $status,
            'masteredScore' => $progress !== null ? (float) $progress->mastered_score : 0.0,
            'lessons' => $node->lessons
                ->sortBy('order')
                ->map(fn (Lesson $lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'kind' => $lesson->kind,
                    'durationMin' => (int) $lesson->duration_min,
                    'order' => (int) $lesson->order,
                ])
                ->values(),
        ];
    }

    /** @return array<string, mixed> */
    private function itemDto(Item $item): array
    {
        return [
            'id' => $item->id,
            'label' => $item->label,
            'type' => $item->type,
            'phoneme' => $item->phoneme,
            'syllables' => $item->syllables,
            'audioUrl' => $item->audio_url,
        ];
    }
}
