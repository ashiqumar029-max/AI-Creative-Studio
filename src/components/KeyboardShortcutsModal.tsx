import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      key: 'N',
      action: 'New Project',
      desc: 'Quickly open project creator dialog from anywhere in dashboard',
    },
    {
      key: 'S',
      action: 'Global Search',
      desc: 'Focus and open cross-vault search for projects, generations, and guides',
    },
    {
      key: '⌘K / Ctrl+K',
      action: 'Command Palette',
      desc: 'Open global search palette with keyword filters',
    },
    {
      key: 'C',
      action: 'Credit Recharge',
      desc: 'Open simulated Stripe checkout modal to top up tokens',
    },
    {
      key: '?',
      action: 'Shortcuts Cheat Sheet',
      desc: 'Toggle this keyboard shortcut helper dialog',
    },
    {
      key: 'ESC',
      action: 'Dismiss / Close',
      desc: 'Close active search modal, project modal, or preview overlay',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0F111D] border border-white/15 shadow-2xl p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Dashboard Shortcuts</h3>
            <p className="text-xs text-slate-400">Power-user keyboard navigation</p>
          </div>
        </div>

        <div className="divide-y divide-white/5 space-y-2 pt-2">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between pt-2.5">
              <div>
                <p className="text-xs font-semibold text-white">{sc.action}</p>
                <p className="text-[11px] text-slate-400">{sc.desc}</p>
              </div>
              <kbd className="px-2 py-1 rounded bg-white/10 border border-white/15 text-[11px] font-mono text-purple-300 shadow-sm shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-500">
            Shortcuts are active whenever an input or text field is not focused.
          </p>
        </div>
      </div>
    </div>
  );
};
