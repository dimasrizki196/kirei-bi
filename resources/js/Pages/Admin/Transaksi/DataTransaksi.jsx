import {
    Search,
    Filter,
    List,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { createPortal } from "react-dom";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";

export default function DataTransaksi({
    transaksis,
    barangs = [],
    tokos = [],
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // STATE MODAL EDIT
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // STATE MODAL HAPUS
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const {
        data,
        setData,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        tanggal_transaksi: "",
        toko_id: "",
        barang_id: "",
        kota_pembeli: "",
        alamat_pembeli: "",
        jumlah_beli: "",
        total_harga: "",
    });

    // FILTER LOGIC
    const filteredTransaksis = transaksis
        ? transaksis.filter((t) => {
              const query = searchQuery.toLowerCase();
              return (
                  (t.nama_barang || "").toLowerCase().includes(query) ||
                  (t.kota_toko || "").toLowerCase().includes(query) ||
                  (t.kota_pembeli || "").toLowerCase().includes(query) ||
                  (t.alamat || "").toLowerCase().includes(query)
              );
          })
        : [];

    const totalPages = Math.ceil(filteredTransaksis.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTransaksis = filteredTransaksis.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // --- LOGIKA EDIT TRANSAKSI ---
    const openEditModal = (t) => {
        const dateStr = `${t.tahun}-${String(t.bulan).padStart(2, "0")}-${String(t.hari).padStart(2, "0")}`;
        setData({
            tanggal_transaksi: dateStr,
            toko_id: t.toko_id,
            barang_id: t.barang_id,
            kota_pembeli: t.kota_pembeli,
            alamat_pembeli: t.alamat,
            jumlah_beli: t.jumlah_beli,
            total_harga: t.total_harga,
        });
        setCurrentId(t.id); // Asumsi primary key-nya adalah 'id'. Sesuaikan jika bernama 'sales_id'
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        reset();
    };

    // Fungsi otomatis hitung total harga saat jumlah atau barang diubah
    const handleCalculateTotal = (field, value) => {
        let newBarangId = field === "barang_id" ? value : data.barang_id;
        let newJumlah = field === "jumlah_beli" ? value : data.jumlah_beli;
        let calculatedTotal = data.total_harga;

        if (newBarangId && newJumlah) {
            const selectedBarang = barangs.find(
                (b) => b.barang_id == newBarangId,
            );
            if (selectedBarang)
                calculatedTotal = selectedBarang.harga * newJumlah;
        }

        setData((prev) => ({
            ...prev,
            [field]: value,
            total_harga: calculatedTotal,
        }));
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route("transaksi.update", currentId), {
            onSuccess: () => closeEditModal(),
        });
    };

    // --- LOGIKA HAPUS TRANSAKSI ---
    const confirmDelete = (t) => {
        setItemToDelete(t);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (!itemToDelete) return;
        destroy(route("transaksi.destroy", itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
                if (currentTransaksis.length === 1 && currentPage > 1)
                    setCurrentPage((prev) => prev - 1);
            },
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Toolbar */}
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
                            onChange={handleSearch}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Tabel Data */}
            <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col">
                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-12 text-center">
                                    No
                                </th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3">Cabang Toko</th>
                                <th className="px-4 py-3 min-w-[200px]">
                                    Produk
                                </th>
                                <th className="px-4 py-3 min-w-[150px]">
                                    Wilayah Pembeli
                                </th>
                                <th className="px-4 py-3 text-center">
                                    Harga Satuan
                                </th>
                                <th className="px-4 py-3 text-center">Qty</th>
                                <th className="px-4 py-3 text-right">
                                    Total Harga
                                </th>
                                <th className="px-4 py-3 text-center sticky right-0 bg-gray-50">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentTransaksis.length > 0 ? (
                                currentTransaksis.map((t, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-center font-bold text-gray-400">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-gray-600">
                                            {`${t.tahun}-${String(t.bulan).padStart(2, "0")}-${String(t.hari).padStart(2, "0")}`}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {t.kota_toko}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 whitespace-normal min-w-[200px]">
                                            <p
                                                className="line-clamp-2"
                                                title={t.nama_barang}
                                            >
                                                {t.nama_barang}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 flex items-center gap-1">
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
                                        <td className="px-4 py-3 text-center text-gray-600">
                                            Rp{" "}
                                            {parseInt(t.harga).toLocaleString(
                                                "id-ID",
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-bold">
                                                {t.jumlah_beli}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-800">
                                            Rp{" "}
                                            {parseInt(
                                                t.total_harga,
                                            ).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 text-center sticky right-0 bg-white/90 backdrop-blur-sm border-l border-gray-100">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(t)
                                                    }
                                                    className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(t)
                                                    }
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
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
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER PAGINASI */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border-t border-gray-200 bg-gray-50 gap-4">
                        <span className="text-xs sm:text-sm text-gray-500">
                            Menampilkan{" "}
                            <span className="font-bold text-gray-700">
                                {startIndex + 1}
                            </span>{" "}
                            hingga{" "}
                            <span className="font-bold text-gray-700">
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filteredTransaksis.length,
                                )}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold text-gray-700">
                                {filteredTransaksis.length}
                            </span>{" "}
                            data
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
                                {currentPage} / {totalPages}
                            </div>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================= */}
            {/* MODAL EDIT DENGAN PORTAL */}
            {/* ========================================= */}
            {isEditModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
                        <div
                            className="fixed inset-0 -z-10"
                            onClick={closeEditModal}
                        ></div>
                        <div className="relative z-10 w-full max-w-lg mt-10 mb-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">
                                    Edit Data Transaksi
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form
                                onSubmit={submitEdit}
                                className="p-5 space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={data.tanggal_transaksi}
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_transaksi",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                            Toko / Cabang
                                        </label>
                                        <select
                                            required
                                            value={data.toko_id}
                                            onChange={(e) =>
                                                setData(
                                                    "toko_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                        >
                                            <option value="" disabled>
                                                Pilih Toko
                                            </option>
                                            {tokos.map((t) => (
                                                <option
                                                    key={t.toko_id}
                                                    value={t.toko_id}
                                                >
                                                    {t.kota}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                        Produk
                                    </label>
                                    <select
                                        required
                                        value={data.barang_id}
                                        onChange={(e) =>
                                            handleCalculateTotal(
                                                "barang_id",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                    >
                                        <option value="" disabled>
                                            Pilih Produk
                                        </option>
                                        {barangs.map((b) => (
                                            <option
                                                key={b.barang_id}
                                                value={b.barang_id}
                                            >
                                                {b.nama_barang} (Sisa:{" "}
                                                {b.stok_saat_ini})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                            Kota Pembeli
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.kota_pembeli}
                                            onChange={(e) =>
                                                setData(
                                                    "kota_pembeli",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                            Alamat Detail
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.alamat_pembeli}
                                            onChange={(e) =>
                                                setData(
                                                    "alamat_pembeli",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                            Jumlah Beli (Qty)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={data.jumlah_beli}
                                            onChange={(e) =>
                                                handleCalculateTotal(
                                                    "jumlah_beli",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                            Total Harga (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={data.total_harga}
                                            onChange={(e) =>
                                                setData(
                                                    "total_harga",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="px-4 py-2 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl text-sm"
                                    >
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body,
                )}

            {/* MODAL KONFIRMASI HAPUS */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                processing={processing}
                title="Hapus Transaksi"
                message={`Anda yakin ingin menghapus riwayat transaksi ini? Stok barang akan dikembalikan secara otomatis ke dalam sistem.`}
            />
        </div>
    );
}
