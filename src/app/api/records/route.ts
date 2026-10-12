import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getHealthRecords } from '@/lib/db';

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
    // If not authenticated, return empty array to prevent data leakage
    if (!userId) {
      return NextResponse.json({ records: [] });
    }
    const records = getHealthRecords(userId);
    return NextResponse.json({ records });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve health records.' }, { status: 500 });
  }
}
