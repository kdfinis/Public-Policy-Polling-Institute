import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@/lib/monitoring";

// Basic global error banner to avoid blank screen without feedback
function installGlobalErrorBanner() {
  let currentBanner: HTMLElement | null = null;

  const show = (msg: string) => {
    // Remove existing banner to prevent memory leak
    if (currentBanner && currentBanner.parentNode) {
      currentBanner.parentNode.removeChild(currentBanner);
    }

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
    currentBanner = el;
  };

  const errorHandler = (e: ErrorEvent) => show(e.message);
  const rejectionHandler = (e: PromiseRejectionEvent) => {
    const reason = (e.reason && (e.reason.message || e.reason.toString())) || 'Unknown error';
    show(reason);
  };

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', rejectionHandler);

  // Cleanup function (though this runs for app lifetime)
  return () => {
    window.removeEventListener('error', errorHandler);
    window.removeEventListener('unhandledrejection', rejectionHandler);
    if (currentBanner && currentBanner.parentNode) {
      currentBanner.parentNode.removeChild(currentBanner);
    }
  };
}

installGlobalErrorBanner();

const rootEl = document.getElementById("root")!;

const root = createRoot(rootEl);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
