import { NextRequest, NextResponse } from 'next/server';
import { comparePasswords, createToken, setSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import { signInSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = signInSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { 
          error: 'No account found with this email address',
          errorType: 'email_not_found'
        },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          error: 'Incorrect password',
          errorType: 'invalid_password'
        },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = await createToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name
    });
    
    // Set session cookie
    await setSession(token);
    
    return NextResponse.json(
      { message: 'Sign in successful', user: { id: user.id.toString(), email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}