import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import {
    Plus,
    Pencil,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Search,
    XCircle,
    CheckCircle2Icon,
} from "lucide-react";

export default function Index({ barangs, flash }) {
    const userRole = usePage().props.auth.user.role;

    // 1. STATE UNTUK PENCARIAN & PAGINASI
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State Modal Hapus
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 2. LOGIKA FILTER PENCARIAN
    const filteredBarangs = barangs.filter(
        (barang) =>
            barang.nama_barang
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            barang.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // 3. LOGIKA PEMOTONGAN DATA (PAGINASI BERDASARKAN HASIL PENCARIAN)
    const totalPages = Math.ceil(filteredBarangs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBarangs = filteredBarangs.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    // Fungsi handle pencarian
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset ke halaman 1 saat mengetik pencarian
    };

    const confirmDelete = (barang) => {
        setItemToDelete(barang);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        router.delete(route("produk.destroy", itemToDelete.barang_id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
                setItemToDelete(null);

                // Jika item yang dihapus adalah item terakhir di halaman tersebut, mundur 1 halaman
                if (currentBarangs.length === 1 && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                }
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Kelola Data Produk (Master Barang)">
            <Head title="Kelola Produk | Kirei Shop" />

            <div className="space-y-4 sm:space-y-6">
                {/* Notifikasi Flash Message */}
                {flash?.message && (
                    <div className="flex items-start sm:items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-3 sm:p-4 rounded-xl shadow-sm">
                        <CheckCircle2
                            size={20}
                            className="text-green-600 shrink-0 mt-0.5 sm:mt-0"
                        />
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">
                            {flash.message}
                        </p>
                    </div>
                )}

                {/* Header Action - Pencarian & Tombol Tambah */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                    {/* Kotak Pencarian */}
                    <div className="relative w-full sm:w-72">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Cari nama produk / kategori..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-xl text-sm focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                        />
                    </div>

                    {/* Tombol Tambah Produk (Hanya Admin) */}
                    {userRole === "admin" && (
                        <Link
                            href={route("produk.create")}
                            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
                        >
                            <Plus size={18} /> Tambah Produk Baru
                        </Link>
                    )}
                </div>

                {/* Tabel Kontainer */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[10px] sm:text-xs uppercase font-bold">
                                    <th className="px-4 py-3 sm:px-6 sm:py-4 w-12 text-center">
                                        No
                                    </th>
                                    <th className="px-4 py-3 sm:px-6 sm:py-4">
                                        Nama Produk
                                    </th>
                                    <th className="px-4 py-3 sm:px-6 sm:py-4">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                        Stok
                                    </th>
                                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                        Batas Min
                                    </th>
                                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                        Status (EWS)
                                    </th>
                                    {userRole === "admin" && (
                                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                            Aksi
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                                {currentBarangs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                userRole === "admin" ? "7" : "6"
                                            }
                                            className="text-center py-12 text-gray-400"
                                        >
                                            <p className="font-medium">
                                                {searchQuery
                                                    ? "Produk tidak ditemukan."
                                                    : "Belum ada data produk."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    currentBarangs.map((barang, index) => (
                                        <tr
                                            key={barang.barang_id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-center font-bold text-gray-400">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-gray-900">
                                                {barang.nama_barang}
                                            </td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                                                <span className="px-2.5 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                                                    {barang.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-center font-bold">
                                                {barang.stok_saat_ini}
                                            </td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-center text-gray-500">
                                                {barang.batas_minimum_stok}
                                            </td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                                {barang.stok_saat_ini <= 0 ? (
                                                    // 1. STATUS HABIS (Stok = 0)
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                        <XCircle size={12} />{" "}
                                                        Habis
                                                    </span>
                                                ) : barang.stok_saat_ini <=
                                                  barang.batas_minimum_stok ? (
                                                    // 2. STATUS KRITIS (Stok <= Batas Minimum, tapi lebih dari 0)
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                                        <AlertTriangle
                                                            size={12}
                                                        />{" "}
                                                        Kritis
                                                    </span>
                                                ) : (
                                                    // 3. STATUS AMAN (Stok > Batas Minimum)
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                                        <CheckCircle2Icon
                                                            size={12}
                                                        />{" "}
                                                        Aman
                                                    </span>
                                                )}
                                            </td>

                                            {userRole === "admin" && (
                                                <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "produk.edit",
                                                                barang.barang_id,
                                                            )}
                                                            className="p-2 sm:p-1.5 text-gray-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    barang,
                                                                )
                                                            }
                                                            className="p-2 sm:p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER PAGINASI */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border-t border-gray-100 bg-gray-50/30 gap-4">
                            <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                                Menampilkan{" "}
                                <span className="font-bold text-gray-700">
                                    {startIndex + 1}
                                </span>{" "}
                                hingga{" "}
                                <span className="font-bold text-gray-700">
                                    {Math.min(
                                        startIndex + itemsPerPage,
                                        filteredBarangs.length,
                                    )}
                                </span>{" "}
                                dari{" "}
                                <span className="font-bold text-gray-700">
                                    {filteredBarangs.length}
                                </span>{" "}
                                data
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2 sm:p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="px-3 py-1 text-xs sm:text-sm font-semibold bg-sky-50 text-sky-700 rounded-lg border border-sky-100">
                                    {currentPage} / {totalPages}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 sm:p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                processing={isDeleting}
                title="Hapus Produk"
                message={`Apakah Anda yakin ingin menghapus produk "${itemToDelete?.nama_barang}"? Data transaksi yang terkait dengan produk ini mungkin akan terpengaruh.`}
            />
        </AuthenticatedLayout>
    );
}
