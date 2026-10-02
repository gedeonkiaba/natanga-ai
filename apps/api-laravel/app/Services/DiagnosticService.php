<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Domain\Pedagogy\DiagnosticEngine;
use App\Models\Child;
use App\Models\Diagnostic;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Service de diagnostic adaptatif (P1, `docs/23` §4) — tâche T4.
 * Reçoit les scores par épreuve A→E, les persiste et dérive le niveau
 * produit (découverte | progression | fluide) via le `DiagnosticEngine`.
 */
class DiagnosticService
{
    public function __construct(private readonly DiagnosticEngine $engine) {}

    /**
     * Enregistre un diagnostic et retourne son DTO (avec explication lisible).
     *
     * @param  array<string, float>  $scores  Carte épreuve ("A".."E") → score 0..1.
     *
     * @throws DomainException si l'enfant est inconnu (CHILD_NOT_FOUND).
     */
    public function record(
        string $childId,
        array $scores,
        ?float $speedWpm,
        int $errorCount,
        int $hesitationCount,
    ): array {
        $this->assertChild($childId);

        $result = $this->engine->computeLevel($scores);

        $diagnostic = Diagnostic::create([
            'id' => (string) Str::uuid(),
            'child_id' => $childId,
            'level_result' => $result['level'],
            'score' => $result['score'],
            'speed_wpm' => $speedWpm,
            'error_count' => $errorCount,
            'hesitation_count' => $hesitationCount,
            'created_at' => now(),
        ]);

        return $this->toDto($diagnostic) + ['explanation' => $result['explanation']];
    }

    /**
     * Historique rejouable/consultable (parent, M5) — du plus récent au plus ancien.
     *
     * @return Collection<int, array>
     */
    public function history(string $childId): Collection
    {
        $this->assertChild($childId);

        return Diagnostic::where('child_id', $childId)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Diagnostic $diagnostic) => $this->toDto($diagnostic))
            ->values();
    }

    /** @return array<string, mixed> */
    private function toDto(Diagnostic $diagnostic): array
    {
        return [
            'id' => $diagnostic->id,
            'childId' => $diagnostic->child_id,
            'level' => $diagnostic->level_result,
            'score' => (float) $diagnostic->score,
            'speedWpm' => $diagnostic->speed_wpm !== null ? (float) $diagnostic->speed_wpm : null,
            'errorCount' => (int) $diagnostic->error_count,
            'hesitationCount' => (int) $diagnostic->hesitation_count,
            'createdAt' => $diagnostic->created_at?->toIso8601String(),
        ];
    }

    private function assertChild(string $childId): void
    {
        if (Child::find($childId) === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }
    }
}
