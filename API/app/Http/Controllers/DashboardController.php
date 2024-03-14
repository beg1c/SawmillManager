<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyLog;
use App\Http\Resources\DailyLogResource;
use App\Models\Order;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Http\Resources\CustomerResource;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
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
        $pageSize = request()->query('pageSize', 5);
        $querySawmill = request()->query('sawmill');

        $customers = Customer::withSum('orders', 'amount')
            ->orderByDesc('orders_sum_amount');

        if ($querySawmill) {
            $customers->where('sawmill_id', 'like', $querySawmill);
        }

        $customers = $customers->paginate($pageSize, ['*'], 'current');
        return CustomerResource::collection($customers);
    }


}
