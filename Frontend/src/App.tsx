import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/context/AuthContext";
import { JournalProvider } from "@/context/JournalContext";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Journal from "./pages/Journal";
import JournalDetail from "./pages/JournalDetail";
import JournalList from "./pages/JournalList";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Therapist from "./pages/Therapist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


// 🔥 Layout wrapper to control Navbar visibility
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <AuthProvider>
          <JournalProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* PUBLIC ROUTES */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* PROTECTED ROUTES */}
                  <Route
                    path="/journal"
                    element={
                      <ProtectedRoute>
                        <Journal />
                      </ProtectedRoute>
                    }
                  />

                   <Route
                    path="/journal/:id"
                    element={
                      <ProtectedRoute>
                        <JournalDetail />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/journal/all"
                    element={
                      <ProtectedRoute>
                        <JournalList />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/therapist"
                    element={
                      <ProtectedRoute>
                        <Therapist />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </JournalProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;