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
        $sortField = request()->query('sort', 'id');
        $sortDirection = request()->query('order', 'asc');
        $pageSize = request()->query('pageSize', 25);

        if (Gate::allows('view-all-equipment')) {
            $equipment = Equipment::orderBy($sortField, $sortDirection)
                        ->paginate($pageSize, ['*'], 'current');
        }
        else {
            $user_sawmills_ids = Auth::user()->sawmills()->pluck('sawmill_id')->toArray();
            $equipment = Equipment::whereIn('sawmill_id', $user_sawmills_ids)
                        ->orderBy($sortField, $sortDirection)
                        ->paginate($pageSize, ['*'], 'current');
        }

        return EquipmentResource::collection($equipment);
    }

    public function store(EquipmentStoreRequest $request)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-all-equipment')) {
            return $this->createEquipment($request, $photoName);
        }

        if (Gate::allows('manage-equipment-associated-sawmills')) {
            $user = Auth::user();
            $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if (!in_array($request['sawmill.id'], $sawmill_ids)) {
                return response()->json([
                    "message" => "You do not have permission to create equipment for that sawmill."
                ], 403);
            }

            return $this->createEquipment($request, $photoName);
        }

        return response()->json([
            "message" => "You do not have permission to create equipment."
        ], 403);
    }

    public function show($id)
    {
        $equipment = Equipment::findOrFail($id);

        if (Gate::allows('view-all-equipment')) {
            return new EquipmentResource($equipment);
        }
        else {
            $user = Auth::user();
            $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if (!in_array($equipment->sawmill_id, $sawmill_ids)) {
                return response()->json([
                    'message' => 'You do not have permission to view that equipment.'
                ], 403);
            }

            return new EquipmentResource($equipment);
        }
    }

    public function update(EquipmentStoreRequest $request, $id)
    {
        $equipment = Equipment::findOrfail($id);
        $photoName = null;

        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-all-equipment')) {
            return $this->updateEquipment($request, $photoName, $id);
        }

        if (Gate::allows('manage-equipment-associated-sawmills')) {
            $user = Auth::user();
            $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if (!in_array($request['sawmill.id'], $sawmill_ids)) {
                return response()->json([
                    "message" => "You do not have permission to update equipment for that sawmill."
                ], 403);
            }

            return $this->updateEquipment($request, $photoName, $id);
        }

        return response()->json([
            "message" => "You do not have permission to update equipment."
        ], 403);
    }

    public function destroy($id)
    {
        $equipment = Equipment::findOrFail($id);

        if (Gate::allows('manage-all-equipment')) {
            $equipment->delete();
            return response()->json([
                "message" => "Equipment deleted."
            ]);
        }

        if (Gate::allows('manage-equipment-associated-sawmills')) {
            $user = Auth::user();
            $sawmill_ids = $user->sawmills()->pluck('sawmill_id')->toArray();

            if (!in_array($equipment->sawmill_id, $sawmill_ids)) {
                return response()->json([
                    "message" => "You do not have permission to delete that equipment."
                ], 403);
            }

            $equipment = Equipment::findOrFail($id);
                $equipment->delete();
                return response()->json([
                    "message" => "Equipment deleted."
                ]);
        }

        return response()->json([
            "message" => "You do not have permission to delete equipment."
        ], 403);
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

    private function updateEquipment($request, $photoname, $id)
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
