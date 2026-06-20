import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_toko: '',
        kota: '',
        alamat: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('toko.store'));
    };

    return (
        <AuthenticatedLayout header="Daftarkan Cabang Toko Baru">
            <Head title="Tambah Toko | Kirei Shop" />

            <div className="max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <Link href={route('toko.index')} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <ArrowLeft size={18} />
                    </Link>
                    <h3 className="font-bold text-gray-800">Form Input Dimensi Toko</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Kota</label>
                            <input type="text" value={data.kota} onChange={e => setData('kota', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500/20" placeholder="Contoh: Surakarta" required />
                            {errors.kota && <span className="text-red-600 text-xs mt-1 block">{errors.kota}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Alamat Lengkap Toko</label>
                        <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="3" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500/20" placeholder="Tuliskan jalan, nomor ruko, kecamatan..." required></textarea>
                        {errors.alamat && <span className="text-red-600 text-xs mt-1 block">{errors.alamat}</span>}
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                        <Link href={route('toko.index')} className="w-1/2 text-center border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</Link>
                        <button type="submit" disabled={processing} className="w-1/2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-colors">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Cabang'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}