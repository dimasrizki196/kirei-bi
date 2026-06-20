<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
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
        return Inertia::render('Admin/KelolaProduk/Create');
    }

    // 3. Proses Simpan Data Produk Baru ke Database
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'type' => 'required|string',
            'pemasok_id' => 'required|integer',
            'stok_saat_ini' => 'required|integer|min:0',
            'batas_minimum_stok' => 'required|integer|min:0',
        ]);

        Barang::create([
            'nama_barang' => $request->nama_barang,
            'type' => $request->type,
            'pemasok_id' => $request->pemasok_id,
            'stok_saat_ini' => $request->stok_saat_ini,
            'batas_minimum_stok' => $request->batas_minimum_stok,
        ]);

        return redirect()->route('produk.index')->with('message', 'Produk baru berhasil ditambahkan!');
    }

    // 4. Tampilkan Halaman Form Edit Produk
    public function edit($id)
    {
        // Mencari berdasarkan primary key custom Anda (barang_id)
        $barang = Barang::where('barang_id', $id)->firstOrFail();

        return Inertia::render('Admin/KelolaProduk/Edit', [
            'barang' => $barang
        ]);
    }

    // 5. Proses Perbarui Data Produk di Database
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'type' => 'required|string',
            'pemasok_id' => 'required|integer',
            'stok_saat_ini' => 'required|integer|min:0',
            'batas_minimum_stok' => 'required|integer|min:0',
        ]);

        $barang = Barang::where('barang_id', $id)->firstOrFail();
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
