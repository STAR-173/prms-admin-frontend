'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Shield, Mail, Phone, Building2, X, Loader2, CheckCircle, Ban } from 'lucide-react';
import { useStaff, useCreateStaff, useUpdateStaff } from './useStaff';
import { useHouses } from '../houses/useHouses';
import { StaffMember } from '@/types';

// --- MAIN PAGE COMPONENT ---
export default function StaffPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    const { data: staffList, isLoading } = useStaff();

    const filteredStaff = staffList?.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleEdit = (staff: StaffMember) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Manage Staff</h1>
                    <p className="text-neutral-400 text-sm">Control access and permissions for your team.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#b91c1c] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
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

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
            )}

            {/* Grid Layout */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStaff.map((staff) => (
                        <div key={staff.id} className="bg-[#111113] border border-neutral-900/50 rounded-xl p-6 group hover:border-neutral-700 transition-colors relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-white font-medium border border-white/5">
                                    {staff.name.charAt(0)}
                                </div>
                                <button
                                    onClick={() => handleEdit(staff)}
                                    className="text-neutral-500 hover:text-white p-1"
                                >
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
                                    <Phone size={14} />
                                    <span>{staff.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                                    <Building2 size={14} />
                                    <span>{staff.houseName}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-neutral-900/50">
                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${staff.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                    {staff.isActive ? <CheckCircle size={10} /> : <Ban size={10} />}
                                    {staff.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Staff Modal */}
            {isModalOpen && (
                <StaffModal
                    staff={editingStaff}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

// --- MODAL COMPONENT ---
function StaffModal({ staff, onClose }: { staff: StaffMember | null, onClose: () => void }) {
    const { data: houses } = useHouses();
    const createMutation = useCreateStaff();
    const updateMutation = useUpdateStaff();

    const [formData, setFormData] = useState({
        fullName: staff?.name || '',
        phone: staff?.phone || '',
        role: staff?.role || 'FLOOR',
        assignedHouseId: staff?.houseId || '',
        isActive: staff?.isActive ?? true
    });

    const isEditing = !!staff;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && staff) {
                // Update Logic: Sanitize payload
                // 1. Remove 'phone' (cannot update identity)
                // 2. Ensure assignedHouseId is sent as undefined or null if empty string
                const { phone, ...updateData } = formData;

                // Optional: Clean up empty strings to null if backend expects strict types, 
                // though your service handles falsy checks.
                const payload = {
                    ...updateData,
                    assignedHouseId: updateData.assignedHouseId || null
                };

                await updateMutation.mutateAsync({ id: staff.id, data: payload });
            } else {
                // Create Logic: Sanitize payload
                // 1. Remove 'isActive' (defaults to true on backend for new staff)
                const { isActive, ...createData } = formData;

                const payload = {
                    ...createData,
                    assignedHouseId: createData.assignedHouseId || null
                };

                await createMutation.mutateAsync(payload);
            }
            onClose();
        } catch (error: any) {
            console.error('Operation failed:', error);
            // Alert the actual error message from backend if available
            alert(error.response?.data?.message || 'Operation failed. Check inputs.');
        }
    };

    const isProcessing = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#18181b] border border-neutral-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                    <h2 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit Staff Member' : 'Add New Staff'}
                    </h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-[#111113] border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    {/* Phone - Read Only if Editing (Identity constraint) */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Phone Number</label>
                        <input
                            required
                            disabled={isEditing}
                            type="text"
                            maxLength={10}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                            className="w-full bg-[#111113] border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none disabled:opacity-50"
                            placeholder="e.g. 9876543210"
                        />
                        {isEditing && <p className="text-[10px] text-neutral-500 mt-1">Phone number acts as identity and cannot be changed.</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">System Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full bg-[#111113] border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none"
                        >
                            <option value="FLOOR">Floor Manager</option>
                            <option value="CASHIER">Cashier</option>
                            <option value="KITCHEN">Kitchen Staff</option>
                            <option value="ADMIN">Super Admin</option>
                            <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                        </select>
                    </div>

                    {/* Assigned House */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Assigned House</label>
                        <select
                            value={formData.assignedHouseId}
                            onChange={e => setFormData({ ...formData, assignedHouseId: e.target.value })}
                            className="w-full bg-[#111113] border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none"
                        >
                            <option value="">-- No Assignment --</option>
                            {houses?.map(h => (
                                <option key={h.id} value={h.id}>{h.name} ({h.location})</option>
                            ))}
                        </select>
                    </div>

                    {/* Active Status (Only for Editing) */}
                    {isEditing && (
                        <div className="flex items-center gap-3 pt-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                <span className="ml-3 text-sm font-medium text-neutral-300">Account Active</span>
                            </label>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-4 border-t border-neutral-800 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2 bg-[#b91c1c] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEditing ? 'Save Changes' : 'Create Account'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}