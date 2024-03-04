<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Http\Resources\InventoryResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function index()
    {
        if (Gate::allows('view-all-inventories')) {
            $inventories = Inventory::with('wastes', 'materials', 'products')->get();
        }
        else {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            $inventories = Inventory::with('wastes', 'materials', 'products')
                ->whereIn('sawmill_id', $user_sawmill_ids)
                ->get();
        }

        return InventoryResource::collection($inventories);
    }

    public function show(Inventory $inventory)
    {
        if (Gate::allows('view-all-inventories')) {
            $inventory->load('wastes', 'materials', 'products');
        }
        else {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
            $inventory->load('wastes', 'materials', 'products');

            if (!in_array($inventory->sawmill->id, $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to view inventory from that sawmill."
                ], 403);
            }
        }

        return new InventoryResource($inventory);
    }

    /* For simplicity sake we will handle available quantities (adding, subtracting) on front-end
    for now and only send calculated values to API. */
    public function updateItem(InventoryItemRequest $request)
    {
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

        if ($quantity = 0) {
            $inventory->$relation()->detach($model->id);
            return response()->json(['message' => ucfirst($request['type']) . ' deleted from inventory'], 200);
        } else {
            if ($inventory->$relation()->where('id', $model->id)->exists()) {
                $inventory->$relation()->updateExistingPivot($model->id, ['quantity' => $quantity]);
                return response()->json(['message' => ucfirst($request['type']) . ' quantity updated in inventory'], 200);
            } else {
                $inventory->$relation()->attach($model->id, ['quantity' => $quantity]);
                return response()->json(['message' => ucfirst($request['type']) . ' added to inventory'], 200);
            }
        }
    }
}
