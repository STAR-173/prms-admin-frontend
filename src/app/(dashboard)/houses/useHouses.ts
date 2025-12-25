import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { House } from '@/types';

export const useHouses = () => {
    return useQuery({
        queryKey: ['admin-houses'],
        queryFn: async () => {
            const { data } = await api.get<House[]>('/admin/houses/list');
            return data;
        },
    });
};