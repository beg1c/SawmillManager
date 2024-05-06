<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Waste>
 */
class WasteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $wasteDescriptions = [
            'Hardwood sawdust' => 'Hardwood sawdust. Bulk.',
            'Softwood sawdust' => 'Softwood sawdust. Bulk.',
            'Hardwood offcuts' => 'Hardwood offcuts. Packed.',
            'Softwood offcuts' => 'Softwood offcuts. Packed.',
            'Other waste' => 'Bark, chips and other residue.',
        ];

        $name = fake()->unique()->randomElement(array_keys($wasteDescriptions));
        $description = $wasteDescriptions[$name];

        $photo = '';

        if (strpos($name, 'sawdust') !== false || strpos($name, 'Rafter') !== false) {
            $photo = 'DEMO-sawdust.jpg';
        } elseif (strpos($name, 'offcuts') !== false) {
            $photo = 'DEMO-offcuts.jpg';
        } elseif (strpos($name, 'waste') !== false) {
            $photo = 'DEMO-residue.jpg';
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
