import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Edit2, Trash2, X, Search, Truck } from "lucide-react";

export default function PemasokIndex({ pemasoks }) {
    const [searchQuery, setSearchQuery] = useState("");

    // State untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // useForm dari Inertia menggantikan axios & useState manual
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        type_pemasok: "",
    });

    // Filter Pencarian di sisi Klien (Client-side)
    const filteredData = pemasoks.filter((item) =>
        item.type_pemasok.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Fungsi Buka/Tutup Modal
    const openCreateModal = () => {
        reset(); // Bersihkan form
        setIsEditing(false);
        setCurrentId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (pemasok) => {
        setData("type_pemasok", pemasok.type_pemasok);
        setIsEditing(true);
        setCurrentId(pemasok.pemasok_id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset(); // Hapus isian form dan error
    };

    // Fungsi Eksekusi Submit (Sangat ringkas berkat Inertia)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(`/admin/pemasok/${currentId}`, {
                onSuccess: () => closeModal(), // Otomatis tutup modal jika sukses
            });
        } else {
            post("/admin/pemasok", {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Fungsi Hapus
    const handleDelete = (id, nama) => {
        if (window.confirm(`Yakin ingin menghapus pemasok "${nama}"?`)) {
            destroy(`/admin/pemasok/${id}`);
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Pemasok">
            <Head title="Kelola Pemasok | Kirei Shop" />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Header & Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Daftar Pemasok
                            </h2>
                            <p className="text-xs text-gray-500">
                                Kelola data supplier / distributor barang
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Cari nama pemasok..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm shrink-0"
                        >
                            <Plus size={16} />{" "}
                            <span className="hidden sm:inline">
                                Tambah Pemasok
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-white text-gray-400 uppercase font-bold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">
                                    ID
                                </th>
                                <th className="px-6 py-4">
                                    Tipe / Nama Pemasok
                                </th>
                                <th className="px-6 py-4 w-32 text-right">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredData.length > 0 ? (
                                filteredData.map((pemasok) => (
                                    <tr
                                        key={pemasok.pemasok_id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-center font-bold text-gray-400">
                                            {pemasok.pemasok_id}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700">
                                            {pemasok.type_pemasok}
                                        </td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(pemasok)
                                                }
                                                className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        pemasok.pemasok_id,
                                                        pemasok.type_pemasok,
                                                    )
                                                }
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center py-12 text-gray-400 font-medium italic"
                                    >
                                        Tidak ada data pemasok ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================================= */}
            {/* MODAL (TAMBAH / EDIT) */}
            {/* ========================================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-800">
                                {isEditing
                                    ? "Edit Data Pemasok"
                                    : "Tambah Pemasok Baru"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Tipe / Nama Pemasok{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.type_pemasok}
                                    onChange={(e) =>
                                        setData("type_pemasok", e.target.value)
                                    }
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium ${errors.type_pemasok ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"}`}
                                    placeholder="Contoh: PT. Bintang Bayi"
                                />
                                {errors.type_pemasok && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.type_pemasok}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {processing && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    )}
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Data"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
