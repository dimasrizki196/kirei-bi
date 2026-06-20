import { Search, Filter, List, MapPin } from "lucide-react";
import { useState } from "react";

export default function DataTransaksi({ transaksis }) {
    const [searchQuery, setSearchQuery] = useState("");

    // LOGIKA FILTER: Disesuaikan tanpa nama pembeli
    const filteredTransaksis = transaksis
        ? transaksis.filter((t) => {
              const query = searchQuery.toLowerCase();
              const namaBarang = t.nama_barang
                  ? t.nama_barang.toLowerCase()
                  : "";

              // Memanggil data berdasarkan alias dari Controller
              const cabangToko = t.kota_toko ? t.kota_toko.toLowerCase() : "";
              const wilayahPembeli = t.kota_pembeli
                  ? t.kota_pembeli.toLowerCase()
                  : "";
              const alamatPembeli = t.alamat ? t.alamat.toLowerCase() : "";

              return (
                  namaBarang.includes(query) ||
                  cabangToko.includes(query) ||
                  wilayahPembeli.includes(query) ||
                  alamatPembeli.includes(query)
              );
          })
        : [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                        Riwayat Transaksi
                    </h3>
                    <p className="text-sm text-gray-500">
                        Daftar seluruh transaksi yang telah berhasil dicatat.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search
                            size={16}
                            className="absolute left-3 top-2.5 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Cari produk atau lokasi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors shrink-0">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 whitespace-nowrap">
                                Tanggal
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                Cabang Toko
                            </th>
                            <th className="px-4 py-3 min-w-[200px]">Produk</th>
                            <th className="px-4 py-3 min-w-[150px]">
                                Wilayah Pembeli
                            </th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">
                                Qty
                            </th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">
                                Total Harga
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTransaksis.length > 0 ? (
                            filteredTransaksis.map((t, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-indigo-50/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-mono text-gray-600 whitespace-nowrap">
                                        {`${t.tahun}-${String(t.bulan).padStart(2, "0")}-${String(t.hari).padStart(2, "0")}`}
                                    </td>

                                    {/* MENGGUNAKAN ALIAS: kota_toko */}
                                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                                        {t.kota_toko}
                                    </td>

                                    <td className="px-4 py-3 text-gray-700">
                                        <p
                                            className="line-clamp-2"
                                            title={t.nama_barang}
                                        >
                                            {t.nama_barang}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            {/* MENGGUNAKAN ALIAS: kota_pembeli */}
                                            <span className="font-bold text-gray-800 whitespace-nowrap flex items-center gap-1">
                                                <MapPin
                                                    size={12}
                                                    className="text-gray-400"
                                                />
                                                {t.kota_pembeli}
                                            </span>
                                            <span
                                                className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate"
                                                title={t.alamat}
                                            >
                                                {t.alamat}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-bold">
                                            {t.jumlah_beli}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-700 whitespace-nowrap">
                                        Rp{" "}
                                        {parseInt(t.total_harga).toLocaleString(
                                            "id-ID",
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-16 text-center text-gray-500 bg-gray-50/50"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <List
                                            size={48}
                                            className="text-gray-300 mb-4"
                                        />
                                        <p className="font-bold text-gray-600 text-base">
                                            {searchQuery
                                                ? "Transaksi Tidak Ditemukan"
                                                : "Belum Ada Transaksi"}
                                        </p>
                                        <p className="text-sm mt-1 text-gray-400 max-w-sm">
                                            {searchQuery
                                                ? `Tidak ada data yang cocok dengan kata kunci "${searchQuery}".`
                                                : "Data yang di-import atau diinput manual akan muncul di sini."}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
