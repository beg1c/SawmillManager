<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Product;
use App\Models\Waste;
use App\Models\Inventory;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\InventoryResource;

class InventoryService
{
    public function updateInventoryItem($type, $item_id, $quantity, $sawmill_id)
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


    public function deleteInventoryItem($type, $item_id, $sawmill_id)
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
