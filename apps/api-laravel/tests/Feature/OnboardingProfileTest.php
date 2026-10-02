<?php

declare(strict_types=1);

use App\Domain\DomainException;
use App\Services\OnboardingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * MVP0 LexiKids — module 1 : onboarding (avatar, intérêts, niveau 1/2/3).
 * Verrouille le contrat HTTP (RFC 7807) et la persistance du profil
 * via `PATCH /api/children/{id}` et `POST /api/children/{id}/level`.
 */
uses(RefreshDatabase::class);

it('met à jour l’avatar et les intérêts de l’enfant', function () {
    $child = makeVerifiedChild();

    $res = $this->patchJson("/api/children/{$child->id}", [
        'avatar' => 'renard-rose',
        'interests' => ['animaux', 'espace'],
    ]);

    $res->assertOk();
    expect($res->json('child.id'))->toBe($child->id)
        ->and($res->json('child.displayName'))->toBe('Léa')
        ->and($res->json('child.birthYear'))->toBe((int) $child->birth_year)
        ->and($res->json('child.avatar'))->toBe('renard-rose')
        ->and($res->json('child.ageBand'))->toBe('6-8')
        ->and($res->json('child.status'))->toBe('ACTIVE') // consentement accordé (helper)
        ->and($res->json('child.interests'))->toBe(['animaux', 'espace'])
        ->and($res->json('child.placementLevel'))->toBeNull();

    $fresh = $child->fresh();
    expect($fresh->avatar)->toBe('renard-rose')
        ->and($fresh->interests)->toBe(['animaux', 'espace']);
});

it('rejette un intérêt hors whitelist (422, ONBOARDING_INVALID_INTEREST)', function () {
    $child = makeVerifiedChild();

    $res = $this->patchJson("/api/children/{$child->id}", [
        'interests' => ['animaux', 'voitures'],
    ]);

    $res->assertStatus(422);
    expect($res->json('code'))->toBe('ONBOARDING_INVALID_INTEREST')
        ->and($res->json('type'))->toBe('about:blank')
        ->and($res->json('status'))->toBe(422);
    expect($child->fresh()->interests)->toBeNull();
});

it('applique le niveau « progression » (2) via l’ajustement manuel', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/level", ['level' => '2']);

    $res->assertOk();
    expect($res->json('childId'))->toBe($child->id)
        ->and($res->json('placementLevel'))->toBe('2');
    expect($child->fresh()->placement_level)->toBe('2');
});

it('rejette un niveau hors 1/2/3 (422)', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/level", ['level' => '9']);

    $res->assertStatus(422);
    expect($child->fresh()->placement_level)->toBeNull();
});

it('retourne 404 pour un enfant inexistant (RFC 7807)', function () {
    actingAsParent();
    $unknown = '00000000-0000-0000-0000-000000000000';

    $update = $this->patchJson("/api/children/{$unknown}", ['avatar' => 'renard-rose']);
    $update->assertStatus(404);
    expect($update->json('code'))->toBe('CHILD_NOT_FOUND')
        ->and($update->json('type'))->toBe('about:blank');

    $level = $this->postJson("/api/children/{$unknown}/level", ['level' => '2']);
    $level->assertStatus(404);
    expect($level->json('code'))->toBe('CHILD_NOT_FOUND');
});

it('dérive le placement_level du diagnostic via applyDiagnosticLevel', function () {
    $service = app(OnboardingService::class);
    $child = makeVerifiedChild();

    expect($service->attributeLevel('decouverte'))->toBe('1')
        ->and($service->attributeLevel('progression'))->toBe('2')
        ->and($service->attributeLevel('fluide'))->toBe('3');

    $updated = $service->applyDiagnosticLevel($child, 'progression');

    expect($updated->placement_level)->toBe('2')
        ->and($child->fresh()->placement_level)->toBe('2');
});

it('rejette un résultat de diagnostic inconnu (ONBOARDING_UNKNOWN_RESULT)', function () {
    $service = app(OnboardingService::class);
    $child = makeVerifiedChild();

    $caught = null;
    try {
        $service->applyDiagnosticLevel($child, 'expert');
    } catch (DomainException $e) {
        $caught = $e;
    }

    expect($caught)->toBeInstanceOf(DomainException::class)
        ->and($caught->errorCode)->toBe('ONBOARDING_UNKNOWN_RESULT');
    expect($child->fresh()->placement_level)->toBeNull();
});
