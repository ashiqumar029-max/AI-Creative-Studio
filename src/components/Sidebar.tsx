import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Wand2,
  History,
  User,
  Settings,
  LogOut,
  Zap,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onOpenCheckout: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCheckout, onCloseMobile }) => {
  const { userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onCloseMobile) onCloseMobile();
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'My Projects', path: '/dashboard/projects', icon: FolderKanban },
    { label: 'AI Tools', path: '/dashboard/tools', icon: Wand2 },
    { label: 'Generation History', path: '/dashboard/history', icon: History },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-[#0C0E17] border-r border-white/10 flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-2 py-1.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px]">
            <div className="w-full h-full bg-[#090A0F] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-purple-300 transition-colors">
              AI Creative Studio
            </span>
            <p className="text-[10px] text-purple-400 font-mono">aicreativestudio.com</p>
          </div>
        </NavLink>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-purple-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <div className="pt-2 border-t border-white/10 mt-2">
              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
                  }`
                }
              >
                <Shield className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom User & Credits Card */}
      <div className="space-y-3">
        {/* Credits Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-purple-950/30 to-black/40 border border-purple-500/25">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Credits</span>
            <span className="font-bold text-purple-300 font-mono">
              {userProfile?.credits ?? 0}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(5, ((userProfile?.credits ?? 0) / 500) * 100))}%`,
              }}
            />
          </div>
          <button
            onClick={onOpenCheckout}
            className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-[11px] font-semibold transition-colors"
          >
            <Zap className="w-3 h-3 text-purple-300" />
            <span>Add Credits / Upgrade</span>
          </button>
        </div>

        {/* User profile & Logout */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-purple-600/40 border border-purple-500/50 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{userProfile?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{userProfile?.plan} Plan</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
