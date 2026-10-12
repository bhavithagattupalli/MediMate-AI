'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowLeft, Send, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function MensHealthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [patientName, setPatientName] = useState(user?.fullName || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [selectedConcern, setSelectedConcern] = useState('Urinary Difficulty or Frequency');
  const [customConcern, setCustomConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonConcerns = [
    'Urinary Difficulty or Frequency',
    'Reproductive & Sexual Health Concerns',
    'Prostate Wellness & Nighttime Urination',
    'Skin Rashes, Hair Loss or Alopecia',
    'Chest Tightness, Palpitations & Fatigue',
    'General Health, Fitness & Vitality',
    'Other Custom Health Concern',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveProblem = selectedConcern === 'Other Custom Health Concern' ? customConcern : selectedConcern;

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
          moduleType: 'mens',
          patientName,
          age,
          healthProblem: effectiveProblem,
          symptoms,
          duration,
          medicalHistory,
          currentMedications,
          sex: 'Male',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit assessment.');
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
        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200">
          Module 2 of 4
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-primary-600 to-cyan-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.mensHealthTitle}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            {t.mensHealthDesc}
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

          {/* Patient Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.fullName} <span className="text-primary-600">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.age} ({t.years}) <span className="text-primary-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 35"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                required
              />
            </div>
          </div>

          {/* Health Concern Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.healthProblem} <span className="text-primary-600">*</span>
            </label>
            <select
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            >
              {commonConcerns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Concern Input */}
          {(selectedConcern === 'Other Custom Health Concern' || selectedConcern === 'General Health, Fitness & Vitality') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Concern Details <span className="text-primary-600">*</span>
              </label>
              <input
                type="text"
                value={customConcern}
                onChange={(e) => setCustomConcern(e.target.value)}
                placeholder={t.customProblemPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
            </div>
          )}

          {/* Symptoms and Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.symptoms} <span className="text-primary-600">*</span>
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Burning sensation when urinating, frequent urination at night, fatigue..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.duration} <span className="text-primary-600">*</span>
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder={t.durationPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              required
            />
          </div>

          {/* Optional Medical History & Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.medicalHistoryOptional}
              </label>
              <textarea
                rows={2}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="e.g. Hypertension, kidney stones, previous surgeries..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition resize-none"
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
                placeholder="e.g. Telmisartan 40mg, Finasteride, Protein supplements..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition resize-none"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <span>
              Your sensitive health records are strictly confidential and protected by role-based data encryption.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-600/25 transition-all flex items-center justify-center gap-2"
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
