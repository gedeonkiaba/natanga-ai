<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Module 2 + 4 (LexiKids) — sessions de lecture assistée.
 * Alimente les KPI (sessions sans intervention, temps quotidien, fluence) et
 * la gamification minimale (étoiles par session terminée).
 *
 * Note : `lesson_id` est une référence **souple** (sans FK) — les sessions sont
 * des données de mesure qui doivent survivre à une purge de contenu pédagogique ;
 * la suppression de l'enfant efface tout en cascade (FK child_id).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->string('lesson_id')->nullable()->index();
            $table->integer('duration_sec')->default(0);
            $table->integer('words_read')->default(0);
            $table->integer('correct_words')->default(0);
            $table->boolean('completed')->default(false);
            $table->integer('stars')->default(0);
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->index('child_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_sessions');
    }
};
