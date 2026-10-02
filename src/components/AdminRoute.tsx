import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs text-slate-400 font-mono tracking-wider">VERIFYING ADMIN PRIVILEGES...</p>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Administrator Access Required</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          This portal is restricted to system administrators. Contact your organization lead if you believe this is an error.
        </p>
        <a
          href="/dashboard"
          className="mt-6 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
        >
          Return to User Dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
