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
        $tokos = DB::table('tokos')->select('toko_id', 'kota', 'alamat')->get();
        $pembelis = DB::table('pembelis')->select('kota', 'alamat')->get();

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
        $request->validate([
            'tanggal_transaksi' => 'required|date',
            'toko_id'           => 'required|integer',
            'barang_id'         => 'required|integer',
            'kota_pembeli'      => 'required|string|max:100',
            'alamat_pembeli'    => 'required|string|max:255',
            'jumlah_beli'       => 'required|integer|min:1',
            'total_harga'       => 'required|numeric|min:0',
        ]);

        $barangInfo = DB::table('barangs')->where('barang_id', $request->barang_id)->first();

        if (!$barangInfo) {
            return back()->with('error', 'Gagal! Data barang tidak ditemukan.');
        }

        if ($barangInfo->stok_saat_ini < $request->jumlah_beli) {
            return back()->with('error', 'Gagal! Stok "' . $barangInfo->nama_barang . '" tidak mencukupi. (Sisa stok: ' . $barangInfo->stok_saat_ini . ')');
        }

        try {
            DB::transaction(function () use ($request, $barangInfo) {

                // 1. ETL DIMENSI WAKTU 
                $date = Carbon::parse($request->tanggal_transaksi);
                $hari = $date->day;
                $bulan = $date->month;
                $tahun = $date->year;

                $waktu = DB::table('waktus')
                    ->where('hari', $hari)
                    ->where('bulan', $bulan)
                    ->where('tahun', $tahun)
                    ->first();

                if ($waktu) {
                    $waktuId = $waktu->waktu_id;
                } else {
                    $waktuId = DB::table('waktus')->insertGetId([
                        'hari'       => $hari,
                        'bulan'      => $bulan,
                        'tahun'      => $tahun,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ], 'waktu_id');
                }

                // 2. LOGIKA WILAYAH DINAMIS 
                $pembeli = DB::table('pembelis')
                    ->where('kota', $request->kota_pembeli)
                    ->where('alamat', $request->alamat_pembeli)
                    ->first();

                if ($pembeli) {
                    $pembeliId = $pembeli->pembeli_id;
                } else {
                    $pembeliId = DB::table('pembelis')->insertGetId([
                        'kota'       => $request->kota_pembeli,
                        'alamat'     => $request->alamat_pembeli,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ], 'pembeli_id');
                }

                // 3. SIMPAN KE TABEL FAKTA
                DB::table('fact_sales')->insert([
                    'barang_id'   => $request->barang_id,
                    'pembeli_id'  => $pembeliId,
                    'toko_id'     => $request->toko_id,
                    'waktu_id'    => $waktuId,
                    'jumlah_beli' => $request->jumlah_beli,
                    'total_harga' => $request->total_harga,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // 4. POTONG STOK BARANG 
                // (Tidak perlu logika $stok < 0 lagi, karena sudah diblokir di atas)
                $stokBaru = $barangInfo->stok_saat_ini - $request->jumlah_beli;
                DB::table('barangs')
                    ->where('barang_id', $request->barang_id)
                    ->update(['stok_saat_ini' => $stokBaru]);
            });

            return back()->with('message', 'Transaksi berhasil disimpan & stok otomatis terpotong!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan transaksi: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        return Excel::download(new \App\Exports\TemplateTransaksiExport, 'Template_Input_Transaksi_Kirei.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file_excel' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        try {
            Excel::import(new TransaksiImport, $request->file('file_excel'));
            return back()->with('message', 'Data transaksi berhasil diimpor dan stok telah diperbarui!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }
}
