<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('client_service_activity', function (Blueprint $table) {
            $table->id();
            $table->uuid('client_id');
            $table->uuid('service_activity_id');
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
            $table->foreign('service_activity_id')->references('id')->on('service_activities')->cascadeOnDelete();

            $table->unique(['client_id', 'service_activity_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('client_service_activity');
    }
};
