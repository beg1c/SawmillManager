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
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'unit_of_measure'=> fake()->randomElement(['Cubic meter', 'Piece']),
            'price' => fake()->randomNumber(2, true),
            'photo' => fake()->randomElement(['product1.jpg',
                                                'product2.jpg',
                                                'product3.jpg',
                                                'product4.jpg',
                                                'product5.jpg',
                                                'product6.jpg',
                                                'product7.jpg'])
        ];
    }
}
