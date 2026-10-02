<?php

declare(strict_types=1);

namespace App\Domain\Gamification;

/**
 * Gamification bienveillante — récompense de l'effort, pas seulement de la réussite.
 * Transposition étendue de `packages/core/src/rewards/index.ts` (US-09 / US-10).
 *
 * Ajouts P1 (`docs/23` §7) :
 *   - kinds `star` / `avatar` en plus de `gems` / `badge` / `effort`.
 *   - seuils de déblocage 3 / 5 / 10 / 20 lectures.
 */
final class GamificationEngine
{
    public const KIND_GEMS = 'gems';
    public const KIND_BADGE = 'badge';
    public const KIND_EFFORT = 'effort';
    public const KIND_STAR = 'star';
    public const KIND_AVATAR = 'avatar';

    /** Gemmes gagnées selon la réussite / l'effort. */
    public const GEMS_SUCCESS = 10;
    public const GEMS_EFFORT = 5;

    /**
     * Seuils de déblocage (cahier des charges §13).
     *
     * @var array<int, array<string>> Chaque seuil → [kind, key].
     */
    public const UNLOCKS = [
        3 => ['star', 'star-3-lectures'],
        5 => ['badge', 'badge-5-lectures'],
        10 => ['avatar', 'avatar-10-lectures'],
        20 => ['badge', 'badge-20-lectures'],
    ];

    /**
     * Calcule la récompense d'une réponse (bienveillante : l'effort est toujours récompensé).
     *
     * @return array{kind: string, amount: int, reason: string}
     */
    public function rewardForAnswer(bool $isCorrect): array
    {
        if ($isCorrect) {
            return ['kind' => self::KIND_GEMS, 'amount' => self::GEMS_SUCCESS, 'reason' => 'réussite'];
        }

        return ['kind' => self::KIND_EFFORT, 'amount' => self::GEMS_EFFORT, 'reason' => 'effort fourni'];
    }

    /**
     * Retourne les déblocages atteints à un nombre de lectures donné.
     *
     * @return array<int, array{kind: string, key: string}> Déblocages franchis (seuil ≤ readsDone).
     */
    public function unlocksFor(int $readsDone): array
    {
        $unlocked = [];

        foreach (self::UNLOCKS as $threshold => $reward) {
            if ($readsDone >= $threshold) {
                $unlocked[$threshold] = ['kind' => $reward[0], 'key' => $reward[1]];
            }
        }

        return $unlocked;
    }

    /**
     * Les déblocages **nouvellement** atteints en passant de $previousReads à $currentReads.
     *
     * @return array<int, array{kind: string, key: string}>
     */
    public function newlyUnlocked(int $previousReads, int $currentReads): array
    {
        $new = [];

        foreach (self::UNLOCKS as $threshold => $reward) {
            if ($currentReads >= $threshold && $previousReads < $threshold) {
                $new[$threshold] = ['kind' => $reward[0], 'key' => $reward[1]];
            }
        }

        return $new;
    }

    /**
     * Streak adouci : un jour manqué décrémente doucement, jamais de remise à zéro brutale.
     */
    public function softenStreak(int $currentStreak, int $missedDays): int
    {
        if ($missedDays <= 0) {
            return $currentStreak;
        }

        return max(0, $currentStreak - $missedDays);
    }
}
