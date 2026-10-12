import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getVitalsLogs, saveVitalsLog } from '@/lib/db';
import { VitalsLog } from '@/lib/types';

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

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromReq(req);
    const logs = getVitalsLogs(userId);

    // Calculate dynamic health score from latest vitals
    let healthScore = 90;
    const latest = logs[logs.length - 1];

    if (latest) {
      if (latest.bpSystolic > 140 || latest.bpDiastolic > 90) healthScore -= 12;
      else if (latest.bpSystolic > 120 || latest.bpDiastolic > 80) healthScore -= 5;

      if (latest.bloodSugar > 140) healthScore -= 15;
      else if (latest.bloodSugar > 100) healthScore -= 5;

      if (latest.spO2 < 95) healthScore -= 15;
      if (latest.temperature > 100.4) healthScore -= 10;
    }

    return NextResponse.json({
      logs,
      latest,
      healthScore: Math.max(40, Math.min(100, healthScore)),
      statusText: healthScore >= 85 ? 'Optimal Vital Baseline' : healthScore >= 70 ? 'Good / Stable' : 'Requires Clinical Attention'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve vitals logs.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bpSystolic = 120,
      bpDiastolic = 80,
      bloodSugar = 95,
      sugarType = 'Fasting',
      heartRate = 72,
      spO2 = 98,
      temperature = 98.6,
      temperatureUnit = 'F',
      weightKg,
      heightCm,
      notes
    } = body;

    // Blood pressure status classification (AHA Guidelines)
    let bpStatus: VitalsLog['bpStatus'] = 'Optimal';
    if (bpSystolic > 140 || bpDiastolic > 90) {
      bpStatus = bpSystolic > 160 || bpDiastolic > 100 ? 'Stage 2 HTN' : 'Stage 1 HTN';
    } else if (bpSystolic >= 120 || bpDiastolic >= 80) {
      bpStatus = 'Elevated';
    }

    // Blood sugar status classification
    let sugarStatus: VitalsLog['sugarStatus'] = 'Normal';
    if (sugarType === 'Fasting') {
      if (bloodSugar > 125) sugarStatus = 'Elevated';
      else if (bloodSugar >= 100) sugarStatus = 'Prediabetes';
      else if (bloodSugar < 70) sugarStatus = 'Hypoglycemia';
    } else {
      if (bloodSugar > 199) sugarStatus = 'Elevated';
      else if (bloodSugar >= 140) sugarStatus = 'Prediabetes';
      else if (bloodSugar < 70) sugarStatus = 'Hypoglycemia';
    }

    // Heart rate status
    let heartRateStatus: VitalsLog['heartRateStatus'] = 'Normal';
    if (heartRate > 100) heartRateStatus = 'Tachycardia';
    else if (heartRate < 60) heartRateStatus = 'Bradycardia';

    // SpO2 status
    let spO2Status: VitalsLog['spO2Status'] = 'Normal';
    if (spO2 < 92) spO2Status = 'Low (Urgent)';
    else if (spO2 < 95) spO2Status = 'Borderline';

    // Temperature status
    let tempStatus: VitalsLog['tempStatus'] = 'Normal';
    const tempF = temperatureUnit === 'C' ? (temperature * 9) / 5 + 32 : temperature;
    if (tempF >= 101.5) tempStatus = 'High Fever';
    else if (tempF >= 99.5) tempStatus = 'Mild Fever';

    // BMI calculation
    let bmi: number | undefined = undefined;
    let bmiStatus: VitalsLog['bmiStatus'] = undefined;
    if (weightKg && heightCm && heightCm > 0) {
      const heightM = heightCm / 100;
      bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
      if (bmi < 18.5) bmiStatus = 'Underweight';
      else if (bmi < 25) bmiStatus = 'Normal';
      else if (bmi < 30) bmiStatus = 'Overweight';
      else bmiStatus = 'Obese';
    }

    const userId = getUserIdFromReq(req);
    const newLog: VitalsLog = {
      id: `vit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      recordedAt: new Date().toISOString(),
      bpSystolic: Number(bpSystolic),
      bpDiastolic: Number(bpDiastolic),
      bpStatus,
      bloodSugar: Number(bloodSugar),
      sugarType,
      sugarStatus,
      heartRate: Number(heartRate),
      heartRateStatus,
      spO2: Number(spO2),
      spO2Status,
      temperature: Number(temperature),
      temperatureUnit,
      tempStatus,
      weightKg: weightKg ? Number(weightKg) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      bmi,
      bmiStatus,
      notes
    };

    saveVitalsLog(newLog);

    return NextResponse.json({
      success: true,
      log: newLog,
      message: 'Vitals logged successfully.'
    });
  } catch (err: any) {
    console.error('Vitals logging error:', err);
    return NextResponse.json({ error: 'Failed to record vitals log.' }, { status: 500 });
  }
}
