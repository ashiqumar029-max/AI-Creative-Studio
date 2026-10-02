import React, { useState, useEffect } from 'react';
import { CreditCard, Search, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminGetAllOrders } from '../../services/db/orderService';
import type { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const list = await adminGetAllOrders();
      if (list && list.length > 0) {
        setOrders(list);
      } else {
        // Fallback demo transactions
        setOrders([
          {
            id: 'ord_sample_1',
            userId: 'user_1',
            userEmail: 'alex@creator.io',
            plan: 'Subscription: Pro Studio Plan',
            amount: 79,
            credits: 2000,
            status: 'completed',
            paymentMethod: 'Stripe (Mastercard •••• 4242)',
            createdAt: '2026-10-01T14:20:00Z',
          },
          {
            id: 'ord_sample_2',
            userId: 'user_2',
            userEmail: 'sarah@production.co',
            plan: 'Credit Bundle: 5000 Credits',
            amount: 129,
            credits: 5000,
            status: 'completed',
            paymentMethod: 'Apple Pay (Visa •••• 8812)',
            createdAt: '2026-09-28T09:15:00Z',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    return (
      o.plan.toLowerCase().includes(search.toLowerCase()) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalRev = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Orders & Revenue Ledgers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track subscription activations, credit bundle checkouts, and sandbox payments
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Gross Volume</span>
            <span className="text-lg font-black text-emerald-300 font-mono">
              ${totalRev.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0D15] border border-white/10">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, package name, or user email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0D15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Item / Plan</th>
                <th className="py-3.5 px-4">Credits Added</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-purple-300 font-bold">
                    {o.id}
                  </td>
                  <td className="py-3.5 px-4 text-white font-medium">
                    {o.userEmail || o.userId.slice(0, 10)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{o.plan}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                    +{o.credits}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-white">
                    ${o.amount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{o.paymentMethod}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
