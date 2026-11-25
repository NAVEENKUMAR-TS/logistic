import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import PlaceholderView from './pages/PlaceholderView';
import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  EmailVerificationPage,
  SessionExpiredPage,
  UnauthorizedPage,
} from './pages/auth';
import { AuthView } from './types/auth';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading, signOut } = useAuth();
  const [activeView, setActiveView] = useState<AuthView | 'dashboard'>('login');

  const [currentRoute, setCurrentRoute] = useState<{ id: string; label: string }>({
    id: 'dashboard',
    label: 'Dashboard',
  });

  // Synchronize active view when Supabase completes session discovery
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Only set to dashboard if we're currently on login
        setActiveView((prev) => (prev === 'login' ? 'dashboard' : prev));
      } else {
        // If not authenticated, ensure dashboard cannot be shown
        setActiveView((prev) => (prev === 'dashboard' ? 'login' : prev));
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleNavigate = (path: string, label: string) => {
    setCurrentRoute({ id: path, label });
  };

  const handleSearch = (query: string) => {
    if (query) {
      console.log(`[Global Logistics Search]: "${query}"`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveView('login');
    setCurrentRoute({ id: 'dashboard', label: 'Dashboard' });
  };

  const renderAuthPage = () => {
    switch (activeView) {
      case 'login':
        return <LoginPage onNavigate={setActiveView} />;
      case 'signup':
        return <SignUpPage onNavigate={setActiveView} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setActiveView} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={setActiveView} />;
      case 'verify-email':
        return <EmailVerificationPage onNavigate={setActiveView} />;
      case 'session-expired':
        return <SessionExpiredPage onNavigate={setActiveView} />;
      case 'unauthorized':
        return <UnauthorizedPage onNavigate={setActiveView} />;
      default:
        return <LoginPage onNavigate={setActiveView} />;
    }
  };

  return (
    <>
      {activeView === 'dashboard' ? (
        <ProtectedRoute
          onUnauthenticated={() => setActiveView('login')}
          onUnauthorized={() => setActiveView('unauthorized')}
        >
          <DashboardLayout
            currentPath={currentRoute.id}
            currentTitle={currentRoute.label}
            onNavigate={handleNavigate}
            onSearch={handleSearch}
            onSignOut={handleSignOut}
          >
            {currentRoute.id === 'dashboard' ? (
              <Dashboard />
            ) : currentRoute.id === 'inventory' ? (
              <InventoryManagement />
            ) : (
              <PlaceholderView
                title={currentRoute.label}
                onBackToDashboard={() => setCurrentRoute({ id: 'dashboard', label: 'Dashboard' })}
              />
            )}
          </DashboardLayout>
        </ProtectedRoute>
      ) : (
        renderAuthPage()
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
