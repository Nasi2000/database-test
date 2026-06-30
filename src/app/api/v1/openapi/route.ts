import { readFileSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const specPath = path.join(process.cwd(), 'openapi', 'techstore.yaml');
  const yaml = readFileSync(specPath, 'utf-8');
  return new NextResponse(yaml, {
    headers: { 'Content-Type': 'application/yaml; charset=utf-8' },
  });
}
