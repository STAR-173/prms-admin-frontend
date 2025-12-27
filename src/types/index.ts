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
    role: 'ADMIN' | 'FLOOR' | 'CASHIER' | 'KITCHEN' | 'COMPLIANCE_OFFICER';
    houseName: string;
    houseId: string | null;
    isActive: boolean;
}