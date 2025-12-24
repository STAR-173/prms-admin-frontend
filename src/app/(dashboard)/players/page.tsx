'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Player } from '@/types';
import { exportToCSV } from '@/lib/export';

// Mock Data
const INITIAL_PLAYERS: Player[] = [
    { id: 'PID014538', name: 'Raj Patel', phone: '98985731721', balance: '5000', games: '45', kyc: 'Verified', house: 'Mumbai' },
    { id: 'PID014539', name: 'Viraj Thaker', phone: '25761238615', balance: '15220', games: '84', kyc: 'Pending', house: 'Madurai' },
    { id: 'PID014540', name: 'Kartik Prithvi', phone: '72186455625', balance: '513888', games: '20', kyc: 'Verified', house: 'Rajkot' },
    { id: 'PID014541', name: 'Cristiano Ronaldo', phone: '04412128410', balance: '50000', games: '02', kyc: 'Pending', house: 'Bangalore' },
    { id: 'PID014542', name: 'Lionel Messi', phone: '8240404402', balance: '10000', games: '24', kyc: 'Verified', house: 'Chennai' },
];

export default function PlayersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Efficient Filtering Logic
    const filteredPlayers = useMemo(() => {
        return INITIAL_PLAYERS.filter(player => {
            const matchesSearch =
                player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                player.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                player.phone.includes(searchQuery);

            const matchesStatus = statusFilter === 'All' || player.kyc === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by player id, name or phone..."
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
                            onClick={() => exportToCSV(filteredPlayers, 'players_list')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#111113] border border-neutral-900/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Filter Panel (Conditional) */}
                {showFilters && (
                    <div className="p-4 bg-[#111113] border border-neutral-900/50 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400">KYC Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-[#18181b] border border-neutral-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-600"
                            >
                                <option value="All">All Status</option>
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
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800/50 text-neutral-400 text-sm">
                            <th className="font-medium p-4 pl-6">Player ID</th>
                            <th className="font-medium p-4">Name</th>
                            <th className="font-medium p-4">Phone Number</th>
                            <th className="font-medium p-4 text-center">Wallet Balance</th>
                            <th className="font-medium p-4 text-center">Games Played</th>
                            <th className="font-medium p-4 text-center">KYC Status</th>
                            <th className="font-medium p-4 text-right pr-6">Last House</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredPlayers.length > 0 ? (
                            filteredPlayers.map((player, i) => (
                                <tr key={i} className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0">
                                    <td className="p-4 pl-6 text-neutral-400">{player.id}</td>
                                    <td className="p-4 text-white font-medium">{player.name}</td>
                                    <td className="p-4 text-neutral-400">{player.phone}</td>
                                    <td className="p-4 text-center text-neutral-300">{player.balance}</td>
                                    <td className="p-4 text-center text-neutral-300">{player.games}</td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={player.kyc} />
                                    </td>
                                    <td className="p-4 text-right pr-6 text-neutral-400">{player.house}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-neutral-500">No players found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination (Static for now) */}
                <div className="flex justify-between items-center p-4 border-t border-neutral-900/50">
                    <span className="text-sm text-neutral-500">Showing {filteredPlayers.length} results</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:text-white text-neutral-500 transition-colors"><ChevronLeft size={16} /></button>
                        <span className="text-sm text-white">Page 1</span>
                        <button className="p-1 hover:text-white text-neutral-500 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: Player['kyc'] }) {
    const styles = {
        Verified: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
        Pending: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        Failed: 'text-red-500 border-red-500/20 bg-red-500/10',
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status}
        </span>
    );
}