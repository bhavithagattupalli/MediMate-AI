'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCheck, ArrowLeft, Send, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function SeniorHealthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [patientName, setPatientName] = useState(user?.fullName || '');
  const [age, setAge] = useState(user?.age && user.age > 50 ? String(user.age) : '58');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Prefer not to say'>('Male');
  const [selectedConcern, setSelectedConcern] = useState('Joint Pain, Knee Arthritis & Mobility');
  const [customConcern, setCustomConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonConcerns = [
    'Joint Pain, Knee Arthritis & Mobility',
    'Blood Pressure Fluctuations & Heart Palpitations',
    'Blood Sugar / Diabetes Management & Fatigue',
    'Balance Issues, Dizziness & Unsteadiness',
    'Memory Lapses, Sleep Changes & Cognitive Vitality',
    'Digestive & Bowel Regularity Issues',
    'Comprehensive Senior Health & Geriatric Review',
    'Other Senior Health Concern',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAge = Number(age);
    if (!patientName.trim()) {
      setError(t.errNameRequired);
      return;
    }
    if (isNaN(numericAge) || numericAge <= 50) {
      setError(t.errSeniorAge);
      return;
    }
    const effectiveProblem = selectedConcern === 'Other Senior Health Concern' ? customConcern : selectedConcern;
    if (!effectiveProblem.trim()) {
      setError(t.errProblemRequired);
      return;
    }
    if (!symptoms.trim()) {
      setError(t.errSymptomsRequired);
      return;
    }
    if (!duration.trim()) {
      setError(t.errDurationRequired);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/modules/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          moduleType: 'senior',
          patientName,
          age: numericAge,
          sex,
          healthProblem: effectiveProblem,
          symptoms,
          duration,
          medicalHistory: medicalConditions,
          currentMedications,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit senior health assessment.');
      } else {
        sessionStorage.setItem('medimate_latest_result', JSON.stringify(data.triageResult));
        router.push(`/results?ref=${data.recordId}`);
      }
    } catch (err: any) {
      setError('Network error while analyzing clinical concern. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </Link>
        <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
          Module 4 of 4 (Age 50+)
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.seniorHealthTitle}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
            {t.seniorHealthDesc}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Name, Age & Sex */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.fullName} <span className="text-amber-600">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Balasubramanian S"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.age} (&gt; 50 {t.years}) <span className="text-amber-600">*</span>
              </label>
              <input
                type="number"
                min="51"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Must be > 50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Calibrated for adults &gt; 50</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.sex} <span className="text-amber-600">*</span>
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              >
                <option value="Male">{t.sexMale}</option>
                <option value="Female">{t.sexFemale}</option>
                <option value="Prefer not to say">{t.sexPreferNotToSay}</option>
              </select>
            </div>
          </div>

          {/* Health Concern Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.healthProblem} <span className="text-amber-600">*</span>
            </label>
            <select
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            >
              {commonConcerns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Concern Input */}
          {selectedConcern === 'Other Senior Health Concern' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Health Concern Details <span className="text-amber-600">*</span>
              </label>
              <input
                type="text"
                value={customConcern}
                onChange={(e) => setCustomConcern(e.target.value)}
                placeholder={t.customProblemPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          )}

          {/* Symptoms and Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.symptoms} <span className="text-amber-600">*</span>
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Stiffness and deep aching in both knees especially in the morning, unsteady when climbing stairs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.duration} <span className="text-amber-600">*</span>
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. Gradually worsening over 3 months..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              required
            />
          </div>

          {/* Medical Conditions & Current Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Existing Medical Conditions (Optional)
              </label>
              <textarea
                rows={2}
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="e.g. Hypertension (10 years), Type 2 Diabetes, mild Osteoarthritis..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Medications & Supplements (Optional)
              </label>
              <textarea
                rows={2}
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder="e.g. Amlodipine 5mg, Glimepiride 1mg, Calcium + Vitamin D3..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none"
              />
            </div>
          </div>

          {/* Geriatric Safety Callout */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              This module includes comprehensive fall-prevention screening and geriatric specialist matching tailored to maintain autonomy and vitality in older adults.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t.submitting}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.submitButton}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
