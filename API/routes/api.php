<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SawmillController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class,'login']);
Route::post('logout', [AuthController::class,'logout'])
    ->middleware('auth:sanctum');
Route::patch('orders/update-status/{id}', [OrderController::class,'updateStatus'])
    ->middleware('auth:sanctum');
Route::get('users/me', [UserController::class, 'me'])
    ->middleware('auth:sanctum');;
Route::post('forgot-password', [AuthController::class,'forgotPassword']);
Route::patch('change-password/{id}', [AuthController::class,'changePassword'])
    ->middleware('auth:sanctum');


Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('sawmills', SawmillController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('employees', UserController::class);
    Route::apiResource('roles', RoleController::class);
});




