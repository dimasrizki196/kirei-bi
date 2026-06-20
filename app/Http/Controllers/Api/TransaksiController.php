<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\TransaksiImport;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class TransaksiController extends Controller
{
    // 1. Tampilkan Halaman Input
    public function index()
    {
        $barangs = DB::table('barangs')->select('barang_id', 'nama_barang', 'stok_saat_ini', 'harga')->get();
        // Pastikan pakai 'tokos' sesuai database kamu
        $tokos = DB::table('tokos')->select('toko_id', 'kota', 'alamat')->get();
        $pembelis = DB::table('pembelis')->select('kota', 'alamat')->get();

        // TAMBAHKAN INI: Ambil data riwayat transaksi (JOIN dengan tabel dimensi)
        $transaksis = DB::table('fact_sales')
            ->join('barangs', 'fact_sales.barang_id', '=', 'barangs.barang_id')
            ->join('tokos', 'fact_sales.toko_id', '=', 'tokos.toko_id')
            ->join('pembelis', 'fact_sales.pembeli_id', '=', 'pembelis.pembeli_id')
            ->join('waktus', 'fact_sales.waktu_id', '=', 'waktus.waktu_id')
            ->select(
                'fact_sales.*',
                'barangs.nama_barang',
                'tokos.kota as kota_toko',
                'pembelis.kota as kota_pembeli',
                'pembelis.alamat',
                'waktus.hari',
                'waktus.bulan',
                'waktus.tahun'
            )
            ->orderBy('fact_sales.created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Transaksi/Index', [
            'barangs'    => $barangs,
            'tokos'      => $tokos,
            'pembelis'   => $pembelis,
            'transaksis' => $transaksis,
            'flash'      => [
                'message' => session('message'),
                'error'   => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Validasinya kita ubah dari pembeli_id menjadi input teks manual
        $request->validate([
            'tanggal_transaksi' => 'required|date',
            'toko_id'           => 'required|integer',
            'barang_id'         => 'required|integer',
            'kota_pembeli'      => 'required|string|max:100', // Kab/Kota
            'alamat_pembeli'    => 'required|string|max:255', // Desa, Kecamatan
            'jumlah_beli'       => 'required|integer|min:1',
            'total_harga'       => 'required|numeric|min:0',
        ]);

        try {
            DB::transaction(function () use ($request) {

                // 1. ETL DIMENSI WAKTU (Penyesuaian Tabel 'waktus')
                $date = Carbon::parse($request->tanggal_transaksi);
                $hari = $date->day;
                $bulan = $date->month;
                $tahun = $date->year;

                // Cari berdasarkan kombinasi hari, bulan, dan tahun
                $waktu = DB::table('waktus')
                    ->where('hari', $hari)
                    ->where('bulan', $bulan)
                    ->where('tahun', $tahun)
                    ->first();

                if ($waktu) {
                    $waktuId = $waktu->waktu_id; // Jika sudah ada tanggal tersebut
                } else {
                    // Jika belum ada, buat dimensi waktu baru
                    $waktuId = DB::table('waktus')->insertGetId([
                        'hari'       => $hari,
                        'bulan'      => $bulan,
                        'tahun'      => $tahun,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ], 'waktu_id');
                }

                // 2. LOGIKA WILAYAH DINAMIS (Cari atau Buat Baru)
                $pembeli = DB::table('pembelis') // <--- Tambah huruf 's' di sini
                    ->where('kota', $request->kota_pembeli)
                    ->where('alamat', $request->alamat_pembeli)
                    ->first();

                if ($pembeli) {
                    $pembeliId = $pembeli->pembeli_id; // Pakai yang ada
                } else {
                    $pembeliId = DB::table('pembelis')->insertGetId([ // <--- Tambah huruf 's' di sini
                        'kota'       => $request->kota_pembeli,
                        'alamat'     => $request->alamat_pembeli,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ], 'pembeli_id');
                }

                // 3. SIMPAN KE TABEL FAKTA
                DB::table('fact_sales')->insert([
                    'barang_id'   => $request->barang_id,
                    'pembeli_id'  => $pembeliId, // Pakai ID dinamis tadi
                    'toko_id'     => $request->toko_id,
                    'waktu_id'    => $waktuId,
                    'jumlah_beli' => $request->jumlah_beli,
                    'total_harga' => $request->total_harga,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // 4. POTONG STOK BARANG
                $barang = DB::table('barangs')->where('barang_id', $request->barang_id)->first();
                if ($barang) {
                    $stokBaru = $barang->stok_saat_ini - $request->jumlah_beli;
                    DB::table('barangs')->where('barang_id', $request->barang_id)
                        ->update(['stok_saat_ini' => $stokBaru < 0 ? 0 : $stokBaru]);
                }
            });

            return back()->with('message', 'Transaksi berhasil disimpan & stok otomatis terpotong!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan transaksi: ' . $e->getMessage());
        }
    }
    // 2. Download Template Excel Kosong
    public function downloadTemplate()
    {
        return Excel::download(new \App\Exports\TemplateTransaksiExport, 'Template_Input_Transaksi_Kirei.xlsx');
    }

    // 3. Proses Import Excel
    public function import(Request $request)
    {
        $request->validate([
            'file_excel' => 'required|mimes:xlsx,xls,csv|max:5120', // Maks 5MB
        ]);

        try {
            Excel::import(new TransaksiImport, $request->file('file_excel'));
            return back()->with('message', 'Data transaksi berhasil diimpor dan stok telah diperbarui!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }
}
