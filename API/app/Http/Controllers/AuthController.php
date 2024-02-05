<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\UserResource;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\SetPasswordRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request['email'])->first();

        if(!$user || !Hash::check($request['password'], $user -> password))
        {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        $token = $user->createToken($user->name.'-AuthToken')->plainTextToken;

        return (new UserResource($user))->additional(['data' => [
            'bearer_token' => $token,
        ]]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json([
          "message" => "Successfully logged out."
        ]);
    }

    public function changePassword(ChangePasswordRequest $request, $id)
    {
        $user = Auth::user();

        if($user->id != $id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 401);
        }

        if (!Hash::check($changeData['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid current password.'
            ], 401);
        }

        $user->update([
            'password' => Hash::make($changeData['new_password'])
        ]);

        return response()->json([
            'message' => 'Password successfully changed.'
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $setData = $request->validate([
            'email' => 'required|string|email|exists:users,email'
        ]);

        $token = Str::random(32);
        $user = User::where('email', $setData['email'])->first();

        $user->update([
            'password_set_token' => Hash::make($token)
        ]);

        // TODO Send token by email

        return response()->json([
            "message" => "Email with reset instructions sent."
        ]);
    }

    public function setPassword(SetPasswordRequest $request)
    {
        $user = User::where('email', $request['email'])->first();

        if(!$user || !Hash::check($request['password_set_token'], $user -> password_set_token))
        {
            return response()->json([
                'message' => 'Invalid token.'
            ], 401);
        }

        $user->update([
            'password' => Hash::make($request['password']),
            'password_set_token' => Hash::make(str_random(32)),
        ]);

        return response()->json([
            'message' => 'Password successfully changed.'
        ]);
    }
}
