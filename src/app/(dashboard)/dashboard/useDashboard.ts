import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await api.get('/admin/dashboard/stats');
            return data;
        },
        refetchInterval: 30000, // Refresh every 30s
    });
};

export const useDashboardActivity = () => {
    return useQuery({
        queryKey: ['dashboard-activity'],
        queryFn: async () => {
            const { data } = await api.get('/admin/dashboard/activity');
            return data;
        },
        refetchInterval: 10000, // Refresh every 10s
    });
};