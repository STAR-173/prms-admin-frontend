'use client';

import React, { useState } from 'react';
import { AtSign, Keyboard, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect to your actual Backend Auth API here
        logger.info('LoginPage', 'User attempting login', { user: 'EMPID' });

        // Simulating success
        router.push('/dashboard');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#09090b] overflow-hidden font-sans text-white">
            {/* Background Ambient Glows */}
            <div className="absolute -top-[30%] left-1/2 h-[60vh] w-[150vw] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-red-600/40 to-red-900/10 blur-3xl opacity-50" />
            <div className="absolute -bottom-[40%] left-1/2 h-[70vh] w-[150vw] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-red-600/40 to-red-900/10 blur-3xl opacity-50" />

            <div className="z-10 w-full max-w-[400px] rounded-2xl border border-white/5 bg-[#121214]/80 p-8 shadow-2xl backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-medium text-white/90">Login</h1>
                    <p className="text-sm text-neutral-500">Use your employee ID</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="group relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white">
                            <AtSign size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Employee ID"
                            className="w-full rounded-lg border border-white/5 bg-[#18181b] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                        />
                    </div>

                    <div className="group relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white">
                            <Keyboard size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full rounded-lg border border-white/5 bg-[#18181b] py-3 pl-10 pr-10 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-white"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-lg bg-[#b91c1c] py-3 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}