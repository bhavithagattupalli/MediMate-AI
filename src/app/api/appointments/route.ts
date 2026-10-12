import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAppointments, createAppointment, getDoctorById, cancelAppointment } from '@/lib/db';
import { Appointment } from '@/lib/types';

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
    // If user is authenticated, return their appointments; otherwise return appointments for guest session if requested
    const appointments = getAppointments(userId);
    return NextResponse.json({ appointments });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      date,
      timeSlot,
      consultationType,
      notes,
    } = body;

    if (!patientName || !doctorId || !date || !timeSlot || !consultationType) {
      return NextResponse.json(
        { error: 'Patient name, doctor, date, time slot, and consultation type are required.' },
        { status: 400 }
      );
    }

    if (!patientPhone && !patientEmail) {
      return NextResponse.json(
        { error: 'At least one contact method (phone or email) is required.' },
        { status: 400 }
      );
    }

    const doctor = getDoctorById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: 'Selected doctor could not be found.' }, { status: 404 });
    }

    // Check if slot is already booked for this doctor on this date
    const existing = getAppointments().find(
      a => a.doctorId === doctorId && a.date === date && a.timeSlot === timeSlot && a.status === 'confirmed'
    );
    if (existing) {
      return NextResponse.json(
        { error: 'This time slot is already reserved. Please select another slot or date.' },
        { status: 409 }
      );
    }

    const userId = getUserIdFromReq(req);
    const bookingRef = `MM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingRef,
      userId,
      patientName,
      patientEmail: patientEmail || '',
      patientPhone: patientPhone || '',
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      timeSlot,
      consultationType: consultationType as 'In-person' | 'Online',
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    createAppointment(newAppointment);

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
      message: 'Appointment reserved successfully',
    });
  } catch (err: any) {
    console.error('Appointment booking error:', err);
    return NextResponse.json({ error: 'Failed to process appointment booking.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { appointmentId, action } = await req.json();
    const userId = getUserIdFromReq(req);

    if (action === 'cancel' && appointmentId) {
      const ok = cancelAppointment(appointmentId, userId);
      if (ok) {
        return NextResponse.json({ success: true, message: 'Appointment cancelled.' });
      }
      return NextResponse.json({ error: 'Appointment not found or unauthorized.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update appointment.' }, { status: 500 });
  }
}
