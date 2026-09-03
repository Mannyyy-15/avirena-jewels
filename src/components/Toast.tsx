import React, { useEffect } from 'react';
import { CheckCircle2, Heart, ShoppingBag, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info';
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans-body">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag className="w-4 h-4 text-[#C5A059]" />;
      case 'wishlist':
        return <Heart className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <div className="pointer-events-auto bg-[#2C2C2A] text-white p-4 rounded-xs shadow-xl border border-[#C5A059]/30 flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="p-1.5 bg-white/10 rounded-full shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-xs font-semibold tracking-wide text-[#FAF8F5]">{toast.title}</h4>
        {toast.subtitle && (
          <p className="text-[11px] text-[#D5CFBF] mt-0.5 font-light truncate">{toast.subtitle}</p>
        )}
        {toast.actionLabel && toast.onAction && (
          <button
            onClick={() => {
              toast.onAction?.();
              onDismiss();
            }}
            className="mt-2 text-[11px] font-medium text-[#C5A059] hover:underline uppercase tracking-wider block cursor-pointer"
          >
            {toast.actionLabel} →
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-[#9A9886] hover:text-white transition-colors p-1 cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
