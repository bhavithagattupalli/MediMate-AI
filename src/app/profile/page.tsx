'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Calendar, 
  FileText, 
  Settings, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  LogOut, 
  ArrowRight, 
  Stethoscope,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment, HealthRecord } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, updateUserProfile, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'appointments' | 'records' | 'settings'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Edit profile state
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected record modal
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setEditName(user.fullName || '');
      setEditAge(user.age ? String(user.age) : '');
      setEditPhone(user.phone || '');
      setEditGender(user.gender || 'Male');
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const [aptRes, recRes] = await Promise.all([
        fetch('/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/records', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const aptData = await aptRes.json();
      const recData = await recRes.json();

      setAppointments(aptData.appointments || []);
      setRecords(recData.records || []);
    } catch (err) {
      console.error('Failed to load user records', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId: id, action: 'cancel' }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
        );
      }
    } catch (err) {
      console.error('Failed cancelling appointment', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    const ok = await updateUserProfile({
      fullName: editName,
      age: editAge ? Number(editAge) : undefined,
      phone: editPhone,
      gender: editGender,
    });
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="py-20 text-center space-y-3">
        <Activity className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Accessing secure patient records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Patient Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.fullName}</h1>
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                <span>Consent Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
              {user.age && <span>Age: {user.age} yrs</span>}
              {user.gender && <span>• {user.gender}</span>}
              {user.phone && <span>• {user.phone}</span>}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.navLogout}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'appointments'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'records'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Health Assessment History ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {loadingData ? (
            <p className="text-xs text-slate-400 py-8 text-center">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Appointments Booked Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a verified doctor from the directory or through our clinical module assessments.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>{t.navBookAppointment}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                        {apt.bookingRef}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{apt.doctorName}</h4>
                      <p className="text-xs text-slate-500">{apt.specialty}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {apt.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Time:</span>
                      <span className="font-semibold text-slate-800">
                        {apt.date} • {apt.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mode:</span>
                      <span className="font-semibold text-teal-700">{apt.consultationType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient:</span>
                      <span className="text-slate-800">{apt.patientName}</span>
                    </div>
                  </div>

                  {apt.status === 'confirmed' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Health Records */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {loadingData ? (
            <p className="text-xs text-slate-400 py-8 text-center">Loading personal records...</p>
          ) : records.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Assessment Records Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit an assessment in any of the 4 health modules on the dashboard to store personalized clinical triage records.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>Go to Dashboard Modules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {rec.moduleType} Module
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {rec.healthProblem}
                      </h4>
                      <p className="text-xs text-slate-500">Patient: {rec.patientName} ({rec.age})</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Recommended Specialty:</span>
                      <span className="font-bold text-primary-700">
                        {rec.triageResult?.recommendedSpecialty || 'General Physician'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Reported Symptoms:</span>
                      <p className="text-slate-700 line-clamp-2 text-[11px] leading-relaxed">
                        {rec.symptoms}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-bold hover:underline"
                    >
                      View Full Assessment & Precautions &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-xl">
          <h3 className="font-bold text-base text-slate-900 mb-4">Edit Profile Information</h3>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-y-auto max-h-[85vh] space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {selectedRecord.moduleType} Assessment
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  {selectedRecord.healthProblem}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-primary-50 p-3 rounded-xl border border-primary-100">
                <span className="font-bold text-primary-900 block">Recommended Specialty:</span>
                <span className="text-primary-800 font-semibold">
                  {selectedRecord.triageResult?.recommendedSpecialty}
                </span>
                <p className="text-slate-600 mt-1">
                  {selectedRecord.triageResult?.specialtyExplanation}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">Reported Symptoms:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg mt-0.5">
                  {selectedRecord.symptoms} (Duration: {selectedRecord.duration})
                </p>
              </div>

              {selectedRecord.triageResult?.precautions && (
                <div>
                  <span className="font-bold text-emerald-800 block">Precautions:</span>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 mt-1">
                    {selectedRecord.triageResult.precautions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
