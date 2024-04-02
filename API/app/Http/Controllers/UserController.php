<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AuthController;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Support\Str;


class UserController extends Controller
{
    public function index()
    {
        $sortField = request()->query('sort', 'id');
        $sortDirection = request()->query('order', 'asc');
        $pageSize = request()->query('pageSize', 10);

        $users = User::join('roles', 'users.role_id', '=', 'roles.id')
                    ->orderBy($sortField, $sortDirection)
                    ->paginate($pageSize, ['users.*'], 'current');
        return UserResource::collection($users);
    }

    public function me()
    {
        $user = Auth::user();
        return new UserResource($user);
    }

    public function store(UserStoreRequest $request)
    {
        if (Gate::allows('manage-users')) {
            $avatarName = null;
            if ($request->has('avatar')) {
                $avatarName = $this->savePhoto($request->avatar);
            }

            return $this->createUser($request, $avatarName);
        }

        return response()->json([
            "message" => "You are not authorized to create users."
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return new UserResource($user);
    }

    public function update(UserStoreRequest $request, $id)
    {
        $user = Auth::user();

        if (Gate::allows('manage-users')) {
            $avatarName = null;
            if ($request->has('avatar')) {
                $avatarName = $this->savePhoto($request->avatar);
            }

            return $this->updateUser($request, $avatarName, $id);
        }
        else if ($id == $user->id) {
            $avatarName = null;
            if ($request->has('avatar')) {
                $avatarName = $this->savePhoto($request->avatar);
            }

            return $this->updateSelf($request, $avatarName, $id);
        }

        return response()->json([
            "message" => "You are not authorized to update users."
        ], 403);
    }

    public function destroy($id)
    {
        if (Gate::allows('manage-users')) {
            $user = User::findOrFail($id);
            $avatar = public_path('avatars') . '/' . $user->avatar;
            if(file_exists($avatar)) {
                //unlink($avatar);
            }
            $user->delete();
            return response()->json([
                "message" => "User deleted."
            ]);
        }

        return response()->json([
            "message" => "You are not authorized to delete users."
        ]);
    }

    private function savePhoto($base64Photo)
    {
        $base64_str = substr($base64Photo, strpos($base64Photo, ",") + 1);
        $decodedImage = base64_decode($base64_str);
        $avatarName = time() . '.png';
        file_put_contents(public_path('avatars') . '/' . $avatarName, $decodedImage);
        return $avatarName;
    }

    private function createUser($request, $avatarName)
    {
        $role = Role::findOrFail($request['role.id']);
        $sawmills = $request["sawmills"];
        $randomPassword = Str::random(32);
        $token = Str::random(32);

        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'password' => Hash::make($randomPassword),
            'password_set_token' => Hash::make($token),
            'contact_number' => $request['contact_number'],
            'birthday' => $request['birthday'],
            'avatar' => $avatarName,
        ]);

        $sawmillIds = array_map(function($sawmill) {
            return $sawmill['id'];
        }, $sawmills);

        $user->sawmills()->sync($sawmillIds);
        $user->role()->associate($role);
        $user->save();

        // TODO Send token by email / or don't send instantly, make button for sending later

        return new UserResource($user);
    }

    private function updateUser($request, $avatarName, $id)
    {
        $role = Role::findOrFail($request['role.id']);
        $user = User::findOrFail($id);
        $sawmills = $request["sawmills"];

        if ($user->email != $request['email']) {
            $email = $request->validate([
                'email' => 'unique:users'
            ]);

            $user->update([
                'email' => $email['email'],
            ]);
        }

        $updateData = ([
            'name' => $request['name'],
            'contact_number' => $request['contact_number'],
            'birthday' => $request['birthday'],
        ]);

        if ($avatarName !== null) {
            $updateData['avatar'] = $avatarName;
            if ($user->avatar !== null) {
                $oldAvatar = public_path('avatars') . '/' . $user->avatar;
                if(file_exists($oldAvatar)) {
                    //unlink($oldAvatar);
                }
            }
        }

        $user->update($updateData);

        $sawmillIds = array_map(function($sawmill) {
            return $sawmill['id'];
        }, $sawmills);

        $user->sawmills()->sync($sawmillIds);

        $user->role()->associate($role);
        $user->save();

        return new UserResource($user);
    }

    private function updateSelf($request, $avatarName, $id)
    {
        $user = User::findOrFail($id);

        if ($user->email != $request['email']) {
            $email = $request->validate([
                'email' => 'unique:users'
            ]);

            $user->update([
                'email' => $email['email'],
            ]);
        }

        $updateData = ([
            'name' => $request['name'],
            'contact_number' => $request['contact_number'],
            'birthday' => $request['birthday'],
        ]);

        if ($avatarName !== null) {
            $updateData['avatar'] = $avatarName;
            if ($user->avatar !== null) {
                $oldAvatar = public_path('avatars') . '/' . $user->avatar;
                if(file_exists($oldAvatar)) {
                    //unlink($oldAvatar);
                }
            }
        }

        $user->update($updateData);

        return new UserResource($user);
    }
}
