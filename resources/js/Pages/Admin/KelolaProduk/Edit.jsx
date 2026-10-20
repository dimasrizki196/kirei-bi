import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

// 1. TERIMA PROPS BARU 'pemasoks' dan 'existingTypes' DARI CONTROLLER
export default function Edit({ barang, pemasoks, existingTypes = [] }) {
    // Membawa data default produk langsung dari DB ke state formulir
    const { data, setData, put, processing, errors } = useForm({
        nama_barang: barang.nama_barang,
        type: barang.type,
        pemasok_id: barang.pemasok_id,
        harga: barang.harga, // <-- Tambahkan state harga
        stok_saat_ini: barang.stok_saat_ini,
        batas_minimum_stok: barang.batas_minimum_stok,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("produk.update", barang.barang_id));
    };

    return (
        <AuthenticatedLayout header="Edit Data Produk">
            <Head title="Edit Produk | Kirei Shop" />

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
                            Perbarui Detail Barang: ID {barang.barang_id}
                        </h3>
                        <p className="text-xs text-gray-500">
                            Edit data produk yang sudah ada di sistem
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
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${errors.nama_barang ? "border-red-500" : "border-gray-300"}`}
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
                            <input
                                type="text"
                                list="kategori-suggestions-edit"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${errors.type ? "border-red-500" : "border-gray-300"}`}
                                required
                                autoComplete="off"
                            />
                            <datalist id="kategori-suggestions-edit">
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
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${errors.harga ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.harga && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.harga}
                                </span>
                            )}
                        </div>

                        {/* PILIH PEMASOK (DYNAMIC DARI DATABASE) */}
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
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${errors.pemasok_id ? "border-red-500" : "border-gray-300"}`}
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

                        {/* STOK SAAT INI & BATAS MINIMUM */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                                Stok Saat Ini{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.stok_saat_ini}
                                onChange={(e) =>
                                    setData("stok_saat_ini", e.target.value)
                                }
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${errors.stok_saat_ini ? "border-red-500" : "border-gray-300"}`}
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
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${errors.batas_minimum_stok ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.batas_minimum_stok && (
                                <span className="text-red-600 text-xs mt-1 block">
                                    {errors.batas_minimum_stok}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* TOMBOL ACTION (Responsif) */}
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
                            className="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {processing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save size={18} />
                            )}
                            {processing ? "Memperbarui..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
