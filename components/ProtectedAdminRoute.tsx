
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono neon-text animate-pulse">VERIFYING CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  // Final Server-side Role Check Enforcement
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
        <div className="mb-6 p-4 border-2 border-red-500 rounded-full">
          <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold font-mono text-red-500 mb-4 uppercase tracking-tighter">ACCESS DENIED</h1>
        <p className="text-gray-400 max-w-md mb-8 font-mono">
          YOUR CURRENT ACCOUNT DOES NOT HAVE PERMISSION TO VIEW THIS RESOURCE. THIS ATTEMPT HAS BEEN LOGGED.
        </p>
        <Navigate to="/" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
