<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Module 2 + 5 (LexiKids) — événements produit privacy-first (minimisation :
 * aucun PII hors child_id, effacement en cascade avec l'enfant).
 * Utilisé par le dashboard parent (aide demandée, blocage > 3 s...) et les KPI.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->string('name')->index();
            $table->json('props')->nullable();
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->index(['child_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_events');
    }
};
