'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportToCSV } from '@/lib/export';

// Note: Keeping data exactly as provided in source file
const INITIAL_HOUSES = [
    { id: 'PID014538', name: 'Raj Patel', location: 'Mumbai', tables: '5000', players: '45', chips: '12000', status: 'Verified' },
    { id: 'PID014539', name: 'Viraj Thaker', location: 'Madurai', tables: '15220', players: '84', chips: '5400', status: 'Pending' },
    { id: 'PID014540', name: 'Kartik Prithvi', location: 'Rajkot', tables: '513888', players: '20', chips: '8900', status: 'Verified' },
    { id: 'PID014541', name: 'Vanraj Chavda', location: 'Ahmedabad', tables: '500080', players: '12', chips: '2300', status: 'Pending' },
];

export default function HousesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredHouses = useMemo(() => {
        return INITIAL_HOUSES.filter(house => {
            const matchesSearch =
                house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                house.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                house.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All' || house.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by house id, name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111113] border border-neutral-900/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-[#111113] border-neutral-900/50 text-neutral-300 hover:text-white'}`}
                        >
                            <Filter size={16} /> Filters
                        </button>
                        <button
                            onClick={() => exportToCSV(filteredHouses, 'houses_list')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#111113] border border-neutral-900/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="p-4 bg-[#111113] border border-neutral-900/50 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-[#18181b] border border-neutral-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-600"
                            >
                                <option value="All">All</option>
                                <option value="Verified">Verified</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <button onClick={() => setStatusFilter('All')} className="text-xs text-red-400 hover:text-red-300 ml-auto">Reset Filters</button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-neutral-900/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800/50 text-neutral-400 text-sm">
                                <th className="font-medium p-4 pl-6">House ID</th>
                                <th className="font-medium p-4 text-center">House Name</th>
                                <th className="font-medium p-4 text-center">Location</th>
                                <th className="font-medium p-4 text-center">Tables</th>
                                <th className="font-medium p-4 text-center">Active Players</th>
                                <th className="font-medium p-4 text-center">Today's Chips</th>
                                <th className="font-medium p-4 text-right pr-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredHouses.map((house, i) => (
                                <tr key={i} className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0">
                                    <td className="p-4 pl-6 text-neutral-400">{house.id}</td>
                                    <td className="p-4 text-center text-white font-medium">{house.name}</td>
                                    <td className="p-4 text-center text-neutral-400">{house.location}</td>
                                    <td className="p-4 text-center text-neutral-300">{house.tables}</td>
                                    <td className="p-4 text-center text-neutral-300">{house.players}</td>
                                    <td className="p-4 text-center text-neutral-300">{house.chips}</td>
                                    <td className="p-4 text-right pr-6">
                                        <StatusBadge status={house.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Verified: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
        Pending: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        Failed: 'text-red-500 border-red-500/20 bg-red-500/10',
    };

    return (
        <span
            className={`
                inline-block px-3 py-1 rounded-full text-xs font-medium border
                ${styles[status] || 'text-neutral-400'}
            `}
        >
            {status}
        </span>
    );
}