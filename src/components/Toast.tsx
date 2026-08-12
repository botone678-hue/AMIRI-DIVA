import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in transition-all">
      <div className="flex items-center gap-3 rounded-none border border-[#C5A059]/40 bg-[#1A1412] px-5 py-3.5 text-xs tracking-wide text-[#FAF8F5] shadow-2xl backdrop-blur-md">
        <Sparkles className="h-4 w-4 shrink-0 text-[#C5A059]" />
        <span className="font-medium text-[#F5F0EB]">{toastMessage}</span>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C5A059]" />
      </div>
    </div>
  );
};
