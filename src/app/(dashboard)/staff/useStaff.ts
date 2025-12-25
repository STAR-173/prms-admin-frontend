import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { StaffMember } from '@/types';

export const useStaff = () => {
    return useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const { data } = await api.get<StaffMember[]>('/users/admin/staff');
            return data;
        },
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newStaff: any) => {
            return api.post('/users/admin/staff', newStaff);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return api.patch(`/users/admin/staff/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};