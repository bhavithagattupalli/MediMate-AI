'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowLeft, 
  Stethoscope, 
  Calendar, 
  Printer, 
  Activity,
  FileCheck2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { ScannedReport } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { BookingModal } from '@/components/BookingModal';

export default function ReportScannerPage() {
  const { t } = useLanguage();
  const { token, user } = useAuth();

  const [reportText, setReportText] = useState('');
  const [patientName, setPatientName] = useState(user?.fullName || 'Patient');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScannedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const presets = [
    {
      id: 'cbc_sample',
      title: '🩸 Complete Blood Count (CBC)',
      desc: 'Simulates sample blood test with low hemoglobin & mild elevated WBC',
      badge: 'Hematology Panel'
    },
    {
      id: 'lipid_sample',
      title: '🧪 Diabetic & Lipid Panel',
      desc: 'Simulates elevated fasting blood sugar, high HbA1c & high cholesterol',
      badge: 'Cardiometabolic'
    },
    {
      id: 'thyroid_sample',
      title: '🦋 Thyroid Function (TFT)',
      desc: 'Simulates elevated TSH hormone pointing towards subclinical hypothyroidism',
      badge: 'Endocrinology'
    }
  ];

  const handleSelectPreset = async (presetId: string) => {
    setSelectedPreset(presetId);
    setError(null);
    setIsScanning(true);

    try {
      const res = await fetch('/api/scanner/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ preset: presetId, patientName })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to analyze sample report.');
      } else {
        setResult(data.report);
      }
    } catch (err: any) {
      setError('Network communication error while analyzing report.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) {
      setError('Please enter or paste medical lab test text, or select one of the sample presets below.');
      return;
    }

    setError(null);
    setIsScanning(true);

    try {
      const res = await fetch('/api/scanner/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ reportText, patientName })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Analysis failed.');
      } else {
        setResult(data.report);
      }
    } catch (err: any) {
      setError('Network error during report scanning.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setReportText(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </Link>
        <span className="text-xs bg-teal-50 text-teal-800 font-bold px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
          <span>AI Medical Report Scanner</span>
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-800 via-teal-700 to-indigo-900 text-white rounded-3xl p-6 sm:p-9 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biomarker Extraction & Clinical Interpretation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Medical Lab & Prescription Report Scanner
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 leading-relaxed">
            Upload or paste your medical laboratory reports (CBC, Lipid Panel, Blood Sugar, Thyroid TFT) for instant automated biomarker extraction, risk stratification, and specialist referral.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/monitoring"
            className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow hover:bg-primary-50 transition"
          >
            Health Vitals Dashboard &rarr;
          </Link>
        </div>
      </div>

      {/* 1-Click Hackathon Sample Presets Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>1-Click Hackathon Demo Reports (Instant Evaluation)</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Click any sample to test live analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              disabled={isScanning}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 hover:border-primary-400 hover:shadow-md ${
                selectedPreset === p.id
                  ? 'border-primary-600 bg-primary-50/70 ring-2 ring-primary-500/20'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{p.title}</h4>
                  <span className="text-[9px] bg-white border border-slate-200 font-semibold px-2 py-0.5 rounded-full text-slate-600">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
              <span className="text-[11px] font-bold text-primary-700 flex items-center gap-1 pt-1">
                <span>Scan this report</span>
                <span>&rarr;</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload & Manual Paste Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-slate-900">Upload or Paste Custom Lab Report</h3>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleManualScan} className="space-y-4">
          {/* File Drag/Drop area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-2xl p-6 text-center bg-slate-50/50 transition">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-xs font-bold text-primary-600 hover:underline">
                Upload Report File (Text, Lab Slip, or PDF export)
              </span>
              <input
                type="file"
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">or paste the raw report text in the box below</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Report Text or Laboratory Excerpt
            </label>
            <textarea
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="e.g. Hemoglobin: 11.2 g/dL, Fasting Sugar: 142 mg/dL, Total Cholesterol: 240 mg/dL, TSH: 8.6 uIU/mL..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition resize-none font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              HIPAA compliant automated extraction with clinical guardrails.
            </span>
            <button
              type="submit"
              disabled={isScanning}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Biomarkers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Scan & Interpret Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ANALYSIS RESULT DISPLAY */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Header Status Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                {result.reportType}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {result.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Scanned on {result.date} for {result.patientName}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs ${
                result.overallStatus === 'normal'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : result.overallStatus === 'requires_attention'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300'
                  : 'bg-rose-50 text-rose-900 border border-rose-300'
              }`}>
                {result.overallStatus === 'normal' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                <span className="uppercase tracking-wider">
                  {result.overallStatus === 'normal' ? 'Normal Baseline' : 'Requires Attention'}
                </span>
              </span>
            </div>
          </div>

          {/* Clinical Synthesis Summary */}
          <div className="bg-primary-50/70 border border-primary-100 rounded-2xl p-5 space-y-1.5">
            <h4 className="font-bold text-xs text-primary-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>AI Clinical Summary & Diagnostic Interpretation</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {result.overallSummary}
            </p>
          </div>

          {/* Biomarkers Table / Cards */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Extracted Biomarkers & Reference Ranges</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{m.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-lg font-black text-slate-900">{m.value}</span>
                        <span className="text-xs font-semibold text-slate-500">{m.unit}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      m.status === 'normal'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : m.status === 'borderline'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="border-t border-slate-200/60 pt-2 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Standard Reference:</span>
                      <span className="font-semibold text-slate-700">{m.referenceRange} {m.unit}</span>
                    </div>
                    <p className="text-slate-600 italic leading-snug">{m.significance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialist Referral & Action */}
          <div className="bg-gradient-to-r from-slate-900 to-primary-950 text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 max-w-xl">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Recommended Specialist Consultation
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <span>{result.doctorRecommendation}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our verified specialists to review these lab findings, receive formal clinical evaluation, or request a second opinion.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={`/doctors?specialty=${encodeURIComponent(result.doctorRecommendation)}`}
                className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Specialist Consultation</span>
              </Link>
            </div>
          </div>

          {/* Lifestyle Guidelines */}
          {result.lifestyleAdvice && result.lifestyleAdvice.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Evidence-Informed Lifestyle & Nutritional Steps
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.lifestyleAdvice.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isBookingModalOpen && (
        <BookingModal
          doctor={null}
          initialPatientName={patientName}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
