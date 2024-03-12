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
use App\Models\Waste;
use App\Models\Inventory;


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

        Waste::factory()->count(15)->create();

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

        $sawmills = Sawmill::all();

        $sawmills->each(function ($sawmill) {
            if (!$sawmill->inventory) {
                $inventory = Inventory::create();

                $products = Product::inRandomOrder()->take(rand(3, 6))->get();
                foreach ($products as $product) {
                    $inventory->products()->attach($product, ['quantity' => rand(10, 100)]);
                }

                $materials = Material::inRandomOrder()->take(rand(3, 6))->get();
                foreach ($materials as $material) {
                    $inventory->materials()->attach($material, ['quantity' => rand(10, 100)]);
                }

                $wastes = Waste::inRandomOrder()->take(rand(3, 6))->get();
                foreach ($wastes as $waste) {
                    $inventory->wastes()->attach($waste, ['quantity' => rand(10, 100)]);
                }

                $inventory->sawmill()->associate($sawmill)->save();
            }
        });
    }
}
