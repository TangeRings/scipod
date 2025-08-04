import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface FileData {
  name: string;
  size: number;
  type: string;
  extractedText: string;
  extractionStatus: 'success' | 'error' | 'empty';
}

interface ExtractionRecord {
  id: string;
  timestamp: string;
  files: FileData[];
  combinedText: string;
  totalFiles: number;
}

async function ensureDataDirectory() {
  const dataDir = join(process.cwd(), 'data');
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }
  return dataDir;
}

async function saveExtractionRecord(record: ExtractionRecord) {
  try {
    const dataDir = await ensureDataDirectory();
    const filePath = join(dataDir, 'extractions.json');
    
    let existingRecords: ExtractionRecord[] = [];
    try {
      const existingData = await readFile(filePath, 'utf-8');
      existingRecords = JSON.parse(existingData);
    } catch (error) {
      // File might not exist yet, start with empty array
    }
    
    existingRecords.push(record);
    
    // Keep only last 50 records to prevent file from growing too large
    if (existingRecords.length > 50) {
      existingRecords = existingRecords.slice(-50);
    }
    
    await writeFile(filePath, JSON.stringify(existingRecords, null, 2));
    console.log(`Saved extraction record with ID: ${record.id}`);
  } catch (error) {
    console.error('Failed to save extraction record:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const extractedTexts: string[] = [];
    const processedFiles: FileData[] = [];
    
    // Get all files from form data
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ 
        error: 'No files provided' 
      }, { status: 400 });
    }

    console.log(`Processing ${files.length} files...`);

    // Process each file
    for (const file of files) {
      console.log(`Processing file: ${file.name} (${file.size} bytes)`);
      
      let extractedText = '';
      let extractionStatus: 'success' | 'error' | 'empty' = 'success';
      
      try {
        const fileType = file.name.toLowerCase();
        
        if (fileType.endsWith('.txt')) {
          // Handle .txt files
          const textContent = await file.text();
          const originalLength = textContent.length;
          extractedText = textContent; // Keep original content including whitespace
          
          console.log(`TXT Processing: ${file.name}`);
          console.log(`- Original content length: ${originalLength}`);
          console.log(`- File size reported: ${file.size} bytes`);
          
          if (originalLength === 0) {
            extractedText = `[EMPTY FILE: ${file.name}]

This text file is empty (0 bytes). Please upload a file with content.`;
            extractionStatus = 'empty';
          } else {
            console.log(`Successfully extracted ${originalLength} characters from ${file.name}`);
          }
          
        } else {
          extractedText = `[UNSUPPORTED FILE TYPE: ${file.name}]

Only .txt files are supported. Please upload text files only.

File details:
- Name: ${file.name}
- Size: ${Math.round(file.size / 1024)} KB
- Type: ${file.type || 'unknown'}`;
          extractionStatus = 'error';
        }
        
        // Store file data
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || 'unknown',
          extractedText,
          extractionStatus
        });
        
        // Add to combined output
        extractedTexts.push(`=== ${file.name} ===\n${extractedText}\n`);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        const errorText = `[ERROR EXTRACTING FROM: ${file.name}]

An error occurred while processing this file:
${error instanceof Error ? error.message : 'Unknown error'}

File details:
- Name: ${file.name}
- Size: ${file.size} bytes`;

        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || 'unknown',
          extractedText: errorText,
          extractionStatus: 'error'
        });
        
        extractedTexts.push(`=== ${file.name} ===\n${errorText}\n`);
      }
    }
    
    // Stack all texts together
    const combinedText = extractedTexts.join('\n' + '='.repeat(50) + '\n\n');
    
    // Create extraction record
    const extractionRecord: ExtractionRecord = {
      id: `extraction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      files: processedFiles,
      combinedText,
      totalFiles: files.length
    };
    
    // Save to JSON file (async, don't wait for it)
    saveExtractionRecord(extractionRecord).catch(console.error);
    
    console.log(`Successfully processed ${files.length} files. Combined text length: ${combinedText.length} characters`);
    
    return NextResponse.json({ 
      success: true,
      extractedText: combinedText,
      fileCount: files.length,
      extractionId: extractionRecord.id,
      files: processedFiles.map(f => ({
        name: f.name,
        size: f.size,
        status: f.extractionStatus
      }))
    });
    
  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from files' },
      { status: 500 }
    );
  }
}