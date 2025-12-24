// Define shapes for your data to prevent UI crashes
export interface Player {
    id: string;
    name: string;
    phone: string;
    balance: string; // Using string for display, consider number for math
    games: string;
    kyc: 'Verified' | 'Pending' | 'Failed';
    house: string;
}

export interface Transaction {
    id: string; // Mapped from 'time' in your snippet, assuming it's an ID
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
}