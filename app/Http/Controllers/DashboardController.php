<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    // Fungsi Pembantu untuk Filter (Agar kodenya bersih dan tidak berulang)
    private function applyFilters($query, $request)
    {
        $filterHari = $request->input('hari', 'semua');
        $filterBulan = $request->input('bulan', 'semua');
        $filterTahun = $request->input('tahun', 'semua');
        $filterToko = $request->input('toko', 'semua');
        $filterKategori = $request->input('kategori', 'semua');

        if ($filterToko !== 'semua') $query->where('fact_sales.toko_id', $filterToko);
        if ($filterKategori !== 'semua') $query->where('barangs.type', $filterKategori);
        if ($filterHari !== 'semua') $query->where('waktus.hari', $filterHari);
        if ($filterBulan !== 'semua') $query->where('waktus.bulan', $filterBulan);
        if ($filterTahun !== 'semua') $query->where('waktus.tahun', $filterTahun);

        return $query;
    }

    // =========================================================
    // 1. FUNGSI UTAMA: MEMUAT UI DENGAN SANGAT CEPAT (TANPA AI)
    // =========================================================
    public function index(Request $request)
    {
        $baseQuery = DB::table('fact_sales')
            ->join('barangs', 'fact_sales.barang_id', '=', 'barangs.barang_id')
            ->join('waktus', 'fact_sales.waktu_id', '=', 'waktus.waktu_id')
            ->join('tokos', 'fact_sales.toko_id', '=', 'tokos.toko_id');

        // Pertumbuhan MoM (Kalkulasi Cepat)
        $filterBulan = $request->input('bulan', 'semua');
        $filterTahun = $request->input('tahun', 'semua');

        if ($filterBulan !== 'semua' && $filterTahun !== 'semua') {
            $curBulan = (int)$filterBulan;
            $curTahun = (int)$filterTahun;
        } else {
            $latest = DB::table('waktus')->join('fact_sales', 'waktus.waktu_id', '=', 'fact_sales.waktu_id')->select('waktus.bulan', 'waktus.tahun')->orderBy('waktus.tahun', 'desc')->orderBy('waktus.bulan', 'desc')->first();
            $curBulan = $latest ? (int)$latest->bulan : (int)date('n');
            $curTahun = $latest ? (int)$latest->tahun : (int)date('Y');
        }

        $prevBulan = $curBulan == 1 ? 12 : $curBulan - 1;
        $prevTahun = $curBulan == 1 ? $curTahun - 1 : $curTahun;

        $qCur = clone $baseQuery;
        $qPrev = clone $baseQuery;
        $omzetCur = (float)$this->applyFilters($qCur, $request)->where('waktus.bulan', $curBulan)->where('waktus.tahun', $curTahun)->sum('fact_sales.total_harga');
        $omzetPrev = (float)$this->applyFilters($qPrev, $request)->where('waktus.bulan', $prevBulan)->where('waktus.tahun', $prevTahun)->sum('fact_sales.total_harga');
        $qtyCur = (float)$this->applyFilters(clone $baseQuery, $request)->where('waktus.bulan', $curBulan)->where('waktus.tahun', $curTahun)->sum('fact_sales.jumlah_beli');
        $qtyPrev = (float)$this->applyFilters(clone $baseQuery, $request)->where('waktus.bulan', $prevBulan)->where('waktus.tahun', $prevTahun)->sum('fact_sales.jumlah_beli');

        $growthOmzet = $omzetPrev > 0 ? round((($omzetCur - $omzetPrev) / $omzetPrev) * 100, 1) : ($omzetCur > 0 ? 100 : 0);
        $growthQty   = $qtyPrev > 0 ? round((($qtyCur - $qtyPrev) / $qtyPrev) * 100, 1) : ($qtyCur > 0 ? 100 : 0);

        // KPI & Tabel Standar
        $kpiQuery = $this->applyFilters(clone $baseQuery, $request);
        $kpi = [
            'total_qty'      => (float)$kpiQuery->sum('fact_sales.jumlah_beli'),
            'total_omzet'    => (float)$kpiQuery->sum('fact_sales.total_harga'),
            'rata_transaksi' => (float)$kpiQuery->avg('fact_sales.total_harga'),
            'total_wilayah'  => DB::table('pembelis')->count(),
            'growth_omzet'   => $growthOmzet,
            'growth_qty'     => $growthQty
        ];

        $stokKritis = DB::table('barangs')->whereColumn('stok_saat_ini', '<=', 'batas_minimum_stok')->select('barang_id', 'nama_barang', 'stok_saat_ini', 'batas_minimum_stok')->get();
        $trenPenjualan = $this->applyFilters(clone $baseQuery, $request)->select('waktus.bulan', 'waktus.tahun', DB::raw('SUM(fact_sales.jumlah_beli) as total_qty'), DB::raw('SUM(fact_sales.total_harga) as total_omzet'))->groupBy('waktus.tahun', 'waktus.bulan')->orderBy('waktus.tahun', 'asc')->orderBy('waktus.bulan', 'asc')->get();
        $komposisiKategori = $this->applyFilters(clone $baseQuery, $request)->select('barangs.type', DB::raw('SUM(fact_sales.total_harga) as total_omzet'))->groupBy('barangs.type')->get();
        $produkTerlaris = $this->applyFilters(clone $baseQuery, $request)->select('barangs.barang_id', 'barangs.nama_barang', 'barangs.type', DB::raw('SUM(fact_sales.jumlah_beli) as terjual'), DB::raw('SUM(fact_sales.total_harga) as pendapatan'))->groupBy('barangs.barang_id', 'barangs.nama_barang', 'barangs.type')->orderByDesc('terjual')->limit(5)->get();
        $produkKurangLaris = $this->applyFilters(clone $baseQuery, $request)->select('barangs.barang_id', 'barangs.nama_barang', 'barangs.type', DB::raw('SUM(fact_sales.jumlah_beli) as terjual'), DB::raw('SUM(fact_sales.total_harga) as pendapatan'))->groupBy('barangs.barang_id', 'barangs.nama_barang', 'barangs.type')->orderBy('terjual', 'asc')->limit(5)->get();

        // Forecasting Sederhana (Tabel Proyeksi)
        $forecasting = [];
        $top3 = DB::table('fact_sales')->select('barang_id')->groupBy('barang_id')->orderByRaw('SUM(jumlah_beli) DESC')->limit(3)->get();
        foreach ($top3 as $item) {
            $barang = DB::table('barangs')->where('barang_id', $item->barang_id)->first();
            if (!$barang) continue;
            $history = DB::table('fact_sales')->join('waktus', 'fact_sales.waktu_id', '=', 'waktus.waktu_id')->where('fact_sales.barang_id', $item->barang_id)->select('waktus.bulan', 'waktus.tahun', DB::raw('SUM(fact_sales.jumlah_beli) as qty'))->groupBy('waktus.tahun', 'waktus.bulan')->orderBy('waktus.tahun', 'desc')->orderBy('waktus.bulan', 'desc')->limit(3)->get();
            $avgPrediksi = $history->count() > 0 ? ceil($history->sum('qty') / $history->count()) : 0;
            $status = ($barang->stok_saat_ini <= ($avgPrediksi + $barang->batas_minimum_stok)) ? 'RESTOCK!' : 'AMAN';
            $forecasting[] = ['nama_barang' => $barang->nama_barang, 'stok_sekarang' => $barang->stok_saat_ini, 'prediksi_qty'  => $avgPrediksi, 'status' => $status];
        }

        return Inertia::render('Dashboard', [
            'kpi'               => $kpi,
            'stokKritis'        => $stokKritis,
            'trenPenjualan'     => $trenPenjualan,
            'komposisiKategori' => $komposisiKategori,
            'produkTerlaris'    => $produkTerlaris,
            'produkKurangLaris' => $produkKurangLaris,
            'forecasting'       => $forecasting,
            'daftarTahun'       => DB::table('waktus')->select('tahun')->distinct()->orderBy('tahun', 'desc')->get(),
            'daftarToko'        => DB::table('tokos')->select('toko_id', 'kota')->get(),
            'daftarKategori'    => DB::table('barangs')->select('type')->distinct()->whereNotNull('type')->get(),
            'filters'           => $request->all()
        ]);
    }

    // =========================================================
    // 2. FUNGSI API ASYNCHRONOUS: GOOGLE GEMINI AUTO-DETECT
    // =========================================================
    public function getAiRecommendation(Request $request)
    {
        // Beri waktu 2 menit karena proses background memanggil API pihak ketiga
        set_time_limit(120);

        $growthOmzet = $request->input('growth_omzet', 0);
        $terlaris = $request->input('terlaris', []);
        $kurangLaris = $request->input('kurang_laris', []);

        $dataUntukAI_Terlaris = array_map(function ($item) {
            return "{$item['nama_barang']} (Terjual {$item['terjual']} pcs)";
        }, $terlaris);

        $dataUntukAI_TidakLaku = array_map(function ($item) {
            return "{$item['nama_barang']} (Hanya laku {$item['terjual']} pcs)";
        }, $kurangLaris);

        $prompt = "Kamu adalah Konsultan Bisnis Profesional untuk Kirei Shop. Berdasarkan data penjualan bulan ini:\n";
        $prompt .= "- Pertumbuhan Omzet: " . $growthOmzet . "% dibanding bulan lalu.\n";
        $prompt .= "- Produk Laris: " . implode(', ', $dataUntukAI_Terlaris) . ".\n";
        $prompt .= "- Produk Tidak Laku (Dead Stock): " . implode(', ', $dataUntukAI_TidakLaku) . ".\n\n";
        $prompt .= "Tugasmu: Berikan persis 3 poin rekomendasi strategi bisnis yang spesifik dan actionable. \n";
        $prompt .= "Fokus pada penanganan dead stock, evaluasi promosi, dan naiknya omzet. \n";
        $prompt .= "Aturan wajib: Pisahkan setiap poin hanya menggunakan simbol '|' (Pipa). Jangan gunakan penomoran, jangan ada teks pembuka/penutup.";

        try {
            $geminiKey = trim(env('GEMINI_API_KEY'));
            if (empty($geminiKey)) throw new \Exception("API Key belum disetting di file .env.");

            // LANGKAH A: Deteksi Otomatis Model Gemini yang Aktif di Akun
            $checkModels = Http::withoutVerifying()
                ->timeout(15)
                ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
                ->get("https://generativelanguage.googleapis.com/v1beta/models?key={$geminiKey}");

            $targetModel = '';

            if ($checkModels->successful()) {
                foreach ($checkModels->json('models') as $model) {
                    if (strpos($model['name'], 'gemini') !== false && isset($model['supportedGenerationMethods']) && in_array('generateContent', $model['supportedGenerationMethods'])) {
                        $targetModel = str_replace('models/', '', $model['name']);
                        // Prioritaskan model "flash" jika ada, lalu keluar dari loop
                        if (strpos($targetModel, 'flash') !== false) break;
                    }
                }
            } else {
                throw new \Exception("Gagal mengambil daftar model dari server Google API.");
            }

            if (empty($targetModel)) throw new \Exception("Model AI pendukung teks tidak ditemukan untuk API Key Anda.");

            // LANGKAH B: Eksekusi Prompt AI menggunakan Model Target
            $response = Http::withoutVerifying()
                ->timeout(60)
                ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$targetModel}:generateContent?key={$geminiKey}", [
                    'contents' => [['parts' => [['text' => $prompt]]]],
                    'generationConfig' => ['temperature' => 0.7]
                ]);

            if ($response->successful()) {
                $aiText = $response->json('candidates.0.content.parts.0.text');
                $rekomendasi = array_filter(array_map('trim', explode('|', $aiText)));

                return response()->json([
                    'status' => 'success',
                    'data' => count($rekomendasi) > 0 ? array_values($rekomendasi) : [$aiText]
                ]);
            } else {
                $err = $response->json();
                return response()->json([
                    'status' => 'error',
                    'message' => $err['error']['message'] ?? "Error Google API Response."
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
