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
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function index()
    {
        $pageSize = request()->query('pageSize', 10);
        $querySawmill = request()->query('sawmill');
        $requestUri = request()->getRequestUri();
        $sawmills = Sawmill::pluck('id')->toArray();

        if ($querySawmill === null || !in_array($querySawmill, $sawmills)) {
            return response()->json([
                'message' => 'Invalid sawmill'
            ], 404);
        }

        if (strpos($requestUri, '/inventory/products') !== false) {
            $inventoryType = 'products';
        } elseif (strpos($requestUri, '/inventory/wastes') !== false) {
            $inventoryType = 'wastes';
        } elseif (strpos($requestUri, '/inventory/materials') !== false) {
            $inventoryType = 'materials';
        } else {
            return response()->json([
                'message' => 'Inventory not found'
            ], 404);
        }

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!Gate::allows('view-all-inventories') && !in_array($querySawmill, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to view that inventory."
            ], 403);
        }

        $inventory = Inventory::findorfail($querySawmill);

        switch ($inventoryType) {
            case 'products':
                $products = $inventory->products()->paginate($pageSize);
                return ProductResource::collection($products);
            case 'materials':
                $materials = $inventory->materials()->paginate($pageSize);
                return MaterialResource::collection($materials);
            case 'wastes':
                $wastes = $inventory->wastes()->paginate($pageSize);
                return WasteResource::collection($wastes);
        }
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

        if ($quantity < 1) {
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
