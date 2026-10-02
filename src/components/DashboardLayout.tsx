import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, FolderPlus, Zap, Search, Keyboard } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { CheckoutModal } from './CheckoutModal';
import { NewProjectModal } from './NewProjectModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { userProfile } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Keyboard Shortcuts System:
  // 'N' for New Project
  // 'S' for Search
  // 'C' for Credits
  // '?' for Shortcuts cheat sheet
  // 'Cmd+K' / 'Ctrl+K' for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an active text input or editable container
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      // Cmd+K or Ctrl+K always triggers search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // If an input is focused, don't hijack normal typing keys
      if (isInputFocused) {
        return;
      }

      // If modifier keys are held, let browser handle them
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewProjectOpen(true);
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsCheckoutOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-[#090A0F] text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <Sidebar
              onOpenCheckout={() => {
                setMobileSidebarOpen(false);
                setIsCheckoutOpen(true);
              }}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar with Integrated Global Search Bar & Shortcut Badges */}
        <header className="h-16 border-b border-white/10 bg-[#0C0E17]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-mono hidden xl:inline">
                GENERATIVE ENGINE ACTIVE
              </span>
            </div>
          </div>

          {/* Central Global Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-xs text-slate-400 hover:text-slate-200 transition-colors shadow-inner group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Search projects, generations, docs...</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">S</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">⌘K</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Keyboard Shortcuts Guide Button */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              title="Keyboard Shortcuts (?)"
              className="hidden lg:flex items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors text-xs"
            >
              <Keyboard className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-[10px] text-slate-500">?</span>
            </button>

            {/* Credits Counter button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:border-purple-500/60 transition-all text-xs font-semibold"
              title="Top up credits (Press C)"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>{userProfile?.credits ?? 0} Credits</span>
              <span className="text-[10px] px-1 bg-purple-500/20 rounded font-mono">+</span>
            </button>

            {/* Quick Create Project with [N] Shortcut */}
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition-all"
              title="New Project (Press N)"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Project</span>
              <kbd className="hidden md:inline px-1 py-0.2 rounded bg-white/20 text-[9px] font-mono">N</kbd>
            </button>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet
            context={{
              openNewProject: () => setIsNewProjectOpen(true),
              openCheckout: () => setIsCheckoutOpen(true),
              openGlobalSearch: () => setIsSearchOpen(true),
            }}
          />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
