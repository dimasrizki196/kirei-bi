import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Store, CheckCircle2 } from 'lucide-react';

export default function Index({ tokos, flash }) {
    
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus cabang toko ini?')) {
            router.delete(route('toko.destroy', id));
        }
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
                        href={route('toko.create')}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 text-sm transition-all"
                    >
                        <Plus size={18} /> Daftarkan Cabang Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-bold">
                                    <th className="px-6 py-4">ID Toko</th>
                                    <th className="px-6 py-4">Nama Cabang / Toko</th>
                                    <th className="px-6 py-4">Kota</th>
                                    <th className="px-6 py-4">Alamat Lengkap</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {tokos.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-400">Belum ada data cabang toko terdaftar.</td>
                                    </tr>
                                ) : tokos.map((t) => (
                                    <tr key={t.toko_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.toko_id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                                            <Store size={16} className="text-gray-400" />Kirei Shop - Cabang {t.kota}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                                                {t.kota}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{t.alamat}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link href={route('toko.edit', t.toko_id)} className="p-1.5 text-gray-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors">
                                                    <Pencil size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(t.toko_id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}