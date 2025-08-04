import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';

const client = new OpenAI();

interface PodcastFormat {
  id: string;
  title: string;
  description: string;
  segments: string[];
  key_questions: string[];
  potential_guests: string[];
  unique_elements: string[];
}

interface PodcastAnalysisRecord {
  id: string;
  timestamp: string;
  contentLength: number;
  contentPreview: string; // First 500 chars of the content
  podcastFormats: PodcastFormat[];
  totalFormats: number;
  processingTimeMs: number;
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

async function savePodcastAnalysisRecord(record: PodcastAnalysisRecord) {
  try {
    const dataDir = await ensureDataDirectory();
    const filePath = join(dataDir, 'podcast-analyses.json');
    
    let existingRecords: PodcastAnalysisRecord[] = [];
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
    console.log(`Saved podcast analysis record with ID: ${record.id}`);
  } catch (error) {
    console.error('Failed to save podcast analysis record:', error);
  }
}

const PROMPT_TEMPLATE = `You are an expert podcast planner assisting scientists in outlining podcasts based on uploaded papers and specific instructions. Your task is to generate three variants of podcast formats using the provided paper content.

First, carefully read and analyze the following paper content:

<paper_content>
{{PAPER_CONTENT}}
</paper_content>

Using the paper content, generate outlines for three podcast format variants:

1. 🔍 Investigative Deep Dive
2. 🧠 Hypothesis vs. Reality (Socratic)  
3. 🧬 The Scientist's Story (Biographical)

For each format, create an outline that includes:
a) A compelling title
b) 3-5 main segments or topics
c) Key questions to be addressed
d) Potential guests or expert commentators
e) Unique elements that fit the specific format

IMPORTANT: Return your response as a valid JSON object with this exact structure:

{
  "podcast_formats": [
    {
      "id": "investigative_deep_dive",
      "title": "Compelling title here",
      "description": "Brief description of this format",
      "segments": ["Segment 1", "Segment 2", "Segment 3"],
      "key_questions": ["Question 1?", "Question 2?", "Question 3?"],
      "potential_guests": ["Guest 1", "Guest 2"],
      "unique_elements": ["Element 1", "Element 2"]
    },
    {
      "id": "hypothesis_vs_reality",
      "title": "Compelling title here",
      "description": "Brief description of this format", 
      "segments": ["Segment 1", "Segment 2", "Segment 3"],
      "key_questions": ["Question 1?", "Question 2?", "Question 3?"],
      "potential_guests": ["Guest 1", "Guest 2"],
      "unique_elements": ["Element 1", "Element 2"]
    },
    {
      "id": "scientists_story",
      "title": "Compelling title here",
      "description": "Brief description of this format",
      "segments": ["Segment 1", "Segment 2", "Segment 3"], 
      "key_questions": ["Question 1?", "Question 2?", "Question 3?"],
      "potential_guests": ["Guest 1", "Guest 2"],
      "unique_elements": ["Element 1", "Element 2"]
    }
  ]
}

Remember to tailor each format to the unique aspects of the research and ensure they remain engaging and accessible to a general audience.`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No content provided for analysis'
      }, { status: 400 });
    }

    console.log('Starting OpenAI podcast analysis...');
    console.log(`Content length: ${content.length} characters`);

    // Replace the placeholder with actual content
    const prompt = PROMPT_TEMPLATE.replace('{{PAPER_CONTENT}}', content);

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    
    if (!result) {
      throw new Error('Empty response from OpenAI');
    }

    console.log('OpenAI response received');
    
    // Parse the JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate the structure
    if (!parsedResult.podcast_formats || !Array.isArray(parsedResult.podcast_formats)) {
      throw new Error('Invalid response structure from OpenAI');
    }

    console.log(`Successfully generated ${parsedResult.podcast_formats.length} podcast formats`);

    // Create analysis record for storage
    const endTime = Date.now();
    const processingTimeMs = endTime - startTime;
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const analysisRecord: PodcastAnalysisRecord = {
      id: analysisId,
      timestamp: new Date().toISOString(),
      contentLength: content.length,
      contentPreview: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      podcastFormats: parsedResult.podcast_formats,
      totalFormats: parsedResult.podcast_formats.length,
      processingTimeMs
    };

    // Save analysis record asynchronously (don't wait for it)
    savePodcastAnalysisRecord(analysisRecord).catch(console.error);

    return NextResponse.json({
      success: true,
      podcast_formats: parsedResult.podcast_formats,
      total_formats: parsedResult.podcast_formats.length,
      analysis_id: analysisId,
      processing_time_ms: processingTimeMs
    });

  } catch (error) {
    console.error('OpenAI podcast analysis error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze content with OpenAI'
    }, { status: 500 });
  }
}