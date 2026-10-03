<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Parcours pédagogique + compte parent démo.
 *
 * Le contenu (items, nœuds, leçons, exercices) vient de `data/curriculum.json`, généré
 * par `content/curriculum/generate.mjs` depuis la base de connaissances CSV : identique
 * à l'app Flutter et à `packages/core`. Ne pas éditer le JSON à la main.
 */
class PedagogySeeder extends Seeder
{
    /** @return array{levels: list<array<string, mixed>>, nodes: list<array<string, mixed>>, lessons: list<array<string, mixed>>, items: list<array<string, mixed>>, exercises: list<array<string, mixed>>} */
    public static function curriculum(): array
    {
        return json_decode((string) file_get_contents(__DIR__.'/data/curriculum.json'), true, flags: JSON_THROW_ON_ERROR);
    }

    public function run(): void
    {
        $curriculum = self::curriculum();

        // 1. Nœuds de l'arbre (parcours + textes), et retrait des anciens nœuds.
        $this->call(TreeSeeder::class);

        // 2. Items : graphèmes, syllabes, mots (découpage syllabique), phrases.
        foreach ($curriculum['items'] as $item) {
            DB::table('items')->updateOrInsert(
                ['id' => $item['id']],
                [
                    'type' => $item['type'],
                    'label' => $item['label'],
                    'phoneme' => $item['phoneme'],
                    'syllables' => json_encode($item['syllables'], JSON_UNESCAPED_UNICODE),
                ],
            );
        }

        // 3. Une leçon par nœud.
        foreach ($curriculum['lessons'] as $lesson) {
            DB::table('lessons')->updateOrInsert(
                ['id' => $lesson['id']],
                [
                    'node_id' => $lesson['nodeId'],
                    'title' => $lesson['title'],
                    'objective' => $lesson['objective'],
                    'duration_min' => $lesson['durationMin'],
                    'order' => $lesson['order'],
                ],
            );
        }

        // 4. Exercices.
        foreach ($curriculum['exercises'] as $exercise) {
            DB::table('exercises')->updateOrInsert(
                ['id' => $exercise['id']],
                [
                    'lesson_id' => $exercise['lessonId'],
                    'type' => $exercise['type'],
                    'params' => json_encode($exercise['params'], JSON_UNESCAPED_UNICODE),
                    'order' => $exercise['order'],
                ],
            );
        }

        // 5. Compte parent démo — JAMAIS en production (mot de passe public).
        // insertOrIgnore : l'id n'est pas régénéré à chaque seed (sinon ses enfants
        // seraient orphelins au déploiement suivant).
        if (app()->environment('local', 'testing')) {
            DB::table('users')->insertOrIgnore([
                'id' => Str::uuid()->toString(),
                'email' => 'demo@natanga.app',
                'password_hash' => Hash::make('demo1234'),
                'role' => 'parent',
                'status' => 'ACTIVE',
            ]);
        }
    }
}
