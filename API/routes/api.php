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

Route::post('login', [AuthController::class,'login']);
Route::post('forgot-password', [AuthController::class,'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class,'logout']);
    Route::patch('change-password/{id}', [AuthController::class,'changePassword']);
    Route::get('users/me', [UserController::class, 'me']);

    Route::patch('orders/update-status/{id}', [OrderController::class,'updateStatus']);

    Route::prefix('dashboard')->group(function () {
        Route::get('recent-daily-logs', [DashboardController::class, 'getRecentDailyLogs']);
        Route::get('get-pending-orders', [DashboardController::class, 'getPendingOrders']);
        Route::get('get-biggest-customers', [DashboardController::class, 'getBiggestCustomers']);
        Route::get('get-most-sold-products', [DashboardController::class, 'getMostSoldProducts']);
        Route::get('get-daily-productivity', [DashboardController::class, 'getDailyProductivity']);
        Route::get('get-closest-services', [DashboardController::class, 'getClosestServices']);
    });

    Route::get('inventory/{type}', [InventoryController::class, 'index']);

    Route::apiResources([
        'sawmills' => SawmillController::class,
        'customers' => CustomerController::class,
        'products' => ProductController::class,
        'equipment' => EquipmentController::class,
        'orders' => OrderController::class,
        'employees' => UserController::class,
        'roles' => RoleController::class,
        'materials' => MaterialController::class,
        'wastes' => WasteController::class,
        'dailylogs' => DailyLogController::class,
    ]);
});




