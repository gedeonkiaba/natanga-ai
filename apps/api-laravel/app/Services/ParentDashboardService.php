<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Attempt;
use App\Models\Child;
use App\Models\Diagnostic;
use App\Models\Progress;
use App\Models\ReadingSession;
use App\Models\Reward;
use App\Models\SkillNode;
use Illuminate\Support\Carbon;

/**
 * Tableau de bord parent (Module 5 LexiKids, MVP0).
 * Le vocabulaire est volontairement simple et bienveillant : un parent doit
 * comprendre la journée et la progression de son enfant sans jargon.
 */
class ParentDashboardService
{
    /** Recommandation proposée quand aucune difficulté récurrente n'est détectée. */
    private const GENERIC_RECOMMENDATION = 'Poursuivez la lecture quotidienne : 10 minutes par jour suffisent.';

    /**
     * Synthèse du jour + de la progression pour l'espace parent.
     *
     * @return array<string, mixed>
     */
    public function dashboard(Child $child): array
    {
        $mastered = Progress::where('child_id', $child->id)
            ->where('status', PedagogyService::STATUS_MASTERED)
            ->count();
        $inProgress = Progress::where('child_id', $child->id)
            ->where('status', PedagogyService::STATUS_IN_PROGRESS)
            ->count();
        $total = SkillNode::count();
        $confusions = $this->confusions($child);

        return [
            'child' => [
                'id' => $child->id,
                'displayName' => $child->display_name,
                'placementLevel' => $child->placement_level,
                'avatar' => $child->avatar,
            ],
            'today' => $this->today($child),
            'totals' => [
                ...$this->totals($child),
                'gems' => (int) Reward::where('child_id', $child->id)
                    ->where('kind', 'gems')
                    ->sum('amount'),
                'masteredNodes' => $mastered,
            ],
            'progression' => [
                'mastered' => $mastered,
                'inProgress' => $inProgress,
                'total' => $total,
                'percent' => $total > 0 ? (int) round($mastered / $total * 100) : 0,
            ],
            'confusions' => $confusions,
            'recentSessions' => $this->recentSessions($child),
            'diagnostic' => $this->latestDiagnostic($child),
            'recommendations' => $this->recommendations($confusions),
        ];
    }

    /**
     * KPI du jour (créées depuis minuit).
     *
     * @return array{sessionsCount: int, durationSec: int, starsEarnedToday: int}
     */
    private function today(Child $child): array
    {
        $stats = ReadingSession::where('child_id', $child->id)
            ->where('created_at', '>=', Carbon::today())
            ->where('created_at', '<', Carbon::tomorrow())
            ->selectRaw('COUNT(*) AS sessions, COALESCE(SUM(duration_sec), 0) AS duration, COALESCE(SUM(stars), 0) AS stars')
            ->first();

        return [
            'sessionsCount' => (int) $stats->sessions,
            'durationSec' => (int) $stats->duration,
            'starsEarnedToday' => (int) $stats->stars,
        ];
    }

    /**
     * Cumuls depuis le début (toutes sessions confondues).
     *
     * @return array{sessions: int, durationSec: int, stars: int}
     */
    private function totals(Child $child): array
    {
        $stats = ReadingSession::where('child_id', $child->id)
            ->selectRaw('COUNT(*) AS sessions, COALESCE(SUM(duration_sec), 0) AS duration, COALESCE(SUM(stars), 0) AS stars')
            ->first();

        return [
            'sessions' => (int) $stats->sessions,
            'durationSec' => (int) $stats->duration,
            'stars' => (int) $stats->stars,
        ];
    }

    /**
     * Top 3 des erreurs récurrentes (métrique d'apprentissage, jamais un diagnostic).
     *
     * @return array<int, array{errorKind: string, count: int}>
     */
    private function confusions(Child $child): array
    {
        return Attempt::where('child_id', $child->id)
            ->whereNotNull('error_kind')
            ->groupBy('error_kind')
            ->selectRaw('error_kind, COUNT(*) AS occurrences')
            ->orderByDesc('occurrences')
            ->limit(3)
            ->get()
            ->map(fn (Attempt $attempt) => [
                'errorKind' => (string) $attempt->error_kind,
                'count' => (int) $attempt->occurrences,
            ])
            ->values()
            ->all();
    }

    /**
     * 5 dernières sessions de lecture.
     *
     * @return array<int, array{id: string, durationSec: int, completed: bool, stars: int, createdAt: string|null}>
     */
    private function recentSessions(Child $child): array
    {
        return ReadingSession::where('child_id', $child->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (ReadingSession $session) => [
                'id' => $session->id,
                'lessonId' => $session->lesson_id,
                'durationSec' => (int) $session->duration_sec,
                'wordsRead' => (int) $session->words_read,
                'correctWords' => (int) $session->correct_words,
                'completed' => (bool) $session->completed,
                'stars' => (int) $session->stars,
                'createdAt' => $session->created_at?->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    /**
     * Dernier diagnostic (niveau produit) ou null s'il n'y en a jamais eu.
     *
     * @return array{result: string, score: float, createdAt: string|null}|null
     */
    private function latestDiagnostic(Child $child): ?array
    {
        $diagnostic = Diagnostic::where('child_id', $child->id)
            ->orderByDesc('created_at')
            ->first();

        if ($diagnostic === null) {
            return null;
        }

        return [
            'result' => $diagnostic->level_result,
            'score' => (float) $diagnostic->score,
            'createdAt' => $diagnostic->created_at?->toIso8601String(),
        ];
    }

    /**
     * 1 à 3 conseils simples déduits des confusions récurrentes ; une
     * recommandation douce et générique quand rien n'est détecté.
     *
     * @param  array<int, array{errorKind: string, count: int}>  $confusions
     * @return array<int, string>
     */
    private function recommendations(array $confusions): array
    {
        $recommendations = [];

        foreach ($confusions as $confusion) {
            $recommendation = $this->recommendationFor($confusion['errorKind']);

            if ($recommendation !== null && ! in_array($recommendation, $recommendations, true)) {
                $recommendations[] = $recommendation;
            }

            if (count($recommendations) === 3) {
                break;
            }
        }

        if ($recommendations === []) {
            $recommendations[] = self::GENERIC_RECOMMENDATION;
        }

        return $recommendations;
    }

    /** Conseil correspondant à une confusion donnée (null si inconnue). */
    private function recommendationFor(string $errorKind): ?string
    {
        $kind = strtolower($errorKind);

        if (str_contains($kind, 'b-d') || str_contains($kind, 'd-b')) {
            return 'Des exercices sur les sons b et d seraient utiles.';
        }

        if (str_contains($kind, 'p-q') || str_contains($kind, 'q-p')) {
            return 'Entraînons les sons p et q avec de courts textes.';
        }

        if (str_contains($kind, 'in-an') || str_contains($kind, 'an-in')
            || str_contains($kind, 'an-en') || str_contains($kind, 'en-an')
            || str_contains($kind, 'in-en') || str_contains($kind, 'en-in')) {
            return 'On peut réviser les sons in, an et en en lisant à voix haute.';
        }

        if (str_contains($kind, 'substitution') || str_contains($kind, 'voyelle')) {
            return 'Lire lentement en épelant les mots aidera.';
        }

        return null;
    }
}
