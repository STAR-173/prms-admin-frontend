/* path: prms-admin-frontend/jest.setup.ts */
import '@testing-library/jest-dom';

// * Mock ResizeObserver (Recharts needs this)
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// * Mock Next/Navigation
const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
};

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => mockRouter),
    usePathname: jest.fn(() => '/dashboard'),
}));