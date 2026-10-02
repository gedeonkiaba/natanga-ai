<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Module 2 (LexiKids) — colonnes de la bibliothèque de textes pré-écrits :
 *   - `interest`      : centre d'intérêt du texte (animaux, espace, contes, dinosaures...).
 *   - `reading_level` : niveau LexiKids '1' | '2' | '3' (Syllabique / Mots simples / Phrases-Textes).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('interest')->nullable();
            $table->string('reading_level', 1)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['interest', 'reading_level']);
        });
    }
};
