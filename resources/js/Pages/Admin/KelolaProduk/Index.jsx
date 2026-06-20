import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Pencil,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    Truck,
} from "lucide-react";

export default function Index({ barangs, flash }) {
    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            router.delete(route("produk.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout header="Kelola Data Produk (Master Barang)">
            <Head title="Kelola Produk | Kirei Shop" />

            <div className="space-y-6">
                {/* Notifikasi Flash Message Laravel */}
                {flash.message && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm">
                        <CheckCircle2 size={20} className="text-green-600" />
                        <p className="text-sm font-medium">{flash.message}</p>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <Link
                        href={route("produk.create")}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 text-sm transition-all"
                    >
                        <Plus size={18} /> Tambah Produk Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-bold">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Nama Produk</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4 text-center">
                                        Stok
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        Batas Min
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        Status (EWS)
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {barangs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-8 text-gray-400"
                                        >
                                            Belum ada data produk harian.
                                        </td>
                                    </tr>
                                ) : (
                                    barangs.map((barang) => (
                                        <tr
                                            key={barang.barang_id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {barang.barang_id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {barang.nama_barang}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                                                    {barang.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold">
                                                {barang.stok_saat_ini}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-500">
                                                {barang.batas_minimum_stok}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {barang.stok_saat_ini <=
                                                barang.batas_minimum_stok ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 animate-pulse">
                                                        <AlertTriangle
                                                            size={12}
                                                        />{" "}
                                                        Kritis
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                                        Aman
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={route(
                                                            "produk.edit",
                                                            barang.barang_id,
                                                        )}
                                                        className="p-1.5 text-gray-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                barang.barang_id,
                                                            )
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
