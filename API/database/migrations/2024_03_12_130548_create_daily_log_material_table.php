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
        Schema::create('daily_log_material', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('daily_log_id');
            $table->unsignedBigInteger('material_id');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->foreign('daily_log_id')->references('id')->on('daily_logs')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_log_material');
    }
};
