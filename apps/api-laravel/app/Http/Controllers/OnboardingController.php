<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\DomainException;
use App\Models\Child;
use App\Services\OnboardingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur d'onboarding (MVP0 LexiKids, module 1) — profil (avatar,
 * intérêts) et niveau de placement. Routes câblées dans `routes/api.php`
 * (`PATCH children/{id}`, `POST children/{id}/level`).
 */
class OnboardingController extends Controller
{
    public function __construct(private readonly OnboardingService $onboarding) {}

    /**
     * Met à jour le profil d'onboarding (avatar, intérêts).
     *
     * @throws DomainException si l'enfant est absent (CHILD_NOT_FOUND, 404).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $child = Child::find($id);
        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $data = $request->validate([
            'avatar' => ['nullable', 'string', 'max:40'],
            'interests' => ['nullable', 'array'],
            'interests.*' => ['string'],
        ]);

        $child = $this->onboarding->updateProfile($child, $data);

        return response()->json(['child' => $this->toDto($child)]);
    }

    /**
     * Ajuste le niveau de placement ('1' | '2' | '3').
     *
     * @throws DomainException si l'enfant est absent (CHILD_NOT_FOUND, 404).
     */
    public function adjustLevel(Request $request, string $id): JsonResponse
    {
        $child = Child::find($id);
        if ($child === null) {
            throw new DomainException('CHILD_NOT_FOUND', 'profil enfant introuvable');
        }

        $data = $request->validate([
            'level' => ['required', 'string', 'in:1,2,3'],
        ]);

        $child = $this->onboarding->adjustLevel($child, (string) $data['level']);

        return response()->json([
            'childId' => $child->id,
            'placementLevel' => $child->placement_level,
        ]);
    }

    /** DTO camelCase du profil d'onboarding. */
    private function toDto(Child $child): array
    {
        return [
            'id' => $child->id,
            'displayName' => $child->display_name,
            'birthYear' => (int) $child->birth_year,
            'avatar' => $child->avatar,
            'ageBand' => $child->age_band,
            'status' => $child->status,
            'interests' => $child->interests,
            'placementLevel' => $child->placement_level,
        ];
    }
}
