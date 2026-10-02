<?php

declare(strict_types=1);

use App\Mail\VerifyEmailMail;
use App\Models\EmailToken;
use App\Models\ReadingSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

/*
| Bloquants de lancement (docs/26) : un vrai parent doit recevoir son lien de
| vérification, pouvoir le redemander, et les clients web reçoivent un contrat
| cohérent (camelCase, RFC 7807 partout).
*/

beforeEach(fn () => Mail::fake());

function verifyUrlSentTo(string $email): string
{
    $url = null;
    Mail::assertSent(VerifyEmailMail::class, function (VerifyEmailMail $mail) use ($email, &$url) {
        $url = $mail->verifyUrl;

        return $mail->hasTo($email);
    });

    return $url;
}

it("envoie à l'inscription un lien de vérification vers le client web, utilisable de bout en bout", function () {
    config(['app.frontend_url' => 'https://app.natanga.test/']);

    $this->postJson('/api/auth/register', ['email' => 'Parent@Example.com', 'password' => 'secret1234'])
        ->assertStatus(201);

    $url = verifyUrlSentTo('parent@example.com');
    expect($url)->toStartWith('https://app.natanga.test/verifier?token=');

    parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
    $this->postJson('/api/auth/verify-email', ['token' => $query['token']])
        ->assertStatus(201)
        ->assertJsonPath('status', 'ACTIVE');

    $this->postJson('/api/auth/login', ['email' => 'parent@example.com', 'password' => 'secret1234'])
        ->assertOk()
        ->assertJsonStructure(['token']);
});

it("n'inclut le token dans aucune réponse d'inscription", function () {
    $res = $this->postJson('/api/auth/register', ['email' => 'p@example.com', 'password' => 'secret1234']);

    $token = EmailToken::first()->token;
    expect($res->getContent())->not->toContain($token);
});

it('renvoie un nouveau lien à un compte en attente et invalide le précédent', function () {
    $this->postJson('/api/auth/register', ['email' => 'p@example.com', 'password' => 'secret1234']);
    $old = EmailToken::first()->token;

    $this->postJson('/api/auth/resend-verification', ['email' => 'p@example.com'])
        ->assertStatus(202)
        ->assertJsonPath('status', 'sent-if-pending');

    Mail::assertSent(VerifyEmailMail::class, 2);
    expect(EmailToken::count())->toBe(1);
    expect(EmailToken::first()->token)->not->toBe($old);

    $this->postJson('/api/auth/verify-email', ['token' => $old])
        ->assertStatus(401)
        ->assertJsonPath('code', 'ERR_TOKEN');
});

it("répond à l'identique pour un email inconnu ou déjà vérifié, sans envoyer d'email (anti-énumération)", function () {
    [$active] = makeParentWithToken('active@example.com');

    $unknown = $this->postJson('/api/auth/resend-verification', ['email' => 'nobody@example.com']);
    $verified = $this->postJson('/api/auth/resend-verification', ['email' => $active->email]);

    $unknown->assertStatus(202);
    $verified->assertStatus(202);
    expect($unknown->json())->toBe($verified->json());
    Mail::assertNothingSent();
    expect(User::find($active->id)->status)->toBe('ACTIVE');
});

it("n'empêche pas l'inscription si l'envoi d'email échoue", function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('smtp down'));

    $this->postJson('/api/auth/register', ['email' => 'p@example.com', 'password' => 'secret1234'])
        ->assertStatus(201);

    expect(EmailToken::count())->toBe(1);
});

it('accepte une session de lecture en camelCase (contrat documenté)', function () {
    $child = makeVerifiedChild();

    $this->postJson("/api/children/{$child->id}/sessions", [
        'lessonId' => 'text-l1-1',
        'durationSec' => 90,
        'wordsRead' => 20,
        'correctWords' => 18,
        'completed' => true,
    ])
        ->assertStatus(201)
        ->assertJsonPath('session.lessonId', 'text-l1-1')
        ->assertJsonPath('session.durationSec', 90)
        ->assertJsonPath('session.stars', 2)
        ->assertJsonPath('reward.amount', 2);
});

it('accepte toujours le snake_case (clients historiques)', function () {
    $child = makeVerifiedChild();

    $this->postJson("/api/children/{$child->id}/sessions", [
        'duration_sec' => 30, 'words_read' => 10, 'correct_words' => 2, 'completed' => true,
    ])
        ->assertStatus(201)
        ->assertJsonPath('session.stars', 1);
});

it('rend une route inconnue en RFC 7807 sans stacktrace, même en debug', function () {
    config(['app.debug' => true]);

    $res = $this->getJson('/api/does-not-exist')->assertStatus(404);

    expect($res->json())->toBe([
        'type' => 'about:blank',
        'title' => 'ressource introuvable',
        'status' => 404,
        'code' => 'ERR_NOT_FOUND',
    ]);
});

it('rend une méthode non autorisée en RFC 7807', function () {
    $this->putJson('/api/health')
        ->assertStatus(405)
        ->assertJsonPath('code', 'ERR_METHOD_NOT_ALLOWED');
});

describe('derrière le proxy web', function () {
    afterEach(fn () => TrustProxies::flushState());

    it('limite les tentatives par parent (X-Forwarded-For) et non globalement', function () {
        TrustProxies::at('*');

        // 12 parents distincts derrière le même proxy : aucun n'est bloqué.
        foreach (range(1, 12) as $i) {
            $this->withHeader('X-Forwarded-For', "203.0.113.{$i}")
                ->postJson('/api/auth/login', ['email' => "p{$i}@example.com", 'password' => 'nope-nope'])
                ->assertStatus(401);
        }

        // Un même parent reste limité à 10 tentatives par minute.
        foreach (range(1, 10) as $i) {
            $this->withHeader('X-Forwarded-For', '198.51.100.7')
                ->postJson('/api/auth/login', ['email' => 'x@example.com', 'password' => 'nope-nope']);
        }
        $this->withHeader('X-Forwarded-For', '198.51.100.7')
            ->postJson('/api/auth/login', ['email' => 'x@example.com', 'password' => 'nope-nope'])
            ->assertStatus(429);
    });
});

it('expose au parent les mots lus seul(e) pour chaque lecture récente', function () {
    $child = makeVerifiedChild();
    $this->postJson("/api/children/{$child->id}/sessions", [
        'lessonId' => 'text-l1-1', 'durationSec' => 60, 'wordsRead' => 20, 'correctWords' => 17, 'completed' => true,
    ])->assertStatus(201);

    $this->getJson("/api/parent/dashboard/{$child->id}")
        ->assertOk()
        ->assertJsonPath('dashboard.recentSessions.0.lessonId', 'text-l1-1')
        ->assertJsonPath('dashboard.recentSessions.0.wordsRead', 20)
        ->assertJsonPath('dashboard.recentSessions.0.correctWords', 17);
});

it('ne crée jamais le compte démo en production et ne régénère pas son id', function () {
    $this->app['env'] = 'production';
    $this->artisan('db:seed', ['--force' => true])->assertSuccessful();
    expect(User::where('email', 'demo@natanga.app')->exists())->toBeFalse();

    $this->app['env'] = 'local';
    $this->artisan('db:seed', ['--force' => true])->assertSuccessful();
    $id = User::where('email', 'demo@natanga.app')->value('id');
    $this->artisan('db:seed', ['--force' => true])->assertSuccessful();
    expect(User::where('email', 'demo@natanga.app')->value('id'))->toBe($id);
});

it('authentifie avec le store de cache par défaut (database) sans erreur 500', function () {
    config(['cache.default' => 'database']);
    [$user] = makeParentWithToken('cache@example.com');

    $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'secret1234'])->assertOk();
    $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'mauvais'])->assertStatus(401);
});

it('limite par email ciblé même si chaque requête annonce une IP différente', function () {
    TrustProxies::at('*');
    [$user] = makeParentWithToken('cible@example.com');

    foreach (range(1, 10) as $i) {
        $this->withHeader('X-Forwarded-For', "192.0.2.{$i}")
            ->postJson('/api/auth/login', ['email' => 'Cible@Example.com', 'password' => 'devine'.$i])
            ->assertStatus(401);
    }

    $this->withHeader('X-Forwarded-For', '192.0.2.99')
        ->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'secret1234'])
        ->assertStatus(429);

    TrustProxies::flushState();
});

it('refuse des mesures de session incohérentes (pas d\'étoiles gratuites)', function () {
    $child = makeVerifiedChild();

    foreach ([
        ['wordsRead' => 1, 'correctWords' => 999999],
        ['wordsRead' => 999999, 'correctWords' => 0],
    ] as $metrics) {
        $this->postJson("/api/children/{$child->id}/sessions", $metrics + ['durationSec' => 30, 'completed' => true])
            ->assertStatus(422);
    }
    $this->postJson("/api/children/{$child->id}/sessions", ['durationSec' => 999999, 'wordsRead' => 10, 'correctWords' => 10, 'completed' => true])
        ->assertStatus(422);

    expect(ReadingSession::count())->toBe(0);
});
