'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Baby, 
  UserCheck, 
  Activity, 
  Stethoscope, 
  Clock, 
  Bot, 
  Languages, 
  CheckCircle2, 
  Lock,
  Microscope,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  const modules = [
    {
      id: 'womens',
      href: '/modules/womens',
      title: t.womensHealthTitle,
      desc: t.womensHealthDesc,
      icon: Heart,
      accentColor: 'from-pink-500 to-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      tags: ['Menstrual Health', 'Pregnancy & Prenatal', 'PCOS & Hormones', 'Menopause', 'Breast Health'],
      stats: 'Dedicated Gynecological Triage',
    },
    {
      id: 'mens',
      href: '/modules/mens',
      title: t.mensHealthTitle,
      desc: t.mensHealthDesc,
      icon: Activity,
      accentColor: 'from-blue-600 to-cyan-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      tags: ['Urinary & Bladder', 'Reproductive Health', 'Skin & Hair Loss', 'Cardiovascular', 'General Vitality'],
      stats: 'Specialized Urological & Men’s Care',
    },
    {
      id: 'children',
      href: '/modules/children',
      title: t.childrenHealthTitle,
      desc: t.childrenHealthDesc,
      icon: Baby,
      accentColor: 'from-teal-500 to-emerald-600',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      tags: ['Pediatric Illnesses', 'Seasonal Fever & Cough', 'Infant Care', 'Safe Pediatric Guidance', 'Age-Calibrated Care'],
      stats: 'Zero-Unsafe Dosages Safety Policy',
    },
    {
      id: 'senior',
      href: '/modules/senior',
      title: t.seniorHealthTitle,
      desc: t.seniorHealthDesc,
      icon: UserCheck,
      accentColor: 'from-amber-600 to-indigo-600',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      tags: ['Age 50+ Specialized', 'Joint & Arthritis', 'Cardiometabolic Risk', 'Fall Prevention Care', 'Medication Review'],
      stats: 'Geriatric & Mobility Safety Guidelines',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-slate-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-primary-800 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>AI-Guided Healthcare Decision Support & Triage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Personalized Clinical Guidance at Every Stage of Life
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Select your specialized health module below. MediMate AI evaluates reported symptoms against evidence-informed clinical pathways, recommends verified doctor specialties, and provides safe precautions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#modules-section"
              className="px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>Explore 4 Health Modules</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/doctors"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Browse Doctor Directory</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Conservative Safety</p>
                <p className="text-[11px] text-slate-500">Zero unverified dosages</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-primary-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Instant Triage</p>
                <p className="text-[11px] text-slate-500">Personalized results</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Languages className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">4 Languages</p>
                <p className="text-[11px] text-slate-500">EN, TE, HI, TA</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-slate-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Data Isolation</p>
                <p className="text-[11px] text-slate-500">Encrypted records</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Interactive Healthcare Modules */}
      <section id="modules-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.modulesTitle}
          </h2>
          <p className="text-sm text-slate-600">
            {t.modulesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative background subtle glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${mod.accentColor} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity pointer-events-none`} />

                <div className="space-y-4">
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${mod.accentColor} flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${mod.badgeColor}`}>
                      {mod.stats}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  {/* Concern Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {mod.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200/60 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition">
                    Dedicated clinical form & results
                  </span>
                  <Link
                    href={mod.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white group-hover:bg-primary-600 text-xs font-bold shadow transition-all"
                  >
                    <span>{t.startAssessment}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Advanced Clinical Suite: Report Scanner & Vitals Monitoring */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Report Scanner */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-8 border border-teal-700/50 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                <Microscope className="w-4 h-4" />
                <span>AI Biomarker OCR & Analysis</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-teal-300 transition">
                AI Lab Report Scanner
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Upload blood work, lipid panels, or thyroid test results. MediMate AI automatically extracts numerical biomarkers, flags out-of-range clinical parameters, and connects you to the right clinician. Includes 1-click test presets for instant demonstration.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] bg-slate-800/80 text-teal-200 px-2.5 py-1 rounded-lg border border-teal-500/20">CBC Blood Count</span>
                <span className="text-[11px] bg-slate-800/80 text-teal-200 px-2.5 py-1 rounded-lg border border-teal-500/20">Lipid & Glucose Panel</span>
                <span className="text-[11px] bg-slate-800/80 text-teal-200 px-2.5 py-1 rounded-lg border border-teal-500/20">Thyroid TFT (TSH)</span>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Supports PDF & image test reports</span>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition"
              >
                <span>Launch Report Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Vitals Monitoring */}
          <div className="bg-gradient-to-br from-primary-950 to-slate-900 text-white rounded-3xl p-8 border border-primary-700/50 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold border border-primary-500/30">
                <HeartPulse className="w-4 h-4" />
                <span>Continuous Biometric Tracking</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary-300 transition">
                Personal Health Vitals
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Log and monitor key physiological vitals including Blood Pressure (AHA classification), Blood Glucose, Resting Heart Rate, SpO2, and BMI. Generates dynamic composite health scores and proactive clinician review recommendations.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] bg-slate-800/80 text-primary-200 px-2.5 py-1 rounded-lg border border-primary-500/20">AHA Blood Pressure Stages</span>
                <span className="text-[11px] bg-slate-800/80 text-primary-200 px-2.5 py-1 rounded-lg border border-primary-500/20">Composite Health Score</span>
                <span className="text-[11px] bg-slate-800/80 text-primary-200 px-2.5 py-1 rounded-lg border border-primary-500/20">Fasting Glucose Tracking</span>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Live clinical classification</span>
              <Link
                href="/monitoring"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-lg transition"
              >
                <span>Open Vitals Monitor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How MediMate AI Operates Step-by-Step */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
            Clinical Care Pathway
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            From Reported Symptoms to Confirmed Clinical Care
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            MediMate AI is engineered for clinical accuracy, patient safety, and seamless specialist care navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-400 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h4 className="font-bold text-sm text-white">Intake & Symptom Submission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your concern with tailored clinical parameters including duration, timeline, and age context.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h4 className="font-bold text-sm text-white">Red-Flag Safety Screening</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate screening for critical emergency symptoms (chest pain, stroke signs) with emergency alerts.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h4 className="font-bold text-sm text-white">Specialist Matching & Precautions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized results page explaining suitable clinician specialty, evidence-based self-care, and what to avoid.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h4 className="font-bold text-sm text-white">Appointment Booking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly reserve confirmed in-person or online video slots with verified doctors from our directory.
            </p>
          </div>
        </div>
      </section>

      {/* AI Health Copilot Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300">
              <Bot className="w-4 h-4" />
              <span>AI Health Copilot</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have General Medical or Wellness Questions?
            </h3>
            <p className="text-xs sm:text-sm text-primary-100 leading-relaxed">
              Chat anytime with our intelligent clinical copilot for health education, lifestyle guidance, and answers to your wellness inquiries.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/doctors"
              className="px-6 py-3 rounded-xl bg-white text-primary-900 font-bold text-xs hover:bg-primary-50 transition shadow-lg text-center"
            >
              {t.navDoctors}
            </Link>
            <Link
              href="/book"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs transition shadow-lg text-center"
            >
              {t.navBookAppointment}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
