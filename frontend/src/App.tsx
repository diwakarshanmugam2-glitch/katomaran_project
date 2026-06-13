import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { DashboardLayout } from './components/DashboardLayout';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { PublicStats } from './pages/PublicStats';
import { Link2, AlertCircle, Home } from 'lucide-react';

// Link Expired Warning Page Component
const ExpiredLinkPage: React.FC = () => (
  <div className="min-h-screen bg-bg-dark bg-grid-pattern flex flex-col items-center justify-center p-6 text-center">
    <div className="glass max-w-md w-full rounded-3xl p-8 border-white/5 shadow-2xl">
      <AlertCircle className="h-14 w-14 text-brand-pink mb-4 mx-auto animate-pulse" />
      <h1 className="font-heading text-2xl font-extrabold text-white mb-2">Link Has Expired</h1>
      <p className="text-sm text-gray-400 mb-8">
        This shortened URL has expired and is no longer active.
      </p>
      <Link
        to="/"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue py-3.5 text-xs font-semibold text-white shadow-lg"
      >
        <Home className="h-4 w-4" />
        Return to Home
      </Link>
    </div>
  </div>
);

// Link Not Found Warning Page Component
const NotFoundLinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  React.useEffect(() => {
    if (code) {
      try {
        const demoLinks = JSON.parse(localStorage.getItem('chronoLink_demo_links') || '{}');
        const target = demoLinks[code];
        if (target) {
          window.location.replace(target);
        }
      } catch (e) {
        console.error('Error parsing demo links:', e);
      }
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-bg-dark bg-grid-pattern flex flex-col items-center justify-center p-6 text-center">
      <div className="glass max-w-md w-full rounded-3xl p-8 border-white/5 shadow-2xl">
        <Link2 className="h-14 w-14 text-brand-purple mb-4 mx-auto" />
        <h1 className="font-heading text-2xl font-extrabold text-white mb-2">URL Not Found</h1>
        <p className="text-sm text-gray-400 mb-8">
          The short code you are trying to visit does not exist.
        </p>
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue py-3.5 text-xs font-semibold text-white shadow-lg"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/stats/:id" element={<PublicStats />} />
          <Route path="/expired" element={<ExpiredLinkPage />} />
          <Route path="/not-found" element={<NotFoundLinkPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics/:id" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Wildcard redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
