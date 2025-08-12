<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('coligate', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('client_id');
            $table->string('logo');
            $table->string('name');
            $table->string('email');
            $table->string('cnpj')->unique();
            $table->string('cep');
            $table->string('street');
            $table->string('number');
            $table->string('complement');
            $table->string('district');
            $table->string('city');
            $table->string('state');
            $table->string('country');
            $table->boolean('status')->default(true);
            $table->rememberToken()->unique();
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
        Schema::dropIfExists('coligate');
    }
};
