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
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\WasteController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\DailyLogController;
use App\Http\Controllers\DashboardController;


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
    ->middleware('auth:sanctum');
Route::post('forgot-password', [AuthController::class,'forgotPassword']);
Route::patch('change-password/{id}', [AuthController::class,'changePassword'])
    ->middleware('auth:sanctum');
Route::get('inventory/{type}', [InventoryController::class, 'index'])
    ->middleware('auth:sanctum');
Route::get('dashboard/recent-daily-logs', [DashboardController::class, 'getRecentDailyLogs'])
    ->middleware('auth:sanctum');
Route::get('dashboard/get-pending-orders', [DashboardController::class, 'getPendingOrders'])
    ->middleware('auth:sanctum');
Route::get('dashboard/get-biggest-customers', [DashboardController::class, 'getBiggestCustomers'])
    ->middleware('auth:sanctum');
Route::get('dashboard/get-recent-daily-logs', [DashboardController::class, 'getRecentDailyLogs'])
    ->middleware('auth:sanctum');
Route::get('dashboard/get-most-sold-products', [DashboardController::class, 'getMostSoldProducts'])
    ->middleware('auth:sanctum');
Route::get('dashboard/get-daily-productivity', [DashboardController::class, 'getDailyProductivity'])
    ->middleware('auth:sanctum');
Route::get('dashboard/get-closest-services', [DashboardController::class, 'getClosestServices'])
    ->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('sawmills', SawmillController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('employees', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('materials', MaterialController::class);
    Route::apiResource('wastes', WasteController::class);
    Route::apiResource('dailylogs', DailyLogController::class);
});




