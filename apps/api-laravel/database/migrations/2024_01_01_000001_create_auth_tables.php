<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('role')->default('parent');
            $table->string('status')->default('PENDING_VERIFICATION');
            $table->timestamps();
        });

        Schema::create('children', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('display_name');
            $table->integer('birth_year');
            $table->string('avatar')->nullable();
            $table->string('age_band');
            $table->string('status')->default('INACTIVE');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->index('user_id');
        });

        Schema::create('consents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('child_id');
            $table->integer('version');
            $table->string('status');
            $table->timestamp('granted_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->json('audit');
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->cascadeOnDelete();
            $table->index('child_id');
            $table->unique(['child_id', 'version']);
        });

        Schema::create('email_tokens', function (Blueprint $table) {
            $table->string('token')->primary();
            $table->uuid('user_id');
            $table->timestamp('expires_at');

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_tokens');
        Schema::dropIfExists('consents');
        Schema::dropIfExists('children');
        Schema::dropIfExists('users');
    }
};
