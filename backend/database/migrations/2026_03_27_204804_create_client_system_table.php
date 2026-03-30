<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('client_system', function (Blueprint $table) {
            $table->id();
            $table->uuid('client_id');
            $table->uuid('system_id');
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
            $table->foreign('system_id')->references('id')->on('system')->cascadeOnDelete();

            $table->unique(['client_id', 'system_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('client_system');
    }
};
