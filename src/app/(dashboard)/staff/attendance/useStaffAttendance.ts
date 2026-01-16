import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { StaffLiveStatus } from '@/types';

export const useStaffLiveStatus = () => {
    return useQuery({
        queryKey: ['staff-live-status'],
        queryFn: async () => {
            const { data } = await api.get<StaffLiveStatus[]>('/attendance/admin/staff-status');
            return data;
        },
        refetchInterval: 10000,
    });
};

// * NEW: Hook for manual marking
export const useMarkAttendance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { staffId: string; date: string; houseId?: string }) => {
            return api.post('/attendance/admin/mark', payload);
        },
        onSuccess: () => {
            // Invalidate status to refresh live counts if marked for today
            queryClient.invalidateQueries({ queryKey: ['staff-live-status'] });
        },
    });
};