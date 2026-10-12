'use client';

import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const EmergencyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <aside aria-label="Medical emergency banner" className="bg-rose-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
          <span>{t.emergencyBanner}</span>
        </div>
        <a
          href="tel:108"
          className="inline-flex items-center gap-1.5 bg-white text-rose-700 hover:bg-rose-50 px-3 py-1 rounded-full font-bold text-xs shadow transition-colors shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{t.emergencyAction}</span>
        </a>
      </div>
    </aside>
  );
};
