<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Arbre pédagogique complet (5 niveaux) — seed idempotent (updateOrInsert par id).
 *
 * Le niveau 1 (lettres) réutilise les ids de `PedagogySeeder` : exécuter
 * `TreeSeeder` seul ou après `PedagogySeeder` ne duplique rien.
 * `unlocked_when` suit la convention de `PedagogyService` : nombre de nœuds
 * précédents (selon `order`) à maîtriser pour débloquer le nœud suivant.
 */
class TreeSeeder extends Seeder
{
    public function run(): void
    {
        $nodes = [
            // Niveau 1 — lettres / syllabes (identiques à PedagogySeeder).
            ['id' => 'n-letters-a', 'level' => 'letters', 'title' => 'Les voyelles', 'order' => 1, 'unlocked_when' => 0],
            ['id' => 'n-letters-bd', 'level' => 'letters', 'title' => 'Les sons b / d', 'order' => 2, 'unlocked_when' => 1],
            ['id' => 'n-letters-pq', 'level' => 'letters', 'title' => 'Les sons p / q', 'order' => 3, 'unlocked_when' => 2],
            // Niveau 2 — mots simples.
            ['id' => 'n-mots-simples', 'level' => 'words', 'title' => 'Mots simples', 'order' => 4, 'unlocked_when' => 3],
            // Niveau 3 — phrases.
            ['id' => 'n-phrases', 'level' => 'phrases', 'title' => 'Phrases', 'order' => 5, 'unlocked_when' => 4],
            // Niveau 4 — textes courts.
            ['id' => 'n-textes-courts', 'level' => 'textes-courts', 'title' => 'Textes courts', 'order' => 6, 'unlocked_when' => 5],
            // Niveau 5 — lecture fluide.
            ['id' => 'n-textes-fluide', 'level' => 'textes-fluide', 'title' => 'Lecture fluide', 'order' => 7, 'unlocked_when' => 6],
        ];

        foreach ($nodes as $node) {
            DB::table('skill_nodes')->updateOrInsert(['id' => $node['id']], $node);
        }
    }
}
