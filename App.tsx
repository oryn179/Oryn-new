
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vote from './pages/Vote';
import Gift from './pages/Gift';
import RateUs from './pages/RateUs';
import Admin from './pages/Admin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (code: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authInProgress = useRef(false);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('oryn_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/session', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code && !authInProgress.current) {
      authInProgress.current = true;
      handleLogin(code);
      // Construct clean URL (maintaining the hash for HashRouter)
      const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      verifySession();
    }
  }, []);

  const handleLogin = async (code: string) => {
    setIsLoading(true);
    try {
      // CRITICAL: Must match the redirect_uri used in the initial GitHub redirect
      const redirect_uri = window.location.origin + window.location.pathname;
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri })
      });
      
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('oryn_token', data.token);
      } else {
        console.error("Auth server error:", data.error);
        logout();
      }
    } catch (error) {
      console.error("Auth request failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oryn_token');
    authInProgress.current = false;
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout, isLoading }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col glow-bg">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/gift" element={<Gift />} />
              <Route path="/rate" element={<RateUs />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <Admin />
                  </ProtectedAdminRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5 bg-[#050505]">
            &copy; 2024 Oryn Server. All Rights Reserved. Designed for Video Editors.
          </footer>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
