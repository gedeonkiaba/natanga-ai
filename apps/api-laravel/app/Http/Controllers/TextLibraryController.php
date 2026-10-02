<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Services\TextLibraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * MVP0 LexiKids — Module 2 : bibliothèque de textes de l'atelier de lecture.
 *
 * GET /api/children/{childId}/texts[?level=1|2|3][&interest=…]
 */
class TextLibraryController extends Controller
{
    public function __construct(private readonly TextLibraryService $texts) {}

    /**
     * Textes du niveau de lecture de l'enfant (200, liste vide si aucun texte
     * n'existe à ce niveau — jamais une erreur).
     *
     * @throws DomainException CHILD_NOT_FOUND (404) si l'enfant est inconnu ;
     *                         TEXT_LIBRARY_INVALID_LEVEL (422) si `level`
     *                         n'est pas 1, 2 ou 3.
     */
    public function index(Request $request, string $childId): JsonResponse
    {
        $child = Child::find($childId);
        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $level = $request->query('level');
        $interest = $request->query('interest');

        // Un niveau non-texte (?level[]=…) est ramené à '' puis rejeté
        // à 422 par le service (TEXT_LIBRARY_INVALID_LEVEL).
        $level = (is_string($level) || $level === null) ? $level : '';
        $interest = is_string($interest) && $interest !== '' ? $interest : null;

        $texts = $this->texts->texts($child, $interest, $level);

        return response()->json([
            'level' => $level ?? $child->placement_level ?? '1',
            'texts' => $texts->values(),
        ]);
    }
}
