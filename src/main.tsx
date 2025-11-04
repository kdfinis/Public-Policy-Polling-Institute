import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@/lib/monitoring";

// Basic global error banner to avoid blank screen without feedback
function installGlobalErrorBanner() {
  const show = (msg: string) => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.zIndex = '9999';
    el.style.background = '#fee2e2';
    el.style.color = '#991b1b';
    el.style.padding = '8px 12px';
    el.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    el.textContent = `Runtime error: ${msg}`;
    document.body.appendChild(el);
  };
  window.addEventListener('error', (e) => show(e.message));
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    const reason = (e.reason && (e.reason.message || e.reason.toString())) || 'Unknown error';
    show(reason);
  });
}

installGlobalErrorBanner();

const rootEl = document.getElementById("root")!;

// TEMP: ensure something renders while debugging blank screen
const pre = document.createElement('div');
pre.textContent = 'Loading UI…';
pre.style.position = 'fixed';
pre.style.bottom = '8px';
pre.style.right = '8px';
pre.style.background = '#111827';
pre.style.color = '#fff';
pre.style.padding = '6px 10px';
pre.style.borderRadius = '6px';
document.body.appendChild(pre);

createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
