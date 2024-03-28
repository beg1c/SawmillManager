<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Product;
use App\Models\Waste;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\DailyLog;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\InventoryResource;

class InventoryService
{
    public function updateInventoryItem($type, $item_id, $quantity, $sawmill_id, $context = null, $dailyLog_id = null, $order_id = null)
    {
        $user = Auth::user();

        switch ($type) {
            case 'materials':
                $model = Material::find($item_id);
                $relation = 'materials';
                break;
            case 'products':
                $model = Product::find($item_id);
                $relation = 'products';
                break;
            case 'wastes':
                $model = Waste::find($item_id);
                $relation = 'wastes';
                break;
            default:
                return response()->json(['message' => 'Invalid item type.'], 400);
        }

        $inventory = Inventory::where('sawmill_id', $sawmill_id)->first();

        $currentQuantity = $inventory->$relation()->find($model->id)->pivot->quantity ?? 0;

        if ($context === "order") {
            $newQuantity = $currentQuantity - $quantity;
            $quantityDifference = $quantity;
        } else if ($context === "daily_log") {
            if ($relation === "materials") {
                $newQuantity = $currentQuantity - $quantity;
                $quantityDifference = $quantity;
            } else {
                $newQuantity = $currentQuantity + $quantity;
                $quantityDifference = $quantity;
            }
        } else {
            $newQuantity = $quantity;
            $quantityDifference = abs($quantity - $currentQuantity);
        }

        if ($inventory->$relation()->where("{$relation}.id", $model->id)->exists()) {
            $inventory->$relation()->updateExistingPivot($model->id, ['quantity' => $newQuantity]);
        } else {
            $inventory->$relation()->attach($model->id, ['quantity' => $newQuantity]);
        }

        $action = $newQuantity > $currentQuantity ? 'add' : 'reduce';

        $this->logInventory($context, $action, $quantityDifference, $inventory, $type, $user, $dailyLog_id, $order_id, $model);

        return new InventoryResource($inventory);
    }


    public function deleteInventoryItem($type, $item_id, $sawmill_id, $context = null, $dailyLog = null, $order = null)
    {
        $user = Auth::user();

        switch ($type) {
            case 'materials':
                $model = Material::find($item_id);
                $relation = 'materials';
                break;
            case 'products':
                $model = Product::find($item_id);
                $relation = 'products';
                break;
            case 'wastes':
                $model = Waste::find($item_id);
                $relation = 'wastes';
                break;
            default:
                return response()->json(['message' => 'Invalid item type'], 400);
        }

        $inventory = Inventory::where('sawmill_id', $sawmill_id)->first();

        $inventory->$relation()->detach($model->id);

        $this->logInventory($context, "delete", 0, $inventory, $type, $user, $dailyLog, $order, $model);

        return new InventoryResource($inventory);
    }

    protected function logInventory($context, $action, $quantity, $inventory, $type, $user = null, $dailyLog_id = null, $order_id = null, $item)
    {
        $inventoryLog = InventoryLog::create([
            'context' => $context,
            'action' => $action,
            'quantity' => $quantity,
        ]);

        $inventoryLog->inventory()->associate($inventory);

        if ($context === "user") {
            $inventoryLog->user()->associate($user);
        }
        if ($context === "daily_log") {
            $dailyLog = DailyLog::find($dailyLog_id);
            $inventoryLog->dailylog()->associate($dailyLog);
        }
        if ($context === "order") {
            $order = Order::find($order_id);
            $inventoryLog->order()->associate($order);
        }

        switch ($type) {
            case 'materials':
                $inventoryLog->material()->associate($item);
                break;
            case 'products':
                $inventoryLog->product()->associate($item);
                break;
            case 'wastes':
                $inventoryLog->waste()->associate($item);
                break;
            default:
                break;
        }

        $inventoryLog->save();
    }
}
