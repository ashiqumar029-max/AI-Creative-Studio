import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FolderKanban,
  CreditCard,
  Image,
  Sliders,
  ArrowLeft,
  Activity,
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const adminNav = [
    { label: 'Overview', path: '/admin', icon: Activity, exact: true },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Project Vault', path: '/admin/projects', icon: FolderKanban },
    { label: 'Orders & Revenue', path: '/admin/orders', icon: CreditCard },
    { label: 'Portfolio CMS', path: '/admin/portfolio', icon: Image },
    { label: 'System Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 h-full bg-[#0B0D15] border-r border-amber-500/20 flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">Admin Control</span>
              <p className="text-[10px] text-amber-400 font-mono">SUPERADMIN ACCESS</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Return to App */}
      <div className="pt-4 border-t border-white/10">
        <Link
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Back to Studio Dashboard</span>
        </Link>
      </div>
    </aside>
  );
};
