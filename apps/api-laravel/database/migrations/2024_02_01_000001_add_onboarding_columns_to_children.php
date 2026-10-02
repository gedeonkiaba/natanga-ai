<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Module 1 (LexiKids) — onboarding enfant enrichi :
 *   - `interests`       : centres d'intérêt (animaux, espace, contes, dinosaures...).
 *   - `placement_level` : niveau attribué '1' | '2' | '3' (Syllabique / Mots simples / Phrases-Textes),
 *                          automatique depuis le diagnostic, ajustable par le parent.
 *   - `accessibility`   : réglages persistants (vitesse voix, coloration syllabique, police, échelle).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->json('interests')->nullable();
            $table->string('placement_level', 1)->nullable();
            $table->json('accessibility')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->dropColumn(['interests', 'placement_level', 'accessibility']);
        });
    }
};
