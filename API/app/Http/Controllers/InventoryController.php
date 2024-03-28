<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Http\Resources\InventoryResource;
use App\Http\Requests\InventoryItemStoreRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Services\InventoryService;

class InventoryController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

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
            return $this->inventoryService->deleteInventoryItem($request->input('type'), $request->input('item_id'), $sawmill_id, "user");
        }

        return $this->inventoryService->updateInventoryItem($request->input('type'), $request->input('item_id'), $request->input('quantity'), $sawmill_id, "user");
    }
}
