import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useInsights = (range: string) => {
    return useQuery({
        queryKey: ['insights', range],
        queryFn: async () => {
            // Parallel fetch for all insight data
            const [stats, revenue, activity, topHouses, recentActivity] = await Promise.all([
                api.get(`/admin/dashboard/insights/stats?range=${range}`).then(res => res.data),
                api.get(`/admin/dashboard/insights/charts/revenue?range=${range}`).then(res => res.data),
                api.get(`/admin/dashboard/insights/charts/activity?range=${range}`).then(res => res.data),
                api.get(`/admin/dashboard/insights/top-houses?range=${range}`).then(res => res.data),
                // Re-using the general activity endpoint, but ideally this should also accept range
                api.get('/admin/dashboard/activity').then(res => res.data)
            ]);

            return { stats, revenue, activity, topHouses, recentActivity };
        },
    });
};