import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, createToken, setSession } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';
import { signUpSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json(
        { error: 'Invalid input', errors },
        { status: 400 }
      );
    }
    
    const { email, password, name } = result.data;
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await createUser(email, hashedPassword, name);
    
    // Create JWT token
    const token = await createToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name
    });
    
    // Set session cookie
    await setSession(token);
    
    return NextResponse.json(
      { message: 'User created successfully', user: { id: user.id.toString(), email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}