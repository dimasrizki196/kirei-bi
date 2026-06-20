<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\TokoController;
use App\Http\Controllers\Api\PemasokController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // =========================================================
    // 1. RUTE BERSAMA (DIAKSES OLEH MANAGER & ADMIN)
    // =========================================================
    Route::middleware(['role:admin,manager'])->group(function () {
        // BI & Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // View Produk (Keduanya bisa melihat daftar produk)
        Route::get('/kelola-produk', [BarangController::class, 'index'])->name('produk.index');
        Route::get('/kelola-produk/{kelola_produk}', [BarangController::class, 'show'])->name('produk.show');
        Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
    });

    // =========================================================
    // 2. KEKUASAAN STRATEGIS: ROLE MANAGER ONLY
    // =========================================================
    Route::middleware(['role:manager'])->group(function () {
        // BI + Rekomendasi AI
        Route::get('/dashboard/api/ai-recommendation', [DashboardController::class, 'getAiRecommendation'])->name('dashboard.ai');

        // Kelola Pemasok (Dipindah ke Manager)
        Route::resource('manager/pemasok', PemasokController::class)->names([
            'index'   => 'pemasok.index',
            'create'  => 'pemasok.create',
            'store'   => 'pemasok.store',
            'edit'    => 'pemasok.edit',
            'update'  => 'pemasok.update',
            'destroy' => 'pemasok.destroy',
        ])->except(['create', 'edit', 'show']);

        // Kelola User (Fitur Baru untuk Manager)
        Route::resource('manager/users', UserController::class)->names([
            'index'   => 'users.index',
            'store'   => 'users.store',
            'update'  => 'users.update',
            'destroy' => 'users.destroy',
        ])->except(['create', 'edit', 'show']);

        // Kelola Toko/Cabang (Asumsi Admin yang bertugas mengelola toko operasional)
        Route::resource('manager/toko', TokoController::class)->names([
            'index'   => 'toko.index',
            'create'  => 'toko.create',
            'store'   => 'toko.store',
            'edit'    => 'toko.edit',
            'update'  => 'toko.update',
            'destroy' => 'toko.destroy',
        ]);
    });

    // =========================================================
    // 3. KEKUASAAN OPERASIONAL: ROLE ADMIN ONLY
    // =========================================================
    Route::middleware(['role:admin'])->group(function () {

        // Kelola Produk (Aksi CRUD: Tambah, Edit, Hapus)
        Route::post('/kelola-produk', [BarangController::class, 'store'])->name('produk.store');
        Route::get('/kelola-produk/create', [BarangController::class, 'create'])->name('produk.create');
        Route::put('/kelola-produk/{kelola_produk}', [BarangController::class, 'update'])->name('produk.update');
        Route::delete('/kelola-produk/{kelola_produk}', [BarangController::class, 'destroy'])->name('produk.destroy');
        Route::get('/kelola-produk/{kelola_produk}/edit', [BarangController::class, 'edit'])->name('produk.edit');

        // Input Transaksi
        Route::prefix('transaksi')->name('transaksi.')->group(function () {
            Route::post('/manual', [TransaksiController::class, 'store'])->name('store');
            Route::get('/template', [TransaksiController::class, 'downloadTemplate'])->name('template');
            Route::post('/import', [TransaksiController::class, 'import'])->name('import');
        });
    });
});

/*
|--------------------------------------------------------------------------
| Rute Pengaturan Profil Akun
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/auth.php';
