<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(4, true),
            'type' => fake()->randomElement(['Machine', 'Hand tool', 'Saw', 'Gear']),
            'description' => fake()->sentence(),
            'notes' => fake()->sentence(),
            'production_year' => fake()->randomNumber(4, true),
            'last_service_date' => fake()->date(),
            'last_service_working_hours' => fake()->randomNumber(4, true),
            'photo' => fake()->randomElement(['equipment1.jpg',
                                                'equipment2.jpg',
                                                'equipment3.jpg',
                                                'equipment4.jpg',
                                                'equipment5.jpg',
                                                'equipment6.jpg']),
            'next_service_date' => fake()->dateTimeBetween('+4 week', '+1 year'),
        ];
    }
}
