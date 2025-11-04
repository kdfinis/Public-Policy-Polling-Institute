import { useMemo, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PollDetail from "./pages/PollDetail";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Terms from "./pages/Terms";
import Error404 from "./pages/Error404";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { DevConsoleOverlay } from "@/components/DevConsoleOverlay";
import Voters from "./pages/Voters";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DemoBanner } from "@/components/DemoBanner";

const App = () => {
  // Fix memory leak: Create QueryClient inside component with proper configuration
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <DemoBanner />
          <Suspense fallback={null}>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Index />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/browse"
                element={
                  <ErrorBoundary>
                    <Browse />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/poll/:id"
                element={
                  <ErrorBoundary>
                    <PollDetail />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/search"
                element={
                  <ErrorBoundary>
                    <Search />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ErrorBoundary>
                    <Notifications />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/profile"
                element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ErrorBoundary>
                    <Analytics />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/voters"
                element={
                  <ErrorBoundary>
                    <Voters />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/terms"
                element={
                  <ErrorBoundary>
                    <Terms />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/login"
                element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/404"
                element={
                  <ErrorBoundary>
                    <Error404 />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/maintenance"
                element={
                  <ErrorBoundary>
                    <Maintenance />
                  </ErrorBoundary>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
        {import.meta.env.DEV && <DevConsoleOverlay />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
