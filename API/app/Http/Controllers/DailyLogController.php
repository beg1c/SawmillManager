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

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        $dailyLogs = DailyLog::whereIn('sawmill_id', $user_sawmill_ids)
                    ->orderBy($sortField, $sortDirection)->get();

        if ($querySawmill) {
            $dailyLogs->where('sawmill_id', 'like', $querySawmill);
        }

        $dailyLogs = $dailyLogs->paginate($pageSize, ['*'], 'current');

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

        return new DailyLogResource($dailyLog);
    }

    public function show($id)
    {
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

    public function update(DailyLogUpdateRequest $request, $id)
    {
        if (Gate::denies('manage-daily-logs')) {
            return response()->json([
                "message" => "You do not have permission to update daily logs."
            ], 403);
        }

        $dailyLog = DailyLog::findorfail($id);

        $user = Auth::user();
        $user_sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($dailyLog->sawmill->id, $user_sawmill_ids)) {
            return response()->json([
                "message" => "You are not authorized to update logs assigned to that sawmill."
            ], 403);
        }

        if (isset($request['date'])) {
            $dailyLog->update([
                'date' => $request['date']
            ]);
        }

        if (isset($request->sawmill->id)) {
            $dailyLog->sawmill()->associate($request->sawmill->id);
        }

        if (isset($request['products'])) {
            $this->updateOrAttachItems($dailyLog, 'products', $request->input('products'));
        }

        if (isset($request['materials'])) {
            $this->updateOrAttachItems($dailyLog, 'materials', $request->input('materials'));
        }

        if (isset($request['wastes'])) {
            $this->updateOrAttachItems($dailyLog, 'wastes', $request->input('wastes'));
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

    private function updateOrAttachItems($dailyLog, $relation, $items)
    {
        if ($items) {
            foreach ($items as $item) {
                $itemId = $item['id'];
                $quantity = $item['quantity'];

                $existingItem = $dailyLog->{$relation}()->where('id', $itemId)->first();

                if ($existingItem && !empty($quantity)) {
                    $existingItem->pivot->update(['quantity' => $quantity]);
                } elseif (!empty($quantity)) {
                    $dailyLog->{$relation}()->attach($itemId, ['quantity' => $quantity]);
                }
            }
        }
    }
}
