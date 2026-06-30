import { NextResponse } from 'next/server';
import { checkConnection } from '@/lib/db';

export async function GET() {
  const status = await checkConnection();
  return NextResponse.json(status);
}
