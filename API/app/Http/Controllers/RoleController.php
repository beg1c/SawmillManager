<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Support\Facades\Gate;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return RoleResource::collection($roles);
    }
}
