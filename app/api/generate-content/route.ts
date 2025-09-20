import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

// Initialize Google Generative AI
let genAI: GoogleGenerativeAI

try {
  // Set the environment variable for Google Cloud authentication
  const keyPath = path.join(process.cwd(), 'service-account-key.json')
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath
  
  // Try to read the service account key file
  const keyFile = fs.readFileSync(keyPath, 'utf8')
  const credentials = JSON.parse(keyFile)
  
  // Use the provided Google AI API key
  const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ'
  
  genAI = new GoogleGenerativeAI(apiKey)
  console.log('✅ Google Generative AI client initialized successfully')
} catch (error) {
  console.error('Failed to initialize Google Generative AI:', error)
  // Fallback initialization
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ')
}

const model = 'gemini-1.5-flash'

export async function POST(request: NextRequest) {
  try {
    const { transcription, language, platforms } = await request.json()

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      )
    }

    console.log('🚀 Content generation request:', { transcription: transcription.substring(0, 100), language, platforms })

    // Generate only product title and description
    const prompt = `Create a product title and description for a handcrafted product based on this transcription: "${transcription}". The content should be clear and suitable for artisans selling their products online in ${language}.

Focus on:
1. Creating a clear, compelling product title (max 60 characters)
2. Writing a detailed product description (2-3 sentences)
3. Highlighting the craftsmanship and uniqueness of the product
4. Using appropriate cultural context for ${language} speaking customers

Format your response as JSON with the following structure:
{
  "title": "Product Title",
  "description": "Product Description"
}

Make sure the response is valid JSON with only these two fields.`

    try {
      const generativeModel = genAI.getGenerativeModel({ model })
      const result = await generativeModel.generateContent(prompt)
      const response = await result.response
      let contentText = response.text().trim()
      
      // Remove markdown code blocks if present
      if (contentText.startsWith('```json')) {
        contentText = contentText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (contentText.startsWith('```')) {
        contentText = contentText.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      console.log('Cleaned content text:', contentText.substring(0, 200) + '...')
      
      // Try to parse JSON response
      let generatedContent
      try {
        generatedContent = JSON.parse(contentText)
        console.log('Successfully parsed JSON content')
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError)
        console.log('Raw content that failed to parse:', contentText)
        // If JSON parsing fails, create a structured response
        generatedContent = {
          title: "Handcrafted Artisan Product",
          description: contentText
        }
      }
      
      console.log('✅ Content generation completed successfully')
      return NextResponse.json(generatedContent)
    } catch (error) {
      console.error('Error generating content:', error)
      throw new Error(`Failed to generate content: ${error}`)
    }

  } catch (error) {
    console.error('❌ Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function getPromptForPlatform(platform: string, transcription: string, language: string): string {
  const basePrompt = `You are an expert content creator specializing in handcrafted artisan products. 
Create compelling content based on this product description: "${transcription}"

Language: ${language}
Platform: ${platform}

Guidelines:
- Keep it authentic and personal
- Highlight the handcrafted nature
- Include relevant hashtags where appropriate
- Make it engaging and shareable
- Respect the original language and cultural context
- Keep it concise but impactful

`

  switch (platform) {
    case 'instagram':
      return basePrompt + `Create an Instagram caption that:
- Is 2-3 sentences maximum
- Includes 5-7 relevant hashtags
- Has an engaging hook
- Emphasizes the unique, handcrafted nature
- Encourages engagement (likes, comments, shares)
- Uses emojis appropriately

Format: Caption text with hashtags at the end`

    case 'whatsapp':
      return basePrompt + `Create a WhatsApp message that:
- Is conversational and friendly
- Highlights key selling points
- Includes a call-to-action
- Is 2-3 sentences
- Feels personal and direct
- Uses appropriate emojis

Format: Direct message text`

    case 'amazon':
      return basePrompt + `Create an Amazon product listing title and description that:
- Is SEO-optimized
- Highlights key features and benefits
- Includes relevant keywords
- Is professional but warm
- Mentions handcrafted/artisan quality
- Is 2-3 sentences for description

Format: Title: [Title]\nDescription: [Description]`

    case 'website':
      return basePrompt + `Create a website product description that:
- Is engaging and descriptive
- Tells the story of the product
- Highlights craftsmanship and quality
- Is 3-4 sentences
- Includes emotional appeal
- Mentions the artisan's skill

Format: Website description text`

    default:
      return basePrompt + `Create a general product description that highlights the handcrafted nature and key features.`
  }
}

