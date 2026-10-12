'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ArrowLeft, Send, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function WomensHealthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [patientName, setPatientName] = useState(user?.fullName || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [selectedConcern, setSelectedConcern] = useState('Menstrual Irregularities & Cramps');
  const [customConcern, setCustomConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonConcerns = [
    'Menstrual Irregularities & Cramps',
    'PCOS / Hormonal Imbalance',
    'Pregnancy & Prenatal Symptoms',
    'Menopause & Perimenopause Symptoms',
    'Breast Changes or Tenderness',
    'Pelvic Pain or Vaginal Discomfort',
    'General Female Wellness & Vitality',
    'Other Custom Concern',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveProblem = selectedConcern === 'Other Custom Concern' ? customConcern : selectedConcern;

    if (!patientName.trim()) {
      setError(t.errNameRequired);
      return;
    }
    if (!age || Number(age) <= 0) {
      setError(t.errAgeRequired);
      return;
    }
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
          moduleType: 'womens',
          patientName,
          age,
          healthProblem: effectiveProblem,
          symptoms,
          duration,
          medicalHistory,
          currentMedications,
          sex: 'Female',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit clinical assessment.');
      } else {
        // Store in sessionStorage and navigate to /results
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
        <span className="text-xs bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
          Module 1 of 4
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Heart className="w-8 h-8 text-white fill-white/20" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.womensHealthTitle}
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 max-w-2xl leading-relaxed">
            {t.womensHealthDesc}
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Details: Name and Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.fullName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.age} ({t.years}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                required
              />
            </div>
          </div>

          {/* Health Concern Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.healthProblem} <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            >
              {commonConcerns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Concern Input */}
          {(selectedConcern === 'Other Custom Concern' || selectedConcern === 'General Female Wellness & Vitality') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Concern Details <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customConcern}
                onChange={(e) => setCustomConcern(e.target.value)}
                placeholder={t.customProblemPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              />
            </div>
          )}

          {/* Symptoms and Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.symptoms} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t.symptomsPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.duration} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder={t.durationPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              required
            />
          </div>

          {/* Optional Medical History & Current Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.medicalHistoryOptional}
              </label>
              <textarea
                rows={2}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder={t.medicalHistoryPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.currentMedicationsOptional}
              </label>
              <textarea
                rows={2}
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder={t.currentMedicationsPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition resize-none"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <span>
              Your health information is stored securely with HIPAA-aligned access isolation. Only authorized clinical triage results are generated.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
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
