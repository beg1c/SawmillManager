<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Customers
        Gate::define('manage-customers', function ($user) {
            return in_array($user->role->role_name, ['executive', 'manager']);
        });

        // Equipment
        Gate::define('manage-equipment', function ($user) {
            return $user->role->role_name === 'executive';
        });

        // Orders
        Gate::define('manage-orders', function ($user) {
            return in_array($user->role->role_name, ['executive', 'manager']);
        });

        // Products
        Gate::define('manage-products', function ($user) {
            return in_array($user->role->role_name, ['executive', 'manager']);
        });

        // Sawmills
        Gate::define('manage-sawmills', function ($user) {
            return $user->role->role_name === 'executive';
        });

        // Users
        Gate::define('manage-users', function ($user) {
            return $user->role->role_name === 'executive';
        });

        // Materials
        Gate::define('manage-materials', function ($user) {
            return in_array($user->role->role_name, ['executive', 'manager']);
        });

        // Wastes
        Gate::define('manage-wastes', function ($user) {
            return in_array($user->role->role_name, ['executive', 'manager']);
        });

        // Inventories
        Gate::define('view-all-inventories', function ($user) {
            return $user->role->role_name === 'executive';
        });

        // Daily logs
        Gate::define('manage-daily-logs', function ($user) {
            return in_array($user->role->role_name, ['executive', 'manager']);
        });
    }
}
