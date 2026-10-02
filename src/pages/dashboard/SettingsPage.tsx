import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  Moon,
  Shield,
  Check,
  Save,
  Key,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [genNotifs, setGenNotifs] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Studio Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize notifications, studio appearance, and automated cloud workflows
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Notifications Section */}
      <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Notifications & Alerts</span>
        </h3>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Email Notifications</p>
              <p className="text-[11px] text-slate-400">
                Receive weekly summary of generated assets and usage stats
              </p>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                emailNotifs ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  emailNotifs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Generation Completion Alerts</p>
              <p className="text-[11px] text-slate-400">
                Display push sound and notification when 4K videos or scripts finish processing
              </p>
            </div>
            <button
              onClick={() => setGenNotifs(!genNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                genNotifs ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  genNotifs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-400" />
          <span>Appearance & Interface</span>
        </h3>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Dark Cinematic Theme</p>
              <p className="text-[11px] text-slate-400">
                High-contrast deep charcoal interface optimized for generative media reviews
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-400 px-3 py-1 rounded bg-purple-500/20">
              Active (Permanent)
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Automatic Project Cloud Sync</p>
              <p className="text-[11px] text-slate-400">
                Auto-save active prompt drafts directly to your currently selected project container
              </p>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoSave ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoSave ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security & API Integration */}
      <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>Developer & API Architecture</span>
        </h3>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Info className="w-4 h-4 shrink-0" />
            <span>Server-side Zero Key Exposure Architecture</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All AI model calls are securely brokered via server-side proxies or demo sandbox fallbacks. Never commit or expose private keys in frontend bundles.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
