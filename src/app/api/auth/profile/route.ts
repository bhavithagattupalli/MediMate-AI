import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById, updateUser } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'medimate_super_secret_jwt_key_2026_secure';

function getUserIdFromAuthHeader(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.substring(7);
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = findUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

export async function PUT(req: Request) {
  const userId = getUserIdFromAuthHeader(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fullName, age, phone, gender } = body;

    const updated = updateUser(userId, {
      fullName: fullName !== undefined ? fullName : undefined,
      age: age !== undefined ? Number(age) : undefined,
      phone: phone !== undefined ? phone : undefined,
      gender: gender !== undefined ? gender : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'User update failed' }, { status: 400 });
    }

    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
