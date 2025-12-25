'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Player } from '@/types';
import { exportToCSV } from '@/lib/export';
import { usePlayers } from './usePlayers';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming this hook exists or I'll implement debounce locally

export default function PlayersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [page, setPage] = useState(1);

    // Debounce search input to prevent API spam
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Simple debounce implementation inside component for brevity
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch Data
    const { data, isLoading, isError } = usePlayers({
        page,
        search: debouncedSearch,
        kycStatus: statusFilter
    });

    const players = data?.data || [];
    const meta = data?.meta;

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
                            onClick={() => players.length && exportToCSV(players, 'players_list')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#111113] border border-neutral-900/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="p-4 bg-[#111113] border border-neutral-900/50 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400">KYC Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="bg-[#18181b] border border-neutral-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-600"
                            >
                                <option value="All">All Status</option>
                                <option value="VERIFIED">Verified</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="RESTRICTED">Restricted</option>
                            </select>
                        </div>
                        <button onClick={() => setStatusFilter('All')} className="text-xs text-red-400 hover:text-red-300 ml-auto">Reset Filters</button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-neutral-900/50 rounded-xl overflow-hidden min-h-[400px] relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111113]/50 z-10 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                )}

                {isError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-red-400">Failed to load players. Please check your connection.</div>
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800/50 text-neutral-400 text-sm">
                            <th className="font-medium p-4 pl-6">Player ID</th>
                            <th className="font-medium p-4">Name</th>
                            <th className="font-medium p-4">Phone Number</th>
                            <th className="font-medium p-4 text-center">Wallet Balance</th>
                            <th className="font-medium p-4 text-center">Activity Score</th>
                            <th className="font-medium p-4 text-center">KYC Status</th>
                            <th className="font-medium p-4 text-right pr-6">Current Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {!isLoading && players.length > 0 ? (
                            players.map((player: Player) => (
                                <tr key={player.id} className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0">
                                    <td className="p-4 pl-6 text-neutral-400 font-mono text-xs">{player.id}</td>
                                    <td className="p-4 text-white font-medium">{player.name}</td>
                                    <td className="p-4 text-neutral-400">{player.phone}</td>
                                    <td className="p-4 text-center text-neutral-300 font-mono">₹{player.balance}</td>
                                    <td className="p-4 text-center text-neutral-300">{player.games}</td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={player.kyc} />
                                    </td>
                                    <td className="p-4 text-right pr-6 text-neutral-400">
                                        {player.house === 'Not Seated' ?
                                            <span className="text-neutral-600">Offline</span> :
                                            <span className="text-emerald-500">Playing at {player.house}</span>
                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            !isLoading && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                                        No players found matching your criteria.
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {meta && (
                    <div className="flex justify-between items-center p-4 border-t border-neutral-900/50">
                        <span className="text-sm text-neutral-500">
                            Showing {players.length} of {meta.total} results
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1 hover:text-white text-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm text-white">Page {page} of {meta.lastPage}</span>
                            <button
                                onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                                disabled={page === meta.lastPage}
                                className="p-1 hover:text-white text-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        VERIFIED: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
        PENDING: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        REJECTED: 'text-red-500 border-red-500/20 bg-red-500/10',
        NOT_SUBMITTED: 'text-neutral-500 border-neutral-500/20 bg-neutral-500/10',
        RESTRICTED: 'text-red-500 bg-red-900/20 border-red-500/50',
        ARCHIVED: 'text-neutral-600 border-neutral-700 bg-neutral-800'
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles['NOT_SUBMITTED']}`}>
            {status}
        </span>
    );
}