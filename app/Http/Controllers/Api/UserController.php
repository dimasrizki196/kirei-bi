<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        // Mengambil semua data user diurutkan dari yang terbaru
        $users = User::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Manager/Users/Index', [
            'users' => $users,
            'flash' => [
                'message' => session('message'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role'     => 'required|in:admin,manager',
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        // Menggunakan redirect bawaan Inertia, bukan JSON Axios
        return redirect()->back()->with('message', 'Pengguna baru berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        // Validasi dasar
        $rules = [
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role'  => 'required|in:admin,manager',
        ];

        // Jika form password diisi, berarti manager ingin mereset password user tersebut
        if ($request->filled('password')) {
            $rules['password'] = ['confirmed', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->back()->with('message', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Proteksi: Manager tidak boleh menghapus akunnya sendiri yang sedang dipakai
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $user->delete();
        
        return redirect()->back()->with('message', 'Pengguna berhasil dihapus.');
    }
}