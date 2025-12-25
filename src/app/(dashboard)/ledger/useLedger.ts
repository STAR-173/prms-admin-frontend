import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface LedgerResponse {
    data: any[];
    page: number;
    total: number;
}

export const useLedger = (page: number, type?: string) => {
    return useQuery({
        queryKey: ['ledger', page, type],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('limit', '20');
            params.append('offset', ((page - 1) * 20).toString());
            if (type && type !== 'All') params.append('type', type === 'Credit' ? 'BUY_IN' : 'CASH_OUT');

            const { data } = await api.get<LedgerResponse>(`/admin/transactions?${params.toString()}`);
            return data;
        },
    });
};