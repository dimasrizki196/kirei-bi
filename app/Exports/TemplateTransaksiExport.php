<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\Sheets\TemplateSheet;
use App\Exports\Sheets\TokoSheet;
use App\Exports\Sheets\BarangSheet;

class TemplateTransaksiExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new TemplateSheet(), // Tab 1: Form Input Transaksi
            new TokoSheet(),     // Tab 2: Referensi Cabang / Toko
            new BarangSheet(),   // Tab 3: Referensi Produk / Barang
        ];
    }
}
