import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={20} className="text-green-400" />,
    error: <XCircle size={20} className="text-red-400" />,
    warning: <AlertCircle size={20} className="text-yellow-400" />,
    info: <Info size={20} className="text-blue-400" />,
  };

  const backgrounds = {
    success: 'bg-gradient-to-r from-green-600 to-green-700 border-green-500',
    error: 'bg-gradient-to-r from-red-600 to-red-700 border-red-500',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500',
    info: 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500',
  };

  return (
    <div
      className={`
        ${backgrounds[toast.type]} 
        border-2 rounded-xl p-3 shadow-2xl 
        flex items-start gap-3 min-w-[280px] max-w-[400px]
        animate-[slide-in-right_0.3s_ease-out]
        backdrop-blur-sm
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-white text-sm mb-0.5">{toast.title}</div>
        {toast.message && (
          <div className="text-xs text-white/90">{toast.message}</div>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface ToasterProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};
