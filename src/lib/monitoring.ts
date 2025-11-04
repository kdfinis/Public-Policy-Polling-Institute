import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

// Only initialize if DSN is present and not a placeholder
const isValidDsn = dsn && 
  dsn.trim() !== '' && 
  !dsn.includes('YOUR_SENTRY_DSN') && 
  !dsn.includes('placeholder') &&
  dsn.startsWith('https://');

if (isValidDsn) {
  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}

export { Sentry };


