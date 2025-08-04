import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface ExtractionRecord {
  id: string;
  timestamp: string;
  files: Array<{
    name: string;
    size: number;
    type: string;
    extractedText: string;
    extractionStatus: 'success' | 'error' | 'empty';
  }>;
  combinedText: string;
  totalFiles: number;
}

export async function GET(request: NextRequest) {
  try {
    const dataDir = join(process.cwd(), 'data');
    const filePath = join(dataDir, 'extractions.json');
    
    try {
      const data = await readFile(filePath, 'utf-8');
      const records: ExtractionRecord[] = JSON.parse(data);
      
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');
      const id = searchParams.get('id');
      
      if (id) {
        // Return specific record by ID
        const record = records.find(r => r.id === id);
        if (!record) {
          return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, record });
      }
      
      // Return latest records (sorted by timestamp, newest first)
      const sortedRecords = records
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      
      return NextResponse.json({ 
        success: true, 
        records: sortedRecords,
        total: records.length
      });
      
    } catch (fileError) {
      // File doesn't exist or is corrupted
      return NextResponse.json({ 
        success: true, 
        records: [],
        total: 0,
        message: 'No extraction records found'
      });
    }
    
  } catch (error) {
    console.error('Error reading extraction records:', error);
    return NextResponse.json(
      { error: 'Failed to read extraction records' },
      { status: 500 }
    );
  }
}