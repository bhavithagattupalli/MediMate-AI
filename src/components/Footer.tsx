'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">{t.appName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.appTagline}. Intelligent, evidence-informed triage assisting you in navigating appropriate clinical care.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Compliant Data Standards</span>
            </div>
          </div>

          {/* Col 2: Health Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Specialized Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/modules/womens" className="hover:text-primary-400 transition">
                  {t.womensHealthTitle}
                </Link>
              </li>
              <li>
                <Link href="/modules/mens" className="hover:text-primary-400 transition">
                  {t.mensHealthTitle}
                </Link>
              </li>
              <li>
                <Link href="/modules/children" className="hover:text-primary-400 transition">
                  {t.childrenHealthTitle}
                </Link>
              </li>
              <li>
                <Link href="/modules/senior" className="hover:text-primary-400 transition">
                  {t.seniorHealthTitle}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Care Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Care Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/doctors" className="hover:text-primary-400 transition">
                  {t.doctorDirectoryTitle}
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-primary-400 transition">
                  Lab Report Scanner (AI)
                </Link>
              </li>
              <li>
                <Link href="/monitoring" className="hover:text-primary-400 transition">
                  Health Vitals Monitoring
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-primary-400 transition">
                  {t.navBookAppointment}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary-400 transition">
                  {t.navMyRecords}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              Emergency Services
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              For sudden severe chest pain, breathing arrest, severe trauma, or signs of stroke, contact emergency services immediately.
            </p>
            <div className="space-y-1.5 text-xs font-mono font-bold text-white">
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700/60 flex justify-between">
                <span>National Ambulance (India):</span>
                <span className="text-rose-400 font-bold">108</span>
              </div>
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700/60 flex justify-between">
                <span>All-in-One Emergency:</span>
                <span className="text-rose-400 font-bold">112</span>
              </div>
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700/60 flex justify-between">
                <span>Emergency (US/Intl):</span>
                <span className="text-rose-400 font-bold">911</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Requirement */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed max-w-4xl mx-auto space-y-2">
          <p className="flex items-center justify-center gap-1 text-slate-300 font-medium">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
            Healthcare Advisory & Clinical Safety Notice
          </p>
          <p>{t.safetyDisclaimer}</p>
          <p className="text-slate-400 text-[10px]">
            &copy; {new Date().getFullYear()} MediMate AI. All rights reserved. Built with evidence-informed clinical triage standards.
          </p>
        </div>
      </div>
    </footer>
  );
};
