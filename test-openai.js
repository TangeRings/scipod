// Test OpenAI integration for podcast format generation
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "PUT_YOUR_OPENAI_API_KEY_HERE", // Replace with your actual API key
});

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

async function testOpenAIIntegration() {
  try {
    // Sample text content for testing
    const samplePaperContent = `
    Research Paper: "Machine Learning Applications in Climate Prediction"
    
    Abstract: This study explores the use of advanced machine learning algorithms to improve long-term climate prediction models. We developed a novel neural network architecture that incorporates satellite data, ocean temperature measurements, and atmospheric composition data to predict climate patterns with 23% higher accuracy than traditional models.
    
    Introduction: Climate prediction has long been a challenge for scientists due to the complex interactions between atmospheric, oceanic, and terrestrial systems. Traditional models rely heavily on physics-based equations, but recent advances in machine learning offer new opportunities for improvement.
    
    Methodology: We collected data from 500+ weather stations globally over a 20-year period, combined with satellite imagery and ocean buoy measurements. Our deep learning model was trained on this comprehensive dataset using a transformer architecture specifically designed for time-series climate data.
    
    Results: The model achieved 78% accuracy in predicting temperature variations 6 months in advance, compared to 55% for traditional models. Precipitation predictions showed a 67% accuracy rate. The model was particularly effective at predicting extreme weather events.
    
    Conclusion: Machine learning represents a significant advancement in climate science, offering more accurate predictions that could help communities better prepare for climate change impacts.
    `;

    const prompt = PROMPT_TEMPLATE.replace('{{PAPER_CONTENT}}', samplePaperContent);

    console.log('🚀 Sending request to OpenAI...\n');
    
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = response.choices[0].message.content;
    
    console.log('✅ Raw OpenAI Response:');
    console.log('='.repeat(50));
    console.log(result);
    console.log('='.repeat(50));
    
    // Try to parse as JSON
    try {
      const parsedResult = JSON.parse(result);
      console.log('\n✅ Successfully parsed as JSON!');
      console.log('\n📊 Structured Output:');
      console.log(JSON.stringify(parsedResult, null, 2));
      
      // Validate structure
      if (parsedResult.podcast_formats && Array.isArray(parsedResult.podcast_formats)) {
        console.log(`\n✅ Found ${parsedResult.podcast_formats.length} podcast formats`);
        
        parsedResult.podcast_formats.forEach((format, index) => {
          console.log(`\nFormat ${index + 1}: ${format.title}`);
          console.log(`ID: ${format.id}`);
          console.log(`Segments: ${format.segments?.length || 0}`);
          console.log(`Questions: ${format.key_questions?.length || 0}`);
        });
      } else {
        console.log('❌ JSON structure is incorrect - missing podcast_formats array');
      }
      
    } catch (parseError) {
      console.log('\n❌ Failed to parse as JSON:');
      console.log(parseError.message);
      console.log('\nTrying to extract JSON from response...');
      
      // Try to extract JSON from markdown code block
      const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[1]);
          console.log('✅ Extracted JSON from code block!');
          console.log(JSON.stringify(extractedJson, null, 2));
        } catch (extractError) {
          console.log('❌ Could not parse extracted JSON:', extractError.message);
        }
      } else {
        console.log('❌ No JSON code block found in response');
      }
    }
    
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Make sure to set your OpenAI API key:');
      console.log('   export OPENAI_API_KEY="your-api-key-here"');
    }
  }
}

// Run the test
testOpenAIIntegration();