'use client';

import React, { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from 'recharts';
import { exportToCSV } from '@/lib/export';

// --- Types ---
interface ChartData {
    time: string;
    value: number;
}

// --- Mock Data ---
const stats = [
    { label: 'Active Players', value: '342', badge: '+230%', badgeColor: 'green' },
    { label: 'Active Houses', value: '47', badge: '12 Cities', badgeColor: 'gray' },
    { label: 'Total Chips', value: '120K', badge: 'In Circulation', badgeColor: 'gray' },
    { label: 'New Signups', value: '28', badge: '+15%', badgeColor: 'green' },
];

const activities = [
    { type: 'Player Check-in', typeColor: 'text-neutral-200', name: 'Rajesh Kumar', location: 'Mumbai Central', time: '2 Minutes ago' },
    { type: 'Chips Added', typeColor: 'text-neutral-200', name: '10,000', location: 'Mumbai Central', time: '2 Minutes ago', meta: 'Chips' },
    { type: 'KYC Approved', typeColor: 'text-neutral-200', name: 'Rajesh Kumar', location: 'Mumbai Central', time: '2 Minutes ago' },
    { type: 'Player Check-out', typeColor: 'text-neutral-200', name: 'Rajesh Kumar', location: 'Mumbai Central', time: '2 Minutes ago' },
    { type: 'Player Check-in', typeColor: 'text-neutral-200', name: 'Rajesh Kumar', location: 'Mumbai Central', time: '2 Minutes ago' },
];

const houses = [
    { name: 'Mumbai Central', id: 'HID001258', players: 89, chips: '120K Chips' },
    { name: 'Delhi NCR', id: 'HID001259', players: 45, chips: '80K Chips' },
    { name: 'Bangalore East', id: 'HID001260', players: 32, chips: '50K Chips' },
    { name: 'Pune West', id: 'HID001261', players: 18, chips: '20K Chips' },
];

// --- Chart Data (Normalized) ---
const revenueData: ChartData[] = [
    { time: '00:00', value: 85 }, { time: '02:00', value: 60 }, { time: '04:00', value: 75 },
    { time: '06:00', value: 80 }, { time: '08:00', value: 50 }, { time: '10:00', value: 75 },
    { time: '12:00', value: 40 }, { time: '14:00', value: 35 }, { time: '16:00', value: 55 },
    { time: '18:00', value: 30 }, { time: '20:00', value: 45 }, { time: '22:00', value: 65 },
];

const activityData: ChartData[] = [
    { time: 'Mon', value: 80 }, { time: 'Tue', value: 55 }, { time: 'Wed', value: 70 },
    { time: 'Thu', value: 75 }, { time: 'Fri', value: 78 }, { time: 'Sat', value: 50 },
    { time: 'Sun', value: 80 },
];

export default function InsightsPage() {
    // We can use this state later for "Custom Range" filtering
    const [timeRange, setTimeRange] = useState('Today');

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex gap-2">
                    {['Today', 'This week', 'This month', 'Custom Range'].map((range) => (
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors">
                        <Filter size={16} /> Filters
                    </button>
                    <button
                        onClick={() => exportToCSV(revenueData, 'revenue_stats')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6 hover:border-neutral-800 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-neutral-400 text-sm font-medium">{stat.label}</span>
                            {stat.badge && (
                                <span
                                    className={`
                                        text-xs px-2 py-0.5 rounded-full font-medium
                                        ${stat.badgeColor === 'green' ? 'text-emerald-500 bg-emerald-500/10' : ''}
                                        ${stat.badgeColor === 'gray' ? 'text-neutral-400 bg-neutral-800' : ''}
                                    `}
                                >
                                    {stat.badge}
                                </span>
                            )}
                        </div>
                        <h3 className="text-4xl font-bold text-white tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ModernChart
                    title="Daily Revenue Trend"
                    data={revenueData}
                    color="#b91c1c" // Red
                />
                <ModernChart
                    title="Player Activity"
                    data={activityData}
                    color="#ef4444" // Slightly lighter red
                />
            </div>

            {/* Bottom Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Real-time Activity */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-neutral-400 text-sm font-medium">Real-time Activity</h2>
                        <span className="bg-red-500/10 text-red-500 text-xs font-medium px-2 py-0.5 rounded animate-pulse">Live</span>
                    </div>

                    <div className="space-y-6">
                        {activities.map((activity, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-medium text-neutral-500 group-hover:text-white transition-colors">{activity.type}</span>
                                    <span className="text-xs text-neutral-500">{activity.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-white font-medium">{activity.name}</p>
                                    </div>
                                    <span className="text-xs text-neutral-500">{activity.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Houses */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-neutral-400 text-sm font-medium">Top Performing Houses</h2>
                        <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded">Today</span>
                    </div>

                    <div className="space-y-6">
                        {houses.map((house, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-white font-medium mb-0.5">{house.name}</p>
                                    <p className="text-xs text-neutral-500">{house.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-neutral-400 mb-0.5">{house.players} Players</p>
                                    <p className="text-xs text-neutral-500">{house.chips}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Reusable Modern Chart Component ---

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

// Custom Tooltip for that "glassmorphism" look
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#18181b]/90 border border-neutral-800 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                <p className="text-neutral-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-sm">
                    {payload[0].value} <span className="text-neutral-500 font-normal">units</span>
                </p>
            </div>
        );
    }
    return null;
};