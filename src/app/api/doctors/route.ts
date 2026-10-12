import { NextResponse } from 'next/server';
import { getDoctors } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty') || undefined;
    const type = searchParams.get('type') || undefined; // In-person or Online
    const query = searchParams.get('q') || undefined;
    const retired = searchParams.get('retired') || undefined; // all, active, retired

    let doctors = getDoctors(specialty, retired);

    if (type && type !== 'all') {
      doctors = doctors.filter(d => d.consultationTypes.includes(type as any));
    }

    if (query) {
      const qLower = query.toLowerCase();
      doctors = doctors.filter(d =>
        d.name.toLowerCase().includes(qLower) ||
        d.specialty.toLowerCase().includes(qLower) ||
        d.hospital.toLowerCase().includes(qLower) ||
        d.qualifications.toLowerCase().includes(qLower) ||
        d.registrationNumber?.toLowerCase().includes(qLower) ||
        d.originalCertification?.toLowerCase().includes(qLower) ||
        d.certifyingAuthority?.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ doctors });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch doctor directory' }, { status: 500 });
  }
}
