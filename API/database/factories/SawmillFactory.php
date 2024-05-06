<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sawmill>
 */
class SawmillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $openFromHours = ['07', '08', '09'];
        $from = fake()->randomElement($openFromHours);

        $openFrom = '0' . $from . ':00:00';
        $openUntil = $from + 8 . ':00:00';

        return [
            'name' => fake()->unique()->randomElement(['SideWood Lumber', 'EcoWood Works', 'ForestFusion Sawmill', 'LumberMax Sawmill']),
            'address' => fake()->address(),
            'open_from' => $openFrom,
            'open_until' => $openUntil,
        ];
    }
}
