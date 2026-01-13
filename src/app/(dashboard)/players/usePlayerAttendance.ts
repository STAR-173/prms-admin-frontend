/* path: src/app/(dashboard)/players/usePlayerAttendance.ts */
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AttendanceRecord } from '@/types';

interface HistoryResponse {
    data: AttendanceRecord[];
    meta: {
        total: number;
        page: number;
    };
}

export const usePlayerAttendance = (userId: string | null, page = 1) => {
    return useQuery({
        queryKey: ['player-attendance', userId, page],
        queryFn: async () => {
            if (!userId) return null;
            const { data } = await api.get<HistoryResponse>(`/attendance/history/${userId}?page=${page}&limit=10`);
            return data;
        },
        enabled: !!userId,
    });
};