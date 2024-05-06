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
        $equipmentTypes = [
            'STIHL MS 211' => 'Chainsaw',
            'STIHL MS 241' => 'Chainsaw',
            'Husqvarna 365' => 'Chainsaw',
            'Husqvarna 592 XP' => 'Chainsaw',
            'Case 321B' => 'Wheel loader',
            'JCB 4CX' => 'Digger',
            'Woodmizer LT 70' => 'Sawmill',
            'Bauerle' => 'Saw',
            'Wravor X212' => 'Saw',
            'Woodmizer MP365' => 'Saw',
            'Deutz 7006' => 'Tractor',
            'Forestry trailer' => 'Trailer',
            'Linde H35D' => 'Forklift',
            'Linde H40D' => 'Forklift',
            'Woodmizer BMS250' => 'Sharpener',
            'Woodmizer BMT300' => 'Tooth setter',
            'John Deere D140' => 'Lawn mower',
            'Case 1455XL' => 'Tractor',
            'JCB 407 ZX' => 'Wheel loader',
        ];

        $name = fake()->unique()->randomElement(array_keys($equipmentTypes));
        $type = $equipmentTypes[$name];

        $photoMappings = [
            'Chainsaw' => 'DEMO-chainsaw.jpg',
            'Wheel loader' => 'DEMO-wheelloader.jpg',
            'Digger' => 'DEMO-digger.jpg',
            'Sawmill' => 'DEMO-sawmill.jpg',
            'Saw' => 'DEMO-saw.jpg',
            'Tractor' => 'DEMO-tractor.jpg',
            'Trailer' => 'DEMO-trailer.jpg',
            'Forklift' => 'DEMO-forklift.jpg',
            'Sharpener' => 'DEMO-sharpener.jpg',
            'Tooth setter' => 'DEMO-sharpener.jpg',
            'Lawn mower' => 'DEMO-lawnmower.jpg',
        ];

        $photo = $photoMappings[$type];

        return [
            'name' => $name,
            'type' => $type,
            'description' => fake()->sentence(),
            'notes' => fake()->sentence(),
            'production_year' => fake()->numberBetween(1980, 2020),
            'last_service_date' => fake()->date(),
            'last_service_working_hours' => fake()->numberBetween(3000, 20000),
            'photo' => $photo,
            'next_service_date' => fake()->dateTimeBetween('+4 week', '+1 year'),
        ];
    }
}
