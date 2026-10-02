import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Users, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-20">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Empowering Every Creator With Studio-Grade AI
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          AI Creative Studio was founded on a simple conviction: high-end digital media production shouldn't be locked behind $50,000 agency retainers or hundred-hour render farms.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-white text-base">Neural Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We synthesize top diffusion weights, large language reasoning, and neural vocoder pipelines into a single frictionless browser environment.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="font-bold text-white text-base">Creator Sovereignty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your creative prompts and media are never leaked or used to train third-party public models without explicit commercial agreements.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-bold text-white text-base">Agency Quality</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every output is calibrated for broadcast compliance, viral CTR thresholds, and professional commercial delivery.
          </p>
        </div>
      </div>

      {/* Story section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/20 via-black/40 to-indigo-950/20 border border-white/10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">The Generative Revolution in 2026</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Modern audiences consume billions of hours of short-form video, immersive audio, and visual content each day. Solo creators and agile marketing teams face immense pressure to output consistently high-caliber media. By unifying scriptwriting, thumbnail generation, voiceover synthesis, and video rendering under one intelligent roof, AI Creative Studio eliminates production bottlenecks.
        </p>
        <div className="pt-2">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            <span>Explore All Capabilities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
