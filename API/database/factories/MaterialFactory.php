<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $materialDescriptions = [
            'Spruce logs A grade' => 'Fresh spruce A grade logs. Length 2+ meters.',
            'Spruce logs B grade' => 'Fresh spruce B grade logs. Length 2+ meters.',
            'Spruce logs C grade' => 'Fresh spruce C grade logs. Length 2+ meters.',
            'Fir logs A grade' => 'Fresh fir A grade logs. Length 2+ meters.',
            'Fir logs B grade' => 'Fresh fir B grade logs. Length 2+ meters.',
            'Fir logs C grade' => 'Fresh fir C grade logs. Length 2+ meters.',
            'Oak logs A grade' => 'Fresh oak A grade logs. Length 2+ meters.',
            'Oak logs B grade' => 'Fresh oak B grade logs. Length 2+ meters.',
            'Oak logs C grade' => 'Fresh oak C grade logs. Length 2+ meters.',
        ];

        $name = fake()->unique()->randomElement(array_keys($materialDescriptions));
        $description = $materialDescriptions[$name];

        return [
            'name' => $name,
            'description' => $description,
            'unit_of_measure'=> 'm3',
            'price' => fake()->randomFloat(2, 0, 400),
            'photo' => fake()->randomElement(['DEMO-logs1.jpg',
                                                'DEMO-logs2.jpg',
                                                'DEMO-logs3.jpg'])
        ];
    }
}
