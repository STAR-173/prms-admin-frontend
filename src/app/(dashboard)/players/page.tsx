/* path: src/app/(dashboard)/players/page.tsx */
"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  History,
  X,
  MapPin,
  Clock
} from "lucide-react";
import { Player, AttendanceRecord } from "@/types";
import { exportToCSV } from "@/lib/export";
import { usePlayers } from "./usePlayers";
import { usePlayerAttendance } from "./usePlayerAttendance";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

// --- Player Detail Modal Component ---
function PlayerDetailModal({ player, onClose }: { player: Player; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePlayerAttendance(player.id, page);

  const history = data?.data || [];
  const meta = data?.meta;

  return (
    <Dialog open={!!player} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#18181b] border-neutral-800 text-white">
        <DialogHeader className="border-b border-neutral-800 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold">{player.name}</DialogTitle>
              <p className="text-sm text-neutral-400 font-mono mt-1">{player.phone} • {player.id}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-bold text-neutral-400 uppercase mb-4 flex items-center gap-2">
            <History size={16} /> Physical Presence History
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-red-600" /></div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 bg-neutral-900/50 rounded-lg">
              No visit history found.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div key={record.id} className="bg-[#111113] border border-neutral-800 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{record.houseName}</p>
                      <p className="text-xs text-neutral-500">
                        {format(new Date(record.enteredAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end text-sm text-neutral-300">
                      <span className="text-emerald-500">{format(new Date(record.enteredAt), 'HH:mm')}</span>
                      <span className="text-neutral-600">→</span>
                      <span className={record.exitedAt ? 'text-red-400' : 'text-emerald-400 animate-pulse'}>
                        {record.exitedAt ? format(new Date(record.exitedAt), 'HH:mm') : 'Active'}
                      </span>
                    </div>
                    {record.durationMinutes && (
                      <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1 justify-end">
                        <Clock size={10} /> {Math.floor(record.durationMinutes / 60)}h {record.durationMinutes % 60}m
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Simple Pagination */}
          {meta && meta.total > 10 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800">
              <span className="text-xs text-neutral-500">Page {page}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 hover:bg-neutral-800 rounded disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => p + 1)} // Simplistic, ideally use meta.lastPage
                  disabled={history.length < 10}
                  className="p-1 hover:bg-neutral-800 rounded disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // * State for Modal

  // Debounce search input to prevent API spam
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    kycStatus: statusFilter,
  });

  const players = data?.data || [];
  const meta = data?.meta;

  const formatChips = (val: string | number) => Math.floor(Number(val) || 0).toLocaleString();

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
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
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters
                ? "bg-neutral-800 border-neutral-600 text-white"
                : "bg-[#111113] border-neutral-900/50 text-neutral-300 hover:text-white"
                }`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              onClick={() =>
                players.length && exportToCSV(players, "players_list")
              }
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#111113] border border-neutral-900/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-[#111113] border border-neutral-900/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-neutral-400 shrink-0">
                KYC Status:
              </span>
              <select
                title="status-filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-auto bg-[#18181b] border border-neutral-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-600"
              >
                <option value="All">All Status</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="RESTRICTED">Restricted</option>
              </select>
            </div>
            <button
              onClick={() => setStatusFilter("All")}
              className="text-xs text-red-400 hover:text-red-300 sm:ml-auto"
            >
              Reset Filters
            </button>
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
            <div className="text-red-400">
              Failed to load players. Please check your connection.
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-800/50 text-neutral-400 text-sm">
                <th className="font-medium p-4 pl-6">Player ID</th>
                <th className="font-medium p-4">Name</th>
                <th className="font-medium p-4">Phone Number</th>
                <th className="font-medium p-4 text-center">Chips Balance</th>
                <th className="font-medium p-4 text-center">Activity Score</th>
                <th className="font-medium p-4 text-center">KYC Status</th>
                <th className="font-medium p-4 text-right pr-6">
                  Current Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {!isLoading && players.length > 0
                ? players.map((player: Player) => (
                  <tr
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)} // * Open Modal
                    className="group hover:bg-neutral-800/30 transition-colors border-b border-neutral-900/50 last:border-0 cursor-pointer"
                  >
                    <td className="p-4 pl-6 text-neutral-400 font-mono text-xs">
                      {player.id}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {player.name}
                    </td>
                    <td className="p-4 text-neutral-400">{player.phone}</td>
                    {/* * CHANGE: Chips format */}
                    <td className="p-4 text-center text-neutral-300 font-mono">
                      {formatChips(player.balance)}
                    </td>
                    <td className="p-4 text-center text-neutral-300">
                      {player.games}
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={player.kyc} />
                    </td>
                    <td className="p-4 text-right pr-6 text-neutral-400">
                      {player.house === "Not Seated" ? (
                        <span className="text-neutral-600">Offline</span>
                      ) : (
                        <span className="text-emerald-500">
                          Playing at {player.house}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
                : !isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-neutral-500"
                    >
                      No players found matching your criteria.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-neutral-900/50">
            <span className="text-sm text-neutral-500 text-center sm:text-left">
              Showing {players.length} of {meta.total} results
            </span>
            <div className="flex items-center gap-2">
              <button
                title="previous-page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:text-white text-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-white px-2">
                Page {page} of {meta.lastPage}
              </span>
              <button
                title="next-page"
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page === meta.lastPage}
                className="p-2 hover:text-white text-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    VERIFIED: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
    PENDING: "text-amber-500 border-amber-500/20 bg-amber-500/10",
    REJECTED: "text-red-500 border-red-500/20 bg-red-500/10",
    NOT_SUBMITTED: "text-neutral-500 border-neutral-500/20 bg-neutral-500/10",
    RESTRICTED: "text-red-500 bg-red-900/20 border-red-500/50",
    ARCHIVED: "text-neutral-600 border-neutral-700 bg-neutral-800",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles["NOT_SUBMITTED"]
        }`}
    >
      {status}
    </span>
  );
}