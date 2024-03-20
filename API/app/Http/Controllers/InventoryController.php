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
use Illuminate\Pagination\LengthAwarePaginator;

class InventoryController extends Controller
{
    public function index()
    {
        $pageSize = request()->query('pageSize', 10);
        $querySawmill = request()->query('sawmill');
        $requestUri = request()->getRequestUri();
        $sawmills = Sawmill::pluck('id')->toArray();
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

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

        if ($querySawmill === null) {
            $inventories = Inventory::whereIn('sawmill_id', $user_sawmill_ids)
                ->with($inventoryType)->get();
            $items = $this->retrieveInventoriesItems($inventories, $inventoryType, $pageSize);
        }
        else {
            if (!Gate::allows('view-all-inventories') && !in_array($querySawmill, $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to view that inventory."
                ], 403);
            }
            $inventory = Inventory::findorfail($querySawmill);
            $items = $inventory->{$inventoryType}()->paginate($pageSize);
        }

        switch ($inventoryType) {
            case 'products':
                return ProductResource::collection($items);
            case 'materials':
                return MaterialResource::collection($items);
            case 'wastes':
                return WasteResource::collection($items);
        }
    }

    public function show()
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
        $querySawmill = request()->query('sawmill');

        if (!$querySawmill) {
            return response()->json([
                "message" => "Specify sawmill in your query."
            ], 400);
        }

        $inventory = Inventory::where('sawmill_id', $querySawmill)->first();

        if (!in_array($querySawmill, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to view that inventory."
            ], 403);
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

    private function retrieveInventoriesItems($inventories, $inventoryType, $pageSize)
    {
        $allItems = [];

        foreach ($inventories as $inventory) {
            foreach ($inventory[$inventoryType] as $item) {
                $itemId = $item['id'];
                $quantity = $item['pivot']['quantity'];

                if (array_key_exists($itemId, $allItems)) {
                    $allItems[$itemId]['quantity'] += $quantity;
                } else {
                    $allItems[$itemId] = $item;
                    $allItems[$itemId]['pivot']['quantity'] = $quantity;
                }
            }
        }

        $allItems = array_values($allItems);

        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $pagedData = array_slice($allItems, ($currentPage - 1) * $pageSize, $pageSize);
        $paginator = new LengthAwarePaginator($pagedData, count($allItems), $pageSize);
        $paginator->setPath(request()->url());

        return $paginator;
    }
}
