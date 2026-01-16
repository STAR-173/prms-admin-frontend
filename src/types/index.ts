/* path: src/types/index.ts */
// src/types/index.ts

export interface Player {
    id: string;
    name: string;
    phone: string;
    balance: string;
    games: string;
    kyc: 'Verified' | 'Pending' | 'Failed';
    house: string;
}

export interface Transaction {
    id: string;
    houseName: string;
    pid: string;
    playerName: string;
    type: string;
    amount: string;
    method: string;
}

export interface House {
    id: string;
    name: string;
    location: string;
    tables: string;
    players: string;
    chips: string;
    status: 'Verified' | 'Pending' | 'Failed';
    qrCode?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    phone: string;
    role: 'ADMIN' | 'FLOOR' | 'FLOOR_STAFF' | 'CASHIER' | 'KITCHEN'; // * Updated
    houseName: string;
    houseId: string | null;
    isActive: boolean;
}

// --- NEW TYPES FOR BATCH 3 ---

export interface AttendanceRecord {
    id: string;
    houseName: string;
    enteredAt: string;
    exitedAt: string | null;
    durationMinutes: number | null;
}

export interface StaffLiveStatus {
    id: string;
    name: string;
    role: string;
    assignedHouse: string;
    isOnline: boolean;
    currentLocation: string;
    lastCheckIn: string | null;
    lastCheckOut: string | null;
}