'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, Building2, Wallet,
    BarChart3, Settings, UserCircle
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { label: 'Players', icon: <Users size={20} />, href: '/players' },
    { label: 'Houses', icon: <Building2 size={20} />, href: '/houses' },
    { label: 'Chip Ledger', icon: <Wallet size={20} />, href: '/ledger' },
    { label: 'Insights', icon: <BarChart3 size={20} />, href: '/insights' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-neutral-900/50 p-4 pt-6 bg-[#09090b] text-white">
            <div>
                <div className="mb-6 px-3">
                    <h1 className="text-xl font-bold tracking-tight text-white">PRMS Admin</h1>
                </div>
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                                    isActive
                                        ? "bg-[#18181b] text-white"
                                        : "text-neutral-400 hover:text-white hover:bg-[#18181b]/50"
                                )}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-6 mb-2">
                {/* Updated Link for Manage Staff */}
                <Link
                    href="/staff"
                    className={clsx(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        pathname === '/staff' ? "text-white bg-[#18181b]" : "text-neutral-400 hover:text-white"
                    )}
                >
                    <Settings size={20} />
                    <span className="text-sm font-medium">Manage Staff</span>
                </Link>

                <div className="flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <UserCircle size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Raj Tripathi</span>
                        <span className="text-xs text-neutral-500">EMPID006969</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}