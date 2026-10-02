import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#07080D] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#090A0F] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">AI Creative Studio</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Turn Your Ideas Into Powerful Digital Content With AI." The next-generation creative platform for videos, thumbnails, images, scripts, voiceovers, and high-impact digital marketing.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Generative Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Col: Creative Tools */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Creative Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard/tools" className="hover:text-purple-400 transition-colors">
                  AI Image Generator
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tools" className="hover:text-purple-400 transition-colors">
                  AI Script Generator
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tools" className="hover:text-purple-400 transition-colors">
                  YouTube Thumbnail Maker
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tools" className="hover:text-purple-400 transition-colors">
                  AI Voice Generator
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tools" className="hover:text-purple-400 transition-colors">
                  AI Video Creator
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tools" className="hover:text-purple-400 transition-colors">
                  Social Content Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Col: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-purple-400 transition-colors">
                  Services Overview
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-purple-400 transition-colors">
                  Showcase Portfolio
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-purple-400 transition-colors">
                  Pricing & Credit Bundles
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">
                  About the Studio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col: Security & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Security & Trust</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Zero Data Training Leak</span>
              </li>
              <li className="text-slate-400">Firestore ABAC Guarded</li>
              <li className="text-slate-400">SOC2 Type II Ready</li>
              <li className="text-slate-400">Commercial Usage Rights</li>
              <li className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  <span>Claim 100 Free Credits</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AI Creative Studio (<span className="text-purple-400 font-mono">aicreativestudio.com</span>). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              API Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
