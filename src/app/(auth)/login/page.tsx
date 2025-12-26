'use client';

import React, { useState } from 'react';
import { Phone, ArrowRight, Loader2, LockKeyhole, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // Utilizing the axios instance we created

type LoginStep = 'PHONE' | 'OTP';

export default function LoginPage() {
    const router = useRouter();

    // State
    const [step, setStep] = useState<LoginStep>('PHONE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handlers
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Basic validation
            if (phone.length !== 10) {
                throw new Error('Please enter a valid 10-digit phone number.');
            }

            // API Call: Request OTP
            await api.post('/auth/otp/request', { phone });

            // Advance to next step
            setStep('OTP');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (otp.length !== 6) {
                throw new Error('Please enter the 6-digit code sent to your phone.');
            }

            // API Call: Verify OTP
            // IMPORTANT: We send isStaff: true to ensure role checks on backend
            const { data } = await api.post('/auth/otp/verify', {
                phone,
                otp,
                isStaff: true
            });

            // Store Session
            localStorage.setItem('accessToken', data.accessToken);
            // We can also store basic user info if needed
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userId', data.user.id);

            // Redirect
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#09090b] overflow-hidden font-sans text-white">
            {/* Ambient Background */}
            <div className="absolute -top-[30%] left-1/2 h-[60vh] w-[150vw] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-red-600/40 to-red-900/10 blur-3xl opacity-50" />
            <div className="absolute -bottom-[40%] left-1/2 h-[70vh] w-[150vw] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-red-600/40 to-red-900/10 blur-3xl opacity-50" />

            <div className="z-10 w-full max-w-[400px] rounded-2xl border border-white/5 bg-[#121214]/80 p-8 shadow-2xl backdrop-blur-sm">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-medium text-white/90">
                        {step === 'PHONE' ? 'ADMIN Login' : 'Verify Identity'}
                    </h1>
                    <p className="text-sm text-neutral-500">
                        {step === 'PHONE'
                            ? 'Enter your registered mobile number'
                            : `Enter the 6-digit code sent to +91 ${phone}`
                        }
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={step === 'PHONE' ? handleRequestOtp : handleVerifyOtp} className="space-y-4">

                    {step === 'PHONE' ? (
                        <div className="group relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white">
                                <Phone size={18} />
                            </div>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="98765 43210"
                                className="w-full rounded-lg border border-white/5 bg-[#18181b] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 font-mono tracking-wide"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="group relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white">
                                <LockKeyhole size={18} />
                            </div>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full rounded-lg border border-white/5 bg-[#18181b] py-3 pl-10 pr-4 text-center text-lg tracking-[0.5em] text-white placeholder-neutral-700 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 font-mono"
                                autoFocus
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#b91c1c] py-3 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {step === 'PHONE' ? 'Send OTP' : 'Login'}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Back Link for OTP Step */}
                {step === 'OTP' && (
                    <button
                        onClick={() => { setStep('PHONE'); setError(null); setOtp(''); }}
                        className="mt-6 w-full text-center text-xs text-neutral-500 hover:text-white transition-colors"
                    >
                        Changed number? Go back
                    </button>
                )}
            </div>
        </div>
    );
}