'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // 1. Check for token in localStorage
        const token = localStorage.getItem('accessToken');

        if (!token) {
            // 2. If missing, redirect immediately
            router.replace('/login');
        } else {
            // 3. If present, allow rendering
            // Optional: You could decode the JWT here to check expiration client-side
            // but the API interceptor handles 401s, so existence is enough for the UI gate.
            setIsAuthorized(true);
        }
    }, [router]);

    // 4. Show loading state while checking (prevents content flash)
    if (!isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#09090b]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    // 5. Render protected content
    return <>{children}</>;
}