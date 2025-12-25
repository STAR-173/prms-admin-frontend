'use client';

import React, { useState } from 'react';
import { Search, Download, Loader2 } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import { useHouses } from './useHouses';

export default function HousesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: houses, isLoading } = useHouses();

    const filteredHouses = houses?.filter(house =>
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
                            placeholder="Search by name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111113] border border-neutral-900/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => exportToCSV(filteredHouses, 'houses_list')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#111113] border border-neutral-900/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-neutral-900/50 rounded-xl overflow-hidden min-h-[300px] relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111113]/50 z-10 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                )}

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
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredHouses.map((house: any, i: number) => (
                                <tr key={i} className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0">
                                    <td className="p-4 pl-6 text-neutral-400 font-mono text-xs">{house.id}</td>
                                    <td className="p-4 text-center text-white font-medium">{house.name}</td>
                                    <td className="p-4 text-center text-neutral-400">{house.location}</td>
                                    <td className="p-4 text-center text-neutral-300">{house.tables}</td>
                                    <td className="p-4 text-center text-neutral-300">{house.players}</td>
                                    <td className="p-4 text-center text-emerald-500 font-mono">₹{house.chips}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}