<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;
use App\Models\Lesson;
use Illuminate\Support\Collection;

/**
 * Erreur de bibliothèque de lecture (MVP0 LexiKids, module 2) — code métier RFC 7807, statut 422.
 *
 * `App\Domain\DomainException::httpStatus()` ne connaît pas le code
 * `TEXT_LIBRARY_INVALID_LEVEL` (400 par défaut) et le fichier d'origine est figé :
 * on affine donc le statut via cette sous-classe, rendue par le renderer
 * `DomainException` de `bootstrap/app.php` (instanceof respecté).
 */
class TextLibraryDomainException extends DomainException
{
    public function httpStatus(): int
    {
        return 422;
    }
}

/**
 * Bibliothèque de textes pré-écrits (Module 2 LexiKids — atelier de lecture assistée).
 *
 * Filtre le corpus `kind = lecture` sur le niveau de lecture de l'enfant
 * (paramètre `level` explicite, sinon son `placement_level`, sinon '1')
 * et, le cas échéant, sur un centre d'intérêt.
 */
class TextLibraryService
{
    /** Niveaux de lecture LexiKids valides (Syllabique / Mots simples / Phrases-Textes). */
    public const LEVELS = ['1', '2', '3'];

    /**
     * Textes accessibles à l'enfant pour son niveau de lecture.
     *
     * @return Collection<int, array<string, mixed>> Liste vide (HTTP 200) si aucun texte
     *                                               n'existe au niveau de l'enfant.
     *
     * @throws TextLibraryDomainException si `level` n'est pas '1', '2' ou '3'
     *                                    (TEXT_LIBRARY_INVALID_LEVEL, 422).
     */
    public function texts(Child $child, ?string $interest, ?string $level): Collection
    {
        if ($level !== null && ! in_array($level, self::LEVELS, true)) {
            throw new TextLibraryDomainException(
                'TEXT_LIBRARY_INVALID_LEVEL',
                'niveau de lecture invalide : '.$level.' (attendu 1, 2 ou 3)',
            );
        }

        $readingLevel = $level ?? $child->placement_level ?? '1';

        return Lesson::query()
            ->where('kind', 'lecture')
            ->where('reading_level', $readingLevel)
            ->when($interest !== null, fn ($query) => $query->where('interest', $interest))
            ->orderBy('order')
            ->get()
            ->map(fn (Lesson $lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                // Contenu du texte : la spec parle de « content », la colonne
                // historique de la table `lessons` s'appelle `text` (repli assuré).
                'text' => $lesson->content ?? $lesson->text,
                'readingLevel' => $lesson->reading_level,
                'interest' => $lesson->interest,
                'phonemes' => $lesson->phonemes,
                'ageMin' => $lesson->age_min,
                'durationMin' => $lesson->duration_min,
                'nodeId' => $lesson->node_id,
            ])
            ->values();
    }
}
