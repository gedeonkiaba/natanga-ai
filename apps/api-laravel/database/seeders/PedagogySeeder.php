<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

/**
 * Seed pédagogique niveau 1 + compte parent démo.
 * Transposition du `prisma/seed.ts`.
 */
class PedagogySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Items (graphemes + mots).
        $graphemes = [
            ['id' => 'g-a', 'label' => 'a', 'phoneme' => 'a'],
            ['id' => 'g-i', 'label' => 'i', 'phoneme' => 'i'],
            ['id' => 'g-o', 'label' => 'o', 'phoneme' => 'o'],
            ['id' => 'g-b', 'label' => 'b', 'phoneme' => 'b'],
            ['id' => 'g-d', 'label' => 'd', 'phoneme' => 'd'],
            ['id' => 'g-p', 'label' => 'p', 'phoneme' => 'p'],
            ['id' => 'g-q', 'label' => 'q', 'phoneme' => 'k'],
        ];
        $words = [
            ['id' => 'w-papa', 'label' => 'papa', 'phoneme' => 'papa'],
            ['id' => 'w-maman', 'label' => 'maman', 'phoneme' => 'maman'],
            ['id' => 'w-lapin', 'label' => 'lapin', 'phoneme' => 'lapin'],
            ['id' => 'w-ballon', 'label' => 'ballon', 'phoneme' => 'ballon'],
            ['id' => 'w-doigt', 'label' => 'doigt', 'phoneme' => 'doigt'],
        ];

        foreach (array_merge($graphemes, $words) as $item) {
            $type = str_starts_with($item['id'], 'g-') ? 'grapheme' : 'word';
            DB::table('items')->updateOrInsert(
                ['id' => $item['id']],
                ['type' => $type, 'label' => $item['label'], 'phoneme' => $item['phoneme']],
            );
        }

        // 2. Nœuds de l'arbre.
        $nodes = [
            ['id' => 'n-letters-a', 'level' => 'letters', 'title' => 'Les voyelles', 'order' => 1, 'unlocked_when' => 0],
            ['id' => 'n-letters-bd', 'level' => 'letters', 'title' => 'Les sons b / d', 'order' => 2, 'unlocked_when' => 1],
            ['id' => 'n-letters-pq', 'level' => 'letters', 'title' => 'Les sons p / q', 'order' => 3, 'unlocked_when' => 2],
        ];
        foreach ($nodes as $node) {
            DB::table('skill_nodes')->updateOrInsert(['id' => $node['id']], $node);
        }

        // 3. Leçon voyelles.
        $lessonId = 'l-vowels-1';
        DB::table('lessons')->updateOrInsert(
            ['id' => $lessonId],
            ['node_id' => 'n-letters-a', 'title' => 'Écouter les voyelles', 'duration_min' => 6, 'order' => 1],
        );

        // 4. Exercices.
        $exercises = [
            ['id' => 'e-vowel-a', 'phoneme' => 'a', 'order' => 1],
            ['id' => 'e-vowel-i', 'phoneme' => 'i', 'order' => 2],
            ['id' => 'e-vowel-o', 'phoneme' => 'o', 'order' => 3],
        ];
        foreach ($exercises as $ex) {
            DB::table('exercises')->updateOrInsert(
                ['id' => $ex['id']],
                [
                    'lesson_id' => $lessonId,
                    'type' => 'sound-grapheme',
                    'params' => json_encode(['phoneme' => $ex['phoneme']]),
                    'order' => $ex['order'],
                ],
            );
        }
        DB::table('exercises')->updateOrInsert(
            ['id' => 'e-word-papa'],
            [
                'lesson_id' => $lessonId,
                'type' => 'word-recognition',
                'params' => json_encode(['correctItemId' => 'w-papa', 'itemIds' => ['w-papa', 'w-maman', 'w-lapin']]),
                'order' => 4,
            ],
        );

        // 5. Compte parent démo.
        DB::table('users')->updateOrInsert(
            ['email' => 'demo@natanga.app'],
            [
                'id' => Str::uuid()->toString(),
                'password_hash' => Hash::make('demo1234'),
                'role' => 'parent',
                'status' => 'ACTIVE',
            ],
        );
    }
}
