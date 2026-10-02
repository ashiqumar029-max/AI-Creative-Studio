import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string, duration: number = 4000) => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      const newToast: ToastItem = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title: string, description?: string) => addToast('success', title, description),
    error: (title: string, description?: string) => addToast('error', title, description),
    info: (title: string, description?: string) => addToast('info', title, description),
    warning: (title: string, description?: string) => addToast('warning', title, description),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          let borderClass = 'border-purple-500/40';
          let bgClass = 'bg-[#0F111E]/95';
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;

          if (t.type === 'success') {
            borderClass = 'border-emerald-500/40 shadow-emerald-950/30';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
          } else if (t.type === 'error') {
            borderClass = 'border-red-500/40 shadow-red-950/30';
            icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />;
          } else if (t.type === 'warning') {
            borderClass = 'border-amber-500/40 shadow-amber-950/30';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
          } else if (t.type === 'info') {
            borderClass = 'border-cyan-500/40 shadow-cyan-950/30';
            icon = <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-4 rounded-xl border ${borderClass} ${bgClass} backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300 transition-all`}
            >
              <div className="flex items-start gap-3">
                {icon}
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{t.title}</h4>
                  {t.description && (
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
