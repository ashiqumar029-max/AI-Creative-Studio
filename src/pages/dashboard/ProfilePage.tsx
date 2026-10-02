import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Zap,
  Shield,
  KeyRound,
  LogOut,
  Camera,
  CheckCircle2,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/db/userService';
import { CheckoutModal } from '../../components/CheckoutModal';

export const ProfilePage: React.FC = () => {
  const { userProfile, refreshProfile, logout, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(userProfile?.name || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    setIsUpdating(true);
    try {
      await updateUserProfile(userProfile.userId, { name, photoURL });
      await refreshProfile();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userProfile?.email) return;
    try {
      await resetPassword(userProfile.email);
      setPasswordMsg(`Password reset instructions sent to ${userProfile.email}`);
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg(err?.message || 'Failed to dispatch reset email');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your credentials, generative allowances, and account preferences
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="relative">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-purple-600/30">
                {name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{userProfile?.name}</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {userProfile?.plan} Plan
              </span>
            </div>
            <p className="text-xs text-slate-400">{userProfile?.email}</p>
            <p className="text-[11px] text-slate-500 font-mono">
              Member since: {new Date(userProfile?.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Credits Pill with Upgrade */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Credits</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xl font-black text-white font-mono">{userProfile?.credits ?? 0}</span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow"
          >
            Upgrade / Refill
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          <span>Edit Profile Information</span>
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Profile Image URL
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={userProfile?.email || ''}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs cursor-not-allowed opacity-60"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Email is managed securely by your authentication provider.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Reset */}
      <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <span>Security & Authentication</span>
        </h3>

        {passwordMsg && (
          <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300">
            {passwordMsg}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5">
          <div>
            <p className="text-xs font-bold text-white">Reset Account Password</p>
            <p className="text-[11px] text-slate-400">
              Receive a secure password update link at your verified address
            </p>
          </div>
          <button
            onClick={handlePasswordReset}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors"
          >
            Send Reset Link
          </button>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-400">Terminate current session across this browser:</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs text-red-300 font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};
