import React, { useState } from 'react';
import { X, Check, Zap, CreditCard, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/db/orderService';
import type { UserPlan } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: UserPlan;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = 'pro',
}) => {
  const { userProfile, addCredits } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>(defaultPlan);
  const [mode, setMode] = useState<'plans' | 'credits'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'creator',
      name: 'Creator',
      price: 29,
      period: '/month',
      credits: 500,
      description: 'Perfect for solo video creators, YouTubers, and digital storytellers.',
      features: [
        '500 monthly generative credits',
        'HD 1080p Image & Thumbnail exports',
        'Up to 50 active projects',
        'Standard processing queue',
        'Commercial usage license',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Studio',
      price: 79,
      period: '/month',
      credits: 2000,
      popular: true,
      description: 'Maximum firepower for agencies, growth marketers, and full-time creators.',
      features: [
        '2,000 monthly generative credits',
        '4K Cinematic Video & Upscaling',
        'Unlimited active projects',
        'Ultra-low latency priority queue',
        'AI Voice cloning & stem separation',
        'Dedicated customer support',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: 199,
      period: '/month',
      credits: 6000,
      description: 'Enterprise generative capacity for multi-creator brands and teams.',
      features: [
        '6,000 monthly generative credits',
        'Custom team workspace & roles',
        'Raw API & Webhook access',
        'Dedicated account manager',
        'Custom fine-tuned style models',
        '99.9% uptime SLA',
      ],
    },
  ];

  const creditPacks = [
    { id: 'pack-500', name: 'Starter Pack', credits: 500, price: 19, bonus: '0%' },
    { id: 'pack-1500', name: 'Creator Pack', credits: 1500, price: 49, bonus: '+15% FREE' },
    { id: 'pack-5000', name: 'Studio Pack', credits: 5000, price: 129, bonus: '+35% FREE' },
  ];

  const handleSimulatedCheckout = async () => {
    setIsProcessing(true);
    try {
      let addedCredits = 0;
      let orderAmount = 0;
      let orderTitle = '';

      if (mode === 'plans') {
        const plan = plans.find((p) => p.id === selectedPlan) || plans[1];
        addedCredits = plan.credits;
        orderAmount = plan.price;
        orderTitle = `Subscription: ${plan.name} Plan`;
      } else {
        const pack = creditPacks.find((p) => p.id === selectedPlan) || creditPacks[0];
        addedCredits = pack.credits;
        orderAmount = pack.price;
        orderTitle = `Credit Bundle: ${pack.credits} Credits`;
      }

      // Add to Firestore orders and adjust user balance
      if (userProfile) {
        await createOrder({
          userId: userProfile.userId,
          userEmail: userProfile.email,
          plan: orderTitle,
          amount: orderAmount,
          credits: addedCredits,
          paymentMethod: 'Stripe Sandbox (Test Card)',
        });
        await addCredits(addedCredits);
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success(
        'Transaction Complete',
        `Credited +${addedCredits} creative tokens to your account.`
      );
      setSuccessMessage(`Successfully added +${addedCredits} credits to your account!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Transaction Failed', 'Payment simulation could not be finalized.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0F111B] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scale Your Creative Production</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Upgrade Plan or Add Credits
          </h2>
          <p className="text-sm text-slate-400">
            Current balance:{' '}
            <span className="font-semibold text-purple-300">
              {userProfile?.credits ?? 0} Credits
            </span>
          </p>

          {/* Toggle between Monthly Plans and Instant Credit Packs */}
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 mt-3">
            <button
              onClick={() => {
                setMode('plans');
                setSelectedPlan('pro');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'plans' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => {
                setMode('credits');
                setSelectedPlan('pack-1500');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'credits' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Instant Credit Packs
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="my-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center font-medium animate-in zoom-in-95">
            🎉 {successMessage}
          </div>
        )}

        {/* Content Body */}
        {mode === 'plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`cursor-pointer relative rounded-xl p-5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 right-4 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-lg">{p.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">${p.price}</span>
                      <span className="text-xs text-slate-400">{p.period}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{p.credits} credits/mo</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-400 leading-relaxed">{p.description}</p>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {creditPacks.map((pack) => {
              const isSelected = selectedPlan === pack.id;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPlan(pack.id)}
                  className={`cursor-pointer relative rounded-xl p-5 border transition-all text-center flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-purple-400">{pack.bonus}</span>
                    <h3 className="font-bold text-white text-lg mt-1">{pack.name}</h3>
                    <div className="my-3 flex items-center justify-center gap-2">
                      <Zap className="w-6 h-6 text-purple-400" />
                      <span className="text-3xl font-extrabold text-white">{pack.credits}</span>
                    </div>
                    <p className="text-xs text-slate-400">Non-expiring creative generation credits</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-xl font-bold text-white">${pack.price}</span>
                    <span className="text-xs text-slate-400 ml-1">one-time</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info & trigger button */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-bit encrypted checkout simulator (Sandbox Ready)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSimulatedCheckout}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Transaction...' : 'Complete Simulated Purchase'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
