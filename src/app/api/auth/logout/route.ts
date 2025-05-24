import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  await clearSession();
  
  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}