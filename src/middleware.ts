import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Identify API calls intended for the backend
    if (pathname.startsWith('/api/')) {
        // 2. Get the backend URL from environment (Runtime)
        const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000';

        // 3. Construct the target URL
        // Incoming: /api/auth/otp/request
        // Target:   http://backend:4000/api/v1/auth/otp/request
        // Logic: Remove '/api' prefix and append to backend base + '/api/v1'

        const pathWithoutApi = pathname.replace(/^\/api/, '');
        const targetUrl = `${backendUrl}/api/v1${pathWithoutApi}${request.nextUrl.search}`;

        // Debug log only in development/test to avoid noise, or enable for debugging now
        // console.log(`[Middleware] Proxying ${pathname} -> ${targetUrl}`);

        // 4. Rewrite the request (Server-side proxy)
        return NextResponse.rewrite(new URL(targetUrl));
    }

    return NextResponse.next();
}

// Configure which paths invoke this middleware
export const config = {
    matcher: '/api/:path*',
};