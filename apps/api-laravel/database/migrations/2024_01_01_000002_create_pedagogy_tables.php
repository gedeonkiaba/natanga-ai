<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_nodes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('level')->index(); // letters | syllables | words | sentences | texts
            $table->string('title');
            $table->integer('order');
            $table->integer('unlocked_when')->default(0);
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('node_id');
            $table->string('title');
            $table->integer('duration_min');
            $table->integer('order');
            $table->timestamps();

            $table->foreign('node_id')->references('id')->on('skill_nodes')->cascadeOnDelete();
            $table->index('node_id');
        });

        Schema::create('exercises', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('lesson_id');
            $table->string('type'); // sound-grapheme | word-recognition
            $table->json('params');
            $table->integer('order');
            $table->timestamps();

            $table->foreign('lesson_id')->references('id')->on('lessons')->cascadeOnDelete();
            $table->index('lesson_id');
        });

        Schema::create('items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('type')->index(); // grapheme | phoneme | word
            $table->string('label');
            $table->string('phoneme')->nullable();
            $table->string('audio_url')->nullable();
            $table->json('metadata')->nullable();
        });

        Schema::create('progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->uuid('node_id');
            $table->string('status')->default('locked');
            $table->float('mastered_score')->default(0);
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->foreign('node_id')->references('id')->on('skill_nodes')->cascadeOnDelete();
            $table->unique(['child_id', 'node_id']);
            $table->index('node_id');
        });

        Schema::create('attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->uuid('exercise_id');
            $table->string('item_id')->nullable();
            $table->boolean('is_correct');
            $table->string('error_kind')->nullable();
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->foreign('exercise_id')->references('id')->on('exercises')->cascadeOnDelete();
            $table->index('child_id');
            $table->index('exercise_id');
        });

        Schema::create('rewards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->string('kind'); // gems | badge | effort
            $table->integer('amount')->default(0);
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->index('child_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rewards');
        Schema::dropIfExists('attempts');
        Schema::dropIfExists('progress');
        Schema::dropIfExists('items');
        Schema::dropIfExists('exercises');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('skill_nodes');
    }
};
