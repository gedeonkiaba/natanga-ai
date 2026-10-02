<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * P1 — extensions pédagogie (spec `docs/23-chantier-p1-spec.md` §3).
 *
 * - Nouvelle table `diagnostics` (résultat d'un diagnostic adaptatif A→E).
 * - Nouvelle table `unlocks` (déblocages gamification : étoile/badge/avatar).
 * - Colonnes de contenu pour les 90 textes (bibliothèque contrôlée) et l'aide TTS mot/syllabe.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnostics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->string('level_result'); // decouverte | progression | fluide
            $table->float('score'); // score global 0..1
            $table->float('speed_wpm')->nullable(); // vitesse (mots/min)
            $table->integer('error_count')->default(0);
            $table->integer('hesitation_count')->default(0);
            $table->timestamp('created_at')->nullable();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->index('child_id');
        });

        Schema::create('unlocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->string('kind'); // star | badge | avatar
            $table->string('key'); // ex. 'badge-3-lectures'
            $table->timestamp('unlocked_at');

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->index('child_id');
            $table->unique(['child_id', 'key']);
        });

        // Colonnes de contenu : textes de lecture (90 textes) + aides TTS mot/syllabe.
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('kind')->default('exercise')->after('title'); // reading | exercise
            $table->json('phonemes')->nullable()->after('kind'); // phonèmes travaillés
            $table->smallInteger('age_min')->nullable()->after('phonemes');
            $table->text('text')->nullable()->after('duration_min'); // texte à lire
        });

        Schema::table('items', function (Blueprint $table) {
            $table->json('syllables')->nullable()->after('phoneme'); // découpage syllabique
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('syllables');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['text', 'age_min', 'phonemes', 'kind']);
        });

        Schema::dropIfExists('unlocks');
        Schema::dropIfExists('diagnostics');
    }
};
