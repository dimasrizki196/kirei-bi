import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: '',
        type: 'Konsumsi',
        pemasok_id: 1,
        stok_saat_ini: 0,
        batas_minimum_stok: 5,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('produk.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Produk Baru">
            <Head title="Tambah Produk | Kirei Shop" />

            <div className="max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <Link href={route('produk.index')} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <ArrowLeft size={18} />
                    </Link>
                    <h3 className="font-bold text-gray-800">Form Input Master Barang</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Nama Produk</label>
                        <input type="text" value={data.nama_barang} onChange={e => setData('nama_barang', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" placeholder="Contoh: Susu Bayi SGM 400g" required />
                        {errors.nama_barang && <span className="text-red-600 text-xs mt-1 block">{errors.nama_barang}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Kategori (Type)</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500/20">
                                <option value="Konsumsi">Konsumsi</option>
                                <option value="Pakaian">Pakaian</option>
                                <option value="Elektronik">Elektronik</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">ID Pemasok</label>
                            <select value={data.pemasok_id} onChange={e => setData('pemasok_id', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500/20">
                                <option value="1">1 (Distributor Utama)</option>
                                <option value="2">2 (Produsen Lokal)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Stok Awal</label>
                            <input type="number" min="0" value={data.stok_saat_ini} onChange={e => setData('stok_saat_ini', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Batas Minimum (EWS)</label>
                            <input type="number" min="0" value={data.batas_minimum_stok} onChange={e => setData('batas_minimum_stok', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl" required />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                        <Link href={route('produk.index')} className="w-1/2 text-center border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</Link>
                        <button type="submit" disabled={processing} className="w-1/2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-colors">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}