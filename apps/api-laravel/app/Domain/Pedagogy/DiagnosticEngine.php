<?php

declare(strict_types=1);

namespace App\Domain\Pedagogy;

use InvalidArgumentException;

/**
 * Diagnostic adaptatif — épreuves A→E du cahier des charges (§4 de `docs/23`).
 *
 * Épreuves :
 *   A. reconnaissance de lettres
 *   B. lecture syllabique
 *   C. mots fréquents
 *   D. pseudo-mots
 *   E. phrase simple
 *
 * Résultat (vocabulaire produit) : `decouverte` | `progression` | `fluide`.
 * L'algorithme est **déterministe et explicable** (seuil de maîtrise, pondération).
 */
final class DiagnosticEngine
{
    public const DECOUVERTE = 'decouverte';
    public const PROGRESSION = 'progression';
    public const FLUIDE = 'fluide';

    /** Niveaux acceptés dans l'ordre croissant (A → E). */
    public const LEVELS = ['A', 'B', 'C', 'D', 'E'];

    /**
     * Poids de chaque épreuve dans le score global.
     * D/E (pseudo-mots, phrase) pèsent davantage : plus discriminants.
     *
     * @var array<string, float>
     */
    private const WEIGHTS = [
        'A' => 1.0,
        'B' => 1.0,
        'C' => 1.0,
        'D' => 1.5,
        'E' => 1.5,
    ];

    /** Seuils de dérivation du niveau (score global 0..1). */
    private const FLUIDE_THRESHOLD = 0.8;
    private const PROGRESSION_THRESHOLD = 0.5;

    /**
     * Calcule le niveau résultant à partir des scores par épreuve.
     *
     * @param array<string, float> $scores Carte épreuve ("A".."E") → score 0..1.
     *
     * @return array{level: string, score: float, explanation: string}
     *
     * @throws InvalidArgumentException si une épreuve est inconnue ou un score hors plage.
     */
    public function computeLevel(array $scores): array
    {
        if ($scores === []) {
            return [
                'level' => self::DECOUVERTE,
                'score' => 0.0,
                'explanation' => 'Aucune épreuve renseignée — niveau « Découverte ».',
            ];
        }

        $weightedSum = 0.0;
        $weightTotal = 0.0;

        foreach ($scores as $level => $score) {
            if (! in_array($level, self::LEVELS, true)) {
                throw new InvalidArgumentException("Épreuve inconnue : {$level}");
            }
            if ($score < 0.0 || $score > 1.0) {
                throw new InvalidArgumentException("Score hors plage [0..1] pour l'épreuve {$level}");
            }

            $weight = self::WEIGHTS[$level];
            $weightedSum += $score * $weight;
            $weightTotal += $weight;
        }

        $global = $weightTotal > 0 ? $weightedSum / $weightTotal : 0.0;

        return [
            'level' => $this->levelFromScore($global),
            'score' => round($global, 4),
            'explanation' => $this->explanation($global),
        ];
    }

    /** Dérive le niveau produit à partir du score global. */
    public function levelFromScore(float $score): string
    {
        if ($score >= self::FLUIDE_THRESHOLD) {
            return self::FLUIDE;
        }
        if ($score >= self::PROGRESSION_THRESHOLD) {
            return self::PROGRESSION;
        }

        return self::DECOUVERTE;
    }

    /** Justification lisible, sans jargon (destinée au parent en P3). */
    private function explanation(float $score): string
    {
        $level = $this->levelFromScore($score);

        return "Niveau « ".ucfirst($level)." » — déterminé à partir du résultat du test de lecture.";
    }
}
