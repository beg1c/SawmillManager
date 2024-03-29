<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Requests\ProductStoreRequest;
use Illuminate\Support\Facades\Gate;


class ProductController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'id');
        $sortDirection = request()->query('order', 'asc');
        $pageSize = request()->query('pageSize', 10);
        $searchQuery = request()->query('q');

        $products = Product::orderBy($sortField, $sortDirection);

        if ($searchQuery) {
            $products->where('name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('description', 'like', '%' . $searchQuery . '%')
                    ->orWhere('price', 'like', '%' . $searchQuery . '%')
                    ->orWhere('unit_of_measure', 'like', '%' . $searchQuery . '%');
        }

        $products = $products->paginate($pageSize, ['*'], 'current');

        return ProductResource::collection($products);
    }

    public function store(ProductStoreRequest $request)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoname = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-products')) {
            return $this->createProduct($request, $photoName);
        }

        return response()->json([
            "message" => "You are not authorized to create products."
        ], 403);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return new ProductResource($product);
    }

    public function update(ProductStoreRequest $request, $id)
    {
        $photoName = null;
        if ($request->has('photo')) {
            $photoName = $this->savePhoto($request->photo);
        }

        if (Gate::allows('manage-products')) {
            return $this->updateProduct($request, $photoName, $id);
        }

        return response()->json([
            "message" => "You are not authorized to update products."
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

    private function createProduct($request, $photoName)
    {
        $product = Product::create([
            'name' => $request['name'],
            'description' => $request['description'],
            'price' => $request['price'],
            'unit_of_measure' => $request['unit_of_measure'],
            'photo' => $photoName,
        ]);

        return new ProductResource($product);
    }

    private function updateProduct($request, $photoName, $id)
    {
        $product = Product::findOrFail($id);
        $updateData = ([
            'name' => $request['name'],
            'description' => $request['description'],
            'price' => $request['price'],
            'unit_of_measure' => $request['unit_of_measure'],
        ]);

        if ($photoName !== null) {
            $updateData['photo'] = $photoName;
            if ($product->photo !== null) {
                $oldPhoto = public_path('photos') . '/' . $product->photo;
                if(file_exists($oldPhoto)) {
                    //unlink($oldPhoto);
                }
            }
        }

        $product->update($updateData);

        return new ProductResource($product);
    }
}
