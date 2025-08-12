<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('profile_permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('coligate_id');
            $table->uuid('client_id');
            $table->uuid('profile_id');
            $table->uuid('permission_id');
            $table->boolean('read');
            $table->boolean('write');
            $table->boolean('delete');
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('profile_permissions');
    }
};
