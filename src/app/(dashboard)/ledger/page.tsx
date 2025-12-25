'use client';

import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import { useLedger } from './useLedger';

export default function ChipLedgerPage() {
    const [filterType, setFilterType] = useState('All'); // 'All', 'Credit', 'Debit'
    const [page, setPage] = useState(1);

    const { data, isLoading } = useLedger(page, filterType);
    const transactions = data?.data || [];
    const totalPages = data ? Math.ceil(data.total / 20) : 1;

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => { setFilterType('All'); setPage(1); }}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === 'All' ? 'bg-[#b91c1c] text-white' : 'bg-[#111113] border border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => { setFilterType('Credit'); setPage(1); }}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === 'Credit' ? 'bg-[#b91c1c] text-white' : 'bg-[#111113] border border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Added (Credit)
                    </button>
                    <button
                        onClick={() => { setFilterType('Debit'); setPage(1); }}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === 'Debit' ? 'bg-[#b91c1c] text-white' : 'bg-[#111113] border border-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Redeemed (Debit)
                    </button>
                </div>
                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => exportToCSV(transactions, 'chip_ledger')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#111113] border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111113] border border-neutral-900/50 rounded-xl overflow-hidden min-h-[400px] relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111113]/50 z-10 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                )}

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
                        {transactions.map((t: any, i: number) => (
                            <tr key={i} className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0">
                                <td className="p-4 pl-6 text-neutral-500">
                                    {new Date(t.time).toLocaleString()}
                                </td>
                                <td className="p-4 text-center text-neutral-500">{t.house}</td>
                                <td className="p-4 text-center text-neutral-500 font-mono text-xs">{t.pid}</td>
                                <td className="p-4 text-center text-neutral-500">{t.pname}</td>
                                <td className={`p-4 text-center font-medium ${t.type === 'BUY_IN' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {t.type === 'BUY_IN' ? 'Credit' : 'Debit'}
                                </td>
                                <td className="p-4 text-center text-neutral-300 font-mono">₹{t.amount}</td>
                                <td className="p-4 text-right pr-6 text-neutral-500">{t.method}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 border-t border-neutral-900/50">
                    <span className="text-sm text-neutral-500">
                        Page {page} of {totalPages || 1}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1 hover:text-white text-neutral-500 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1 hover:text-white text-neutral-500 transition-colors disabled:opacity-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}