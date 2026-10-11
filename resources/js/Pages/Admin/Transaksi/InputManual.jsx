import { useForm, usePage } from "@inertiajs/react";
import {
    Save,
    Search,
    ChevronDown,
    MapPin,
    Store,
    Calendar,
    ShoppingCart,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function InputManual({ barangs, tokos, pembelis }) {
    // Ambil pesan flash dari props global
    const { flash } = usePage().props;

    const daftarKotaUnik = [...new Set(pembelis?.map((p) => p.kota))];
    const daftarAlamatUnik = [...new Set(pembelis?.map((p) => p.alamat))];

    const formManual = useForm({
        tanggal_transaksi: new Date().toISOString().split("T")[0],
        toko_id: "",
        barang_id: "",
        kota_pembeli: "",
        alamat_pembeli: "",
        jumlah_beli: "1",
        total_harga: "",
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchBarang, setSearchBarang] = useState("");
    const dropdownRef = useRef(null);

    const filteredBarangs = barangs?.filter((b) =>
        b.nama_barang.toLowerCase().includes(searchBarang.toLowerCase()),
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (formManual.data.barang_id && formManual.data.jumlah_beli) {
            const produkTerpilih = barangs?.find(
                (b) => b.barang_id === formManual.data.barang_id,
            );
            if (produkTerpilih) {
                const total =
                    (produkTerpilih.harga || 0) *
                    parseInt(formManual.data.jumlah_beli);
                formManual.setData("total_harga", total);
            }
        } else {
            formManual.setData("total_harga", "");
        }
    }, [formManual.data.barang_id, formManual.data.jumlah_beli]);

    const submitManual = (e) => {
        e.preventDefault();
        formManual.post(route("transaksi.store"), {
            preserveScroll: true,
            onSuccess: (page) => {
                // KUNCI: Hanya reset form jika tidak ada error terkait stok
                if (!page.props.flash.error) {
                    formManual.reset("barang_id", "jumlah_beli", "total_harga");
                    setSearchBarang("");
                }
            },
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mx-auto">
            {/* AREA NOTIFIKASI */}
            {flash?.message && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{flash.message}</p>
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-sm font-medium">{flash.error}</p>
                </div>
            )}

            {/* HEADER */}
            <div className="mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                        Input Transaksi Kasir
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Catat data penjualan secara manual ke dalam sistem.
                    </p>
                </div>
            </div>

            <form onSubmit={submitManual} className="space-y-4 sm:space-y-6">
                {/* BAGIAN 1: WAKTU & CABANG */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-100">
                    <div className="col-span-full mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                            <Store size={16} className="text-slate-500" />{" "}
                            Informasi Transaksi
                        </h4>
                    </div>
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">
                            Tanggal Transaksi
                        </label>
                        <div className="relative">
                            <Calendar
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="date"
                                value={formManual.data.tanggal_transaksi}
                                onChange={(e) =>
                                    formManual.setData(
                                        "tanggal_transaksi",
                                        e.target.value,
                                    )
                                }
                                className="w-full pl-10 pr-3 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">
                            Lokasi Cabang (Toko)
                        </label>
                        <div className="relative">
                            <Store
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <select
                                value={formManual.data.toko_id}
                                onChange={(e) =>
                                    formManual.setData(
                                        "toko_id",
                                        e.target.value,
                                    )
                                }
                                className="w-full pl-10 pr-3 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
                                required
                            >
                                <option value="">-- Pilih Cabang --</option>
                                {tokos?.map((t) => (
                                    <option key={t.toko_id} value={t.toko_id}>
                                        {t.kota} - {t.alamat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* BAGIAN 2: WILAYAH PEMBELI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 border border-sky-100 bg-sky-50/50 p-4 sm:p-5 rounded-2xl">
                    <div className="md:col-span-2 mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-sky-800 flex items-center gap-1.5">
                            <MapPin size={16} className="text-sky-600" /> Data
                            Wilayah Pembeli
                        </h4>
                    </div>
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-sky-700/70 mb-1.5 ml-1">
                            Kota / Kabupaten
                        </label>
                        <input
                            type="text"
                            list="list-kota"
                            placeholder="Cth: Surakarta"
                            value={formManual.data.kota_pembeli}
                            onChange={(e) =>
                                formManual.setData(
                                    "kota_pembeli",
                                    e.target.value,
                                )
                            }
                            className="w-full px-4 py-2 sm:py-2.5 border border-sky-200 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
                            required
                        />
                        <datalist id="list-kota">
                            {daftarKotaUnik.map((kota, i) => (
                                <option key={i} value={kota} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-sky-700/70 mb-1.5 ml-1">
                            Desa, Kecamatan, atau Detail
                        </label>
                        <input
                            type="text"
                            list="list-alamat"
                            placeholder="Cth: Jajar, Laweyan"
                            value={formManual.data.alamat_pembeli}
                            onChange={(e) =>
                                formManual.setData(
                                    "alamat_pembeli",
                                    e.target.value,
                                )
                            }
                            className="w-full px-4 py-2 sm:py-2.5 border border-sky-200 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
                            required
                        />
                        <datalist id="list-alamat">
                            {daftarAlamatUnik.map((alamat, i) => (
                                <option key={i} value={alamat} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* BAGIAN 3: PRODUK & HARGA */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="md:col-span-12 mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <ShoppingCart size={16} className="text-gray-500" />{" "}
                            Detail Belanjaan
                        </h4>
                    </div>

                    <div className="md:col-span-6 relative" ref={dropdownRef}>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">
                            Cari Produk Terjual
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl flex items-center justify-between bg-white text-left focus:ring-2 focus:ring-sky-500"
                        >
                            <span className="truncate text-sm text-gray-700 font-medium">
                                {formManual.data.barang_id
                                    ? barangs?.find(
                                          (b) =>
                                              b.barang_id ===
                                              formManual.data.barang_id,
                                      )?.nama_barang
                                    : "Pilih dari katalog..."}
                            </span>
                            <ChevronDown
                                size={16}
                                className="text-gray-400 shrink-0"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                                <div className="p-2 border-b border-gray-100 relative bg-gray-50/80">
                                    <Search
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ketik nama produk..."
                                        value={searchBarang}
                                        onChange={(e) =>
                                            setSearchBarang(e.target.value)
                                        }
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500"
                                        autoFocus
                                    />
                                </div>
                                <ul className="max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar">
                                    {filteredBarangs?.length > 0 ? (
                                        filteredBarangs.map((b) => (
                                            <li
                                                key={b.barang_id}
                                                onClick={() => {
                                                    formManual.setData(
                                                        "barang_id",
                                                        b.barang_id,
                                                    );
                                                    setIsDropdownOpen(false);
                                                    setSearchBarang("");
                                                }}
                                                className={`px-4 py-2.5 text-sm cursor-pointer border-b border-gray-50 flex justify-between items-center transition-colors ${formManual.data.barang_id === b.barang_id ? "bg-sky-50 text-sky-700 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                                            >
                                                <span className="truncate pr-3">
                                                    {b.nama_barang}
                                                </span>
                                                <div className="flex flex-col items-end shrink-0">
                                                    <span
                                                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${b.stok_saat_ini <= 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
                                                    >
                                                        Stok: {b.stok_saat_ini}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-6 text-sm text-gray-400 text-center italic">
                                            Produk tidak ditemukan
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                        <input
                            type="hidden"
                            required
                            value={formManual.data.barang_id}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">
                            Kuantitas
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formManual.data.jumlah_beli}
                            onChange={(e) =>
                                formManual.setData(
                                    "jumlah_beli",
                                    e.target.value,
                                )
                            }
                            className="w-full px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm font-bold text-center sm:text-left"
                            required
                        />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-[10px] sm:text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">
                            Total Harga (Otomatis)
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={
                                formManual.data.total_harga
                                    ? `Rp ${parseInt(formManual.data.total_harga).toLocaleString("id-ID")}`
                                    : ""
                            }
                            className="w-full px-4 py-2 sm:py-2.5 border border-transparent bg-green-50 text-green-700 font-bold rounded-xl cursor-not-allowed text-sm md:text-base text-right sm:text-left"
                            placeholder="Rp 0"
                            required
                        />
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={formManual.processing}
                        className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white py-3 px-8 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:shadow-lg hover:shadow-sky-600/20"
                    >
                        {formManual.processing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>{" "}
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Simpan Transaksi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
