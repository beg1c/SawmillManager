<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\Sawmill;
use App\Models\Product;
use App\Models\Material;
use App\Models\Waste;
use App\Http\Resources\InventoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\WasteResource;
use App\Http\Resources\MaterialResource;
use App\Http\Requests\InventoryItemRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;

class InventoryController extends Controller
{
    public function showInventory()
    {

        if (!request()->has('sawmill')) {
            return response()->json([
                "message" => "Please specify inventory sawmill in query string."
            ], 400);
        }

        $querySawmill = request()->query('sawmill');
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($querySawmill, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to view that inventory."
            ], 403);
        }

        $inventory = Inventory::where('sawmill_id', $querySawmill)->first();

        return new InventoryResource($inventory);
    }

    public function addItemToInventory(InventoryItemRequest $request)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($request['inventory_id'], $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to modify that inventory."
            ], 403);
        }

        switch ($request['type']) {
            case 'material':
                $model = Material::find($request['item_id']);
                $relation = 'materials';
                break;
            case 'product':
                $model = Product::find($request['item_id']);
                $relation = 'products';
                break;
            case 'waste':
                $model = Waste::find($request['item_id']);
                $relation = 'wastes';
                break;
            default:
                return response()->json(['message' => 'Invalid item type'], 400);
        }

        $inventory = Inventory::findOrFail($request['inventory_id']);
        $quantity = $request['quantity'];

        if ($inventory->$relation()->where("{$relation}.id", $model->id)->exists()) {
            return response()->json(['message' => ucfirst($request['type']) . ' already exists in inventory'], 400);
        }

        $inventory->$relation()->attach($model->id, ['quantity' => $quantity]);

        return new InventoryResource($inventory);
    }

    public function updateItemInInventory(InventoryItemRequest $request)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($request['inventory_id'], $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to modify that inventory."
            ], 403);
        }

        switch ($request['type']) {
            case 'material':
                $model = Material::find($request['item_id']);
                $relation = 'materials';
                break;
            case 'product':
                $model = Product::find($request['item_id']);
                $relation = 'products';
                break;
            case 'waste':
                $model = Waste::find($request['item_id']);
                $relation = 'wastes';
                break;
            default:
                return response()->json(['message' => 'Invalid item type'], 400);
        }

        $inventory = Inventory::findOrFail($request['inventory_id']);
        $quantity = $request['quantity'];

        if ($inventory->$relation()->where("{$relation}.id", $model->id)->exists()) {
            $inventory->$relation()->updateExistingPivot($model->id, ['quantity' => $quantity]);
        }

        return new InventoryResource($inventory);
    }

    public function deleteItemFromInventory(InventoryItemRequest $request)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($request['inventory_id'], $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to modify that inventory."
            ], 403);
        }

        switch ($request['type']) {
            case 'material':
                $model = Material::find($request['item_id']);
                $relation = 'materials';
                break;
            case 'product':
                $model = Product::find($request['item_id']);
                $relation = 'products';
                break;
            case 'waste':
                $model = Waste::find($request['item_id']);
                $relation = 'wastes';
                break;
            default:
                return response()->json(['message' => 'Invalid item type'], 400);
        }

        $inventory = Inventory::findOrFail($request['inventory_id']);

        $inventory->$relation()->detach($model->id);

        return new InventoryResource($inventory);
    }
}
