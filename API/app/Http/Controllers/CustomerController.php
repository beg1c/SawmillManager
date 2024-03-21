<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CustomerResource;
use App\Http\Requests\CustomerStoreRequest;
use App\Models\Customer;
use Illuminate\Support\Facades\Gate;

class CustomerController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'created_at');
        $sortDirection = request()->query('order', 'desc');
        $pageSize = request()->query('pageSize');
        $searchQuery = request()->query('q');

        $customers = Customer::orderBy($sortField, $sortDirection);

        if ($searchQuery) {
            $customers->where('name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('contact_number', 'like', '%' . $searchQuery . '%')
                    ->orWhere('address', 'like', '%' . $searchQuery . '%');
        }

        if ($pageSize) {
            $customers = $customers->paginate($pageSize, ['*'], 'current');
        } else {
            $customers = $customers->get();
        }

        return CustomerResource::collection($customers);
    }

    public function store(CustomerStoreRequest $request)
    {
        if (Gate::authorize('manage-customers')) {
            $customer = Customer::create(($request->all()));
            return new CustomerResource($customer);
        }

        return response()->json([
            "message" => "You do not have permission to create customers."
        ], 403);
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return new CustomerResource($customer);
    }

    public function update(CustomerStoreRequest $request, Customer $customer)
    {
        if (Gate::allows('manage-customers')) {
            $customer->update($request->all());
            return new CustomerResource($customer);
        }

        return response()->json([
            "message" => "You do not have permission to update customers."
        ], 403);
    }

    public function destroy($id)
    {
        if (Gate::allows('manage-customers')) {
            $customer = Customer::findOrFail($id);
            $customer->delete();
            return response()->json([
                "message" => "Customer deleted."
            ]);
        }

        return response()->json([
            "message" => "You do not have permission to delete customers."
        ], 403);
    }
}
