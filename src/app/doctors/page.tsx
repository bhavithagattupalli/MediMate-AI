'use client';

import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  MapPin, 
  Video, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  UserCheck, 
  Languages as LangIcon,
  ShieldCheck,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Doctor } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { BookingModal } from '@/components/BookingModal';

export default function DoctorDirectoryPage() {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [retiredFilter, setRetiredFilter] = useState<'all' | 'active' | 'retired'>('all');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, selectedType, retiredFilter]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSpecialty !== 'all') params.set('specialty', selectedSpecialty);
      if (selectedType !== 'all') params.set('type', selectedType);
      if (retiredFilter !== 'all') params.set('retired', retiredFilter);
      if (searchQuery.trim()) params.set('q', searchQuery);

      const res = await fetch(`/api/doctors?${params.toString()}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (e) {
      console.error('Failed to load doctors', e);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'all',
    'Gynecologist',
    'Urologist',
    'Pediatrician',
    'Geriatrician',
    'Cardiologist',
    'Dermatologist',
    'Orthopedic',
    'Endocrinologist',
    'General Physician',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.doctorDirectoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verified practicing clinicians and distinguished senior retired doctors with official medical council certifications.
          </p>
        </div>

        {/* Doctor Status Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl text-xs font-bold shrink-0">
          <button
            onClick={() => setRetiredFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              retiredFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Clinicians
          </button>
          <button
            onClick={() => setRetiredFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              retiredFilter === 'active'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Practicing
          </button>
          <button
            onClick={() => setRetiredFilter('retired')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              retiredFilter === 'retired'
                ? 'bg-gradient-to-r from-amber-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-200" />
            <span>Retired & Senior Emeritus</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, council reg. number, specialty, or certification..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="md:w-60">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            >
              <option value="all">{t.allSpecialties}</option>
              {specialties.filter((s) => s !== 'all').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Dropdown */}
          <div className="md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
            >
              <option value="all">{t.allTypes}</option>
              <option value="In-person">{t.inPerson}</option>
              <option value="Online">{t.onlineConsultation}</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Stethoscope className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading specialist & senior emeritus directory...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Specialists Matched</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria, specialty filter, or status selection to view available clinicians.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('all');
              setSelectedType('all');
              setRetiredFilter('all');
            }}
            className="text-xs text-primary-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`rounded-3xl border p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-5 ${
                doc.isRetired
                  ? 'bg-gradient-to-b from-amber-50/40 via-white to-slate-50/50 border-amber-200/90 ring-1 ring-amber-100'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Name, Age, Status Tag & Avatar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${
                      doc.isRetired 
                        ? 'bg-gradient-to-tr from-amber-600 via-orange-600 to-indigo-700 text-white shadow-amber-500/20' 
                        : 'bg-gradient-to-tr from-primary-600 to-teal-500 text-white'
                    }`}>
                      {doc.isRetired ? <Award className="w-6 h-6 text-amber-200" /> : doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-slate-700">
                          Age: <span className="text-primary-700">{doc.age} yrs</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {doc.experienceYears}+ yrs practice
                        </span>
                      </div>
                      <p className="text-xs font-medium text-teal-800 mt-1">
                        {doc.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {doc.isVerified ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-full">
                        {t.demoDoctor}
                      </span>
                    )}

                    {doc.isRetired && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <Award className="w-3 h-3 text-amber-700" />
                        <span>Retired Emeritus</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Callout for Retired vs Practicing */}
                <div className={`p-2.5 rounded-2xl text-[11px] flex items-center justify-between border ${
                  doc.isRetired
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-primary-50/50 border-primary-100 text-primary-900'
                }`}>
                  <span className="font-bold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{doc.doctorStatus}</span>
                  </span>
                  {doc.retiredYearsAgo && (
                    <span className="text-[10px] font-medium text-amber-700 bg-white/70 px-2 py-0.5 rounded-full">
                      Retired ~{doc.retiredYearsAgo} yrs ago
                    </span>
                  )}
                </div>

                {/* Original Certification & Medical Council Registration Badge */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                      Original Medical Registration
                    </span>
                    <span className="text-[10px] font-mono font-bold text-primary-800 bg-white border border-primary-200 px-2 py-0.5 rounded-md">
                      {doc.registrationNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    <span className="font-semibold text-slate-900 block text-[10px] text-slate-500">Board Certification & Fellowships:</span>
                    <p className="font-medium text-slate-800 mt-0.5">{doc.originalCertification}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">Auth: {doc.certifyingAuthority}</span>
                  </div>
                </div>

                {/* Qualifications & Hospital */}
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Degrees:</span> {doc.qualifications}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.hospital}</span>
                  </p>
                </div>

                {/* Scope of Senior Advice for Retired Doctors */}
                {doc.seniorConsultationScope && (
                  <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-950">
                    <span className="font-bold block text-indigo-800 text-[10px] uppercase">
                      Senior Consultation Scope:
                    </span>
                    <p className="mt-0.5 text-slate-700 leading-relaxed font-medium">
                      {doc.seniorConsultationScope}
                    </p>
                  </div>
                )}

                {/* Availability, Modes & Fee */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Availability</span>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {doc.availability.slice(0, 3).join(', ')}...
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">{t.fee}</span>
                    <span className="font-bold text-teal-700 text-xs">
                      ₹{doc.fee} / consultation
                    </span>
                  </div>
                </div>

                {/* Consultation Types & Languages */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {doc.consultationTypes.map((type) => (
                    <span
                      key={type}
                      className="text-[10px] bg-teal-50 text-teal-800 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      {type === 'Online' ? <Video className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                      <span>{type}</span>
                    </span>
                  ))}
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <LangIcon className="w-2.5 h-2.5" />
                    <span>{doc.languages.join(', ')}</span>
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setBookingDoctor(doc)}
                  className={`w-full py-2.5 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                    doc.isRetired
                      ? 'bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{doc.isRetired ? 'Consult Senior Emeritus Doctor' : t.bookNow}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}
    </div>
  );
}
