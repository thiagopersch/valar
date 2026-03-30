<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('url')->unique()->nullable();
            $table->string('field_link_applyment')->unique()->nullable();
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('color_primary')->nullable();
            $table->string('background')->nullable();
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->date('foundation_date')->nullable();
            $table->integer('old_contractual_level')->nullable();
            $table->integer('contractual_level')->nullable();
            $table->integer('potential_level')->nullable();
            $table->string('demand_level')->nullable();
            $table->string('priority_level')->nullable();
            
            // Relacionamentos com usuários (serão adicionados como chaves estrangeiras na migração de usuários)
            $table->uuid('commercial_user_id')->nullable();
            $table->boolean('has_dedicated_customer_success')->default(false);
            $table->uuid('customer_success_user_id')->nullable();
            $table->uuid('project_manager_user_id')->nullable();
            $table->uuid('relationship_manager_user_id')->nullable();
            $table->boolean('has_dedicated_analyst')->default(false);
            $table->uuid('dedicated_analyst_user_id')->nullable();
            
            $table->string('analyst_type')->nullable();
            $table->string('implementation_type')->nullable();
            $table->text('general_observations')->nullable();
            $table->string('health_score')->nullable();
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
        Schema::dropIfExists('clients');
    }
};
