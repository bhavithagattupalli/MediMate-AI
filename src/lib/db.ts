import fs from 'fs';
import path from 'path';
import { Doctor, Appointment, User, HealthRecord, VitalsLog, ScannedReport } from './types';

interface DatabaseSchema {
  users: User[];
  doctors: Doctor[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  vitals: VitalsLog[];
  scannedReports: ScannedReport[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

export const INITIAL_DOCTORS: Doctor[] = [
  // --- PRACTICING SPECIALISTS ---
  {
    id: 'doc-1',
    name: 'Dr. Priya Sharma, MD',
    age: 42,
    specialty: 'Gynecologist & Obstetrician',
    qualifications: 'MBBS, MS (OBG), Fellowship in Reproductive Medicine',
    experienceYears: 16,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'MCI-REG-2008-049182',
    originalCertification: 'Board Certified in Obstetrics & Gynecology (National Board of Examinations) & Fellowship in Reproductive Endocrinology',
    certifyingAuthority: 'Medical Council of India (MCI) & Indian College of Obstetricians and Gynaecologists',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'Apex Women Care & Maternity Hospital',
    rating: 4.9,
    fee: 800,
    languages: ['English', 'Hindi', 'Telugu'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Venkat, MS',
    age: 46,
    specialty: 'Urologist & Andrologist',
    qualifications: 'MBBS, MS (General Surgery), MCh (Urology)',
    experienceYears: 18,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'APMC-REG-2004-038291',
    originalCertification: 'Master of Chirurgiae (MCh) in Urology & Renal Transplantation Certification',
    certifyingAuthority: 'Andhra Pradesh Medical Council & National Board of Examinations',
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'Metro Kidney & Uro Care Center',
    rating: 4.8,
    fee: 900,
    languages: ['English', 'Telugu', 'Tamil'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Ananya Sundaram, MD',
    age: 39,
    specialty: 'Pediatrician',
    qualifications: 'MBBS, MD (Pediatrics), DNB (Pediatrics)',
    experienceYears: 13,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'TMC-REG-2011-062849',
    originalCertification: 'Diplomate of National Board (DNB) in Pediatrics & Advanced Neonatal Life Support Certified',
    certifyingAuthority: 'Tamil Nadu Medical Council & Indian Academy of Pediatrics',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '06:00 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'Rainbow Children Health Institute',
    rating: 4.9,
    fee: 750,
    languages: ['English', 'Tamil', 'Telugu', 'Hindi'],
  },
  {
    id: 'doc-4',
    name: 'Dr. K. S. Ramanujam, MD',
    age: 56,
    specialty: 'Geriatrician & Senior Care Specialist',
    qualifications: 'MBBS, MD (Internal Medicine), PGD (Geriatric Medicine)',
    experienceYears: 26,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'TSMC-REG-1998-021940',
    originalCertification: 'Post-Graduate Specialty Diploma in Geriatric Medicine & Internal Medicine Board',
    certifyingAuthority: 'Telangana State Medical Council & National Institute of Social Defence',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['10:00 AM', '12:00 PM', '03:30 PM', '05:30 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'ElderCare Speciality Center',
    rating: 4.9,
    fee: 1000,
    languages: ['English', 'Telugu', 'Tamil', 'Hindi'],
  },
  {
    id: 'doc-5',
    name: 'Dr. Arvind Mehra, MD',
    age: 49,
    specialty: 'Cardiologist',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology)',
    experienceYears: 21,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'DMC-REG-2001-015842',
    originalCertification: 'Doctorate of Medicine (DM) in Interventional Cardiology & Fellow of Cardiological Society of India',
    certifyingAuthority: 'Delhi Medical Council & All India Institute of Medical Sciences (AIIMS)',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['11:00 AM', '01:00 PM', '04:00 PM', '06:30 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'Fortis Heart & Vascular Institute',
    rating: 4.9,
    fee: 1200,
    languages: ['English', 'Hindi'],
  },
  {
    id: 'doc-6',
    name: 'Dr. Kavitha Reddy, MD',
    age: 38,
    specialty: 'Dermatologist & Trichologist',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experienceYears: 12,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'APMC-REG-2012-073819',
    originalCertification: 'Board Certification in Clinical Dermatology & Aesthetics, IADVL',
    certifyingAuthority: 'Andhra Pradesh Medical Council & IADVL',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '12:30 PM', '02:00 PM', '05:00 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'GlowSkin Clinic',
    rating: 4.7,
    fee: 700,
    languages: ['English', 'Telugu', 'Hindi'],
  },
  {
    id: 'doc-7',
    name: 'Dr. Vikramaditya Rao, MS',
    age: 47,
    specialty: 'Orthopedic Surgeon & Joint Specialist',
    qualifications: 'MBBS, MS (Orthopedics), Fellowship in Joint Replacement',
    experienceYears: 19,
    isVerified: true,
    isDemo: false,
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'KMC-REG-2005-042817',
    originalCertification: 'Master of Surgery (MS) Orthopedics & International Fellowship in Adult Hip/Knee Reconstruction',
    certifyingAuthority: 'Karnataka Medical Council & Indian Orthopaedic Association',
    availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['09:00 AM', '11:00 AM', '03:00 PM', '05:00 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'Apollo Bone & Joint Institute',
    rating: 4.8,
    fee: 850,
    languages: ['English', 'Telugu', 'Hindi'],
  },

  // --- RETIRED DOCTORS / SENIOR EMERITUS CONSULTANTS (HIGH EXPERIENCE & TELE-SECOND OPINIONS) ---
  {
    id: 'doc-ret-1',
    name: 'Prof. Dr. M. S. Swaminathan, MD, FRCP, DSc',
    age: 74,
    specialty: 'Cardiologist & Senior Cardiovascular Consultant (Emeritus)',
    qualifications: 'MBBS, MD (Internal Medicine), DM (Cardiology), FRCP (London)',
    experienceYears: 48,
    isVerified: true,
    isDemo: false,
    isRetired: true,
    doctorStatus: 'Emeritus Professor & Senior Advisor',
    registrationNumber: 'MCI-REG-1976-004128',
    originalCertification: 'Fellow of the Royal College of Physicians (FRCP London) & Board Certified in Clinical & Interventional Cardiology, AIIMS New Delhi',
    certifyingAuthority: 'Medical Council of India & Royal College of Physicians (UK)',
    retiredYearsAgo: 4,
    seniorConsultationScope: 'Cardiac Second Opinions, Complex Electrocardiogram & Angiogram Review, Tele-Consultation',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '03:00 PM'],
    consultationTypes: ['Online', 'In-person'],
    hospital: 'National Institute of Cardiovascular Research (Emeritus Advisor)',
    rating: 5.0,
    fee: 950,
    languages: ['English', 'Tamil', 'Hindi', 'Telugu'],
  },
  {
    id: 'doc-ret-2',
    name: 'Prof. Dr. Devaki Amma, MD, DCH, FAAP',
    age: 71,
    specialty: 'Pediatrician & Pediatric Care Specialist (Emeritus)',
    qualifications: 'MBBS, MD (Pediatrics), DCH, FAAP (Fellow, American Academy of Pediatrics)',
    experienceYears: 44,
    isVerified: true,
    isDemo: false,
    isRetired: true,
    doctorStatus: 'Retired Senior Consultant (Honorary)',
    registrationNumber: 'TMC-REG-1979-011409',
    originalCertification: 'Diplomate in Child Health & Board Certified Pediatrician (MD Pediatrics), Institute of Child Health, Chennai',
    certifyingAuthority: 'Tamil Nadu Medical Council & American Academy of Pediatrics',
    retiredYearsAgo: 3,
    seniorConsultationScope: 'Pediatric Second Opinions, Chronic Childhood Conditions, Developmental Diagnostics',
    availability: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:30 AM', '11:00 AM', '04:00 PM'],
    consultationTypes: ['Online'],
    hospital: 'Children Memorial Advanced Research Center (Honorary Senior)',
    rating: 4.9,
    fee: 700,
    languages: ['English', 'Tamil', 'Telugu'],
  },
  {
    id: 'doc-ret-3',
    name: 'Prof. Dr. V. R. Narayana Rao, MS, MCh, FRCS',
    age: 76,
    specialty: 'Urologist & Renal Health Specialist (Emeritus)',
    qualifications: 'MBBS, MS (Surgery), MCh (Urology), FRCS (Edinburgh)',
    experienceYears: 50,
    isVerified: true,
    isDemo: false,
    isRetired: true,
    doctorStatus: 'Emeritus Professor & Senior Advisor',
    registrationNumber: 'APMC-REG-1974-008271',
    originalCertification: 'Fellow of the Royal College of Surgeons (FRCS Edinburgh) & MCh Urology National Certification',
    certifyingAuthority: 'Andhra Pradesh Medical Council & Royal College of Surgeons',
    retiredYearsAgo: 5,
    seniorConsultationScope: 'Prostate Health Review, Complex Renal Calculus Review, Urological Second Opinions',
    availability: ['Monday', 'Thursday'],
    timeSlots: ['10:30 AM', '02:30 PM', '04:30 PM'],
    consultationTypes: ['Online'],
    hospital: 'Apex Institute of Renal Sciences (Senior Emeritus)',
    rating: 4.9,
    fee: 850,
    languages: ['English', 'Telugu', 'Hindi'],
  },
  {
    id: 'doc-ret-4',
    name: 'Dr. Sarojini Soundararajan, MD, FICOG',
    age: 69,
    specialty: 'Gynecologist & Senior Women’s Health Consultant (Emeritus)',
    qualifications: 'MBBS, MD (OBG), DGO, FICOG (Fellow of Indian College of Obstetricians)',
    experienceYears: 42,
    isVerified: true,
    isDemo: false,
    isRetired: true,
    doctorStatus: 'Retired Senior Consultant (Honorary)',
    registrationNumber: 'MCI-REG-1981-019552',
    originalCertification: 'Doctor of Medicine in Obstetrics & Gynaecology, Madras Medical College & FICOG Fellowship',
    certifyingAuthority: 'Medical Council of India & Indian College of Obstetricians and Gynaecologists',
    retiredYearsAgo: 2,
    seniorConsultationScope: 'Menopause Transition Care, Hormonal Second Opinions, Gynecological Health Review',
    availability: ['Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '12:00 PM', '03:30 PM'],
    consultationTypes: ['Online', 'In-person'],
    hospital: 'Women Well-Being Senior Advisory Board',
    rating: 4.9,
    fee: 800,
    languages: ['English', 'Tamil', 'Telugu', 'Hindi'],
  },
  {
    id: 'doc-ret-5',
    name: 'Prof. Dr. Hariprasad Chintala, MD, MNAMS',
    age: 73,
    specialty: 'Geriatrician & Senior Health Consultant (Emeritus)',
    qualifications: 'MBBS, MD (Internal Medicine), MNAMS (Member National Academy of Medical Sciences)',
    experienceYears: 46,
    isVerified: true,
    isDemo: false,
    isRetired: true,
    doctorStatus: 'Emeritus Professor & Senior Advisor',
    registrationNumber: 'TSMC-REG-1977-009834',
    originalCertification: 'Member of National Academy of Medical Sciences (MNAMS) & Board Certified in Geriatric Medicine & Internal Medicine',
    certifyingAuthority: 'Telangana State Medical Council & National Board of Examinations',
    retiredYearsAgo: 4,
    seniorConsultationScope: 'Elderly Polypharmacy & Medication Interaction Audits, Fall Risk Minimization, Chronic Multimorbidity Review',
    availability: ['Monday', 'Tuesday', 'Friday'],
    timeSlots: ['10:00 AM', '01:00 PM', '04:00 PM'],
    consultationTypes: ['Online', 'In-person'],
    hospital: 'Senior Vitality & Geriatric Research Foundation',
    rating: 5.0,
    fee: 900,
    languages: ['English', 'Telugu', 'Hindi', 'Tamil'],
  },

  // --- DEMO / SAMPLE CLINICIANS ---
  {
    id: 'doc-8',
    name: 'Dr. Sunita Deshmukh, MD',
    age: 44,
    specialty: 'Endocrinologist & Diabetologist',
    qualifications: 'MBBS, MD (Internal Medicine), DM (Endocrinology)',
    experienceYears: 15,
    isVerified: false,
    isDemo: true, // Sample Doctor
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'MMC-REG-2007-034821',
    originalCertification: 'Super-Specialty DM in Endocrinology & Diabetes Care',
    certifyingAuthority: 'Maharashtra Medical Council (Sample Demo Verification)',
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['10:00 AM', '01:00 PM', '03:30 PM'],
    consultationTypes: ['Online'],
    hospital: 'Sample Diabetes & Hormone Clinic (Demo)',
    rating: 4.6,
    fee: 750,
    languages: ['English', 'Hindi'],
  },
  {
    id: 'doc-9',
    name: 'Dr. Manish Gupta, MD',
    age: 41,
    specialty: 'General Physician & Family Health',
    qualifications: 'MBBS, MD (Family Medicine)',
    experienceYears: 14,
    isVerified: false,
    isDemo: true, // Sample Doctor
    isRetired: false,
    doctorStatus: 'Practicing Specialist',
    registrationNumber: 'DMC-REG-2010-058291',
    originalCertification: 'Board Certified in Family Practice & Preventative Medicine',
    certifyingAuthority: 'Delhi Medical Council (Sample Demo Verification)',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '05:30 PM'],
    consultationTypes: ['In-person', 'Online'],
    hospital: 'MediCommunity Health Center (Demo)',
    rating: 4.6,
    fee: 500,
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
  }
];

const INITIAL_VITALS: VitalsLog[] = [
  {
    id: 'vit-1',
    recordedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    bpSystolic: 122,
    bpDiastolic: 82,
    bpStatus: 'Normal',
    bloodSugar: 98,
    sugarType: 'Fasting',
    sugarStatus: 'Normal',
    heartRate: 74,
    heartRateStatus: 'Normal',
    spO2: 98,
    spO2Status: 'Normal',
    temperature: 98.4,
    temperatureUnit: 'F',
    tempStatus: 'Normal',
    weightKg: 68.5,
    heightCm: 172,
    bmi: 23.1,
    bmiStatus: 'Normal',
    notes: 'Morning routine resting baseline'
  },
  {
    id: 'vit-2',
    recordedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    bpSystolic: 126,
    bpDiastolic: 84,
    bpStatus: 'Normal',
    bloodSugar: 132,
    sugarType: 'Post-Prandial',
    sugarStatus: 'Normal',
    heartRate: 78,
    heartRateStatus: 'Normal',
    spO2: 99,
    spO2Status: 'Normal',
    temperature: 98.6,
    temperatureUnit: 'F',
    tempStatus: 'Normal',
    weightKg: 68.2,
    heightCm: 172,
    bmi: 23.0,
    bmiStatus: 'Normal',
    notes: '2 hours post-lunch reading'
  },
  {
    id: 'vit-3',
    recordedAt: new Date().toISOString(),
    bpSystolic: 118,
    bpDiastolic: 78,
    bpStatus: 'Optimal',
    bloodSugar: 92,
    sugarType: 'Fasting',
    sugarStatus: 'Normal',
    heartRate: 71,
    heartRateStatus: 'Normal',
    spO2: 99,
    spO2Status: 'Normal',
    temperature: 98.5,
    temperatureUnit: 'F',
    tempStatus: 'Normal',
    weightKg: 68.0,
    heightCm: 172,
    bmi: 23.0,
    bmiStatus: 'Normal',
    notes: 'Optimal healthy vitals reading'
  }
];

const INITIAL_REPORTS: ScannedReport[] = [
  {
    id: 'rep-sample-1',
    title: 'Complete Blood Count (CBC) Laboratory Evaluation',
    reportType: 'Blood Test / CBC',
    patientName: 'Demo Patient',
    date: new Date().toISOString().split('T')[0],
    overallSummary: 'Comprehensive hematological parameters are largely within physiologic limits, with a mild borderline low ferritin indicator.',
    overallStatus: 'normal',
    metrics: [
      { name: 'Hemoglobin (Hb)', value: 13.8, unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'normal', significance: 'Oxygen transport capacity is healthy.' },
      { name: 'Total Leukocyte Count (WBC)', value: 7200, unit: 'cells/mcL', referenceRange: '4,000 - 11,000', status: 'normal', significance: 'No acute active systemic infection indicated.' },
      { name: 'Platelet Count', value: 245000, unit: 'mcL', referenceRange: '150,000 - 450,000', status: 'normal', significance: 'Normal clotting potential.' },
      { name: 'RBC Count', value: 4.8, unit: 'million/mcL', referenceRange: '4.5 - 5.9', status: 'normal', significance: 'Optimal red cell mass.' },
      { name: 'Mean Corpuscular Volume (MCV)', value: 84.5, unit: 'fL', referenceRange: '80.0 - 100.0', status: 'normal', significance: 'Normocytic red cells.' }
    ],
    doctorRecommendation: 'General Physician or Hematologist for routine annual preventative wellness check.',
    lifestyleAdvice: [
      'Maintain dietary iron intake (leafy greens, dates, lentils, lean protein).',
      'Hydrate with 2 to 2.5 liters of clean water daily.',
      'Maintain regular aerobic physical exercise.'
    ],
    createdAt: new Date().toISOString()
  }
];

function ensureDataDirectory(): void {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseSchema = {
      users: [],
      doctors: INITIAL_DOCTORS,
      appointments: [],
      healthRecords: [],
      vitals: INITIAL_VITALS,
      scannedReports: INITIAL_REPORTS,
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDatabase(): DatabaseSchema {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    let modified = false;

    if (!parsed.doctors || parsed.doctors.length < INITIAL_DOCTORS.length || !parsed.doctors[0]?.age) {
      parsed.doctors = INITIAL_DOCTORS;
      modified = true;
    }
    if (!parsed.vitals || parsed.vitals.length === 0) {
      parsed.vitals = INITIAL_VITALS;
      modified = true;
    }
    if (!parsed.scannedReports || parsed.scannedReports.length === 0) {
      parsed.scannedReports = INITIAL_REPORTS;
      modified = true;
    }

    if (modified) {
      saveDatabase(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file, returning default schema:', err);
    return {
      users: [],
      doctors: INITIAL_DOCTORS,
      appointments: [],
      healthRecords: [],
      vitals: INITIAL_VITALS,
      scannedReports: INITIAL_REPORTS,
    };
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  ensureDataDirectory();
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper query functions
export function getDoctors(specialtyFilter?: string, retiredFilter?: string): Doctor[] {
  const db = readDatabase();
  let list = db.doctors;

  if (retiredFilter === 'retired') {
    list = list.filter(d => d.isRetired === true);
  } else if (retiredFilter === 'active') {
    list = list.filter(d => d.isRetired === false);
  }

  if (!specialtyFilter || specialtyFilter.toLowerCase() === 'all') {
    return list;
  }

  return list.filter(d => 
    d.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()) ||
    specialtyFilter.toLowerCase().includes(d.specialty.toLowerCase())
  );
}

export function getDoctorById(id: string): Doctor | undefined {
  const db = readDatabase();
  return db.doctors.find(d => d.id === id);
}

export function findUserByEmail(email: string): User | undefined {
  const db = readDatabase();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const db = readDatabase();
  return db.users.find(u => u.id === id);
}

export function createUser(user: User): User {
  const db = readDatabase();
  db.users.push(user);
  saveDatabase(db);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = readDatabase();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...updates };
  saveDatabase(db);
  return db.users[index];
}

export function createAppointment(appointment: Appointment): Appointment {
  const db = readDatabase();
  db.appointments.push(appointment);
  saveDatabase(db);
  return appointment;
}

export function getAppointments(userId?: string): Appointment[] {
  const db = readDatabase();
  if (!userId) return db.appointments;
  return db.appointments.filter(a => a.userId === userId);
}

export function cancelAppointment(id: string, userId?: string): boolean {
  const db = readDatabase();
  const index = db.appointments.findIndex(a => a.id === id && (!userId || a.userId === userId));
  if (index === -1) return false;
  db.appointments[index].status = 'cancelled';
  saveDatabase(db);
  return true;
}

export function saveHealthRecord(record: HealthRecord): HealthRecord {
  const db = readDatabase();
  db.healthRecords.push(record);
  saveDatabase(db);
  return record;
}

export function getHealthRecords(userId?: string): HealthRecord[] {
  const db = readDatabase();
  if (!userId) return db.healthRecords;
  return db.healthRecords.filter(r => r.userId === userId);
}

// Vitals monitoring helpers
export function saveVitalsLog(log: VitalsLog): VitalsLog {
  const db = readDatabase();
  if (!db.vitals) db.vitals = [];
  db.vitals.push(log);
  saveDatabase(db);
  return log;
}

export function getVitalsLogs(userId?: string): VitalsLog[] {
  const db = readDatabase();
  if (!db.vitals) return [];
  if (!userId) return db.vitals;
  const userLogs = db.vitals.filter(v => v.userId === userId);
  // If user has no custom logs yet, return global baseline logs for hackathon demonstration
  return userLogs.length > 0 ? userLogs : db.vitals;
}

// Scanned reports helpers
export function saveScannedReport(report: ScannedReport): ScannedReport {
  const db = readDatabase();
  if (!db.scannedReports) db.scannedReports = [];
  db.scannedReports.push(report);
  saveDatabase(db);
  return report;
}

export function getScannedReports(userId?: string): ScannedReport[] {
  const db = readDatabase();
  if (!db.scannedReports) return [];
  if (!userId) return db.scannedReports;
  const userReports = db.scannedReports.filter(r => r.userId === userId);
  return userReports.length > 0 ? userReports : db.scannedReports;
}

