import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const metrics = [
    { label: 'Total Players', value: '12,847', badge: '+230%', badgeColor: 'green' },
    { label: 'Active Houses', value: '47', badge: '12 Cities', badgeColor: 'gray' },
    { label: 'Total Chips', value: '4.2 Cr', badge: 'In Circulation', badgeColor: 'gray' },
    { label: 'Active Now', value: '342', subLabel: 'Player Online', subLabelColor: 'green' },
];

const activities = [
    { type: 'Player Check-in', typeColor: 'text-emerald-500', name: 'Rajesh Kumar', location: 'Mumbai Central', time: '2 Minutes ago' },
    { type: 'Chips Added', typeColor: 'text-red-500', name: '10,000', location: 'Mumbai Central', time: '2 Minutes ago', meta: 'Chips' },
    { type: 'KYC Approved', typeColor: 'text-emerald-500', name: 'Rajesh Kumar', location: 'Mumbai Central', time: '2 Minutes ago' },
];

const houses = [
    { name: 'Mumbai Central', id: 'HID001258', players: 89, chips: '120K Chips' },
    { name: 'Delhi NCR', id: 'HID001259', players: 12, chips: '80K Chips' },
];

export default function DashboardPage() {
    return (
        <div>
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((m, i) => (
                    <StatCard key={i} {...m} />
                ))}
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Real-time Activity Column */}
                <div className="bg-[#111113] border border-neutral-900/50 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-neutral-400 text-sm font-medium">Real-time Activity</h2>
                        <span className="bg-red-500/10 text-red-500 text-xs font-medium px-2 py-0.5 rounded">Live</span>
                    </div>

                    <div className="space-y-6">
                        {activities.map((activity, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-medium ${activity.typeColor}`}>{activity.type}</span>
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

                {/* Top Performing Houses Column */}
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