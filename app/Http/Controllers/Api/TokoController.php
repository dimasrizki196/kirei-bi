<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TokoController extends Controller
{
    // 1. Tampilkan Halaman Utama (Daftar Cabang Toko)
    public function index()
    {
        // Mengambil data dari tabel toko
        $tokos = DB::table('tokos')->orderBy('toko_id', 'asc')->get();

        return Inertia::render('Manager/KelolaToko/Index', [
            'tokos' => $tokos,
            'flash' => [
                'message' => session('message')
            ]
        ]);
    }

    // 2. Tampilkan Form Tambah Toko Baru
    public function create()
    {
        return Inertia::render('Manager/KelolaToko/Create');
    }

    // 3. Proses Simpan Toko Baru ke Database
    public function store(Request $request)
    {
        $request->validate([
            'alamat'    => 'required|string',
            'kota'      => 'required|string|max:100',
        ]);

        DB::table('tokos')->insert([
            'alamat'     => $request->alamat,
            'kota'       => $request->kota,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('toko.index')->with('message', 'Cabang toko baru berhasil didaftarkan!');
    }

    // 4. Tampilkan Form Edit Toko
    public function edit($id)
    {
        $toko = DB::table('tokos')->where('toko_id', $id)->first();

        if (!$toko) {
            return redirect()->route('toko.index')->with('error', 'Data toko tidak ditemukan.');
        }

        return Inertia::render('Manager/KelolaToko/Edit', [
            'toko' => $toko
        ]);
    }

    // 5. Proses Perbarui Data Toko
    public function update(Request $request, $id)
    {
        $request->validate([
            'alamat'    => 'required|string',
            'kota'      => 'required|string|max:100',
        ]);

        DB::table('tokos')->where('toko_id', $id)->update([
            'alamat'     => $request->alamat,
            'kota'       => $request->kota,
            'updated_at' => now(),
        ]);

        return redirect()->route('toko.index')->with('message', 'Data cabang toko berhasil diperbarui!');
    }

    // 6. Proses Hapus Data Toko
    public function destroy($id)
    {
        DB::table('tokos')->where('toko_id', $id)->delete();

        return redirect()->route('toko.index')->with('message', 'Cabang toko berhasil dihapus dari sistem!');
    }
}
