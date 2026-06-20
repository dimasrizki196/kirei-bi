<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PemasokController extends Controller
{
    public function index()
    {
        // Mengambil semua data pemasok dari database
        $pemasoks = DB::table('pemasoks')->orderBy('created_at', 'desc')->get();

        // Render halaman React di folder Manager/Pemasok/Index
        return Inertia::render('Manager/Pemasok/Index', [
            'pemasoks' => $pemasoks,
            'flash' => [
                'message' => session('message')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type_pemasok' => 'required|string|max:255'
        ]);

        DB::table('pemasoks')->insert([
            'type_pemasok' => $request->type_pemasok,
            'created_at'   => now(),
            'updated_at'   => now()
        ]);

        // Kembali ke halaman sebelumnya secara otomatis
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'type_pemasok' => 'required|string|max:255'
        ]);

        DB::table('pemasoks')->where('pemasok_id', $id)->update([
            'type_pemasok' => $request->type_pemasok,
            'updated_at'   => now()
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        DB::table('pemasoks')->where('pemasok_id', $id)->delete();

        return redirect()->back();
    }
}
