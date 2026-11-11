import React, { useEffect } from 'react';
import { useAuditStore } from '@/lib/store';
import { Trophy, X, PartyPopper, Sparkles } from 'lucide-react';

export const MilestoneCelebration: React.FC = () => {
  const toast = useAuditStore((state) => state.activeMilestoneToast);
  const dismiss = useAuditStore((state) => state.dismissMilestoneToast);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      dismiss();
    }, 6000);

    return () => clearTimeout(timer);
  }, [toast, dismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm pointer-events-auto animate-in slide-in-from-bottom-5 duration-300"
    >
      {/* Reduced-motion aware celebratory sparkle particles */}
      <div className="absolute -top-3 -left-3 pointer-events-none opacity-80 motion-safe:animate-bounce">
        <Sparkles className="w-5 h-5 text-amber" aria-hidden="true" />
      </div>
      <div className="absolute -bottom-2 -right-2 pointer-events-none opacity-80 motion-safe:animate-pulse">
        <PartyPopper className="w-5 h-5 text-deep-green" aria-hidden="true" />
      </div>

      <div className="p-4 rounded-2xl glass-sidebar bg-mist-800/95 border border-white/80 shadow-2xl flex items-start gap-3 text-forest">
        <div className="w-10 h-10 rounded-full bg-deep-green-100 flex items-center justify-center flex-shrink-0 text-deep-green shadow-sm">
          {toast.percentage >= 100 ? (
            <Trophy className="w-5 h-5 text-amber" aria-hidden="true" />
          ) : (
            <PartyPopper className="w-5 h-5 text-deep-green" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 pr-1">
          <div className="text-xs font-bold text-forest flex items-center justify-between">
            <span>Milestone Reached!</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-deep-green text-mist">
              {toast.percentage}%
            </span>
          </div>
          <p className="text-xs text-forest-700 mt-1 font-medium leading-snug">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="w-7 h-7 rounded-full flex items-center justify-center text-forest-500 hover:text-forest hover:bg-mist-200/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green -mr-1 -mt-1"
          aria-label="Dismiss milestone notification"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

