export type Language = 'en' | 'te' | 'hi' | 'ta';

export type ModuleType = 'womens' | 'mens' | 'children' | 'senior';

export interface Doctor {
  id: string;
  name: string;
  age: number;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  isVerified: boolean;
  isDemo: boolean;
  isRetired: boolean;
  doctorStatus: 'Practicing Specialist' | 'Retired Senior Consultant (Honorary)' | 'Emeritus Professor & Senior Advisor';
  registrationNumber: string;
  originalCertification: string;
  certifyingAuthority: string;
  retiredYearsAgo?: number;
  seniorConsultationScope?: string;
  availability: string[];
  timeSlots: string[];
  consultationTypes: ('In-person' | 'Online')[];
  hospital: string;
  rating: number;
  fee: number;
  languages: string[];
  imageUrl?: string;
}

export interface TriageResult {
  patientName: string;
  patientAge: string | number;
  moduleType: ModuleType;
  reportedConcern: string;
  symptoms: string;
  duration: string;
  medicalHistory?: string;
  currentMedications?: string;
  recommendedSpecialty: string;
  specialtyExplanation: string;
  precautions: string[];
  thingsToAvoid: string[];
  warningSigns: string[];
  isEmergency: boolean;
  emergencyReason?: string;
  fallPreventionGuidance?: string[];
  timestamp: string;
}

export interface Appointment {
  id: string;
  bookingRef: string;
  userId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  timeSlot: string;
  consultationType: 'In-person' | 'Online';
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  age?: number;
  phone?: string;
  gender?: string;
  consentGiven: boolean;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  userId?: string;
  moduleType: ModuleType;
  patientName: string;
  age: string | number;
  guardianName?: string;
  healthProblem: string;
  symptoms: string;
  duration: string;
  medicalHistory?: string;
  currentMedications?: string;
  sex?: string;
  triageResult: TriageResult;
  createdAt: string;
}

export interface ReportMetric {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'abnormal' | 'critical';
  significance: string;
}

export interface ScannedReport {
  id: string;
  userId?: string;
  title: string;
  reportType: 'Blood Test / CBC' | 'Lipid & Metabolic Profile' | 'Thyroid Function' | 'Urine Analysis' | 'Custom Lab Report';
  patientName: string;
  date: string;
  overallSummary: string;
  overallStatus: 'normal' | 'requires_attention' | 'critical';
  metrics: ReportMetric[];
  doctorRecommendation: string;
  lifestyleAdvice: string[];
  warningNotice?: string;
  createdAt: string;
}

export interface VitalsLog {
  id: string;
  userId?: string;
  recordedAt: string;
  bpSystolic: number;
  bpDiastolic: number;
  bpStatus: 'Optimal' | 'Normal' | 'Elevated' | 'Stage 1 HTN' | 'Stage 2 HTN';
  bloodSugar: number;
  sugarType: 'Fasting' | 'Post-Prandial' | 'Random';
  sugarStatus: 'Normal' | 'Prediabetes' | 'Elevated' | 'Hypoglycemia';
  heartRate: number;
  heartRateStatus: 'Normal' | 'Bradycardia' | 'Tachycardia';
  spO2: number;
  spO2Status: 'Normal' | 'Borderline' | 'Low (Urgent)';
  temperature: number;
  temperatureUnit: 'F' | 'C';
  tempStatus: 'Normal' | 'Mild Fever' | 'High Fever';
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  bmiStatus?: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  notes?: string;
}

