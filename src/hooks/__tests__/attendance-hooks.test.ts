/* path: prms-admin-frontend/src/hooks/__tests__/attendance-hooks.test.ts */
import { renderHook, waitFor } from '@testing-library/react';
import { usePlayerAttendance } from '@/app/(dashboard)/players/usePlayerAttendance';
import { useStaffLiveStatus } from '@/app/(dashboard)/staff/attendance/useStaffAttendance';
import api from '@/lib/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// * Mock API
jest.mock('@/lib/api');

// * Wrapper for React Query
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });
    return ({ children }: { children: React.ReactNode }) => (
        React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
};

describe('Attendance Hooks', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('usePlayerAttendance', () => {
        it('should fetch history for valid userId', async () => {
            const mockResponse = {
                data: {
                    data: [{ id: '1', houseName: 'Test House', enteredAt: '2023-01-01' }],
                    meta: { total: 1 }
                }
            };
            (api.get as jest.Mock).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => usePlayerAttendance('user-1', 1), {
                wrapper: createWrapper()
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(api.get).toHaveBeenCalledWith('/attendance/history/user-1?page=1&limit=10');
            expect(result.current.data).toEqual(mockResponse.data);
        });

        it('should NOT fetch if userId is null', async () => {
            const { result } = renderHook(() => usePlayerAttendance(null), {
                wrapper: createWrapper()
            });

            expect(result.current.fetchStatus).toBe('idle'); // Not fetching
            expect(api.get).not.toHaveBeenCalled();
        });
    });

    describe('useStaffLiveStatus', () => {
        it('should fetch staff status list', async () => {
            const mockResponse = {
                data: [{ id: 'staff-1', isOnline: true }]
            };
            (api.get as jest.Mock).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useStaffLiveStatus(), {
                wrapper: createWrapper()
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(api.get).toHaveBeenCalledWith('/attendance/admin/staff-status');
            expect(result.current.data).toEqual(mockResponse.data);
        });
    });
});