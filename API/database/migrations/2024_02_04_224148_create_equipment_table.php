<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('description')->nullable();
            $table->string('notes')->nullable();
            $table->integer('production_year')->nullable();
            $table->date('last_service_date')->nullable();
            $table->integer('last_service_working_hours')->nullable();
            $table->unsignedBigInteger('sawmill_id')->nullable();
            $table->timestamps();

            $table->foreign('sawmill_id')->references('id')
                ->on('sawmills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
