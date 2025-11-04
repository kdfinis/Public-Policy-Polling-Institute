import { useEffect, useRef, useState } from 'react';
import { Sentry } from '@/lib/monitoring';

interface LogEntry {
  level: 'log' | 'warn' | 'error';
  message: string;
}

export function DevConsoleOverlay() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const orig = useRef<{ log: any; warn: any; error: any } | null>(null);

  useEffect(() => {
    const push = (level: LogEntry['level'], args: any[]) => {
      // Throttle log updates to prevent excessive re-renders
      const msg = args
        .map((a) => (a instanceof Error ? a.stack || a.message : typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');
      
      // Limit message length and log count to prevent memory issues
      const truncatedMsg = msg.length > 500 ? msg.substring(0, 500) + '...' : msg;
      setLogs((l) => {
        const newLogs = [...l.slice(-49), { level, message: truncatedMsg }];
        return newLogs; // Limit to 50 logs instead of 100
      });

      // Forward to Sentry if configured
      try {
        if ((Sentry as any)?.captureMessage) {
          if (level === 'error') {
            const err = args.find((a) => a instanceof Error) as Error | undefined;
            if (err) {
              (Sentry as any).captureException(err);
            } else {
              (Sentry as any).captureMessage(msg, 'error');
            }
          } else if (level === 'warn') {
            (Sentry as any).captureMessage(msg, 'warning');
          } else {
            (Sentry as any).captureMessage(msg, 'info');
          }
        }
      } catch {}
    };

    orig.current = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    console.log = (...args: any[]) => {
      push('log', args);
      // @ts-ignore
      orig.current!.log(...args);
    };
    console.warn = (...args: any[]) => {
      push('warn', args);
      // @ts-ignore
      orig.current!.warn(...args);
    };
    console.error = (...args: any[]) => {
      push('error', args);
      // @ts-ignore
      orig.current!.error(...args);
    };

    const onError = (e: ErrorEvent) => push('error', [e.message]);
    const onRejection = (e: PromiseRejectionEvent) => push('error', [e.reason]);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      if (orig.current) {
        console.log = orig.current.log;
        console.warn = orig.current.warn;
        console.error = orig.current.error;
      }
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        left: 8,
        width: '32rem',
        maxWidth: '90vw',
        maxHeight: '40vh',
        overflow: 'auto',
        background: 'rgba(17,24,39,0.92)',
        color: '#f9fafb',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        padding: '8px 10px',
        borderRadius: 8,
        zIndex: 10000,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
   >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Client Logs</div>
      {logs.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No messages yet…</div>
      ) : (
        logs.map((l, i) => (
          <div key={i} style={{
            whiteSpace: 'pre-wrap',
            color: l.level === 'error' ? '#fecaca' : l.level === 'warn' ? '#fde68a' : '#e5e7eb',
          }}>
            [{l.level.toUpperCase()}] {l.message}
          </div>
        ))
      )}
    </div>
  );
}


