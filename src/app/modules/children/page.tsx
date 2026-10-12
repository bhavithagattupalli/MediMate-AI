'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Baby, ArrowLeft, Send, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function ChildrenHealthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [childName, setChildName] = useState('');
  const [ageYears, setAgeYears] = useState('3');
  const [ageMonths, setAgeMonths] = useState('6');
  const [guardianName, setGuardianName] = useState(user?.fullName || '');
  const [selectedConcern, setSelectedConcern] = useState('Fever, Cold or Respiratory Infection');
  const [customConcern, setCustomConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonConcerns = [
    'Fever, Cold or Respiratory Infection',
    'Persistent Cough or Wheezing Sound',
    'Ear Pain, Tugging Ear or Ear Discharge',
    'Stomach Ache, Vomiting or Loose Stools',
    'Skin Rashes, Itchiness or Eczema',
    'Poor Appetite or Feeding Difficulties',
    'Growth, Milestones & Developmental Check',
    'Other Pediatric Concern',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveProblem = selectedConcern === 'Other Pediatric Concern' ? customConcern : selectedConcern;

    if (!childName.trim()) {
      setError("Child's full name is required.");
      return;
    }
    if (!guardianName.trim()) {
      setError(t.errGuardianRequired);
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

    const formattedAge = `${ageYears} yrs ${ageMonths} mos`;

    setLoading(true);
    try {
      const res = await fetch('/api/modules/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          moduleType: 'children',
          patientName: childName,
          age: formattedAge,
          guardianName,
          healthProblem: effectiveProblem,
          symptoms,
          duration,
          medicalHistory,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit pediatric assessment.');
      } else {
        sessionStorage.setItem('medimate_latest_result', JSON.stringify(data.triageResult));
        router.push(`/results?ref=${data.recordId}`);
      }
    } catch (err: any) {
      setError('Network error while analyzing pediatric symptoms. Please try again.');
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
        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
          Module 3 of 4
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Baby className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.childrenHealthTitle}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            {t.childrenHealthDesc}
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

          {/* Child Name & Guardian Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Child's Full Name <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Aarav Patel"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.parentGuardianName} <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Meera Patel (Mother)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                required
              />
            </div>
          </div>

          {/* Child Age in Years and Months */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Child's Age (Years & Months) <span className="text-teal-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="17"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400">
                    {t.years}
                  </span>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400">
                    {t.months}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Concern Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.healthProblem} <span className="text-teal-600">*</span>
            </label>
            <select
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            >
              {commonConcerns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Concern Input */}
          {selectedConcern === 'Other Pediatric Concern' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Concern Details <span className="text-teal-600">*</span>
              </label>
              <input
                type="text"
                value={customConcern}
                onChange={(e) => setCustomConcern(e.target.value)}
                placeholder={t.customProblemPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          )}

          {/* Symptoms and Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.symptoms} <span className="text-teal-600">*</span>
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe child's symptoms: e.g. Fever of 100.5°F, runny nose, irritability, reduced milk/water intake..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.duration} <span className="text-teal-600">*</span>
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. Started yesterday evening, 2 days..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              required
            />
          </div>

          {/* Relevant Pediatric History */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.medicalHistoryOptional}
            </label>
            <textarea
              rows={2}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="e.g. Birth history, known allergies, vaccinations up to date, febrile seizures..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-none"
            />
          </div>

          {/* Strict Pediatric Medication Safety Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pediatric Medication Safety Mandate</p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                MediMate AI strictly prohibits recommending unverified medication dosages or adult pharmaceuticals for children. Our system matches with verified Pediatricians for safe weight-calibrated clinical oversight.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
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
