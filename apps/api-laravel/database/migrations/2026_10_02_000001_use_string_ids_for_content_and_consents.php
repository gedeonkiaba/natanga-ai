<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| Les identifiants de contenu sont des slugs (`n-letters-a`, `text-l1-1`, `ex-…`) et
| ceux des consentements valent `{childId}:{uuid}` (73 car.) : ils ne sont PAS des
| UUID. SQLite ne type pas ses colonnes (tests verts), mais PostgreSQL refuse le seed
| et l'octroi du consentement (SQLSTATE 22P02). On passe ces colonnes en chaînes,
| clés étrangères conservées. Sans effet sur SQLite (déjà permissif).
*/
return new class extends Migration
{
    /** @var array<string, array<int, array{0: string, 1: string, 2: string}>> table → [colonne référencée par FK, table cible, colonne cible] */
    private const FOREIGN_KEYS = [
        'lessons' => [['node_id', 'skill_nodes', 'id']],
        'exercises' => [['lesson_id', 'lessons', 'id']],
        'progress' => [['node_id', 'skill_nodes', 'id']],
        'attempts' => [['exercise_id', 'exercises', 'id']],
    ];

    /** @var array<string, array<int, string>> */
    private const COLUMNS = [
        'skill_nodes' => ['id'],
        'lessons' => ['id', 'node_id'],
        'exercises' => ['id', 'lesson_id'],
        'progress' => ['node_id'],
        'attempts' => ['exercise_id'],
        'consents' => ['id'],
    ];

    public function up(): void
    {
        $this->convert(fn (Blueprint $table, string $column) => $table->string($column, 100)->change());
    }

    /** Irréversible : les slugs et ids de consentement existants ne sont pas des UUID. */
    public function down(): void {}

    private function convert(callable $change): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        foreach (self::FOREIGN_KEYS as $table => $keys) {
            Schema::table($table, function (Blueprint $t) use ($keys) {
                foreach ($keys as [$column]) {
                    $t->dropForeign([$column]);
                }
            });
        }

        foreach (self::COLUMNS as $table => $columns) {
            Schema::table($table, function (Blueprint $t) use ($columns, $change) {
                foreach ($columns as $column) {
                    $change($t, $column);
                }
            });
        }

        foreach (self::FOREIGN_KEYS as $table => $keys) {
            Schema::table($table, function (Blueprint $t) use ($keys) {
                foreach ($keys as [$column, $target, $targetColumn]) {
                    $t->foreign($column)->references($targetColumn)->on($target)->cascadeOnDelete();
                }
            });
        }
    }
};
