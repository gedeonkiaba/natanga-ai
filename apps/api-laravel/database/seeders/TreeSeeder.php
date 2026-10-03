<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Arbre pédagogique — seed idempotent (updateOrInsert par id).
 *
 * Les nœuds du parcours (6 niveaux, une leçon chacun) viennent de la base de connaissances
 * (`PedagogySeeder::curriculum()`), suivis des 2 nœuds de textes de l'atelier de lecture.
 * `unlocked_when` suit la convention de `PedagogyService` : nombre de nœuds précédents
 * (selon `order`) à maîtriser pour débloquer le nœud.
 */
class TreeSeeder extends Seeder
{
    /**
     * Nœuds des versions précédentes → nœud qui reprend leurs textes de lecture.
     * Les textes sont rattachés au nouveau nœud AVANT la suppression (pas de cascade
     * sur l'historique de lecture) ; leçons d'exercices et progression de ces nœuds partent.
     */
    public const LEGACY_NODES = [
        'n-letters-a' => 'n-mot-maman',
        'n-mots-simples' => 'n-phrase-1',
        'n-phrases' => 'n-textes-courts',
    ];

    public function run(): void
    {
        $nodes = array_map(fn (array $node) => [
            'id' => $node['id'],
            'level' => $node['level'],
            'title' => $node['title'],
            'order' => $node['order'],
            'unlocked_when' => $node['unlockedWhen'],
        ], PedagogySeeder::curriculum()['nodes']);

        $count = count($nodes);
        $nodes[] = ['id' => 'n-textes-courts', 'level' => 'textes-courts', 'title' => 'Textes courts', 'order' => $count + 1, 'unlocked_when' => $count];
        $nodes[] = ['id' => 'n-textes-fluide', 'level' => 'textes-fluide', 'title' => 'Lecture fluide', 'order' => $count + 2, 'unlocked_when' => $count + 1];

        foreach ($nodes as $node) {
            DB::table('skill_nodes')->updateOrInsert(['id' => $node['id']], $node);
        }

        foreach (self::LEGACY_NODES as $legacy => $replacement) {
            DB::table('lessons')->where('node_id', $legacy)->where('kind', 'lecture')->update(['node_id' => $replacement]);
            DB::table('skill_nodes')->where('id', $legacy)->delete();
        }
    }
}
