import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data');
    const filePath = join(dataDir, 'podcast-analyses.json');
    
    const data = await readFile(filePath, 'utf-8');
    const analyses = JSON.parse(data);
    
    return NextResponse.json(analyses, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading podcast analyses:', error);
    return NextResponse.json([], {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}