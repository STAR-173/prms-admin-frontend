/**
 * Structured Logger for Production Observability.
 * In production, swap console.log with Sentry/LogRocket.
 */
export const logger = {
    info: (component: string, message: string, meta?: Record<string, unknown>) => {
        console.log(`[INFO] [${component}] ${message}`, meta || '');
    },
    error: (component: string, message: string, error: unknown) => {
        console.error(`[ERROR] [${component}] ${message}`, error);
    },
    warn: (component: string, message: string) => {
        console.warn(`[WARN] [${component}] ${message}`);
    },
};