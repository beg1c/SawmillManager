<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyLog;
use App\Http\Resources\DailyLogResource;
use App\Http\Requests\DailyLogStoreRequest;
use App\Http\Requests\DailyLogUpdateRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class DailyLogController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'date');
        $sortDirection = request()->query('order', 'desc');
        $pageSize = request()->query('pageSize', 10);
        $querySawmill = request()->query('sawmill');

        if (Gate::allows('view-all-daily-logs')) {
            $dailyLogs = DailyLog::orderBy($sortField, $sortDirection);
        }
        else {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            $dailyLogs = DailyLog::whereIn('sawmill_id', $user_sawmill_ids)
                        ->orderBy($sortField, $sortDirection)->get();
        }

        if ($querySawmill) {
            $dailyLogs->where('sawmill_id', 'like', $querySawmill);
        }

        $dailyLogs = $dailyLogs->paginate($pageSize, ['*'], 'current');
        return DailyLogResource::collection($dailyLogs);
    }

    public function store(DailyLogStoreRequest $request)
    {
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
        if (Gate::allows('view-all-daily_logs')) {
            $dailyLog = DailyLog::findOrFail($id);
            return new DailyLogResource($dailyLog);
        }
        else {
            $user = Auth::user();
            $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();
            $dailyLog = DailyLog::findOrFail($id);

            if (!in_array($dailyLog->sawmill->id, $user_sawmill_ids)) {
                return response()->json([
                    "message" => "You are not authorized to view daily log assigned to other sawmill."
                ], 403);
            }

            return new DailyLogResource($dailyLog);
        }
    }

    public function update(DailyLogUpdateRequest $request, $id)
    {
        $dailyLog = DailyLog::findorfail($id);

        if (isset($request['date'])) {
            $dailyLog->update([
                'date' => $request['date']
            ]);
        }

        if (isset($request->sawmill->id)) {
            $dailyLog->sawmill()->associate($request->sawmill->id);
            $dailyLog->save();
        }

        if (isset($request['products'])) {
            $products = $request['products'];

            foreach ($products as $product) {
                $productId = $product['id'];
                $quantity = $product['quantity'];

                if (!empty($quantity)) {
                    $dailyLog->products()->attach($productId, ['quantity' => $quantity]);
                }
            }
        }

        if (isset($request['materials'])) {
            $materials = $request['materials'];

            foreach ($materials as $material) {
                $materialId = $material['id'];
                $quantity = $material['quantity'];

                if (!empty($quantity)) {
                    $dailyLog->materials()->attach($materialId, ['quantity' => $quantity]);
                }
            }
        }

        if (isset($request['wastes'])) {
            $wastes = $request['wastes'];

            foreach ($wastes as $waste) {
                $wasteId = $waste['id'];
                $quantity = $waste['quantity'];

                if (!empty($quantity)) {
                    $dailyLog->wastes()->attach($wasteId, ['quantity' => $quantity]);
                }
            }
        }

        return new DailyLogResource($dailyLog);
    }

    public function destroy($id)
    {
        if (!Gate::allows('manage-daily-logs')) {
            return response()->json([
                'message' => 'You are not allowed to manage logs.'
            ], 403);
        }

        $dailyLog = DailyLog::findOrFail($id);

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($dailyLog->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                'message' => 'You are not allowed to delete daily logs for sawmills you do not manage.'
            ], 403);
        }

        $dailyLog->delete();

        return response()->json([
            'message' => 'Daily log deleted.'
        ]);
    }
}
