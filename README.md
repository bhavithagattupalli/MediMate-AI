# 🏥 MediMate AI – Your Personal AI Health Copilot

MediMate AI is a complete, responsive, full-stack healthcare web application providing evidence-informed symptom intake, clinical triage navigation, specialist doctor matching, multilingual accessibility (English, Telugu, Hindi, Tamil), and an AI Health Copilot.

---

## 🚀 Features Overview

### 1. Main Dashboard & 4 Specialized Clinical Modules
- **Women's Health Module (`/modules/womens`)**: Covers menstrual health, pregnancy/prenatal care, PCOS, menopause, breast wellness, and pelvic health.
- **Men's Health Module (`/modules/mens`)**: Covers urological concerns, reproductive health, prostate wellness, skin & hair loss, and cardiovascular risk.
- **Children's Health Module (`/modules/children`)**: Calibrated for pediatric care (years & months), parent/guardian verification, with a strict **Zero Unsafe Dosages** safety policy.
- **Senior Health Module (`/modules/senior`)**: Calibrated specifically for adults aged **> 50**, including mobility assessment, chronic conditions, and **Fall Prevention Guidance**.

### 2. Personalized Results Page (`/results`)
- Clinical Intake Summary (Patient Name, Age, Symptoms, Timeline).
- Recommended Doctor Specialty with evidence-informed medical justification.
- Safe General Precautions & Self-Care.
- Important Things to Avoid.
- Red-Flag Warning Signs requiring urgent or emergency care.
- One-click **Book Appointment** pre-filling matching specialists.
- **Edit Details** & **Back to Dashboard** controls.

### 3. Red-Flag Emergency Screening Interceptor
- Automatically screens symptom inputs for critical emergencies (e.g., severe crushing chest pain, signs of stroke [FAST], breathing arrest, severe bleeding).
- Prominently displays emergency medical alerts with one-click calling to emergency dispatch (**108** / **112** / **911**) rather than delaying care with routine appointments.

### 4. Verified & Retired Doctor Directory
- **Practicing Specialists & Retired Senior Emeritus Clinicians**:
  - Displays each doctor's exact **Age** (e.g. 74 yrs, 76 yrs, 42 yrs).
  - Displays **Particular Full Medical Name** and honors.
  - Displays **Original Medical Council Registration Number** (e.g., `MCI-REG-1976-004128`, `TMC-REG-1979-011409`).
  - Displays **Original Board Certification & Fellowships** (e.g. Fellow of Royal College of Physicians [FRCP London], AIIMS Board Certified).
  - Displays **Certifying Issuing Authority** and years of experience (up to 50 years of clinical practice).
  - Displays **Senior Consultation Scope** for retired doctors (Second Opinions, ECG/Angiogram Review, Complex Cases).
  - Quick status filtering: **All Clinicians**, **Active Practicing**, and **Retired & Senior Emeritus Consultants**.

### 5. AI Voice Assistant & Health Copilot
- **Speech-to-Text (Voice Input)**: Speak directly into your microphone in English, Telugu, Hindi, or Tamil using Web Speech Recognition with animated soundwave indicators.
- **Text-to-Speech (Voice Output)**: Natural voice synthesis reading out medical explanations aloud, with play/pause/replay and auto-read toggles.
- **Dedicated Hands-Free Voice Assistant Mode**: Interactive voice screen featuring a 3D pulsing AI sphere that dynamically reacts to speaking, listening, and clinical guideline analysis.
- **Backend-Mediated Proxy (`/api/ai/chat`)**: Connects to Google Gemini API with fallback clinical intelligence without exposing API keys.

### 6. Full Multilingual Support (4 Languages)
- Real-time reactive switching across:
  - **English**
  - **Telugu (తెలుగు)**
  - **Hindi (हिंदी)**
  - **Tamil (தமிழ்)**
- Fully translates all dashboard cards, intake forms, error messages, results headers, precautions, buttons, and navigation.

### 7. Patient Auth, Consent & Health Records
- Registration with mandatory **Healthcare Consent Agreement**.
- Secure login with bcrypt password hashing and JWT sessions.
- Patient Profile with:
  - Appointment history & cancellation controls.
  - Health assessment history with patient data isolation.
  - Profile update tools.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom healthcare palette
- **Icons**: Lucide React
- **Authentication**: JWT & bcryptjs
- **Persistence**: File-backed atomic JSON data layer (`data/db.json`) — runs out of the box with zero DB configuration required!
- **AI Integration**: Google Gemini API (`@google/generative-ai`) via backend proxy

---

## 💻 How to Run Locally

### 1. Navigate to Project Directory
```powershell
cd C:\Users\renuk\.gemini\antigravity\scratch\medimate-ai
```

### 2. Install Dependencies (if not already installed)
```powershell
npm.cmd install
```

### 3. Configure Environment Variables (Optional)
Check `.env.local`:
```env
# Optional: Provide Google Gemini API Key for dynamic live AI chat.
# If omitted, MediMate AI runs in built-in clinical knowledge base mode!
GEMINI_API_KEY=your_gemini_api_key_here

JWT_SECRET=medimate_super_secret_jwt_key_2026_secure
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development Server
```powershell
npm.cmd run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🛡️ Healthcare Safety Notice
*MediMate AI is designed strictly for health education, clinical triage support, and care navigation. It does not replace formal clinical diagnosis, clinical testing, or individualized prescription therapy by a licensed medical practitioner.*
