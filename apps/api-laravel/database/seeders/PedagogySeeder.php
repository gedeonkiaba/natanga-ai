<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
            ['id' => 'w-bon', 'label' => 'bon', 'phoneme' => 'bon'],
            ['id' => 'w-don', 'label' => 'don', 'phoneme' => 'don'],
            ['id' => 'w-bebe', 'label' => 'bébé', 'phoneme' => 'bébé'],
            ['id' => 'w-dodo', 'label' => 'dodo', 'phoneme' => 'dodo'],
            ['id' => 'w-pomme', 'label' => 'pomme', 'phoneme' => 'pomme'],
            ['id' => 'w-poule', 'label' => 'poule', 'phoneme' => 'poule'],
            ['id' => 'w-quatre', 'label' => 'quatre', 'phoneme' => 'quatre'],
            ['id' => 'w-coq', 'label' => 'coq', 'phoneme' => 'coq'],
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
            ['id' => 'n-mots-simples', 'level' => 'words', 'title' => 'Mots simples', 'order' => 4, 'unlocked_when' => 3],
        ];
        foreach ($nodes as $node) {
            DB::table('skill_nodes')->updateOrInsert(['id' => $node['id']], $node);
        }

        // 3. Une leçon par nœud (identiques à packages/core/src/pedagogy/content.ts).
        $lessons = [
            ['id' => 'l-vowels-1', 'node_id' => 'n-letters-a', 'title' => 'Écouter les voyelles'],
            ['id' => 'l-bd-1', 'node_id' => 'n-letters-bd', 'title' => 'b ou d ?'],
            ['id' => 'l-pq-1', 'node_id' => 'n-letters-pq', 'title' => 'p ou q ?'],
            ['id' => 'l-mots-1', 'node_id' => 'n-mots-simples', 'title' => 'Lire des mots'],
        ];
        foreach ($lessons as $lesson) {
            DB::table('lessons')->updateOrInsert(
                ['id' => $lesson['id']],
                ['node_id' => $lesson['node_id'], 'title' => $lesson['title'], 'duration_min' => 6, 'order' => 1],
            );
        }

        // 4. Exercices. b/d et p/q : lettres en miroir seulement, mot-repère dit
        // par la voix (`cue`), puis paires de mots ne différant que par cette lettre.
        $sg = fn (string $phoneme, ?string $cue = null, ?array $itemIds = null): array => [
            'sound-grapheme',
            array_filter(['phoneme' => $phoneme, 'cue' => $cue, 'itemIds' => $itemIds], fn ($v) => $v !== null),
        ];
        $wr = fn (string $correct, array $itemIds): array => [
            'word-recognition',
            ['correctItemId' => $correct, 'itemIds' => $itemIds],
        ];
        $exercises = [
            'l-vowels-1' => [
                'e-vowel-a' => $sg('a'),
                'e-vowel-i' => $sg('i'),
                'e-vowel-o' => $sg('o'),
                'e-word-papa' => $wr('w-papa', ['w-papa', 'w-maman', 'w-lapin']),
            ],
            'l-bd-1' => [
                'e-bd-b1' => $sg('b', 'b, comme ballon', ['g-b', 'g-d']),
                'e-bd-d1' => $sg('d', 'd, comme doigt', ['g-b', 'g-d']),
                'e-bd-b2' => $sg('b', 'b, comme bébé', ['g-d', 'g-p', 'g-b']),
                'e-bd-bon' => $wr('w-bon', ['w-don', 'w-bon']),
                'e-bd-dodo' => $wr('w-dodo', ['w-bebe', 'w-dodo', 'w-ballon']),
            ],
            'l-pq-1' => [
                'e-pq-p1' => $sg('p', 'p, comme papa', ['g-p', 'g-q']),
                'e-pq-q1' => $sg('k', 'q, comme quatre', ['g-p', 'g-q']),
                'e-pq-p2' => $sg('p', 'p, comme pomme', ['g-q', 'g-b', 'g-p']),
                'e-pq-quatre' => $wr('w-quatre', ['w-pomme', 'w-quatre', 'w-poule']),
                'e-pq-coq' => $wr('w-coq', ['w-coq', 'w-poule', 'w-papa']),
            ],
            'l-mots-1' => [
                'e-mots-lapin' => $wr('w-lapin', ['w-papa', 'w-lapin', 'w-ballon']),
                'e-mots-maman' => $wr('w-maman', ['w-maman', 'w-pomme', 'w-papa']),
                'e-mots-ballon' => $wr('w-ballon', ['w-bon', 'w-dodo', 'w-ballon']),
                'e-mots-poule' => $wr('w-poule', ['w-poule', 'w-coq', 'w-pomme']),
                'e-mots-bebe' => $wr('w-bebe', ['w-dodo', 'w-papa', 'w-bebe']),
            ],
        ];
        foreach ($exercises as $lessonId => $list) {
            $order = 0;
            foreach ($list as $id => [$type, $params]) {
                DB::table('exercises')->updateOrInsert(
                    ['id' => $id],
                    ['lesson_id' => $lessonId, 'type' => $type, 'params' => json_encode($params), 'order' => ++$order],
                );
            }
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
