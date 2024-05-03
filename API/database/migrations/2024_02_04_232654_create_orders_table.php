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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('notes')->nullable();
            $table->date('deadline')->nullable();
            $table->dateTime('ordered_at')->nullable();
            $table->dateTime('ready_at')->nullable();
            $table->dateTime('dispatched_at')->nullable();
            $table->string('status')->default('Pending');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('sawmill_id')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')
                ->on('customers')->onDelete('cascade');
            $table->foreign('sawmill_id')->references('id')
                ->on('sawmills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
