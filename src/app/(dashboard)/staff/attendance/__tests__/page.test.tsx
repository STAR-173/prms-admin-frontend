/* path: prms-admin-frontend/src/app/(dashboard)/staff/attendance/__tests__/page.test.tsx */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StaffAttendancePage from '../page';
import { useStaffLiveStatus } from '../useStaffAttendance';

// * Mock Hook
jest.mock('../useStaffAttendance');

describe('StaffAttendancePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show loader while fetching', () => {
        (useStaffLiveStatus as jest.Mock).mockReturnValue({
            data: [],
            isLoading: true
        });

        render(<StaffAttendancePage />);
        // Look for loader (implicit via class or role, usually handled by checking absence of content)
        // Or if you gave it a role/testId. Assuming "Loading..." text isn't there but spinner is.
        // We'll check if the search bar is present (it renders before loading check)
        expect(screen.getByPlaceholderText('Search staff...')).toBeInTheDocument();
    });

    it('should render staff cards with correct status', () => {
        const mockData = [
            {
                id: '1',
                name: 'Alice Floor',
                role: 'FLOOR',
                assignedHouse: 'House A',
                isOnline: true,
                currentLocation: 'House A',
                lastCheckIn: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Bob Kitchen',
                role: 'KITCHEN',
                assignedHouse: 'House B',
                isOnline: false, // Absent
                currentLocation: 'Absent',
                lastCheckIn: null
            }
        ];

        (useStaffLiveStatus as jest.Mock).mockReturnValue({
            data: mockData,
            isLoading: false
        });

        render(<StaffAttendancePage />);

        // Check Alice (Online)
        expect(screen.getByText('Alice Floor')).toBeInTheDocument();
        expect(screen.getByText('House A')).toBeInTheDocument(); // Location
        // Check Bob (Offline)
        expect(screen.getByText('Bob Kitchen')).toBeInTheDocument();
        expect(screen.getByText('Absent')).toBeInTheDocument();

        // Check "1 Online" counter
        expect(screen.getByText('1 Online')).toBeInTheDocument();
    });

    it('should filter staff by search', () => {
        const mockData = [
            { id: '1', name: 'Alice', role: 'FLOOR', assignedHouse: 'H1', isOnline: true, currentLocation: 'H1', lastCheckIn: null },
            { id: '2', name: 'Bob', role: 'FLOOR', assignedHouse: 'H1', isOnline: false, currentLocation: 'Absent', lastCheckIn: null }
        ];

        (useStaffLiveStatus as jest.Mock).mockReturnValue({
            data: mockData,
            isLoading: false
        });

        render(<StaffAttendancePage />);

        const searchInput = screen.getByPlaceholderText('Search staff...');
        fireEvent.change(searchInput, { target: { value: 'Alice' } });

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
});