<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Pemasok; // <-- 1. Tambahkan Model Pemasok
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangController extends Controller
{
    // 1. Tampilkan Halaman Utama (Tabel Produk)
    public function index()
    {
        $barangs = Barang::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/KelolaProduk/Index', [
            'barangs' => $barangs,
            'flash' => [
                'message' => session('message')
            ]
        ]);
    }

    // 2. Tampilkan Halaman Form Tambah Produk Baru
    public function create()
    {
        // 2. Ambil data pemasok untuk dikirim ke dropdown React
        $pemasoks = Pemasok::all();
        $existingTypes = Barang::select('type')
            ->whereNotNull('type')
            ->distinct()
            ->pluck('type');

        return Inertia::render('Admin/KelolaProduk/Create', [
            'pemasoks' => $pemasoks,
            'existingTypes' => $existingTypes
        ]);
    }

    // 3. Proses Simpan Data Produk Baru ke Database
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'type' => 'required|string',
            'pemasok_id' => 'required|integer',
            'harga' => 'required|numeric|min:0', // <-- 3. Tambahkan validasi harga
            'stok_saat_ini' => 'required|integer|min:0',
            'batas_minimum_stok' => 'required|integer|min:0',
        ]);

        Barang::create([
            'nama_barang' => $request->nama_barang,
            'type' => $request->type,
            'pemasok_id' => $request->pemasok_id,
            'harga' => $request->harga, // <-- Simpan harga ke database
            'stok_saat_ini' => $request->stok_saat_ini,
            'batas_minimum_stok' => $request->batas_minimum_stok,
        ]);

        return redirect()->route('produk.index')->with('message', 'Produk baru berhasil ditambahkan!');
    }

    // 4. Tampilkan Halaman Form Edit Produk
    public function edit($id)
    {
        $barang = Barang::where('barang_id', $id)->firstOrFail();

        // Ambil data pemasok juga untuk halaman Edit
        $pemasoks = Pemasok::all();

        $existingTypes = Barang::select('type')
            ->whereNotNull('type')
            ->distinct()
            ->pluck('type');

        return Inertia::render('Admin/KelolaProduk/Edit', [
            'barang' => $barang,
            'pemasoks' => $pemasoks,
            'existingTypes' => $existingTypes
        ]);
    }

    // 5. Proses Perbarui Data Produk di Database
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'type' => 'required|string',
            'pemasok_id' => 'required|integer',
            'harga' => 'required|numeric|min:0', // <-- Tambahkan validasi harga
            'stok_saat_ini' => 'required|integer|min:0',
            'batas_minimum_stok' => 'required|integer|min:0',
        ]);

        $barang = Barang::where('barang_id', $id)->firstOrFail();

        // Karena form menggunakan $request->all() sebelumnya, 
        // pastikan Model Barang Anda mengizinkan 'harga' di kolom $fillable
        $barang->update($request->all());

        return redirect()->route('produk.index')->with('message', 'Data produk berhasil diperbarui!');
    }

    // 6. Proses Hapus Data Produk
    public function destroy($id)
    {
        $barang = Barang::where('barang_id', $id)->firstOrFail();
        $barang->delete();

        return redirect()->route('produk.index')->with('message', 'Produk berhasil dihapus dari sistem!');
    }
}
