/* path: prms-admin-frontend/src/components/Sidebar.tsx */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Wallet,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  Fingerprint
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
  isMobile?: boolean;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  { label: "Players", icon: <Users size={20} />, href: "/players" },
  { label: "Houses", icon: <Building2 size={20} />, href: "/houses" },
  { label: "Chip Ledger", icon: <Wallet size={20} />, href: "/ledger" },
  { label: "Insights", icon: <BarChart3 size={20} />, href: "/insights" },
];

export function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <aside
      className={clsx(
        "w-64 flex flex-col justify-between bg-[#09090b] text-white",
        isMobile
          ? "h-full p-4 pt-6"
          : "flex-shrink-0 border-r border-neutral-900/50 p-4 pt-6 hidden lg:flex"
      )}
    >
      <div>
        <div className="mb-6 px-3">
          <h1 className="text-xl font-bold tracking-tight text-white">
            PRMS Admin
          </h1>
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

      <div className="space-y-1 mb-2">
        <p className="px-3 text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">Management</p>

        <Link
          href="/staff/attendance"
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            pathname === "/staff/attendance"
              ? "text-white bg-[#18181b]"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <Fingerprint size={20} />
          <span className="text-sm font-medium">Attendance</span>
        </Link>

        <Link
          href="/staff"
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            // * Fixed Logic: Strict equality is sufficient here.
            pathname === "/staff"
              ? "text-white bg-[#18181b]"
              : "text-neutral-400 hover:text-white"
          )}
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Manage Staff</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                <UserCircle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  Admin User
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Staff Access
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-neutral-500 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}