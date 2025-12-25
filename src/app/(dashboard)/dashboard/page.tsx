'use client';

import React from 'react';
import { useDashboardStats, useDashboardActivity } from './useDashboard';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
    const { data: stats } = useDashboardStats();
    const { data: activity } = useDashboardActivity();

    return (
        <div>
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Players"
                    value={stats?.totalPlayers?.toString() || '...'}
                    badge="Registered"
                    badgeColor="gray"
                />
                <StatCard
                    label="Active Houses"
                    value={stats?.activeHouses?.toString() || '...'}
                    badge="Live"
                    badgeColor="green"
                />
                <StatCard
                    label="Total Chips"
                    value={`₹${stats?.totalChips || '...'}`}
                    badge="System Wide"
                    badgeColor="gray"
                />
                <StatCard
                    label="Active Now"
                    value={stats?.activeNow?.toString() || '...'}
                    subLabel="Players Seated"
                    subLabelColor="green"
                />
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Real-time Activity Column */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-neutral-400 text-sm font-medium">Real-time Activity</h2>
                        <span className="bg-red-500/10 text-red-500 text-xs font-medium px-2 py-0.5 rounded animate-pulse">Live</span>
                    </div>

                    <div className="space-y-6">
                        {activity?.map((item: any, i: number) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-medium ${item.type === 'Chips Added' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {item.type}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-white font-medium">{item.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-neutral-300 font-mono">₹{item.amount}</p>
                                        <span className="text-[10px] text-neutral-500">{item.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Houses Column (Placeholder for now, or reuse useAdminHouses) */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                        Performance Charts Coming Soon
                    </div>
                </div>
            </div>
        </div>
    );
}

// Internal Component for Stats
function StatCard({ label, value, badge, badgeColor, subLabel, subLabelColor }: any) {
    return (
        <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
                <span className="text-neutral-400 text-sm font-medium">{label}</span>
                {badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor === 'green' ? 'text-emerald-500 bg-emerald-500/10' : 'text-neutral-400 bg-neutral-800'}`}>
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                {subLabel && <span className={`text-xs ${subLabelColor === 'green' ? 'text-emerald-500' : 'text-neutral-500'}`}>{subLabel}</span>}
            </div>
        </div>
    );
}