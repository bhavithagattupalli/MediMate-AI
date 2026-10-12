'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Stethoscope, 
  ShieldAlert, 
  ArrowLeft, 
  Edit3, 
  Calendar, 
  Clock, 
  User, 
  HeartHandshake, 
  Activity, 
  PhoneCall,
  Sparkles,
  Footprints
} from 'lucide-react';
import { TriageResult, Doctor } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { BookingModal } from '@/components/BookingModal';

export default function ResultsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [result, setResult] = useState<TriageResult | null>(null);
  const [matchedDoctor, setMatchedDoctor] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('medimate_latest_result');
    if (raw) {
      try {
        const parsed: TriageResult = JSON.parse(raw);
        setResult(parsed);

        // Fetch a matching doctor for this recommended specialty
        fetch(`/api/doctors?specialty=${encodeURIComponent(parsed.recommendedSpecialty)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.doctors && data.doctors.length > 0) {
              setMatchedDoctor(data.doctors[0]);
            } else {
              // fallback to general physician or first doctor
              fetch('/api/doctors')
                .then((r) => r.json())
                .then((d) => setMatchedDoctor(d.doctors?.[0] || null));
            }
          })
          .catch(() => {});
      } catch (e) {
        console.error('Failed to parse triage result', e);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Activity className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Assessment Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please select a specialized health module from the dashboard to submit your symptoms and generate a personalized clinical evaluation.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl shadow transition hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </Link>
      </div>
    );
  }

  const moduleNames = {
    womens: t.womensHealthTitle,
    mens: t.mensHealthTitle,
    children: t.childrenHealthTitle,
    senior: t.seniorHealthTitle,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/modules/${result.moduleType}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.editDetails}</span>
          </button>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
            {moduleNames[result.moduleType] || result.moduleType}
          </span>
        </div>
      </div>

      {/* EMERGENCY RED-FLAG BANNER (Prominently displayed if detected) */}
      {result.isEmergency && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-rose-950 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
              <ShieldAlert className="w-7 h-7 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-rose-700 tracking-tight">
                {t.emergencyWarningNotice}
              </h2>
              <p className="text-xs sm:text-sm text-rose-800 font-medium leading-relaxed">
                {result.emergencyReason || 'Critical red flag symptoms detected requiring immediate emergency medical evaluation.'}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-1 text-center sm:text-left">
              <p className="font-bold text-rose-900">Do not wait for a routine appointment booking.</p>
              <p className="text-slate-600">Dial local ambulance emergency services or proceed directly to an emergency hospital department.</p>
            </div>
            <a
              href="tel:108"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>Call 108 / 112 / 911 Now</span>
            </a>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.resultsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t.resultsSubtitle}
        </p>
      </div>

      {/* Grid: Patient Details & Reported Concern */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-primary-600" />
            <h3 className="font-bold text-sm text-slate-800">{t.patientDetailsCard}</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-semibold text-slate-800">{result.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.age}:</span>
              <span className="font-semibold text-slate-800">{result.patientAge}</span>
            </div>
            {result.medicalHistory && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-0.5">Relevant Medical History:</span>
                <span className="text-slate-700 italic bg-slate-50 p-2 rounded-lg block">
                  {result.medicalHistory}
                </span>
              </div>
            )}
            {result.currentMedications && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-0.5">Current Medications:</span>
                <span className="text-slate-700 italic bg-slate-50 p-2 rounded-lg block">
                  {result.currentMedications}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Reported Concern Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-800">{t.reportedConcernCard}</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Primary Concern:</span>
              <span className="font-bold text-slate-900 bg-primary-50/70 text-primary-800 px-2.5 py-1 rounded-md inline-block">
                {result.reportedConcern}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 block mb-0.5">Reported Symptoms:</span>
              <p className="text-slate-700 bg-slate-50 p-2 rounded-lg leading-relaxed">
                {result.symptoms}
              </p>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-800">{result.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Doctor Specialty Hero Card */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-teal-900 text-white rounded-3xl p-7 sm:p-9 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-teal-300 font-bold">
                {t.recommendedSpecialty}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {result.recommendedSpecialty}
              </h2>
            </div>
          </div>

          {!result.isEmergency && (
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookAppointmentWithSpecialist}</span>
            </button>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.specialtyReason}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
            {result.specialtyExplanation}
          </p>
        </div>
      </div>

      {/* Clinical Guidance: Precautions, Things to Avoid & Warning Signs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Precautions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
              {t.generalPrecautions}
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {result.precautions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Things to Avoid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
              {t.thingsToAvoid}
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {result.thingsToAvoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warning Signs Requiring Urgent Care */}
        <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-rose-200 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-xs text-rose-900 uppercase tracking-wide">
              {t.warningSigns}
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-rose-950 font-medium">
            {result.warningSigns.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fall Prevention Guidance for Senior Module */}
      {result.fallPreventionGuidance && result.fallPreventionGuidance.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-amber-900">
            <Footprints className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-sm">{t.fallPreventionGuidance}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-900">
            {result.fallPreventionGuidance.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-700">{idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <HeartHandshake className="w-4 h-4 text-teal-600" />
          <span>Need further clarification? You can ask our AI Health Copilot or browse doctor schedules.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/modules/${result.moduleType}`)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {t.editDetails}
          </button>
          {!result.isEmergency && (
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition shadow-md shadow-primary-500/20"
            >
              {t.bookNow}
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          doctor={matchedDoctor}
          initialPatientName={result.patientName}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
