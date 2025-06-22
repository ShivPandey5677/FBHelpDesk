import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import FacebookIntegration from './components/integration/FacebookIntegration';
import ConversationsPage from './pages/ConversationsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/conversations" /> : <LoginForm />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/conversations" /> : <RegisterForm />} 
      />
      <Route 
        path="/integration" 
        element={
          <ProtectedRoute>
            <FacebookIntegration />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/conversations" 
        element={
          <ProtectedRoute>
            <ConversationsPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/conversations" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;