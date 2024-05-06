<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'contact_number' => fake()->phoneNumber(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('sawmill-manager'),
            'password_set_token' => Hash::make(Str::random(32)),
            'remember_token' => Str::random(10),
            'birthday' => fake()->date(),
            'role_id' => 3,
            'avatar' => fake()->randomElement(['DEMO-avatar1.jpg',
                                                'DEMO-avatar2.jpg',
                                                'DEMO-avatar3.jpg',
                                                'DEMO-avatar4.jpg',
                                                'DEMO-avatar5.jpg',
                                                'DEMO-avatar6.jpg',
                                                'DEMO-avatar7.jpg'])
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
