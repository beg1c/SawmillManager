<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use App\Models\DailyLog;
use App\Http\Resources\DailyLogResource;
use App\Models\Order;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Http\Resources\CustomerResource;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Models\Equipment;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\DailyProductivityResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getDailyProductivity()
    {
        $querySawmill = request()->query('sawmill');

        if ($querySawmill) {
            $dailyProductivity = DB::table('daily_logs')
                    ->select(
                        'date',
                        DB::raw('(SELECT COALESCE(SUM(quantity), 0) FROM daily_log_product WHERE daily_log_product.daily_log_id = daily_logs.id) as product_quantity'),
                        DB::raw('(SELECT COALESCE(SUM(quantity), 0) FROM daily_log_material WHERE daily_log_material.daily_log_id = daily_logs.id) as material_quantity'),
                        DB::raw('(SELECT COALESCE(SUM(quantity), 0) FROM daily_log_waste WHERE daily_log_waste.daily_log_id = daily_logs.id) as waste_quantity')
                    )
                    ->where('sawmill_id', $querySawmill)
                    ->orderBy('date', 'desc')
                    ->take(7)
                    ->get();
        } else {
            $dailyProductivity = DB::select(
                'WITH
                    logs as (SELECT daily_logs.date date FROM daily_logs),
                    products as (SELECT SUM(daily_log_product.quantity) as quantity, daily_logs.date FROM daily_log_product, daily_logs WHERE daily_log_product.daily_log_id = daily_logs.id group by daily_logs.date),
                    wastes as (SELECT SUM(daily_log_waste.quantity) as quantity, daily_logs.date FROM daily_log_waste, daily_logs WHERE daily_log_waste.daily_log_id = daily_logs.id group by daily_logs.date),
                    materials as (SELECT SUM(daily_log_material.quantity) as quantity, daily_logs.date FROM daily_log_material, daily_logs WHERE daily_log_material.daily_log_id = daily_logs.id group by daily_logs.date)
                SELECT
                    logs.date,
                    products.quantity as product_quantity,
                    wastes.quantity as waste_quantity,
                    materials.quantity as material_quantity
                FROM
                    logs
                LEFT JOIN products ON
                    logs.date = products.date
                LEFT JOIN wastes ON
                    logs.date = wastes.date
                LEFT JOIN materials ON
                    logs.date = materials.date
                GROUP BY
                    logs.date
                LIMIT 7;'
                );
        }

        return DailyProductivityResource::collection($dailyProductivity);
    }

    public function getRecentDailyLogs()
    {
        $pageSize = request()->query('pageSize', 10);
        $querySawmill = request()->query('sawmill');

        $dailyLogs = DailyLog::orderBy('date', 'desc');

        if ($querySawmill) {
            $dailyLogs->where('sawmill_id', 'like', $querySawmill);
        }

        $dailyLogs = $dailyLogs->paginate($pageSize, ['*'], 'current');
        return DailyLogResource::collection($dailyLogs);
    }

    public function getPendingOrders()
    {
        $querySawmill = request()->query('sawmill');

        $orders = Order::where('status', 'Pending')
            ->orderBy('ordered_at', 'asc');

        if ($querySawmill) {
            $orders->where('sawmill_id', 'like', $querySawmill);
        }

        $orders = $orders->get();
        return OrderResource::collection($orders);
    }

    public function getBiggestCustomers()
    {
        $pageSize = request()->query('pageSize', 7);
        $querySawmill = request()->query('sawmill');

        $customers = Customer::withSum('orders', 'amount')
            ->orderByDesc('orders_sum_amount');

        if ($querySawmill) {
            $customers->where('sawmill_id', 'like', $querySawmill);
        }

        $customers = $customers->paginate($pageSize, ['*'], 'current');
        return CustomerResource::collection($customers);
    }

    public function getMostSoldProducts()
    {
        $querySawmill = request()->query('sawmill');

        $products = Product::select('products.*')
                ->join('order_product', 'products.id', '=', 'order_product.product_id');

        if ($querySawmill) {
            $products = $products->join('orders', 'order_product.order_id', '=', 'orders.id')
                    ->where('orders.sawmill_id', $querySawmill);
        }

        $products = $products->selectRaw('products.*, SUM(order_product.quantity) AS total_sold')
                ->groupBy('products.id')
                ->orderByDesc('total_sold')
                ->take(5)
                ->get();

        return ProductResource::collection($products);
    }

    public function getClosestServices()
    {
        $querySawmill = request()->query('sawmill');
        $pageSize = request()->query('pageSize', 5);

        $equipment = Equipment::orderBy('next_service_date', 'asc');

        if ($querySawmill) {
            $equipment->where('sawmill_id', $querySawmill);
        }

        $equipment = $equipment->paginate($pageSize, ['*'], 'current');
        return EquipmentResource::collection($equipment);
    }
}
