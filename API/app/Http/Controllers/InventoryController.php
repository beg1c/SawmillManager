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
use App\Http\Requests\InventoryItemStoreRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;

class InventoryController extends Controller
{
    public function show($id)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to view that inventory."
            ], 403);
        }

        $inventory = Inventory::where('sawmill_id', $id)->first();

        return new InventoryResource($inventory);
    }

    public function update(InventoryItemStoreRequest $request, $sawmill_id)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($sawmill_id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to modify that inventory."
            ], 403);
        }

        if (!$request->input('quantity')) {
            return $this->deleteInventoryItem($request->input('type'), $request->input('item_id'), $sawmill_id);
        }

        return $this->updateInventoryItem($request->input('type'), $request->input('item_id'), $request->input('quantity'), $sawmill_id);
    }


    private function updateInventoryItem($type, $item_id, $quantity, $sawmill_id)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($sawmill_id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to modify that inventory."
            ], 403);
        }

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

        if ($inventory->$relation()->where("{$relation}.id", $model->id)->exists()) {
            $inventory->$relation()->updateExistingPivot($model->id, ['quantity' => $quantity]);
        } else {
            $inventory->$relation()->attach($model->id, ['quantity' => $quantity]);
        }

        return new InventoryResource($inventory);
    }

    private function deleteInventoryItem($type, $item_id, $sawmill_id)
    {
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

        return new InventoryResource($inventory);
    }
}
