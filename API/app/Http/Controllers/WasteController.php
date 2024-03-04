<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Waste;
use App\Http\Resources\WasteResource;
use App\Http\Requests\WasteStoreRequest;
use Illuminate\Support\Facades\Gate;

class WasteController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'id');
        $sortDirection = request()->query('order', 'asc');
        $pageSize = request()->query('pageSize', 10);
        $searchQuery = request()->query('q');

        $wastes = Waste::orderBy($sortField, $sortDirection);

        if ($searchQuery) {
            $wastes->where('name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('description', 'like', '%' . $searchQuery . '%')
                    ->orWhere('price', 'like', '%' . $searchQuery . '%')
                    ->orWhere('unit_of_measure', 'like', '%' . $searchQuery . '%');
        }

        $wastes = $wastes->paginate($pageSize, ['*'], 'current');

        return WasteResource::collection($wastes);
    }

    public function store(WasteStoreRequest $request)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoname = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-wastes')) {
            return $this->createWaste($request, $photoName);
        }

        return response()->json([
            "message" => "You are not authorized to create wastes."
        ], 403);
    }

    public function show($id)
    {
        $waste = Waste::findOrFail($id);
        return new WasteResource($waste);
    }

    public function update(WasteStoreRequest $request, $id)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-wastes')) {
            return $this->updateWaste($request, $photoName, $id);
        }

        return response()->json([
            "message" => "You are not authorized to update wastes."
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

    private function createWaste($request, $photoName)
    {
        $waste = Waste::create([
            'name' => $request['name'],
            'description' => $request['description'],
            'price' => $request['price'],
            'unit_of_measure' => $request['unit_of_measure'],
            'photo' => $photoName,
        ]);

        return new WasteResource($waste);
    }

    private function updateWaste($request, $photoName, $id)
    {
        $waste = Waste::findOrFail($id);
        $updateData = ([
            'name' => $request['name'],
            'description' => $request['description'],
            'price' => $request['price'],
            'unit_of_measure' => $request['unit_of_measure'],
        ]);

        if ($photoName !== null) {
            $updateData['photo'] = $photoName;
            if ($waste->photo !== null) {
                $oldPhoto = public_path('photos') . '/' . $waste->photo;
                if(file_exists($oldPhoto)) {
                    //unlink($oldPhoto);
                }
            }
        }

        $waste->update($updateData);

        return new WasteResource($waste);
    }
}
