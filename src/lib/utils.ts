import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes intelligently.
 * Example: cn('px-2 py-1', 'p-4') -> 'p-4' (correctly overrides)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}