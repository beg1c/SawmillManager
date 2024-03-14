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
        Schema::table('sawmills', function (Blueprint $table) {
            $table->dropColumn('open_hours');

            $table->time('open_from')->nullable();
            $table->time('open_until')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sawmills', function (Blueprint $table) {
            $table->string('open_hours')->nullable()->after('address');

            $table->dropColumn('open_from');
            $table->dropColumn('open_until');
        });
    }
};
