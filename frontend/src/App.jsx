import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import JourneyPlanner from './pages/dashboard/JourneyPlanner';
import CrowdMap from './pages/dashboard/CrowdMap';
import CrowdIntelligence from './pages/dashboard/CrowdIntelligence';
import ReportCrowd from './pages/dashboard/ReportCrowd';
import Analytics from './pages/dashboard/Analytics';
import Profile from './pages/dashboard/Profile';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-flow-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-flow-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-flow-muted text-sm">Loading FLOWWISE...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="plan" element={<JourneyPlanner />} />
        <Route path="map" element={<CrowdMap />} />
        <Route path="intelligence" element={<CrowdIntelligence />} />
        <Route path="report" element={<ReportCrowd />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
