<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => fake()->randomFloat(2, 0, 2000),
            'notes' => fake()->randomElement(['Put stickers every 50 cm', 'Do not store outside', 'Asked for delivery', 'Check with customer before sawing', null]),
            'deadline' => fake()->dateTimeBetween('+2 week', '+10 week'),
            'ordered_at' => fake()->dateTimeBetween('-10 week', '-8 week'),
            'status' => fake()->randomElement(['Pending', 'Ready', 'Dispatched'])
        ];
    }
}
