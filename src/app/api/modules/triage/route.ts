import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { evaluateClinicalTriage, TriageInput } from '@/lib/triageEngine';
import { saveHealthRecord } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const JWT_SECRET = process.env.JWT_SECRET || 'medimate_super_secret_jwt_key_2026_secure';

function getUserIdFromReq(req: Request): string | undefined {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return undefined;
  const token = auth.substring(7);
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  try {
    const body: TriageInput = await req.json();
    const { moduleType, patientName, age, guardianName, healthProblem, symptoms, duration, medicalHistory, currentMedications, sex } = body;

    // Strict validation
    if (!patientName || patientName.trim() === '') {
      return NextResponse.json({ error: 'Patient full name is required.' }, { status: 400 });
    }
    if (age === undefined || age === null || age === '') {
      return NextResponse.json({ error: 'Patient age is required.' }, { status: 400 });
    }
    if (!healthProblem || healthProblem.trim() === '') {
      return NextResponse.json({ error: 'Health concern or problem must be provided.' }, { status: 400 });
    }
    if (!symptoms || symptoms.trim() === '') {
      return NextResponse.json({ error: 'Symptoms description is required.' }, { status: 400 });
    }
    if (!duration || duration.trim() === '') {
      return NextResponse.json({ error: 'Duration of symptoms is required.' }, { status: 400 });
    }

    // Children's health specific validation
    if (moduleType === 'children') {
      if (!guardianName || guardianName.trim() === '') {
        return NextResponse.json({ error: 'Parent or Guardian name is mandatory for children.' }, { status: 400 });
      }
    }

    // Senior health specific validation
    if (moduleType === 'senior') {
      const numericAge = Number(age);
      if (isNaN(numericAge) || numericAge <= 50) {
        return NextResponse.json(
          { error: 'Senior Health Module is specifically calibrated for patients above 50 years of age.' },
          { status: 400 }
        );
      }
    }

    // Run clinical triage
    const triageResult = evaluateClinicalTriage(body);

    // If Gemini API key is configured and this isn't an emergency red flag, optionally enhance clinical explanation
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !triageResult.isEmergency) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a clinical decision-support copilot for a healthcare triage portal.
Patient Category: ${moduleType}
Age: ${age}
Reported Concern: ${healthProblem}
Symptoms: ${symptoms}
Duration: ${duration}
Medical History: ${medicalHistory || 'None reported'}
Current Medications: ${currentMedications || 'None reported'}
Recommended Doctor Specialty: ${triageResult.recommendedSpecialty}

Task:
Write a supportive, 2-3 sentence explanation of why consulting a ${triageResult.recommendedSpecialty} is clinically appropriate for these symptoms.
SAFETY RULES:
- Do NOT provide a definitive diagnosis.
- Do NOT prescribe medications or specific dosages.
- Emphasize that clinical physical examination is essential.
Provide ONLY the 2-3 sentence paragraph without markdown titles.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim().length > 20) {
          triageResult.specialtyExplanation = text.trim();
        }
      } catch (aiErr) {
        // Graceful fallback to rule-based explanation
        console.warn('Gemini API call skipped or errored, using validated clinical rule-based explanation.');
      }
    }

    // Save record to database
    const userId = getUserIdFromReq(req);
    const savedRecord = saveHealthRecord({
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      moduleType,
      patientName,
      age,
      guardianName,
      healthProblem,
      symptoms,
      duration,
      medicalHistory,
      currentMedications,
      sex,
      triageResult,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      recordId: savedRecord.id,
      triageResult,
    });
  } catch (err: any) {
    console.error('Triage assessment error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during symptom evaluation.' },
      { status: 500 }
    );
  }
}
