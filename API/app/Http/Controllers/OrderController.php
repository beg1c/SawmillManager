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
        $sortField = request()->query('sort', 'id');
        $sortDirection = request()->query('order', 'asc');
        $pageSize = request()->query('pageSize', 10);
        $queryStatuses = request()->query('status', []);
        $queryCustomer = request()->query('customer');
        $querySawmill = request()->query('sawmill');

        if (Gate::allows('view-all-orders')) {
            $orders = Order::orderBy($sortField, $sortDirection);
        }
        else {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            $orders = Order::whereIn('sawmill_id', $user_sawmill_ids)
                        ->orderBy($sortField, $sortDirection)->get();
        }

        if ($queryStatuses) {
            $orders->whereIn('status', $queryStatuses);
        }

        if ($queryCustomer) {
            $orders->where('customer_id', 'like', $queryCustomer);
        }

        if ($querySawmill) {
            $orders->where('sawmill_id', 'like', $querySawmill);
        }

        $orders = $orders->paginate($pageSize, ['*'], 'current');
        return OrderResource::collection($orders);
    }

    public function store(OrderStoreRequest $request)
    {
        if (Gate::allows('manage-all-orders')) {
            return $this->createOrder($request);
        }
        else if (Gate::allows('manage-orders-associated-sawmills')) {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if (!in_array($request['sawmill.id'], $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to assign order to that sawmill."
                ], 403);
            }

            return $this->createOrder($request);
        }
        else {
            return response()->json([
                "message" => "You are not authorized to create orders."
            ], 403);
        }
    }

    public function show($id)
    {
        if (Gate::allows('view-all-orders')) {
            $order = Order::findOrFail($id);
            return new OrderResource($order);
        }
        else {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
            $order = Order::findOrFail($id);

            if (!in_array($order->sawmill->id, $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to view order assigned to other sawmill."
                ], 403);
            }

            return new OrderResource($order);
        }
    }

    public function update(OrderStoreRequest $request, $id)
    {
        if (Gate::allows('manage-all-orders')) {
            return $this->updateOrder($request, $id);
        }

        if (Gate::allows('manage-orders-associated-sawmills')) {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if(!in_array($order->sawmill->id, $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to update order assigned to other sawmill."
                ], 403);
            }

            return $this->updateOrder($request, $id);
        }

        return response()->json([
            "message" => "You are not authorized to update orders."
        ], 403);
    }

    public function updateStatus(OrderStatusRequest $request, $id)
    {
        $order = Order::findOrFail($id);
        $status = $request['status'];
        $ready_at = date('Y-m-d H:i:s', strtotime($request['ready_at']));
        $dispatched_at = date('Y-m-d H:i:s', strtotime($request['dispatched_at']));

        if ($status === 'Dispatched') {
            $order->update([
                'ready_at' => $dispatched_at,
                'dispatched_at' => $dispatched_at,
                'status' => $status,
            ]);
        }
        else if ($status === 'Ready') {
            $order->update([
                'ready_at' => $ready_at,
                'status' => $status,
            ]);
        }

        $order->save();

        return new OrderResource($order);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        if (Gate::allows('manage-all-orders')) {
            $order->delete();
            return response()->json([
                "message" => "Order deleted."
            ]);
        }
        else if (Gate::allows('manage-orders-associated-sawmills')) {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if(!in_array($user->sawmill, $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to delete orders assigned to sawmills you don't manage."
                ], 403);
            }

            $order->delete();
            return response()->json([
                "message" => "Order deleted."
            ]);
        }

        return response()->json([
            "message" => "You are not authorized to delete orders."
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
        $order->save();

        return new OrderResource($order);
    }

    public function updateOrder($request, $id)
    {
        $order = Order::findOrFail($id);
        $order->customer()->associate($request['customer.id']);
        $order->sawmill()->associate($request['sawmill.id']);
        $order->save();

        $products = $request['products'];

        foreach ($products as $product) {
            $productId = $product['id'];
            $quantity = $product['quantity'];

            if (!empty($quantity)) {
                $order->products()->attach($productId, ['quantity' => $quantity]);
            }
        }

        return new OrderResource($order);
    }
}
