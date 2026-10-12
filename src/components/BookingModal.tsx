'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  MapPin, 
  Video, 
  FileText 
} from 'lucide-react';
import { Doctor, Appointment } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface BookingModalProps {
  doctor: Doctor | null;
  initialPatientName?: string;
  onClose: () => void;
  onSuccess?: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  initialPatientName = '',
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [patientName, setPatientName] = useState(initialPatientName || user?.fullName || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [consultationType, setConsultationType] = useState<'In-person' | 'Online'>('In-person');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setDate(dateStr);
    if (doctor && doctor.timeSlots.length > 0) {
      setTimeSlot(doctor.timeSlots[0]);
    }
  }, [doctor]);

  if (!doctor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!patientName.trim()) {
      setError(t.errNameRequired);
      return;
    }
    if (!date) {
      setError('Please select a preferred appointment date.');
      return;
    }
    if (!timeSlot) {
      setError('Please select an available time slot.');
      return;
    }
    if (!patientPhone.trim() && !patientEmail.trim()) {
      setError('Please provide either a phone number or an email address.');
      return;
    }

    setLoading(true);
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
          doctorId: doctor.id,
          date,
          timeSlot,
          consultationType,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to complete appointment booking.');
      } else {
        setConfirmedAppointment(data.appointment);
        if (onSuccess) onSuccess(data.appointment);
      }
    } catch (err: any) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">{t.bookNow}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Confirmed State */}
          {confirmedAppointment ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{t.bookingSuccessTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">{t.bookingSuccessDesc}</p>
              </div>

              {/* Reference Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{t.bookingRef}:</span>
                  <span className="font-mono font-bold text-primary-700">
                    {confirmedAppointment.bookingRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-semibold text-slate-800">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Specialty:</span>
                  <span className="text-slate-700">{doctor.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-semibold text-slate-800">
                    {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-semibold text-teal-700">
                    {confirmedAppointment.consultationType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="text-slate-800">{confirmedAppointment.patientName}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Doctor Summary Card */}
              <div className="bg-primary-50/60 border border-primary-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{doctor.name}</h4>
                    {doctor.age && (
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                        Age: {doctor.age} yrs
                      </span>
                    )}
                    {doctor.isRetired ? (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                        Retired Emeritus
                      </span>
                    ) : doctor.isVerified ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {t.verifiedDoctor}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        {t.demoDoctor}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-primary-800 font-bold">{doctor.specialty}</p>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <p className="font-mono text-primary-900 font-semibold">Reg: {doctor.registrationNumber}</p>
                    <p className="truncate text-slate-600">Cert: {doctor.originalCertification}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{doctor.hospital}</p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Consultation Type Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.filterType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-person')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      consultationType === 'In-person'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                    <span>{t.inPerson}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('Online')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      consultationType === 'Online'
                        ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t.onlineConsultation}</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.preferredDate}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.availableSlot}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  >
                    {doctor.timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  required
                />
              </div>

              {/* Contact Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.contactPhone}
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.contactEmail}
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Consultation Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Concern or Brief Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention any specific concerns you'd like the doctor to review in advance..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-primary-500/20"
                >
                  {loading ? 'Validating Slot...' : t.confirmBooking}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
