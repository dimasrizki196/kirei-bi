import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LayoutDashboard,
    PackageSearch,
    ShoppingCart,
    Store,
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    Users,
    Truck,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. DAFTAR MENU KHUSUS ADMIN
    const adminMenus = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            url: route("dashboard"),
            active: route().current("dashboard"),
        },
        {
            title: "Input Transaksi",
            icon: ShoppingCart,
            url: route("transaksi.index"),
            active: route().current("transaksi.index*"),
        },
        {
            title: "Kelola Produk",
            icon: PackageSearch,
            url: route("produk.index"),
            active: route().current("produk.*"),
        },
    ];

    // 2. DAFTAR MENU KHUSUS MANAGER
    const managerMenus = [
        {
            title: "Dashboard BI",
            icon: LayoutDashboard,
            url: route("dashboard"),
            active: route().current("dashboard"),
        },
        {
            title: "Kelola Akses User",
            icon: Users,
            url: route("users.index"),
            active: route().current("users.*"),
        },
        {
            title: "Daftar Produk",
            icon: PackageSearch,
            url: route("produk.index"),
            active: route().current("produk.*"),
        },
        {
            title: "Riwayat Transaksi",
            icon: ShoppingCart,
            url: route("transaksi.index"),
            active: route().current("transaksi.*"),
        },
        {
            title: "Kelola Pemasok",
            icon: Truck,
            url: route("pemasok.index"),
            active: route().current("pemasok.*"),
        },
        {
            title: "Kelola Toko",
            icon: Store,
            url: route("toko.index"),
            active: route().current("toko.*"),
        },
    ];

    // 3. PENENTUAN MENU BERDASARKAN ROLE
    const displayedMenus = user.role === "manager" ? managerMenus : adminMenus;

    const roleLabel = user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "Admin";

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR NAVIGATION */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } flex flex-col`}
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                    <Link
                        href={route("dashboard")}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-sky-100 p-2 rounded-xl">
                            <ApplicationLogo className="h-12 w-12 fill-current text-sky-600" />
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">
                            Kirei Shop <span className="text-sky-600">BI</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto flex-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3 mt-4">
                        Menu {roleLabel}
                    </div>

                    {displayedMenus.map((menu, index) => (
                        <Link
                            key={index}
                            href={menu.url}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                menu.active
                                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                                    : "text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                            }`}
                        >
                            <menu.icon
                                size={20}
                                className={
                                    menu.active ? "text-white" : "text-gray-500"
                                }
                            />
                            <span className="font-medium">{menu.title}</span>
                        </Link>
                    ))}
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        {header && (
                            <div className="hidden sm:block text-xl font-semibold text-gray-800">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
                                >
                                    <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start text-left">
                                        <span className="text-sm font-semibold text-gray-700 leading-tight">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {roleLabel} Kirei
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className="text-gray-400 ml-1"
                                    />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right">
                                <Dropdown.Link
                                    href={route("profile.edit")}
                                    className="flex items-center gap-2"
                                >
                                    <User size={16} /> Profil Saya
                                </Dropdown.Link>

                                {/* PERUBAHAN KRUSIAL: Menggunakan Link murni dari Inertia */}
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} /> Keluar
                                </Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {header && (
                        <div className="sm:hidden mb-6 text-xl font-semibold text-gray-800">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
