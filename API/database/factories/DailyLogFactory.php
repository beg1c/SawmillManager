<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyLog>
 */
class DailyLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = fake()->dateTime()->format('Y-m-d H:i:s');
        $lockedAt = fake()->boolean(50) ? $date : null;

        return [
            'date' => fake()->date(),
            'locked_at' => fake()->dateTime(),
        ];
    }
}
