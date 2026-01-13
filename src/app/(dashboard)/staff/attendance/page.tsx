/* path: src/app/(dashboard)/staff/attendance/page.tsx */
"use client";

import React, { useState } from "react";
import { useStaffLiveStatus } from "./useStaffAttendance";
import { Loader2, Search, MapPin, Clock, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";

export default function StaffAttendancePage() {
    const { data: staffList = [], isLoading } = useStaffLiveStatus();
    const [search, setSearch] = useState("");

    const filtered = staffList.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase()) ||
        s.assignedHouse.toLowerCase().includes(search.toLowerCase())
    );

    const onlineCount = staffList.filter(s => s.isOnline).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Staff Attendance</h1>
                    <p className="text-neutral-400 text-sm">Real-time presence monitoring.</p>
                </div>
                <div className="flex items-center gap-3 bg-[#111113] border border-neutral-900/50 px-4 py-2 rounded-lg">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm text-white font-medium">{onlineCount} Online</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="relative max-w-md">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search staff..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#111113] border border-neutral-900/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((staff) => (
                        <div
                            key={staff.id}
                            className={clsx(
                                "border rounded-xl p-5 relative overflow-hidden transition-colors",
                                staff.isOnline
                                    ? "bg-[#111113] border-emerald-900/30"
                                    : "bg-[#111113] border-neutral-900/50 opacity-75"
                            )}
                        >
                            {staff.isOnline && (
                                <div className="absolute top-0 right-0 p-3">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-lg font-bold text-neutral-400 border border-neutral-700">
                                    {staff.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">{staff.name}</h3>
                                    <p className="text-xs text-neutral-500 font-mono mt-1">{staff.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Location Badge */}
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={16} className={staff.isOnline ? "text-emerald-500" : "text-neutral-600"} />
                                    <span className={staff.isOnline ? "text-white" : "text-neutral-500"}>
                                        {staff.currentLocation}
                                    </span>
                                </div>

                                {/* Last Check In Time */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock size={16} className="text-neutral-600" />
                                    <span className="text-neutral-400">
                                        {staff.isOnline && staff.lastCheckIn
                                            ? `Checked in ${formatDistanceToNow(new Date(staff.lastCheckIn), { addSuffix: true })}`
                                            : staff.lastCheckIn
                                                ? `Last seen ${formatDistanceToNow(new Date(staff.lastCheckIn), { addSuffix: true })}`
                                                : "No activity logs"
                                        }
                                    </span>
                                </div>

                                {/* Assigned vs Actual Warning */}
                                {staff.isOnline && staff.currentLocation !== staff.assignedHouse && (
                                    <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-start gap-2">
                                        <ShieldAlert className="text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-amber-200">
                                            Warning: Checked into {staff.currentLocation} but assigned to {staff.assignedHouse}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}