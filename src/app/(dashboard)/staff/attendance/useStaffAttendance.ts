/* path: src/app/(dashboard)/staff/attendance/useStaffAttendance.ts */
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { StaffLiveStatus } from '@/types';

export const useStaffLiveStatus = () => {
    return useQuery({
        queryKey: ['staff-live-status'],
        queryFn: async () => {
            const { data } = await api.get<StaffLiveStatus[]>('/attendance/admin/staff-status');
            return data;
        },
        refetchInterval: 10000, // Live Dashboard updates every 10s
    });
};