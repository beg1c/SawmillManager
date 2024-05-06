<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roles = ['executive', 'manager', 'worker'];
        $roleName = fake()->unique()->randomElement($roles);
        $roleId = array_search($roleName, $roles) + 1;

        return [
            'role_name' => $roleName,
            'id' => $roleId,
        ];
    }
}
