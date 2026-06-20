import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Sparkles,
    Package,
    ShoppingBag,
    Users,
    Filter,
    Calendar,
    MapPin,
    Tag,
    Trophy,
    BatteryWarning,
    ArrowUpRight,
    ArrowDownRight,
    Lightbulb,
    XCircle,
    Bot,
    RefreshCw, // <-- Icon baru untuk tombol Refresh AI
} from "lucide-react";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export default function Dashboard({
    kpi = {
        total_qty: 0,
        total_omzet: 0,
        rata_transaksi: 0,
        total_wilayah: 0,
        growth_omzet: 0,
        growth_qty: 0,
    },
    stokKritis = [],
    trenPenjualan = [],
    komposisiKategori = [],
    produkTerlaris = [],
    produkKurangLaris = [],
    daftarTahun = [],
    daftarToko = [],
    daftarKategori = [],
    filters = {},
}) {
    // 1. STATE FILTER
    const [filterHari, setFilterHari] = useState(filters.hari || "semua");
    const [filterBulan, setFilterBulan] = useState(filters.bulan || "semua");
    const [filterTahun, setFilterTahun] = useState(filters.tahun || "semua");
    const [filterToko, setFilterToko] = useState(filters.toko || "semua");
    const [filterKategori, setFilterKategori] = useState(
        filters.kategori || "semua",
    );

    // 1. Ambil role user dari props global Inertia
    const userRole = usePage().props.auth.user.role;

    // 2. STATE LOADING & AI
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [rekomendasiAI, setRekomendasiAI] = useState([]);

    // 3. FUNGSI KHUSUS UNTUK MEMANGGIL AI
    const fetchAiRecommendation = () => {
        setIsAiLoading(true);
        setRekomendasiAI([]);

        axios
            .get("/dashboard/api/ai-recommendation", {
                params: {
                    growth_omzet: kpi.growth_omzet,
                    terlaris: produkTerlaris,
                    kurang_laris: produkKurangLaris,
                },
            })
            .then((response) => {
                if (response.data.status === "success") {
                    setRekomendasiAI(response.data.data);
                    // KUNCI: Simpan hasil ke sessionStorage agar tidak fetch ulang saat pindah menu
                    sessionStorage.setItem(
                        "kirei_ai_rekomendasi",
                        JSON.stringify(response.data.data),
                    );
                } else {
                    setRekomendasiAI(["[Sistem AI] " + response.data.message]);
                }
            })
            .catch((error) => {
                setRekomendasiAI([
                    "Sistem AI gagal terhubung. Coba klik Analisis Ulang Data.",
                ]);
            })
            .finally(() => {
                setIsAiLoading(false);
            });
    };

    // 4. EFFECT: AUTO-LOAD (Hanya Manager & Hanya 1x Per Sesi)
    useEffect(() => {
        // Cek apakah user adalah manager
        if (userRole === "manager") {
            const savedAiData = sessionStorage.getItem("kirei_ai_rekomendasi");

            if (savedAiData) {
                // Jika data AI sudah ada di memori sesi, langsung pakai (tanpa loading)
                setRekomendasiAI(JSON.parse(savedAiData));
            } else {
                // Jika memori kosong (baru pertama kali login/buka dashboard), panggil API
                fetchAiRecommendation();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole]);

    const handleFilterChange = (key, value) => {
        setIsPageLoading(true);
        if (key === "hari") setFilterHari(value);
        if (key === "bulan") setFilterBulan(value);
        if (key === "tahun") setFilterTahun(value);
        if (key === "toko") setFilterToko(value);
        if (key === "kategori") setFilterKategori(value);

        const queryParams = {
            hari: key === "hari" ? value : filterHari,
            bulan: key === "bulan" ? value : filterBulan,
            tahun: key === "tahun" ? value : filterTahun,
            toko: key === "toko" ? value : filterToko,
            kategori: key === "kategori" ? value : filterKategori,
        };

        router.get("/dashboard", queryParams, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsPageLoading(false),
        });
    };

    const resetFilters = () => {
        setIsPageLoading(true);
        setFilterHari("semua");
        setFilterBulan("semua");
        setFilterTahun("semua");
        setFilterToko("semua");
        setFilterKategori("semua");
        router.get(
            "/dashboard",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsPageLoading(false),
            },
        );
    };

    // 3. PERSIAPAN DATA GRAFIK
    const namaBulan = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Ags",
        "Sep",
        "Okt",
        "Nov",
        "Des",
    ];
    const labelTren = trenPenjualan.map(
        (t) => `${namaBulan[t.bulan - 1]} ${t.tahun}`,
    );
    const dataOmzetTren = trenPenjualan.map((t) => t.total_omzet / 1000000);
    const dataQtyTren = trenPenjualan.map((t) => t.total_qty);

    const dataTrenGrafik = {
        labels: labelTren,
        datasets: [
            {
                label: "Omzet (Jt)",
                data: dataOmzetTren,
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                tension: 0.4,
                fill: true,
                yAxisID: "y",
            },
            {
                label: "Qty (Pcs)",
                data: dataQtyTren,
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                tension: 0.4,
                fill: true,
                yAxisID: "y1",
            },
        ],
    };

    const dataKategoriPie = {
        labels: komposisiKategori.map((k) => k.type ?? "Lainnya"),
        datasets: [
            {
                data: komposisiKategori.map((k) => k.total_omzet),
                backgroundColor: [
                    "#38bdf8",
                    "#818cf8",
                    "#34d399",
                    "#fbbf24",
                    "#9ca3af",
                    "#f472b6",
                ],
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    const opsiGrafikGaris = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
        scales: {
            y: { type: "linear", display: true, position: "left" },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: { drawOnChartArea: false },
            },
        },
    };
    const opsiGrafikPie = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "right" } },
        cutout: "65%",
    };
    const formatRp = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    return (
        <AuthenticatedLayout header="Dashboard Business Intelligence">
            <Head title="BI Dashboard | Kirei Shop" />

            <div
                className={`space-y-6 max-w-full overflow-hidden px-2 sm:px-0 pb-12 transition-opacity duration-300 ${isPageLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
            >
                {/* 1. FILTER PANEL */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full xl:w-auto shrink-0">
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                            <Filter size={20} className="text-indigo-600" />
                            <span className="text-sm md:text-base">
                                Filter Analitik:
                            </span>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="xl:hidden flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold bg-red-50 px-2 py-1 rounded-lg"
                        >
                            <XCircle size={14} /> Reset
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-3 w-full">
                        <div className="flex w-full lg:w-auto bg-gray-50 border border-gray-300 rounded-xl overflow-hidden divide-x divide-gray-300">
                            <div className="hidden sm:flex items-center pl-3 pr-2 bg-white">
                                <Calendar size={14} className="text-gray-400" />
                            </div>
                            <select
                                value={filterHari}
                                onChange={(e) =>
                                    handleFilterChange("hari", e.target.value)
                                }
                                className="w-1/3 sm:w-auto pl-2 sm:pl-3 pr-8 py-2 border-0 bg-transparent text-xs sm:text-sm focus:ring-0 font-medium text-gray-700"
                            >
                                <option value="semua">Tgl</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterBulan}
                                onChange={(e) =>
                                    handleFilterChange("bulan", e.target.value)
                                }
                                className="w-1/3 sm:w-auto pl-2 sm:pl-3 pr-8 py-2 border-0 bg-transparent text-xs sm:text-sm focus:ring-0 font-medium text-gray-700"
                            >
                                <option value="semua">Bulan</option>
                                {namaBulan.map((bln, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {bln}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterTahun}
                                onChange={(e) =>
                                    handleFilterChange("tahun", e.target.value)
                                }
                                className="w-1/3 sm:w-auto pl-2 sm:pl-3 pr-8 py-2 border-0 bg-transparent text-xs sm:text-sm focus:ring-0 font-medium text-gray-700"
                            >
                                <option value="semua">Tahun</option>
                                {daftarTahun.map((thn, i) => (
                                    <option key={i} value={thn.tahun}>
                                        {thn.tahun}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 flex-col sm:flex-row flex-1">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag size={14} className="text-gray-400" />
                                </div>
                                <select
                                    value={filterKategori}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "kategori",
                                            e.target.value,
                                        )
                                    }
                                    className="pl-9 pr-8 py-2 w-full border border-gray-300 rounded-xl text-sm focus:ring-indigo-500 font-medium text-gray-700"
                                >
                                    <option value="semua">
                                        Semua Kategori
                                    </option>
                                    {daftarKategori.map((kat, i) => (
                                        <option key={i} value={kat.type}>
                                            {kat.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin
                                        size={14}
                                        className="text-gray-400"
                                    />
                                </div>
                                <select
                                    value={filterToko}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "toko",
                                            e.target.value,
                                        )
                                    }
                                    className="pl-9 pr-8 py-2 w-full border border-gray-300 rounded-xl text-sm focus:ring-indigo-500 font-medium text-gray-700"
                                >
                                    <option value="semua">Semua Cabang</option>
                                    {daftarToko.map((toko) => (
                                        <option
                                            key={toko.toko_id}
                                            value={toko.toko_id}
                                        >
                                            Cabang {toko.kota}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={resetFilters}
                        className="hidden xl:flex shrink-0 items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold border border-gray-200 hover:border-red-200"
                    >
                        <XCircle size={16} /> Reset
                    </button>
                </div>

                {/* 2. KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400">
                                Total Terjual
                            </p>
                            <h3 className="text-xl lg:text-2xl font-black text-gray-800 mt-1">
                                {parseInt(kpi.total_qty).toLocaleString(
                                    "id-ID",
                                )}{" "}
                                <span className="text-xs font-medium text-gray-500">
                                    Pcs
                                </span>
                            </h3>
                            <div
                                className={`flex items-center gap-1 mt-1.5 text-xs font-bold ${kpi.growth_qty >= 0 ? "text-emerald-600" : "text-red-500"}`}
                            >
                                {kpi.growth_qty >= 0 ? (
                                    <ArrowUpRight size={14} />
                                ) : (
                                    <ArrowDownRight size={14} />
                                )}{" "}
                                <span>{Math.abs(kpi.growth_qty)}% (MoM)</span>
                            </div>
                        </div>
                        <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400">
                                Total Omzet
                            </p>
                            <h3 className="text-xl lg:text-2xl font-black text-gray-800 mt-1">
                                Rp{" "}
                                {((kpi.total_omzet || 0) / 1000000).toFixed(1)}{" "}
                                <span className="text-xs font-medium text-gray-500">
                                    Jt
                                </span>
                            </h3>
                            <div
                                className={`flex items-center gap-1 mt-1.5 text-xs font-bold ${kpi.growth_omzet >= 0 ? "text-emerald-600" : "text-red-500"}`}
                            >
                                {kpi.growth_omzet >= 0 ? (
                                    <ArrowUpRight size={14} />
                                ) : (
                                    <ArrowDownRight size={14} />
                                )}{" "}
                                <span>{Math.abs(kpi.growth_omzet)}% (MoM)</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400">
                                Rata-rata Transaksi
                            </p>
                            <h3 className="text-xl lg:text-2xl font-black text-gray-800 mt-1">
                                Rp{" "}
                                {parseInt(
                                    kpi.rata_transaksi || 0,
                                ).toLocaleString("id-ID")}
                            </h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-400">
                                Wilayah Pembeli
                            </p>
                            <h3 className="text-xl lg:text-2xl font-black text-gray-800 mt-1">
                                {kpi.total_wilayah}{" "}
                                <span className="text-xs font-medium text-gray-500">
                                    Titik Unik
                                </span>
                            </h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                {/* 3. VISUALISASI GRAFIK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="mb-4">
                            <h4 className="font-bold text-gray-800 text-base">
                                Tren Pertumbuhan Penjualan
                            </h4>
                        </div>
                        <div className="w-full h-64 lg:h-80">
                            {trenPenjualan.length > 0 ? (
                                <Line
                                    data={dataTrenGrafik}
                                    options={opsiGrafikGaris}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    Belum ada data di periode ini
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="mb-4">
                            <h4 className="font-bold text-gray-800 text-base">
                                Komposisi Kategori
                            </h4>
                        </div>
                        <div className="w-full h-64 lg:h-80 flex justify-center pb-4">
                            {komposisiKategori.length > 0 ? (
                                <Doughnut
                                    data={dataKategoriPie}
                                    options={opsiGrafikPie}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    Belum ada data
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. ANALISIS TABEL PRODUK & STOK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
                                <h4 className="font-bold text-gray-800 text-base flex items-center gap-2">
                                    <Trophy
                                        size={18}
                                        className="text-amber-500"
                                    />{" "}
                                    Top 5 Produk Terlaris
                                </h4>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-white text-gray-400 uppercase font-bold border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 w-10 text-center">
                                                No
                                            </th>
                                            <th className="px-5 py-3">
                                                Nama Produk
                                            </th>
                                            <th className="px-5 py-3 text-center">
                                                Terjual
                                            </th>
                                            <th className="px-5 py-3 text-right">
                                                Pendapatan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {produkTerlaris.length > 0 ? (
                                            produkTerlaris.map(
                                                (item, index) => (
                                                    <tr
                                                        key={item.barang_id}
                                                        className="hover:bg-slate-50 transition-colors"
                                                    >
                                                        <td className="px-5 py-3 text-center font-bold text-gray-400">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <p className="font-bold text-gray-700 max-w-[200px] sm:max-w-xs truncate">
                                                                {
                                                                    item.nama_barang
                                                                }
                                                            </p>
                                                            <p className="text-[10px] sm:text-xs text-gray-400">
                                                                {item.type}
                                                            </p>
                                                        </td>
                                                        <td className="px-5 py-3 text-center font-semibold text-emerald-600">
                                                            {item.terjual} Pcs
                                                        </td>
                                                        <td className="px-5 py-3 text-right font-bold text-gray-700">
                                                            {formatRp(
                                                                item.pendapatan,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center py-6 text-gray-400"
                                                >
                                                    Tidak ada data penjualan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
                                <h4 className="font-bold text-gray-800 text-base flex items-center gap-2">
                                    <BatteryWarning
                                        size={18}
                                        className="text-red-500"
                                    />{" "}
                                    5 Produk Paling Kurang Laris
                                </h4>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-white text-gray-400 uppercase font-bold border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 w-10 text-center">
                                                No
                                            </th>
                                            <th className="px-5 py-3">
                                                Nama Produk
                                            </th>
                                            <th className="px-5 py-3 text-center">
                                                Terjual
                                            </th>
                                            <th className="px-5 py-3 text-right">
                                                Pendapatan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {produkKurangLaris.length > 0 ? (
                                            produkKurangLaris.map(
                                                (item, index) => (
                                                    <tr
                                                        key={item.barang_id}
                                                        className="hover:bg-slate-50 transition-colors"
                                                    >
                                                        <td className="px-5 py-3 text-center font-bold text-gray-400">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <p className="font-bold text-gray-700 max-w-[200px] sm:max-w-xs truncate">
                                                                {
                                                                    item.nama_barang
                                                                }
                                                            </p>
                                                            <p className="text-[10px] sm:text-xs text-gray-400">
                                                                {item.type}
                                                            </p>
                                                        </td>
                                                        <td className="px-5 py-3 text-center font-semibold text-red-500">
                                                            {item.terjual} Pcs
                                                        </td>
                                                        <td className="px-5 py-3 text-right font-bold text-gray-700">
                                                            {formatRp(
                                                                item.pendapatan,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center py-6 text-gray-400"
                                                >
                                                    Tidak ada data penjualan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 h-full flex flex-col">
                        {stokKritis.length > 0 ? (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-red-800 font-bold mb-4 pb-3 border-b border-red-100">
                                    <AlertTriangle
                                        size={20}
                                        className="animate-pulse shrink-0"
                                    />
                                    <h4 className="text-base">
                                        Stok Menipis (Bawah Batas Min)
                                    </h4>
                                </div>
                                <div className="space-y-3 overflow-y-auto pr-1 max-h-[500px] custom-scrollbar">
                                    {stokKritis.map((barang) => (
                                        <div
                                            key={barang.barang_id}
                                            className="bg-white p-3 rounded-xl border border-red-100 shadow-sm text-sm flex justify-between items-center gap-3"
                                        >
                                            <span className="font-semibold text-gray-800 leading-tight">
                                                {barang.nama_barang}
                                            </span>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                    Sisa: {barang.stok_saat_ini}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-1">
                                                    Min:{" "}
                                                    {barang.batas_minimum_stok}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center h-full text-emerald-700 text-center">
                                <Sparkles
                                    size={48}
                                    className="mb-4 opacity-80"
                                />
                                <span className="font-bold text-lg">
                                    Gudang 100% Aman
                                </span>
                                <span className="text-sm mt-2 max-w-[200px]">
                                    Semua stok produk berada di atas batas
                                    minimum.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ======================================================== */}
                {/* 5. GENERATIVE AI DENGAN TOMBOL REFRESH KHUSUS */}
                {/* ======================================================== */}

                {userRole === "manager" && (
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-900/50 text-white relative overflow-hidden mt-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-700/80 pb-5 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                                    <Bot size={28} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                                        Gemini AI Strategist
                                    </h3>
                                    <p className="text-xs sm:text-sm text-indigo-200/70 mt-1">
                                        Menganalisis data spesifik berdasarkan
                                        filter yang Anda tetapkan
                                    </p>
                                </div>
                            </div>

                            {/* Area Status & Tombol Refresh */}
                            <div className="flex items-center gap-3 self-start md:self-auto">
                                <button
                                    onClick={fetchAiRecommendation}
                                    disabled={isAiLoading}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                        isAiLoading
                                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25 hover:shadow-lg border border-indigo-500/50"
                                    }`}
                                >
                                    <RefreshCw
                                        size={16}
                                        className={
                                            isAiLoading ? "animate-spin" : ""
                                        }
                                    />
                                    {isAiLoading
                                        ? "Memproses..."
                                        : "Analisis Ulang Data"}
                                </button>

                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                                    {isAiLoading ? (
                                        <>
                                            <span className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-amber-400"></span>
                                            <span className="text-[10px] font-bold text-amber-400 tracking-wider">
                                                WAIT
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            <span className="text-[10px] font-bold text-emerald-400 tracking-wider">
                                                READY
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 w-full">
                            {isAiLoading ? (
                                <div className="w-full flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-xl border border-slate-700/50 shadow-inner">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin"></div>
                                        <div className="absolute inset-2 rounded-full border-r-2 border-purple-400 animate-spin reverse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Bot
                                                size={20}
                                                className="text-indigo-300 animate-pulse"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-indigo-300 text-sm font-medium animate-pulse tracking-wide">
                                        AI sedang merumuskan strategi dari data
                                        filter terbaru...
                                    </p>
                                </div>
                            ) : rekomendasiAI.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
                                    {rekomendasiAI.map((teks, idx) => {
                                        const cleanText = teks.replace(
                                            /^[0-9]+\.\s*/,
                                            "",
                                        );
                                        return (
                                            <div
                                                key={idx}
                                                className="flex flex-col gap-3.5 bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50 items-start hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all shadow-sm"
                                            >
                                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 inline-flex items-center justify-center">
                                                    <Sparkles size={18} />
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed w-full">
                                                    {cleanText
                                                        .split("**")
                                                        .map((part, i) =>
                                                            i % 2 === 1 ? (
                                                                <strong
                                                                    key={i}
                                                                    className="text-white bg-indigo-500/20 px-1.5 py-0.5 rounded mx-0.5 border border-indigo-500/30 block mb-2"
                                                                >
                                                                    {part}
                                                                </strong>
                                                            ) : (
                                                                part
                                                            ),
                                                        )}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/50 text-center text-slate-500 italic">
                                    Tekan tombol "Analisis Ulang Data" untuk
                                    memulai AI.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
