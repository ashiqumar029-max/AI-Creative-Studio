import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Zap,
  Edit,
  Trash2,
  Shield,
  Ban,
  CheckCircle2,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { adminGetAllUsers, adminUpdateUser } from '../../services/db/userService';
import type { UserProfile, UserPlan } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editPlan, setEditPlan] = useState<UserPlan>('free');
  const [creditAdjustment, setCreditAdjustment] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await adminGetAllUsers();
      if (list && list.length > 0) {
        setUsers(list);
      } else {
        // Fallback demo users if Firestore is initially empty
        setUsers([
          {
            userId: 'user_1',
            name: 'Alex Vance',
            email: 'alex@creator.io',
            role: 'user',
            plan: 'pro',
            credits: 1250,
            status: 'active',
            createdAt: '2026-09-12T10:00:00Z',
            updatedAt: '2026-10-01T15:00:00Z',
          },
          {
            userId: 'user_2',
            name: 'Sarah Connor',
            email: 'sarah@production.co',
            role: 'user',
            plan: 'business',
            credits: 4800,
            status: 'active',
            createdAt: '2026-08-20T08:30:00Z',
            updatedAt: '2026-09-28T12:00:00Z',
          },
          {
            userId: 'admin_1',
            name: 'Lead Admin',
            email: 'umarashiq700800@gmail.com',
            role: 'admin',
            plan: 'business',
            credits: 99999,
            status: 'active',
            createdAt: '2026-08-01T00:00:00Z',
            updatedAt: '2026-10-02T03:00:00Z',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      await adminUpdateUser(user.userId, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.userId === user.userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleSaveUserEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const newCredits = Math.max(0, editingUser.credits + creditAdjustment);
      await adminUpdateUser(editingUser.userId, {
        plan: editPlan,
        credits: newCredits,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.userId === editingUser.userId ? { ...u, plan: editPlan, credits: newCredits } : u
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          User Management Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect registered accounts, adjust generative balances, and assign membership tiers
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0D15] border border-white/10 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 capitalize"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="creator">Creator</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0D15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Credits</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-white text-xs shrink-0">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-semibold text-white truncate max-w-[140px]">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] truncate max-w-[180px]">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 uppercase font-mono">User</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold text-[10px]">
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{u.credits}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        u.status === 'suspended'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setEditPlan(u.plan);
                          setCreditAdjustment(0);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Edit Plan / Adjust Credits"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`p-1.5 rounded-lg ${
                          u.status === 'suspended'
                            ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                        }`}
                        title={u.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0F111B] border border-white/10 shadow-2xl p-6 space-y-4">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white">Adjust User: {editingUser.name}</h2>
            <p className="text-xs text-slate-400">{editingUser.email}</p>

            <form onSubmit={handleSaveUserEdits} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Subscription Plan
                </label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as UserPlan)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 capitalize"
                >
                  <option value="free">Free</option>
                  <option value="creator">Creator ($29/mo)</option>
                  <option value="pro">Pro ($79/mo)</option>
                  <option value="business">Business ($199/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Adjust Credits (Current: {editingUser.credits})
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCreditAdjustment((prev) => prev - 100)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={creditAdjustment}
                    onChange={(e) => setCreditAdjustment(parseInt(e.target.value) || 0)}
                    placeholder="+/- credits"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setCreditAdjustment((prev) => prev + 100)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  New Balance will be:{' '}
                  <strong className="text-amber-300">
                    {Math.max(0, editingUser.credits + creditAdjustment)}
                  </strong>
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
