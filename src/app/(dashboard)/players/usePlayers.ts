import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Player } from '@/types';

interface PlayersResponse {
    data: Player[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}

interface UsePlayersParams {
    page: number;
    search: string;
    kycStatus: string;
}

export const usePlayers = ({ page, search, kycStatus }: UsePlayersParams) => {
    return useQuery({
        queryKey: ['players', page, search, kycStatus],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '10');
            if (search) params.append('search', search);
            if (kycStatus && kycStatus !== 'All') params.append('kycStatus', kycStatus);

            const { data } = await api.get<PlayersResponse>(`/users/admin/list?${params.toString()}`);
            return data;
        },
    });
};