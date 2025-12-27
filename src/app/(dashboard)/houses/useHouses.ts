// src/app/(dashboard)/houses/useHouses.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Hook to create a new house
export const useCreateHouse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newHouse: { name: string; location: string }) => {
            return api.post('/admin/houses', newHouse);
        },
        onSuccess: () => {
            // Refresh the list immediately after successful creation
            queryClient.invalidateQueries({ queryKey: ['admin-houses'] });
        },
    });
};