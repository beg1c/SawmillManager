<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderStatusRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'ordered_at');
        $sortDirection = request()->query('order', 'desc');
        $pageSize = request()->query('pageSize');
        $queryStatuses = request()->query('status', []);
        $queryCustomer = request()->query('customer');
        $querySawmill = request()->query('sawmill');

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        $orders = Order::whereIn('sawmill_id', $user_sawmill_ids)
                    ->orderBy($sortField, $sortDirection);

        if ($queryStatuses) {
            $orders->whereIn('status', $queryStatuses);
        }

        if ($queryCustomer) {
            $orders->where('customer_id', 'like', $queryCustomer);
        }

        if ($querySawmill) {
            $orders->where('sawmill_id', 'like', $querySawmill);
        }

        if ($pageSize) {
            $orders = $orders->paginate($pageSize, ['*'], 'current');
        }
        else {
            $orders = $orders->get();
        }

        return OrderResource::collection($orders);
    }

    public function store(OrderStoreRequest $request)
    {
        if (Gate::denies('manage-orders')) {
            return response()->json([
                "message" => "You are not authorized to create orders."
            ], 403);
        }

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($request['sawmill.id'], $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to assign order to that sawmill."
            ], 403);
        }

        return $this->createOrder($request);
    }

    public function show($id)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
        $order = Order::findOrFail($id);

        if (!in_array($order->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to view order assigned to that sawmill."
            ], 403);
        }

        return new OrderResource($order);
    }

    // public function update(OrderStoreRequest $request, $id)
    // {
    //     if (Gate::denies('manage-orders')) {
    //         return response()->json([
    //             "message" => "You are not authorized to update orders."
    //         ], 403);
    //     }

    //     $user = Auth::user();
    //     $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

    //     if(!in_array($order->sawmill->id, $user_sawmill_ids)) {
    //         return response()->json([
    //             "message" => "You are not authorized to update order assigned to that sawmill."
    //         ], 403);
    //     }

    //     return $this->updateOrder($request, $id);
    // }

    public function updateStatus(OrderStatusRequest $request, $id)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
        $order = Order::findOrFail($id);

        if(!in_array($order->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to update order assigned to that sawmill."
            ], 403);
        }

        $status = $request['status'];
        $ready_at = date('Y-m-d H:i:s', strtotime($request['ready_at']));
        $dispatched_at = date('Y-m-d H:i:s', strtotime($request['dispatched_at']));

        if ($status === 'Dispatched') {
            if (!isset($order->ready_at)) {
                $order->update([
                    'ready_at' => $dispatched_at,
                    'dispatched_at' => $dispatched_at,
                    'status' => $status,
                ]);
            }
            else {
                $order->update([
                    'dispatched_at' => $dispatched_at,
                    'status' => $status,
                ]);
            }
        }
        else if ($status === 'Ready') {
            $order->update([
                'ready_at' => $ready_at,
                'status' => $status,
            ]);
        }

        return new OrderResource($order);
    }

    public function destroy($id)
    {
        if (Gate::denies('manage-orders')) {
            return response()->json([
                "message" => "You are not authorized to delete orders."
            ]);
        }

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
        $order = Order::findOrFail($id);

        if(!in_array($order->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to delete order assigned to that sawmill."
            ], 403);
        }

        $order->delete();
        return response()->json([
            "message" => "Order deleted."
        ]);
    }

    private function createOrder($request)
    {
        $order = Order::create($request->all());
        $amount = 0;

        $products = $request['products'];

        foreach ($products as $product) {
            $productId = $product['id'];
            $quantity = $product['quantity'];

            if (!empty($quantity)) {
                $order->products()->attach($productId, ['quantity' => $quantity]);
                $amount += $quantity * $product['price'];
            }
        }

        $order->customer()->associate($request['customer.id']);
        $order->sawmill()->associate($request['sawmill.id']);
        $order->update([
            'amount' => $amount,
        ]);

        return new OrderResource($order);
    }

    // public function updateOrder($request, $id)
    // {
    //     $order = Order::findOrFail($id);
    //     $order->customer()->associate($request['customer.id']);
    //     $order->sawmill()->associate($request['sawmill.id']);
    //     $amount = $order->amount;

    //     $products = $request['products'];

    //     foreach ($products as $product) {
    //         $productId = $product['id'];
    //         $quantity = $product['quantity'];

    //         if (!empty($quantity)) {
    //             $order->products()->attach($productId, ['quantity' => $quantity]);
    //             $amount += $quantity * $product['price'];
    //         }
    //     }

    //     $order->update([
    //         'amount' => $amount,
    //     ]);

    //     return new OrderResource($order);
    // }
}
