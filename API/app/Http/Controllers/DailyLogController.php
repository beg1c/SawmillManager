<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyLog;
use App\Http\Resources\DailyLogResource;
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
}
