import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '@/lib/db';
import { User } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'medimate_super_secret_jwt_key_2026_secure';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, age, phone, gender, consentGiven } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: 'Consent to store personal health data is required to create an account.' },
        { status: 400 }
      );
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fullName,
      email,
      passwordHash,
      age: age ? Number(age) : undefined,
      phone: phone || undefined,
      gender: gender || undefined,
      consentGiven: true,
      createdAt: new Date().toISOString(),
    };

    createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Omit passwordHash in response
    const { passwordHash: _, ...safeUser } = newUser;

    return NextResponse.json({
      message: 'Account created successfully',
      user: safeUser,
      token,
    });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: 'Server error during registration.' }, { status: 500 });
  }
}
