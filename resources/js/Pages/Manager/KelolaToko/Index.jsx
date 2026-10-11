import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import {
    Plus,
    Pencil,
    Trash2,
    Store,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function Index({ tokos, flash }) {
    // 1. STATE UNTUK PAGINASI
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Jumlah data per halaman

    // 2. STATE UNTUK MODAL HAPUS
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 3. LOGIKA PEMOTONGAN DATA (PAGINASI)
    const totalPages = Math.ceil(tokos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTokos = tokos.slice(startIndex, startIndex + itemsPerPage);

    // 4. FUNGSI UNTUK MEMBUKA MODAL HAPUS
    const confirmDelete = (toko) => {
        setItemToDelete(toko);
        setIsDeleteModalOpen(true);
    };

    // 5. FUNGSI EKSEKUSI HAPUS
    const executeDelete = () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        router.delete(route("toko.destroy", itemToDelete.toko_id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
                setItemToDelete(null);

                // Jika menghapus item terakhir di halaman, mundur 1 halaman
                if (currentTokos.length === 1 && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                }
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Kelola Data Cabang Toko (Dimensi Toko)">
            <Head title="Kelola Toko | Kirei Shop" />

            <div className="space-y-6">
                {/* Notifikasi */}
                {flash.message && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm">
                        <CheckCircle2 size={20} className="text-green-600" />
                        <p className="text-sm font-medium">{flash.message}</p>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <Link
                        href={route("toko.create")}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 text-sm transition-all"
                    >
                        <Plus size={18} /> Daftarkan Cabang Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-bold">
                                    <th className="px-6 py-4 w-12 text-center">
                                        No
                                    </th>
                                    <th className="px-6 py-4">ID Toko</th>
                                    <th className="px-6 py-4">
                                        Nama Cabang / Toko
                                    </th>
                                    <th className="px-6 py-4">Kota</th>
                                    <th className="px-6 py-4">
                                        Alamat Lengkap
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {/* MAPPING MENGGUNAKAN currentTokos */}
                                {currentTokos.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-8 text-gray-400"
                                        >
                                            Belum ada data cabang toko
                                            terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    currentTokos.map((t, index) => (
                                        <tr
                                            key={t.toko_id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-center font-bold text-gray-400">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {t.toko_id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                                                <Store
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                Kirei Shop - Cabang {t.kota}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                                                    {t.kota}
                                                </span>
                                            </td>
                                            <td
                                                className="px-6 py-4 text-gray-500 max-w-xs truncate"
                                                title={t.alamat}
                                            >
                                                {t.alamat}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={route(
                                                            "toko.edit",
                                                            t.toko_id,
                                                        )}
                                                        className="p-1.5 text-gray-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>

                                                    {/* GANTI ONCLICK MENJADI confirmDelete */}
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(t)
                                                        }
                                                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 6. FOOTER PAGINASI */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border-t border-gray-100 bg-gray-50/30 gap-4">
                            <span className="text-xs sm:text-sm text-gray-500">
                                Menampilkan{" "}
                                <span className="font-bold text-gray-700">
                                    {startIndex + 1}
                                </span>{" "}
                                hingga{" "}
                                <span className="font-bold text-gray-700">
                                    {Math.min(
                                        startIndex + itemsPerPage,
                                        tokos.length,
                                    )}
                                </span>{" "}
                                dari{" "}
                                <span className="font-bold text-gray-700">
                                    {tokos.length}
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
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 7. SISIPKAN MODAL KONFIRMASI HAPUS */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                processing={isDeleting}
                title="Hapus Cabang Toko"
                message={`Apakah Anda yakin ingin menghapus "Kirei Shop - Cabang ${itemToDelete?.kota}"? Data transaksi yang terkait dengan toko ini mungkin akan terpengaruh.`}
            />
        </AuthenticatedLayout>
    );
}
