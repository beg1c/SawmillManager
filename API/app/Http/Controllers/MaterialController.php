<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Http\Resources\MaterialResource;
use App\Http\Requests\MaterialStoreRequest;
use Illuminate\Support\Facades\Gate;


class MaterialController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'id');
        $sortDirection = request()->query('order', 'asc');
        $pageSize = request()->query('pageSize', 10);
        $searchQuery = request()->query('q');

        $materials = Material::orderBy($sortField, $sortDirection);

        if ($searchQuery) {
            $materials->where('name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('description', 'like', '%' . $searchQuery . '%')
                    ->orWhere('price', 'like', '%' . $searchQuery . '%')
                    ->orWhere('unit_of_measure', 'like', '%' . $searchQuery . '%');
        }

        $materials = $materials->paginate($pageSize, ['*'], 'current');

        return MaterialResource::collection($materials);
    }

    public function store(MaterialStoreRequest $request)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoname = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-materials')) {
            return $this->createMaterial($request, $photoName);
        }

        return response()->json([
            "message" => "You are not authorized to create materials."
        ], 403);
    }

    public function show($id)
    {
        $material = Material::findOrFail($id);
        return new MaterialResource($material);
    }

    public function update(MaterialStoreRequest $request, $id)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-materials')) {
            return $this->updateMaterial($request, $photoName, $id);
        }

        return response()->json([
            "message" => "You are not authorized to update materials."
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

    private function createMaterial($request, $photoName)
    {
        $material = Material::create([
            'name' => $request['name'],
            'description' => $request['description'],
            'price' => $request['price'],
            'unit_of_measure' => $request['unit_of_measure'],
            'photo' => $photoName,
        ]);

        return new MaterialResource($material);
    }

    private function updateMaterial($request, $photoName, $id)
    {
        $material = Material::findOrFail($id);
        $updateData = ([
            'name' => $request['name'],
            'description' => $request['description'],
            'price' => $request['price'],
            'unit_of_measure' => $request['unit_of_measure'],
        ]);

        if ($photoName !== null) {
            $updateData['photo'] = $photoName;
            if ($material->photo !== null) {
                $oldPhoto = public_path('photos') . '/' . $material->photo;
                if(file_exists($oldPhoto)) {
                    //unlink($oldPhoto);
                }
            }
        }

        $material->update($updateData);

        return new MaterialResource($material);
    }
}
