<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\Product;
use App\Models\Sawmill;
use App\Models\Order;
use App\Models\Role;
use App\Models\Material;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::factory()->count(3)->create();

        Sawmill::factory()->count(3)->create();

        User::factory()->count(10)->create()->each(function ($user) {
            $user->sawmills()->attach(Sawmill::all()->random());
            $user->role()->associate(Role::all()->random())->save();
        });

        Customer::factory()->count(30)->create();

        Product::factory()->count(15)->create();

        Material::factory()->count(15)->create();

        Equipment::factory()->count(15)->create()->each(function ($equipment) {
            $equipment->sawmill()->associate(Sawmill::all()->random())->save();
        });

        Order::factory()->count(50)->create()->each(function ($order) {
            $order->customer()->associate(Customer::all()->random())->save();
            $order->sawmill()->associate(Sawmill::all()->random())->save();

            $products = Product::inRandomOrder()->take(rand(1, 5))->get();
            foreach ($products as $product) {
                $order->products()->attach($product, ['quantity' => rand(1, 10)]);
            }
        });
    }
}
