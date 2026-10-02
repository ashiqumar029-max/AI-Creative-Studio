import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export const PageLoadingFallback: React.FC<{ label?: string }> = ({
  label = 'Loading workspace module...',
}) => {
  return (
    <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-900/20">
          <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
        <Loader2 className="w-14 h-14 text-purple-500/40 animate-spin absolute -top-1 -left-1 pointer-events-none" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs font-mono uppercase tracking-widest text-purple-300">
          AI Creative Studio
        </p>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
    </div>
  );
};
