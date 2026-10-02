<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Module 2 LexiKids — réglages d'accessibilité (MVP0).
 * Verrouille les défauts bienveillants, la persistance par fusion partielle
 * et le garde-fou 422 sur toute valeur hors plage.
 */
uses(RefreshDatabase::class);

it('retourne les réglages par défaut quand l’enfant n’a encore rien choisi', function () {
    $child = makeVerifiedChild();

    $res = $this->getJson("/api/children/{$child->id}/settings");
    $res->assertOk();

    expect((float) $res->json('settings.voiceSpeed'))->toBe(1.0);
    expect($res->json('settings.syllableColoring'))->toBeTrue();
    expect($res->json('settings.fontFamily'))->toBe('system');
    expect((float) $res->json('settings.fontScale'))->toBe(1.0);

    // Les défauts ne sont jamais forcés en base : l'enfant peut ne rien choisir.
    expect($child->refresh()->accessibility)->toBeNull();
});

it('valide, fusionne et persiste des réglages PATCH valides', function () {
    $child = makeVerifiedChild();

    $res = $this->patchJson("/api/children/{$child->id}/settings", [
        'voiceSpeed' => 1.25,
        'fontFamily' => 'dyslexic',
    ]);

    $res->assertOk();
    expect((float) $res->json('settings.voiceSpeed'))->toBe(1.25);
    expect($res->json('settings.fontFamily'))->toBe('dyslexic');
    expect((float) $res->json('settings.fontScale'))->toBe(1.0); // défaut conservé
    expect($res->json('settings.syllableColoring'))->toBeTrue();

    // Second PATCH partiel : seule la clé envoyée change, le reste est conservé.
    $this->patchJson("/api/children/{$child->id}/settings", [
        'fontScale' => 1.5,
        'syllableColoring' => false,
    ])->assertOk();

    $stored = $child->refresh()->accessibility;
    expect((float) $stored['voiceSpeed'])->toBe(1.25);
    expect($stored['fontFamily'])->toBe('dyslexic');
    expect((float) $stored['fontScale'])->toBe(1.5);
    expect($stored['syllableColoring'])->toBeFalse();
});

it('rejette une vitesse de voix hors plage (422 ACCESSIBILITY_INVALID_SETTING)', function () {
    $child = makeVerifiedChild();

    $this->patchJson("/api/children/{$child->id}/settings", ['voiceSpeed' => 9])
        ->assertStatus(422)
        ->assertJson(['code' => 'ACCESSIBILITY_INVALID_SETTING']);

    // Rien n'est persisté quand un réglage est refusé.
    expect($child->refresh()->accessibility)->toBeNull();
});

it('rejette une police inconnue (422 ACCESSIBILITY_INVALID_SETTING)', function () {
    $child = makeVerifiedChild();

    $this->patchJson("/api/children/{$child->id}/settings", ['fontFamily' => 'comic'])
        ->assertStatus(422)
        ->assertJson(['code' => 'ACCESSIBILITY_INVALID_SETTING']);
});

it('404 sur un enfant inconnu (RFC 7807)', function () {
    actingAsParent();
    $unknown = '/api/children/00000000-0000-0000-0000-000000000000/settings';

    $this->getJson($unknown)
        ->assertStatus(404)
        ->assertJson(['code' => 'CHILD_NOT_FOUND']);

    $this->patchJson($unknown, ['voiceSpeed' => 1.1])
        ->assertStatus(404)
        ->assertJson(['code' => 'CHILD_NOT_FOUND']);
});
