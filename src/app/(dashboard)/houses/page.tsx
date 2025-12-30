"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Loader2,
  Plus,
  QrCode,
  X,
  MapPin,
} from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { useHouses, useCreateHouse } from "./useHouses";
import { House } from "@/types";
import Image from "next/image";

export default function HousesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: houses, isLoading } = useHouses();

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  const filteredHouses =
    houses?.filter(
      (house) =>
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleViewHouse = (house: House) => {
    setSelectedHouse(house);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Poker Houses</h1>
          <p className="text-neutral-400 text-sm">
            Manage locations and view access codes.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#b91c1c] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Create House
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
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
              onClick={() => exportToCSV(filteredHouses, "houses_list")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#111113] border border-neutral-900/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
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
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-800/50 text-neutral-400 text-sm">
                <th className="font-medium p-4 pl-6">House Name</th>
                <th className="font-medium p-4 text-center">Location</th>
                <th className="font-medium p-4 text-center">Tables</th>
                <th className="font-medium p-4 text-center">Active Players</th>
                <th className="font-medium p-4 text-center">Today's Chips</th>
                <th className="font-medium p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredHouses.map((house: House) => (
                <tr
                  key={house.id}
                  className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0 cursor-pointer"
                  onClick={() => handleViewHouse(house)}
                >
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {house.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {house.id}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-neutral-400">
                    {house.location}
                  </td>
                  <td className="p-4 text-center text-neutral-300">
                    {house.tables}
                  </td>
                  <td className="p-4 text-center text-neutral-300">
                    {house.players}
                  </td>
                  <td className="p-4 text-center text-emerald-500 font-mono">
                    ₹{house.chips}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewHouse(house);
                      }}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors"
                      title="View QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateHouseModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {selectedHouse && (
        <HouseDetailsModal
          house={selectedHouse}
          onClose={() => setSelectedHouse(null)}
        />
      )}
    </div>
  );
}

// --- CREATE HOUSE MODAL ---
function CreateHouseModal({ onClose }: { onClose: () => void }) {
  const { mutateAsync: createHouse, isPending } = useCreateHouse();
  const [formData, setFormData] = useState({ name: "", location: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHouse(formData);
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create house");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-auto bg-[#18181b] border border-neutral-800 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white">Add New House</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              House Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[#111113] border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none"
              placeholder="e.g. Royal Flush Lounge"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Location / City
            </label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-[#111113] border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none"
              placeholder="e.g. Mumbai, Indiranagar"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-[#b91c1c] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create House
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- HOUSE DETAILS / QR MODAL ---
function HouseDetailsModal({
  house,
  onClose,
}: {
  house: House;
  onClose: () => void;
}) {
  const handleDownloadQr = () => {
    if (!house.qrCode) return;
    const link = document.createElement("a");
    link.href = house.qrCode;
    link.download = `QR_${house.name.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg mx-auto bg-[#18181b] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-start p-6 border-b border-neutral-800 bg-[#111113]">
          <div>
            <h2 className="text-xl font-bold text-white">{house.name}</h2>
            <div className="flex items-center gap-1.5 text-neutral-400 mt-1">
              <MapPin size={14} />
              <span className="text-sm">{house.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 shadow-lg">
            {house.qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={house.qrCode}
                alt={`QR Code for ${house.name}`}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-36 h-36 sm:w-48 sm:h-48 bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
                QR Not Available
              </div>
            )}
          </div>

          <p className="text-neutral-400 text-sm max-w-xs mb-4 sm:mb-6 px-2">
            Scan this code with the Player App to instantly join{" "}
            <strong>{house.name}</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full text-sm">
            <div className="bg-[#111113] p-3 rounded-lg border border-neutral-800">
              <span className="block text-neutral-500 text-xs mb-1">
                House ID
              </span>
              <span className="font-mono text-white select-all">
                {house.id}
              </span>
            </div>
            <div className="bg-[#111113] p-3 rounded-lg border border-neutral-800">
              <span className="block text-neutral-500 text-xs mb-1">
                Active Tables
              </span>
              <span className="font-mono text-white">{house.tables}</span>
            </div>
          </div>

          <button
            onClick={handleDownloadQr}
            disabled={!house.qrCode}
            className="mt-4 sm:mt-6 w-full py-2.5 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} /> Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
