
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PhishSense from './pages/PhishSense';
import ThreatIntel from './pages/ThreatIntel';
import Training from './pages/Training';
import Incidents from './pages/Incidents';
import VulnerabilityPredictor from './pages/VulnerabilityPredictor';
import Admin from './pages/Admin';
import AISearch from './pages/AISearch';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import GmailOAuthConsent from './pages/GmailOAuthConsent';
import GmailOAuthCallback from './pages/GmailOAuthCallback';
import Profile from './pages/Profile';
import SecurityHub from './pages/SecurityHub';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import GoogleSignIn from './pages/GoogleSignIn';
import GithubSignIn from './pages/GithubSignIn';

// A component to protect routes that require authentication.
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Renders the child routes
};

// A component to protect routes that require admin privileges.
const AdminRoute: React.FC = () => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    // Redirect to a "not authorized" page or dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

      {/* Routes that don't need the main layout */}
      <Route path="/gmail-oauth-consent" element={<GmailOAuthConsent />} />
      <Route path="/gmail-oauth-callback" element={<GmailOAuthCallback />} />
      <Route path="/google-signin" element={<GoogleSignIn />} />
      <Route path="/github-signin" element={<GithubSignIn />} />


      {/* Protected routes that use the main layout */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/security-hub" element={<SecurityHub />} />
                <Route path="/phish-sense" element={<PhishSense />} />
                <Route path="/threat-intel" element={<ThreatIntel />} />
                <Route path="/training" element={<Training />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/vuln-predictor" element={<VulnerabilityPredictor />} />
                <Route path="/ai-search" element={<AISearch />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Admin-only routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
