<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('system', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Chaves estrangeiras para coligate e clients
            $table->foreignUuid('coligate_id')->nullable()->constrained('coligate')->onDelete('set null');
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->onDelete('set null');
            
            $table->string('code');
            $table->string('name');
            $table->string('fantasy_name');
            $table->text('description')->nullable();
            $table->boolean('status')->default(true);
            $table->rememberToken()->unique();
            
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('system');
    }
};
