
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DaftarPeternakan from "./pages/DaftarPeternakan";
import JadwalPage from "./pages/JadwalPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { GoatProvider } from "./context/GoatContext";
import { CheckinProvider } from "./context/CheckinContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GoatProvider>
          <CheckinProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="daftar-peternakan" element={<DaftarPeternakan />} />
                    <Route path="jadwal" element={<JadwalPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CheckinProvider>
        </GoatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
