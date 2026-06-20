<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Pastikan pengguna sudah login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // 2. Cek apakah role pengguna saat ini diizinkan masuk
        if (!in_array($request->user()->role, $roles)) {
            // Jika Admin nekat masuk ke area Manager, lempar balik ke halaman transaksi mereka
            if ($request->user()->role === 'admin') {
                return redirect()->route('admin.transaksi.index')->with('error', 'Akses ditolak! Anda tidak memiliki izin untuk membuka halaman Manager.');
            }

            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
