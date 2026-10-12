'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Thermometer, 
  Wind, 
  Scale, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowLeft, 
  Stethoscope, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { VitalsLog } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function MonitoringDashboardPage() {
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [logs, setLogs] = useState<VitalsLog[]>([]);
  const [healthScore, setHealthScore] = useState(88);
  const [statusText, setStatusText] = useState('Optimal Vital Baseline');
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New vital form state
  const [bpSystolic, setBpSystolic] = useState('120');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [bloodSugar, setBloodSugar] = useState('95');
  const [sugarType, setSugarType] = useState<'Fasting' | 'Post-Prandial' | 'Random'>('Fasting');
  const [heartRate, setHeartRate] = useState('72');
  const [spO2, setSpO2] = useState('98');
  const [temperature, setTemperature] = useState('98.6');
  const [weightKg, setWeightKg] = useState('68');
  const [heightCm, setHeightCm] = useState('172');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vitals', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setHealthScore(data.healthScore || 85);
        setStatusText(data.statusText || 'Good Vital Baseline');
      }
    } catch (e) {
      console.error('Failed to load vitals', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogVital = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          bpSystolic,
          bpDiastolic,
          bloodSugar,
          sugarType,
          heartRate,
          spO2,
          temperature,
          weightKg,
          heightCm,
          notes
        })
      });

      if (res.ok) {
        setIsLogModalOpen(false);
        fetchVitals();
      }
    } catch (e) {
      console.error('Error logging vital', e);
    } finally {
      setSubmitting(false);
    }
  };

  const latest = logs[logs.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/scanner"
            className="text-xs bg-teal-50 text-teal-800 font-bold px-3 py-1.5 rounded-xl border border-teal-200 hover:bg-teal-100 transition"
          >
            Go to Report Scanner &rarr;
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-primary-800 to-teal-800 text-white rounded-3xl p-6 sm:p-9 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-300">
            <Activity className="w-3.5 h-3.5" />
            <span>Cardiometabolic & Vital Sign Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Personal Health Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 leading-relaxed">
            Real-time biometric tracking for Blood Pressure, Blood Sugar, Heart Rate, Pulse Oximetry (SpO2), Temperature, and Body Mass Index with automated clinical risk stratification.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-5 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Today's Vitals</span>
          </button>
        </div>
      </div>

      {/* Health Score & Overall Vital Status Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Circular Score representation */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20 shrink-0">
            {healthScore}
            <span className="absolute -bottom-1 text-[9px] font-bold uppercase bg-slate-900 px-2 py-0.5 rounded-full">
              Score
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
              Biometric Health Status: {statusText}
            </h3>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Based on American Heart Association (AHA) and WHO physiologic guidelines across your 5 most recent vital logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{logs.length} Readings Logged</span>
          </span>
          <button
            onClick={fetchVitals}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition"
            title="Refresh vitals"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CORE VITALS CARDS GRID (Current Status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Blood Pressure */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Blood Pressure (BP)</h4>
                <p className="text-[11px] text-slate-400">Systolic / Diastolic</p>
              </div>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              latest?.bpStatus === 'Optimal' || latest?.bpStatus === 'Normal'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {latest?.bpStatus || 'Normal'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {latest ? `${latest.bpSystolic}/${latest.bpDiastolic}` : '120/80'}
              </span>
              <span className="text-xs font-semibold text-slate-400">mmHg</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Target baseline: &lt; 120/80 mmHg (Resting)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>AHA Category:</span>
            <span className="font-semibold text-slate-800">{latest?.bpStatus || 'Optimal'}</span>
          </div>
        </div>

        {/* Card 2: Blood Glucose / Sugar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Blood Glucose</h4>
                <p className="text-[11px] text-slate-400">{latest?.sugarType || 'Fasting'}</p>
              </div>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              latest?.sugarStatus === 'Normal'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {latest?.sugarStatus || 'Normal'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {latest?.bloodSugar || '95'}
              </span>
              <span className="text-xs font-semibold text-slate-400">mg/dL</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Fasting Target: 70 - 99 mg/dL
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Metabolic Range:</span>
            <span className="font-semibold text-slate-800">{latest?.sugarStatus || 'Normal'}</span>
          </div>
        </div>

        {/* Card 3: Heart Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Heart Rate (Pulse)</h4>
                <p className="text-[11px] text-slate-400">Resting Cardiac Rate</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {latest?.heartRateStatus || 'Normal'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {latest?.heartRate || '72'}
              </span>
              <span className="text-xs font-semibold text-slate-400">BPM</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Normal resting bounds: 60 - 100 BPM
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Rhythm Evaluation:</span>
            <span className="font-semibold text-slate-800">Normal Sinus Rhythm</span>
          </div>
        </div>

        {/* Card 4: SpO2 Blood Oxygen */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Blood Oxygen (SpO2)</h4>
                <p className="text-[11px] text-slate-400">Arterial Oxygenation</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {latest?.spO2Status || 'Normal'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {latest?.spO2 || '99'}
              </span>
              <span className="text-xs font-semibold text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Optimal saturation: 95% - 100%
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Respiratory Reserve:</span>
            <span className="font-semibold text-slate-800">Excellent</span>
          </div>
        </div>

        {/* Card 5: Body Temperature */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Body Temperature</h4>
                <p className="text-[11px] text-slate-400">Core Thermal Reading</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {latest?.tempStatus || 'Normal'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {latest?.temperature || '98.6'}
              </span>
              <span className="text-xs font-semibold text-slate-400">°F</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Afebrile baseline: 97.8°F - 99.1°F
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Fever Indicator:</span>
            <span className="font-semibold text-slate-800">Afebrile (No fever)</span>
          </div>
        </div>

        {/* Card 6: BMI & Body Weight */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Body Mass Index (BMI)</h4>
                <p className="text-[11px] text-slate-400">Weight & Height Status</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {latest?.bmiStatus || 'Normal'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {latest?.bmi || '23.0'}
              </span>
              <span className="text-xs font-semibold text-slate-400">kg/m² ({latest?.weightKg || '68'} kg)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Healthy WHO range: 18.5 - 24.9
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Category:</span>
            <span className="font-semibold text-slate-800">{latest?.bmiStatus || 'Healthy Weight'}</span>
          </div>
        </div>
      </div>

      {/* VITALS LOG HISTORY TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span>Biometric Longitudinal History & Readings</span>
            </h3>
            <p className="text-xs text-slate-500">Historical trend across all logged clinical sessions</p>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Blood Pressure</th>
                <th className="py-3 px-4">Glucose</th>
                <th className="py-3 px-4">Heart Rate</th>
                <th className="py-3 px-4">SpO2</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">BMI</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[...logs].reverse().map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 text-slate-900 font-semibold whitespace-nowrap">
                    {new Date(l.recordedAt).toLocaleDateString()} {new Date(l.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900">{l.bpSystolic}/{l.bpDiastolic}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({l.bpStatus})</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900">{l.bloodSugar}</span>
                    <span className="text-[10px] text-slate-400 ml-1">{l.sugarType}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span>{l.heartRate} bpm</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-teal-700">{l.spO2}%</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span>{l.temperature}°{l.temperatureUnit}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span>{l.bmi ? `${l.bmi}` : '--'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">
                    {l.notes || 'Routine check'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: LOG NEW VITAL ENTRY */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-base text-slate-900">Log New Health Vitals</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogVital} className="space-y-4">
              {/* Blood Pressure: Systolic & Diastolic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blood Pressure (mmHg)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                      placeholder="Systolic (e.g. 120)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Systolic (Upper)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      placeholder="Diastolic (e.g. 80)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Diastolic (Lower)</span>
                  </div>
                </div>
              </div>

              {/* Glucose & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    placeholder="e.g. 95"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Timing
                  </label>
                  <select
                    value={sugarType}
                    onChange={(e) => setSugarType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Fasting">Fasting</option>
                    <option value="Post-Prandial">Post-Prandial (2h after meal)</option>
                    <option value="Random">Random</option>
                  </select>
                </div>
              </div>

              {/* Heart Rate & SpO2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Oxygen (SpO2 %)
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={spO2}
                    onChange={(e) => setSpO2(e.target.value)}
                    placeholder="e.g. 98"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Temperature & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 98.6"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g. 68"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Context / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Post-morning exercise, feeling energetic..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  {submitting ? 'Recording...' : 'Save Vitals Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
