'use client';

import React, { useState, useMemo } from 'react';
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportToCSV } from '@/lib/export';

const INITIAL_TRANSACTIONS = [
    { time: '10:42 AM', house: 'Mumbai', pid: 'PID014538', pname: 'Raj Patel', type: 'Credit', amount: '5000', method: 'UPI' },
    { time: '10:45 AM', house: 'Pune', pid: 'PID014539', pname: 'Viraj', type: 'Debit', amount: '1500', method: 'Cash' },
    { time: '11:20 AM', house: 'Mumbai', pid: 'PID014540', pname: 'Kartik', type: 'Credit', amount: '10000', method: 'Bank Transfer' },
];

export default function ChipLedgerPage() {
    const [filterType, setFilterType] = useState('All'); // 'All', 'Credit', 'Debit'
    const [showFilters, setShowFilters] = useState(false);

    const filteredTransactions = useMemo(() => {
        if (filterType === 'All') return INITIAL_TRANSACTIONS;
        return INITIAL_TRANSACTIONS.filter(t => t.type === filterType);
    }, [filterType]);

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => setFilterType('All')}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === 'All' ? 'bg-[#b91c1c] text-white' : 'bg-[#111113] border border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => setFilterType('Credit')}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === 'Credit' ? 'bg-[#b91c1c] text-white' : 'bg-[#111113] border border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Added (Credit)
                    </button>
                    <button
                        onClick={() => setFilterType('Debit')}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === 'Debit' ? 'bg-[#b91c1c] text-white' : 'bg-[#111113] border border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Redeemed (Debit)
                    </button>
                </div>
                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => exportToCSV(filteredTransactions, 'chip_ledger')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#111113] border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-neutral-900/50 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800/50 text-neutral-200 text-sm">
                            <th className="font-medium p-4 pl-6 text-neutral-200">Time</th>
                            <th className="font-medium p-4 text-center text-neutral-200">House</th>
                            <th className="font-medium p-4 text-center text-neutral-200">Player ID</th>
                            <th className="font-medium p-4 text-center text-neutral-200">Player Name</th>
                            <th className="font-medium p-4 text-center text-neutral-200">Type</th>
                            <th className="font-medium p-4 text-center text-neutral-200">Amount</th>
                            <th className="font-medium p-4 text-right pr-6 text-neutral-200">Method</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredTransactions.map((t, i) => (
                            <tr key={i} className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0">
                                <td className="p-4 pl-6 text-neutral-500">{t.time}</td>
                                <td className="p-4 text-center text-neutral-500">{t.house}</td>
                                <td className="p-4 text-center text-neutral-500">{t.pid}</td>
                                <td className="p-4 text-center text-neutral-500">{t.pname}</td>
                                <td className={`p-4 text-center font-medium ${t.type === 'Credit' ? 'text-emerald-500' : 'text-red-500'}`}>{t.type}</td>
                                <td className="p-4 text-center text-neutral-500">{t.amount}</td>
                                <td className="p-4 text-right pr-6 text-neutral-500">{t.method}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}