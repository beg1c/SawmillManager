<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyLog;
use App\Http\Resources\DailyLogResource;
use App\Http\Requests\DailyLogStoreRequest;
use App\Http\Requests\DailyLogUpdateRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use App\Services\InventoryService;

class DailyLogController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        $sortField = request()->query('sort', 'date');
        $sortDirection = request()->query('order', 'desc');
        $pageSize = request()->query('pageSize');
        $querySawmill = request()->query('sawmill');

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        $dailyLogs = DailyLog::whereIn('sawmill_id', $user_sawmill_ids)
                    ->orderBy($sortField, $sortDirection);

        if ($querySawmill) {
            $dailyLogs->where('sawmill_id', 'like', $querySawmill);
        }

        if ($pageSize) {
            $dailyLogs = $dailyLogs->paginate($pageSize, ['*'], 'current');
        }
        else {
            $dailyLogs = $dailyLogs->get();
        }

        return DailyLogResource::collection($dailyLogs);
    }

    public function store(DailyLogStoreRequest $request)
    {
        if (Gate::denies('manage-daily-logs')) {
            return response()->json([
                "message" => "You do not have permission to create daily logs."
            ], 403);
        }

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if(!in_array($request['sawmill.id'], $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to assign logs to sawmill you don't manage."
            ], 403);
        }

        $dailyLog = DailyLog::create($request->all());

        $dailyLog->sawmill()->associate($request['sawmill.id']);

        $dailyLog->save();

        return new DailyLogResource($dailyLog);
    }

    public function show($id)
    {
        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
        $dailyLog = DailyLog::findOrFail($id);

        if (!in_array($dailyLog->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to view daily log assigned to that sawmill."
            ], 403);
        }

        return new DailyLogResource($dailyLog);
    }

    public function update(DailyLogUpdateRequest $request, $id)
    {
        if (Gate::denies('manage-daily-logs')) {
            return response()->json([
                "message" => "You do not have permission to update daily logs."
            ], 403);
        }

        $dailyLog = DailyLog::findorfail($id);

        if ($dailyLog->locked_at !== null) {
            return response()->json([
                "message" => "The daily log is locked and cannot be updated."
            ], 403);
        }

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($dailyLog->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to update logs assigned to that sawmill."
            ], 403);
        }

        if ($request->filled('locked_at')) {
            $dailyLog->locked_at = $request->input('locked_at');
            $this->updateInventoryItems($dailyLog);
            $dailyLog->save();
            return new DailyLogResource($dailyLog);
        }

        if (isset($request['products'])) {
            $this->syncItems($dailyLog, 'products', $request->input('products'));
        }

        if (isset($request['materials'])) {
            $this->syncItems($dailyLog, 'materials', $request->input('materials'));
        }

        if (isset($request['wastes'])) {
            $this->syncItems($dailyLog, 'wastes', $request->input('wastes'));
        }

        $dailyLog->save();

        return new DailyLogResource($dailyLog);
    }

    public function destroy($id)
    {
        if (!Gate::allows('manage-daily-logs')) {
            return response()->json([
                'message' => 'You are not allowed to delete logs.'
            ], 403);
        }

        $dailyLog = DailyLog::findOrFail($id);

        if ($dailyLog->locked_at !== null) {
            return response()->json([
                "message" => "The daily log is locked and cannot be deleted."
            ], 403);
        }

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($dailyLog->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                'message' => 'You are not allowed to delete logs for that sawmill.'
            ], 403);
        }

        $this->syncItems($dailyLog, 'materials', []);
        $this->syncItems($dailyLog, 'products', []);
        $this->syncItems($dailyLog, 'wastes', []);

        $dailyLog->delete();

        return response()->json([
            'message' => 'Daily log deleted.'
        ]);
    }

    private function syncItems($dailyLog, $relation, $items)
    {
        $itemIdsInRequest = collect($items)->pluck('id');

        $existingItemIds = $dailyLog->{$relation}->pluck('id');

        $itemsToDelete = $existingItemIds->diff($itemIdsInRequest);

        $dailyLog->{$relation}()->detach($itemsToDelete);

        foreach ($items as $item) {
            $itemId = $item['id'];
            $quantity = $item['quantity'];

            $existingItem = $dailyLog->{$relation}()->where($relation . '.id', $itemId)->first();

            if ($existingItem && !empty($quantity)) {
                $existingItem->pivot->update(['quantity' => $quantity]);
            } elseif (!empty($quantity)) {
                $dailyLog->{$relation}()->attach($itemId, ['quantity' => $quantity]);
            }
        }
    }

    private function updateInventoryItems($dailyLog)
    {
        foreach ($dailyLog->products as $product) {
            $quantity = $product->pivot->quantity;
            $this->inventoryService->updateInventoryItem('products', $product->id, $quantity, $dailyLog->sawmill->id, "daily_log", $dailyLog->id, null);
        }

        foreach ($dailyLog->materials as $material) {
            $quantity = $material->pivot->quantity;
            $this->inventoryService->updateInventoryItem('materials', $material->id, $quantity, $dailyLog->sawmill->id, "daily_log", $dailyLog->id, null);
        }

        foreach ($dailyLog->wastes as $waste) {
            $quantity = $waste->pivot->quantity;
            $this->inventoryService->updateInventoryItem('wastes', $waste->id, $quantity, $dailyLog->sawmill->id, "daily_log", $dailyLog->id, null);
        }
    }
}
