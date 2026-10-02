import React, { useState } from 'react';
import { Sliders, Shield, Zap, AlertTriangle, CheckCircle2, Save, Database } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [defaultCredits, setDefaultCredits] = useState(100);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('All generative AI models operational with 99.98% uptime.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          System Configuration & Platform Rules
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure global generative allocations, system status messages, and security policies
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>System configuration successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Generative Allocations */}
        <div className="p-6 rounded-2xl bg-[#0B0D15] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Default Signup Allocations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Starter Credits on Registration
              </label>
              <input
                type="number"
                value={defaultCredits}
                onChange={(e) => setDefaultCredits(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default per prompt specification: 100 free credits
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Free Plan Generation Rate Limit
              </label>
              <input
                type="text"
                disabled
                value="10 requests / minute"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs cursor-not-allowed opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Global Broadcast */}
        <div className="p-6 rounded-2xl bg-[#0B0D15] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Platform Broadcast Banner</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Live System Status Announcement
            </label>
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-xs font-bold text-white">Emergency Maintenance Mode</p>
              <p className="text-[11px] text-slate-400">
                Temporarily pause generation queues while scaling back-end neural workers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                maintenanceMode ? 'bg-red-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Database Audit */}
        <div className="p-6 rounded-2xl bg-[#0B0D15] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Firestore Database Collections Audit</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {['users', 'projects', 'generations', 'portfolio', 'orders', 'user_settings'].map(
              (col) => (
                <div key={col} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-purple-300">/{col}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save System Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};
