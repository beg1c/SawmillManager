<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryLog>
 */
class InventoryLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'context' => fake()->randomElement(['user', 'order', 'daily_log']),
            'action' => fake()->randomElement(['add', 'reduce', 'delete']),
            'quantity' => fake()->randomFloat(2, 0, 50),
        ];
    }
}
