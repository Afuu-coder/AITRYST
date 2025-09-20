import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

// Set up Google Cloud credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(process.cwd(), 'service-account-key.json');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(request: NextRequest) {
  try {
    const { transcription, language, platforms } = await request.json();

    if (!transcription || !language) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    console.log('🚀 Platform content generation request:', { 
      transcription: transcription.substring(0, 100), 
      language, 
      platforms 
    });

    // Generate platform-specific content
    const prompt = `Create comprehensive marketing content for a handcrafted product with this description: "${transcription}". The content should be engaging and suitable for artisans selling their products online in ${language}.

Focus on:
1. Highlighting the craftsmanship and uniqueness of the product
2. Connecting with the cultural significance of handcrafted items
3. Appealing to customers who value authenticity and tradition
4. Creating content that converts browsers into buyers
5. Using appropriate cultural context for ${language} speaking customers

Format your response as JSON with the following structure:
{
  "headline": "A catchy headline",
  "description": "A detailed product description",
  "instagram": "Instagram caption with hashtags",
  "whatsapp": "WhatsApp message for customers",
  "amazon": "Amazon product description",
  "emailSubject": "Email subject line",
  "emailBody": "Email body content",
  "facebook": "Facebook post content",
  "twitter": "Twitter post (under 280 characters)"
}

Make sure the response is valid JSON and each platform content is tailored for that specific platform.`;

    try {
      const generativeModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      let contentText = response.text().trim();
      
      // Remove markdown code blocks if present
      if (contentText.startsWith('```json')) {
        contentText = contentText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (contentText.startsWith('```')) {
        contentText = contentText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      console.log('Cleaned content text:', contentText.substring(0, 200) + '...');
      
      // Try to parse JSON response
      let generatedContent;
      try {
        generatedContent = JSON.parse(contentText);
        console.log('Successfully parsed JSON content');
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        console.log('Raw content that failed to parse:', contentText);
        // If JSON parsing fails, create a structured response
        generatedContent = {
          headline: "Handcrafted Artisan Product",
          description: contentText,
          instagram: `✨ ${contentText}\n\n#Handcrafted #Artisan #Local #Unique #MadeWithLove`,
          whatsapp: `🎨 *Handcrafted Product*\n\n${contentText}\n\nInterested? DM for more details!`,
          amazon: `Handcrafted Artisan Product - ${contentText}`,
          emailSubject: "Discover Our Handcrafted Collection",
          emailBody: contentText,
          facebook: contentText,
          twitter: contentText.substring(0, 280)
        };
      }
      
      console.log('✅ Platform content generation completed successfully');
      return NextResponse.json(generatedContent);
    } catch (error) {
      console.error('Error generating platform content:', error);
      return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in platform content generation:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
