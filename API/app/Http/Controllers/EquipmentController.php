<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\EquipmentResource;
use App\Http\Requests\EquipmentStoreRequest;
use App\Models\Equipment;
use App\Models\Sawmill;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class EquipmentController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'created_at');
        $sortDirection = request()->query('order', 'desc');
        $pageSize = request()->query('pageSize');

        $user_sawmills_ids = Auth::user()->sawmills()->pluck('sawmill_id')->toArray();
        $equipment = Equipment::whereIn('sawmill_id', $user_sawmills_ids)
                    ->orderBy($sortField, $sortDirection);

        if ($pageSize) {
            $equipment = $equipment->paginate($pageSize, ['*'], 'current');
        }
        else {
            $equipment = $equipment->get();
        }

        return EquipmentResource::collection($equipment);
    }

    public function store(EquipmentStoreRequest $request)
    {
        if (Gate::denies('manage-equipment')) {
            return response()->json([
                "message" => "You do not have permission to create equipment."
            ], 403);
        }

        $user = Auth::user();
        $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($request['sawmill.id'], $sawmill_ids)) {
            return response()->json([
                "message" => "You do not have permission to create equipment for that sawmill."
            ], 403);
        }

        $photoName = null;
        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        return $this->createEquipment($request, $photoName);
    }

    public function show($id)
    {
        $equipment = Equipment::findOrFail($id);

        $user = Auth::user();
        $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($equipment->sawmill_id, $sawmill_ids)) {
            return response()->json([
                'message' => 'You do not have permission to view that equipment.'
            ], 403);
        }

        return new EquipmentResource($equipment);
    }

    public function update(EquipmentStoreRequest $request, $id)
    {
        if (Gate::denies('manage-equipment')) {
            return response()->json([
                "message" => "You do not have permission to update equipment."
            ], 403);
        }

        $user = Auth::user();
        $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($request['sawmill.id'], $sawmill_ids)) {
            return response()->json([
                "message" => "You do not have permission to update equipment for that sawmill."
            ], 403);
        }
        $photoName = null;

        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        return $this->updateEquipment($request, $photoName, $id);
    }

    public function destroy($id)
    {
        if (Gate::denies('manage-equipment')) {
            return response()->json([
                "message" => "You do not have permission to delete equipment."
            ], 403);
        }

        $equipment = Equipment::findOrFail($id);

        $user = Auth::user();
        $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

        if (!in_array($equipment->sawmill_id, $sawmill_ids)) {
            return response()->json([
                "message" => "You do not have permission to delete that equipment."
            ], 403);
        }

        $equipment->delete();
        return response()->json([
            "message" => "Equipment deleted."
        ]);
    }

    private function savePhoto($base64Photo)
    {
        $base64_str = substr($base64Photo, strpos($base64Photo, ",") + 1);
        $decodedImage = base64_decode($base64_str);
        $photoName = time() . '.png';
        file_put_contents(public_path('photos') . '/' . $photoName, $decodedImage);
        return $photoName;
    }

    private function createEquipment($request, $photoName)
    {
        $equipment = Equipment::create([
            'name' => $request['name'],
            'type' => $request['type'],
            'description' => $request['description'],
            'notes' => $request['notes'],
            'production_year' => $request['production_year'],
            'last_service_date' => $request['last_service_date'],
            'last_service_working_hours' => $request['last_service_working_hours'],
            'photo' => $photoName,
            'next_service_date' => $request['next_service_date'],
        ]);

        $equipment->sawmill()->associate($request['sawmill.id']);
        $equipment->save();

        return new EquipmentResource($equipment);
    }

    private function updateEquipment($request, $photoName, $id)
    {
        $updateData = ([
            'name' => $request['name'],
            'type' => $request['type'],
            'description' => $request['description'],
            'notes' => $request['notes'],
            'production_year' => $request['production_year'],
            'last_service_date' => $request['last_service_date'],
            'last_service_working_hours' => $request['last_service_working_hours'],
            'next_service_date' => $request['next_service_date'],
        ]);

        $equipment = Equipment::findOrfail($id);

        if ($photoName !== null) {
            $updateData['photo'] = $photoName;
            if ($equipment->photo !== null) {
                $oldPhoto = public_path('photos') . '/' . $equipment->photo;
                if(file_exists($oldPhoto)) {
                    //unlink($oldPhoto);
                }
            }
        }

        $equipment->update($updateData);
        $equipment->sawmill()->associate($request['sawmill.id']);
        $equipment->save();

        return new EquipmentResource($equipment);
    }
}
