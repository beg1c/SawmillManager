<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productDescriptions = [
            'Beam 16x16x400cm' => 'Spruce/fir beam. Fresh sawn.',
            'Beam 16x16x500cm' => 'Spruce/fir beam. Fresh sawn.',
            'Beam 16x16x600cm' => 'Spruce/fir beam. Fresh sawn.',
            'Rafter 10x14x400cm' => 'Spruce/fir rafter. Fresh sawn.',
            'Rafter 10x14x500cm' => 'Spruce/fir rafter. Fresh sawn.',
            'Rafter 10x14x600cm' => 'Spruce/fir rafter. Fresh sawn.',
            'Rafter 10x12x400cm' => 'Spruce/fir rafter. Fresh sawn.',
            'Rafter 10x12x500cm' => 'Spruce/fir rafter. Fresh sawn.',
            'Rafter 10x12x600cm' => 'Spruce/fir rafter. Fresh sawn.',
            'Board length 200cm' => 'Spruce/fir boards. Fresh sawn.',
            'Board length 400cm' => 'Spruce/fir boards. Fresh sawn.',
            'Plank length 200cm' => 'Spruce/fir planks. Fresh sawn.',
            'Plank length 400cm' => 'Spruce/fir planks. Fresh sawn.',
            'Board (Oak) length 200cm+' => 'Oak boards. Fresh sawn.',
            'Plank (Oak) length 200cm+' => 'Oak planks. Fresh sawn.',
        ];

        $name = fake()->unique()->randomElement(array_keys($productDescriptions));
        $description = $productDescriptions[$name];

        $photo = '';

        if (strpos($name, 'Beam') !== false || strpos($name, 'Rafter') !== false) {
            $photo = 'DEMO-beam.jpg';
        } elseif (strpos($name, 'Board') !== false) {
            $photo = 'DEMO-boards.jpg';
        } elseif (strpos($name, 'Plank') !== false) {
            $photo = 'DEMO-planks.jpg';
        }

        return [
            'name' => $name,
            'description' => $description,
            'unit_of_measure'=> 'm3',
            'price' => fake()->randomFloat(2, 0, 400),
            'vat' => fake()->numberBetween(10, 30),
            'photo' => $photo,
        ];
    }
}
