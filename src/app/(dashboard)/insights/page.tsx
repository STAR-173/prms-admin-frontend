'use client';

import React, { useState } from 'react';
import { Filter, Download, Loader2 } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { exportToCSV } from '@/lib/export';
import { useInsights } from './useInsights';
import { formatDistanceToNow } from 'date-fns';

interface ChartData {
    time: string;
    value: number;
}

export default function InsightsPage() {
    const [timeRange, setTimeRange] = useState('Today');
    const { data, isLoading } = useInsights(timeRange);

    const stats = data?.stats;
    const revenueData = data?.revenue || [];
    const activityData = data?.activity || [];
    const topHouses = data?.topHouses || [];
    const activities = data?.recentActivity || [];

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex gap-2">
                    {['Today', 'This week', 'This month'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                ${timeRange === range
                                    ? 'bg-[#b91c1c] text-white shadow-sm shadow-red-900/20'
                                    : 'bg-[#18181b] text-neutral-400 hover:text-white border border-neutral-800'
                                }
                            `}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => exportToCSV(revenueData, `revenue_${timeRange}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                        <Download size={16} /> Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    label="Active Players"
                    value={stats?.activePlayers?.toString() || '0'}
                    badge={timeRange}
                    badgeColor="green"
                />
                <StatCard
                    label="Active Houses"
                    value={stats?.activeHouses?.toString() || '0'}
                    badge="System Wide"
                    badgeColor="gray"
                />
                <StatCard
                    label="Total Volume"
                    value={`₹${stats?.totalChips || '0'}`}
                    badge="Buy-Ins"
                    badgeColor="gray"
                />
                {/* 
                    NOTE: 'New Signups' card is hidden/disabled because Backend Schema 
                    lacks 'createdAt' on Users table. Re-enable once Schema is patched.
                */}
                <StatCard
                    label="Avg Activity"
                    value="--"
                    badge="Coming Soon"
                    badgeColor="gray"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ModernChart
                    title={`Revenue Trend (${timeRange})`}
                    data={revenueData}
                    color="#b91c1c" // Red
                />
                <ModernChart
                    title={`Activity Trend (${timeRange})`}
                    data={activityData}
                    color="#ef4444" // Slightly lighter red
                />
            </div>

            {/* Bottom Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Real-time Activity */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-neutral-400 text-sm font-medium">Recent Transactions</h2>
                        <span className="bg-red-500/10 text-red-500 text-xs font-medium px-2 py-0.5 rounded animate-pulse">Live</span>
                    </div>

                    <div className="space-y-6">
                        {activities.slice(0, 5).map((activity: any, i: number) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-medium ${activity.type === 'Chips Added' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {activity.type}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-white font-medium">{activity.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-neutral-300 font-mono">₹{activity.amount}</p>
                                        <span className="text-[10px] text-neutral-500">{activity.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <p className="text-sm text-neutral-500 text-center py-4">No recent activity.</p>
                        )}
                    </div>
                </div>

                {/* Top Performing Houses */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-neutral-400 text-sm font-medium">Top Performing Houses</h2>
                        <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded">{timeRange}</span>
                    </div>

                    <div className="space-y-6">
                        {topHouses.map((house: any, i: number) => (
                            <div key={i} className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-white font-medium mb-0.5">{house.name}</p>
                                    <p className="text-[10px] text-neutral-500 font-mono">ID: {house.id.slice(-6)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-emerald-500 font-mono mb-0.5">₹{house.chips}</p>
                                    <p className="text-xs text-neutral-500">{house.players} Players</p>
                                </div>
                            </div>
                        ))}
                        {topHouses.length === 0 && (
                            <p className="text-sm text-neutral-500 text-center py-4">No data available for this period.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ label, value, badge, badgeColor }: any) {
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
            </div>
        </div>
    );
}

function ModernChart({ title, data, color }: { title: string, data: ChartData[], color: string }) {
    return (
        <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6 h-[350px] flex flex-col">
            <h2 className="text-neutral-400 text-sm font-medium mb-6">{title}</h2>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 12 }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#gradient-${title})`}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#18181b]/90 border border-neutral-800 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                <p className="text-neutral-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-sm">
                    {payload[0].value} <span className="text-neutral-500 font-normal"></span>
                </p>
            </div>
        );
    }
    return null;
};