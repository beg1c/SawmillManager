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
        Schema::create('daily_log_product', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('daily_log_id');
            $table->unsignedBigInteger('product_id');
            $table->decimal('quantity', 10, 5)->default(0);
            $table->timestamps();

            $table->foreign('daily_log_id')->references('id')->on('daily_logs')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_log_product');
    }
};
