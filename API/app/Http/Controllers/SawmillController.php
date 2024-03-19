<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\SawmillResource;
use App\Http\Requests\SawmillStoreRequest;
use App\Models\Sawmill;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class SawmillController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $sawmills = $user->sawmills;

        return SawmillResource::collection($sawmills);
    }

    public function store(SawmillStoreRequest $request)
    {
        if (Gate::denies('manage-sawmills')) {
            return response()->json([
                "message" => "You must are not authorized to create sawmills.",
            ], 403);
        }

        $sawmill = Sawmill::create($request->all());
        return new SawmillResource($sawmill);
    }

    public function show($id)
    {
        $sawmill = Sawmill::findOrFail($id);

        $user = Auth::user();
        if ($user->sawmills->contains($sawmill)) {
            return new SawmillResource($sawmill);
        }
        else {
            return response()->json([
                "message" => "You are not authorized to view that sawmill."
            ], 403);
        }
    }

    public function update(SawmillStoreRequest $request, $id)
    {
        if (Gate::denies('manage-sawmills')) {
            return response()->json([
                "message" => "You are not authorized to update sawmills."
            ], 403);
        }

        $sawmill = Sawmill::findOrFail($id);
        $sawmill->update($request->all());
        return new SawmillResource($sawmill);
    }

    public function destroy($id)
    {
        if (Gate::denies('manage-sawmills')) {
            return response()->json([
                "message" => "You are not authorized to delete sawmills."
            ], 403);
        }

        $sawmill = Sawmill::firstOrFail($id);
        $sawmill->delete();
        return response()->json([
            "message" => "Sawmill deleted."
        ]);
    }
}
