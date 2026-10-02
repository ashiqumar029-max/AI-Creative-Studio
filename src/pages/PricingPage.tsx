import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { CheckoutModal } from '../components/CheckoutModal';
import { useAuth } from '../context/AuthContext';
import type { UserPlan } from '../types';

export const PricingPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<UserPlan>('pro');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const pricingPlans: {
    id: UserPlan;
    name: string;
    price: number | string;
    period: string;
    description: string;
    popular?: boolean;
    credits: number;
    features: string[];
    buttonText: string;
  }[] = [
    {
      id: 'free',
      name: 'FREE',
      price: 0,
      period: 'forever',
      credits: 100,
      description: 'Ideal for trying out generative tools and testing AI creative prototypes.',
      features: [
        '100 complimentary starter credits',
        'Access to all 8 creative tools',
        'Up to 3 active projects',
        'Standard generation speed',
        'Community access & support',
        'Standard resolution downloads',
      ],
      buttonText: 'Current / Get Started',
    },
    {
      id: 'creator',
      name: 'CREATOR',
      price: 29,
      period: '/month',
      credits: 500,
      description: 'Engineered for dedicated content creators, YouTubers, and digital marketers.',
      features: [
        '500 monthly generative credits',
        'Up to 50 active projects',
        'HD 1080p & 4K exports',
        'Advanced script & video tools',
        'Priority generation queue',
        'Full commercial usage license',
      ],
      buttonText: 'Choose Plan',
    },
    {
      id: 'pro',
      name: 'PRO STUDIO',
      price: 79,
      period: '/month',
      credits: 2000,
      popular: true,
      description: 'Maximum creative throughput for fast-scaling agencies and media teams.',
      features: [
        '2,000 monthly generative credits',
        'Unlimited active projects',
        'High-speed ultra priority queue',
        'Neural voice cloning & master audio',
        '4K vertical & cinematic upscaling',
        'A/B viral thumbnail predictor',
        'Dedicated VIP support response',
      ],
      buttonText: 'Choose Plan',
    },
    {
      id: 'business',
      name: 'BUSINESS',
      price: 199,
      period: '/month',
      credits: 6000,
      description: 'Enterprise bandwidth for high-output creative agencies and brands.',
      features: [
        '6,000 monthly generative credits',
        'Multi-user team workspaces',
        'Advanced project roles & asset sharing',
        'Direct REST API / Webhooks access',
        'Custom fine-tuned style models',
        'Dedicated account manager',
        '99.98% SLA & invoicing support',
      ],
      buttonText: 'Choose Plan',
    },
  ];

  const handleSelectPlan = (planId: UserPlan) => {
    setSelectedPlanForModal(planId);
    setIsCheckoutOpen(true);
  };

  const faqs = [
    {
      q: 'How do generative credits work?',
      a: 'Each creative action consumes credits depending on the complexity: standard images cost 5-10 credits, scripts cost 5 credits, thumbnails cost 8 credits, and 4K videos cost 15-25 credits.',
    },
    {
      q: 'Can I purchase additional credits without upgrading my monthly plan?',
      a: 'Yes! You can purchase instant non-expiring credit packs at any time from your dashboard or profile.',
    },
    {
      q: 'Do I own commercial rights to the generated content?',
      a: 'Yes. All content created on Free, Creator, Pro, and Business tiers carries full commercial distribution and monetization rights.',
    },
    {
      q: 'How does payment processing operate?',
      a: 'We support Stripe, PayPal, and Apple Pay via modern secure checkout. In this preview build, clicking "Choose Plan" activates a database-ready sandbox simulator.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Flexible Creative Investment</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Transparent, Scalable Pricing
        </h1>
        <p className="text-base sm:text-lg text-slate-400">
          Choose a plan that fits your production volume. Upgrade, downgrade, or buy extra credits whenever you need.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPlans.map((plan) => {
          const isCurrent = userProfile?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-purple-500 bg-gradient-to-b from-purple-950/30 to-[#0C0E17] shadow-xl shadow-purple-950/40'
                  : 'border border-white/10 bg-[#0C0E17] hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 h-8 leading-snug">{plan.description}</p>

                <div className="mt-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                    </span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{plan.credits} credits / month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white/10 text-slate-400 cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{isCurrent ? 'Current Plan' : plan.buttonText}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="mt-24 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about our credits and plans</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        defaultPlan={selectedPlanForModal}
      />
    </div>
  );
};
