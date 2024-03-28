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
use App\Models\DailyLog;
use App\Models\InventoryLog;

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
                $order->products()->attach($product, ['quantity' => rand(1000, 100000) / 1000]);
            }
        });

        $sawmills = Sawmill::all();

        $sawmills->each(function ($sawmill) {
            if (!$sawmill->inventory) {
                $inventory = Inventory::create();

                $products = Product::inRandomOrder()->take(rand(3, 6))->get();
                foreach ($products as $product) {
                    $inventory->products()->attach($product, ['quantity' => rand(1000, 100000) / 1000]);
                }

                $materials = Material::inRandomOrder()->take(rand(3, 6))->get();
                foreach ($materials as $material) {
                    $inventory->materials()->attach($material, ['quantity' => rand(1000, 100000) / 1000]);
                }

                $wastes = Waste::inRandomOrder()->take(rand(3, 6))->get();
                foreach ($wastes as $waste) {
                    $inventory->wastes()->attach($waste, ['quantity' => rand(1000, 100000) / 1000]);
                }

                $inventory->sawmill()->associate($sawmill)->save();
            }
        });

        $sawmills->each(function ($sawmill) {
            for ($i = 0; $i < 10; $i++) {
                $date = now()->subDays(rand(1, 30));

                $dailyLog = DailyLog::create([
                    'date' => $date,
                ]);

                $dailyLog->sawmill()->associate($sawmill)->save();

                $dailyLog->products()->attach(Product::inRandomOrder()->take(rand(1, 5))->pluck('id'), ['quantity' => rand(1000, 100000) / 1000]);
                $dailyLog->materials()->attach(Material::inRandomOrder()->take(rand(1, 5))->pluck('id'), ['quantity' => rand(1000, 100000) / 1000]);
                $dailyLog->wastes()->attach(Waste::inRandomOrder()->take(rand(1, 5))->pluck('id'), ['quantity' => rand(1000, 100000) / 1000]);
            }
        });

        $sawmills->each(function ($sawmill) {
            for ($i = 0; $i < 20; $i++) {
                $context = ['user', 'order', 'daily_log'][rand(0, 2)];

                $inventory = $sawmill->inventory;

                $logData = InventoryLog::factory()->make([
                    'context' => $context,
                ]);

                $logData->inventory()->associate($inventory);

                switch ($context) {
                    case 'user':
                        $user = User::inRandomOrder()->first();
                        $logData->user()->associate($user);
                        break;
                    case 'order':
                        $order = Order::inRandomOrder()->first();
                        $logData->order()->associate($order);
                        break;
                    case 'daily_log':
                        $dailyLog = DailyLog::inRandomOrder()->first();
                        $logData->dailyLog()->associate($dailyLog);
                        break;
                }

                $model = ['material', 'product', 'waste'][rand(0, 2)];
                $relatedModel = $model == 'material' ? Material::inRandomOrder()->first() :
                                ($model == 'product' ? Product::inRandomOrder()->first() : Waste::inRandomOrder()->first());

                $relatedModelId = $relatedModel->id;
                $logData->$model()->associate($relatedModel);

                $logData->save();
            }
        });
    }
}
