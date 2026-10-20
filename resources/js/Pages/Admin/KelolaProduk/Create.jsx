import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

// 1. TERIMA PROPS BARU 'existingTypes' DARI CONTROLLER
export default function Create({ pemasoks, existingTypes = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: "",
        type: "",
        pemasok_id: "",
        harga: "",
        stok_saat_ini: 0,
        batas_minimum_stok: 5,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("produk.store"));
    };

    return (
        <AuthenticatedLayout header="Tambah Produk Baru">
            <Head title="Tambah Produk | Kirei Shop" />

            <div className="max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <Link
                        href={route("produk.index")}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                            Form Input Master Barang
                        </h3>
                        <p className="text-xs text-gray-500">
                            Tambahkan data produk baru ke dalam sistem
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* NAMA PRODUK */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Nama Produk{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_barang}
                                onChange={(e) =>
                                    setData("nama_barang", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.nama_barang ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Contoh: Susu Bayi SGM 400g"
                                required
                            />
                            {errors.nama_barang && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.nama_barang}
                                </span>
                            )}
                        </div>

                        {/* KATEGORI SMART INPUT (DATALIST) */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Kategori (Type){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            {/* Tambahkan atribut list="kategori-suggestions" */}
                            <input
                                type="text"
                                list="kategori-suggestions"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.type ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Pilih atau ketik kategori baru..."
                                required
                                autoComplete="off"
                            />
                            {/* Datalist sebagai penampung rekomendasi */}
                            <datalist id="kategori-suggestions">
                                {existingTypes.map((kategori, index) => (
                                    <option key={index} value={kategori} />
                                ))}
                            </datalist>
                            {errors.type && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.type}
                                </span>
                            )}
                        </div>

                        {/* INPUT HARGA */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Harga Satuan (Rp){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.harga}
                                onChange={(e) =>
                                    setData("harga", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.harga ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Contoh: 50000"
                                required
                            />
                            {errors.harga && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.harga}
                                </span>
                            )}
                        </div>

                        {/* PILIH PEMASOK */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Pilih Pemasok (Supplier){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.pemasok_id}
                                onChange={(e) =>
                                    setData("pemasok_id", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.pemasok_id ? "border-red-500" : "border-gray-300"}`}
                                required
                            >
                                <option value="" disabled>
                                    -- Silakan Pilih Pemasok --
                                </option>
                                {pemasoks &&
                                    pemasoks.map((p) => (
                                        <option
                                            key={p.pemasok_id}
                                            value={p.pemasok_id}
                                        >
                                            {p.pemasok_id} - {p.type_pemasok}
                                        </option>
                                    ))}
                            </select>
                            {errors.pemasok_id && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.pemasok_id}
                                </span>
                            )}
                        </div>

                        {/* STOK AWAL & BATAS MINIMUM */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Stok Awal{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.stok_saat_ini}
                                onChange={(e) =>
                                    setData("stok_saat_ini", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.stok_saat_ini ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.stok_saat_ini && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.stok_saat_ini}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Batas Minimum (EWS){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.batas_minimum_stok}
                                onChange={(e) =>
                                    setData(
                                        "batas_minimum_stok",
                                        e.target.value,
                                    )
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.batas_minimum_stok ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.batas_minimum_stok && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.batas_minimum_stok}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* TOMBOL ACTION */}
                    <div className="pt-5 mt-2 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-100">
                        <Link
                            href={route("produk.index")}
                            className="w-full sm:w-1/2 text-center border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-1/2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {processing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save size={18} />
                            )}
                            {processing ? "Menyimpan..." : "Simpan Produk"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
