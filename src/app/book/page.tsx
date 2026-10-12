'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  MapPin, 
  Video, 
  ArrowLeft 
} from 'lucide-react';
import { Doctor, Appointment } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function BookAppointmentPage() {
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [patientName, setPatientName] = useState(user?.fullName || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [consultationType, setConsultationType] = useState<'In-person' | 'Online'>('In-person');
  const [notes, setNotes] = useState('');

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    // Tomorrow as initial date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);

    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        if (data.doctors && data.doctors.length > 0) {
          setDoctors(data.doctors);
          setSelectedDoctorId(data.doctors[0].id);
          setTimeSlot(data.doctors[0].timeSlots[0] || '10:00 AM');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingDoctors(false));
  }, []);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!patientName.trim()) {
      setError(t.errNameRequired);
      return;
    }
    if (!selectedDoctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (!timeSlot) {
      setError('Please select an appointment time slot.');
      return;
    }
    if (!patientPhone.trim() && !patientEmail.trim()) {
      setError('Please provide a contact phone or email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          patientName,
          patientEmail,
          patientPhone,
          doctorId: selectedDoctorId,
          date,
          timeSlot,
          consultationType,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to confirm booking.');
      } else {
        setConfirmedAppointment(data.appointment);
      }
    } catch (err: any) {
      setError('Network communication error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.navBookAppointment}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reserve an in-person or video consultation with verified specialists.
        </p>
      </div>

      {confirmedAppointment ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t.bookingSuccessTitle}</h2>
            <p className="text-xs text-slate-500 mt-1">{t.bookingSuccessDesc}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2.5">
              <span className="text-slate-500">{t.bookingRef}:</span>
              <span className="font-mono font-bold text-primary-700 text-sm">
                {confirmedAppointment.bookingRef}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-800">{confirmedAppointment.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Specialty:</span>
              <span className="text-slate-700">{confirmedAppointment.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="font-semibold text-slate-800">
                {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consultation Mode:</span>
              <span className="font-semibold text-teal-700">
                {confirmedAppointment.consultationType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="text-slate-800">{confirmedAppointment.patientName}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setConfirmedAppointment(null);
                setNotes('');
              }}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Book Another Appointment
            </button>
            <Link
              href="/profile"
              className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm text-center"
            >
              {t.viewAppointments}
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Clinician & Specialty <span className="text-primary-600">*</span>
              </label>
              {loadingDoctors ? (
                <div className="text-xs text-slate-400 py-2">Loading available doctors...</div>
              ) : (
                <select
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    const doc = doctors.find((d) => d.id === e.target.value);
                    if (doc && doc.timeSlots.length > 0) setTimeSlot(doc.timeSlots[0]);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.isRetired ? '[RETIRED EMERITUS] ' : ''}{d.name} (Age: {d.age} yrs) — {d.specialty}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected Doctor Summary Card */}
            {selectedDoctor && (
              <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                selectedDoctor.isRetired
                  ? 'bg-gradient-to-r from-amber-50/80 to-indigo-50/40 border-amber-200'
                  : 'bg-primary-50/50 border-primary-100'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                    selectedDoctor.isRetired
                      ? 'bg-gradient-to-tr from-amber-600 to-indigo-600'
                      : 'bg-primary-600'
                  }`}>
                    {selectedDoctor.isRetired ? '★' : selectedDoctor.name.charAt(3)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{selectedDoctor.name}</h4>
                      <span className="text-[10px] bg-white border border-slate-200 font-bold px-1.5 py-0.5 rounded text-slate-700">
                        Age: {selectedDoctor.age} yrs
                      </span>
                      {selectedDoctor.isRetired && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                          Senior Emeritus
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-primary-800 font-bold mt-0.5">{selectedDoctor.specialty}</p>
                    <p className="text-[11px] font-mono text-primary-900 mt-1 font-semibold">
                      Reg: {selectedDoctor.registrationNumber} • {selectedDoctor.certifyingAuthority}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Certification: {selectedDoctor.originalCertification}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                  <span className="font-extrabold text-teal-700 text-sm">₹{selectedDoctor.fee}</span>
                </div>
              </div>
            )}

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.filterType}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('In-person')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition ${
                    consultationType === 'In-person'
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>{t.inPerson}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('Online')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition ${
                    consultationType === 'Online'
                      ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-teal-600" />
                  <span>{t.onlineConsultation}</span>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.preferredDate} <span className="text-primary-600">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.availableSlot} <span className="text-primary-600">*</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  required
                >
                  {(selectedDoctor?.timeSlots || ['10:00 AM', '02:00 PM', '04:30 PM']).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.fullName} <span className="text-primary-600">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient full name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                required
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.contactPhone}
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.contactEmail}
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Symptoms or Doctor Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any background details or symptoms..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                {submitting ? 'Confirming Availability...' : t.confirmBooking}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
