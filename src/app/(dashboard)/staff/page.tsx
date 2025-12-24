'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Shield, Mail } from 'lucide-react';

const STAFF_MEMBERS = [
    { id: 'EMP001', name: 'Raj Tripathi', role: 'Super Admin', email: 'raj@prms.com', status: 'Active', lastLogin: '2 mins ago' },
    { id: 'EMP002', name: 'Sarah Connor', role: 'House Manager', email: 'sarah@prms.com', status: 'Active', lastLogin: '5 hours ago' },
    { id: 'EMP003', name: 'John Doe', role: 'Support Agent', email: 'john@prms.com', status: 'Inactive', lastLogin: '2 days ago' },
];

export default function StaffPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStaff = STAFF_MEMBERS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Manage Staff</h1>
                    <p className="text-neutral-400 text-sm">Control access and permissions for your team.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#b91c1c] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                    <Plus size={16} /> Add Member
                </button>
            </div>

            {/* Toolbar */}
            <div className="mb-6 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search staff by name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-[#111113] border border-neutral-900/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                />
            </div>

            {/* Grid Layout for Staff Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaff.map((staff) => (
                    <div key={staff.id} className="bg-[#111113] border border-neutral-900/50 rounded-xl p-6 group hover:border-neutral-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-white font-medium border border-white/5">
                                {staff.name.charAt(0)}
                            </div>
                            <button className="text-neutral-500 hover:text-white">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-white font-medium text-lg">{staff.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
                                <Shield size={14} className="text-[#b91c1c]" />
                                <span>{staff.role}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                                <Mail size={14} />
                                <span>{staff.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-900/50">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${staff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'}`}>
                                {staff.status}
                            </span>
                            <span className="text-xs text-neutral-600">Active {staff.lastLogin}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}