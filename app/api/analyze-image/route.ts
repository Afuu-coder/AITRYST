import { NextRequest, NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import fs from 'fs'
import path from 'path'

// Initialize Google Cloud Vision client
let visionClient: ImageAnnotatorClient

try {
  // Set the environment variable for Google Cloud authentication
  const keyPath = path.join(process.cwd(), 'service-account-key.json')
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath
  
  // Try to read the service account key file
  const keyFile = fs.readFileSync(keyPath, 'utf8')
  const credentials = JSON.parse(keyFile)
  
  visionClient = new ImageAnnotatorClient({
    projectId: credentials.project_id || 'artisan-ai-472017',
    credentials: credentials
  })
  console.log('✅ Google Cloud Vision client initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize Vision Client:', error)
  // Fallback initialization
  visionClient = new ImageAnnotatorClient({
    projectId: 'artisan-ai-472017',
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    console.log('🖼️ Analyzing image:', {
      fileName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    })

    // Convert File to Buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    // Perform image analysis
    const [result] = await visionClient.annotateImage({
      image: { content: imageBuffer },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
        { type: 'TEXT_DETECTION', maxResults: 5 },
        { type: 'IMAGE_PROPERTIES' }
      ]
    })

    // Extract relevant information
    const labels = result.labelAnnotations?.map(label => label.description) || []
    const objects = result.localizedObjectAnnotations?.map(obj => obj.name) || []
    const text = result.textAnnotations?.[0]?.description || ''
    const colors = result.imageProperties?.dominantColors?.colors?.slice(0, 3).map(color => 
      color.color ? `RGB(${color.color.red}, ${color.color.green}, ${color.color.blue})` : ''
    ).filter(Boolean) || []

    // Create comprehensive analysis
    const analysis = createProductAnalysis(labels, objects, text, colors)

    console.log('✅ Image analysis completed:', analysis.substring(0, 100) + '...')

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('❌ Image analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please check your Google Cloud Vision API configuration.' },
      { status: 500 }
    )
  }
}

function createProductAnalysis(labels: string[], objects: string[], text: string, colors: string[]): string {
  const analysisParts = []

  // Object detection
  if (objects.length > 0) {
    analysisParts.push(`Objects detected: ${objects.join(', ')}`)
  }

  // Label analysis
  const relevantLabels = labels.filter(label => 
    label.toLowerCase().includes('handmade') ||
    label.toLowerCase().includes('craft') ||
    label.toLowerCase().includes('artisan') ||
    label.toLowerCase().includes('traditional') ||
    label.toLowerCase().includes('pottery') ||
    label.toLowerCase().includes('ceramic') ||
    label.toLowerCase().includes('textile') ||
    label.toLowerCase().includes('jewelry') ||
    label.toLowerCase().includes('wood') ||
    label.toLowerCase().includes('metal') ||
    label.toLowerCase().includes('fabric') ||
    label.toLowerCase().includes('clay') ||
    label.toLowerCase().includes('stone')
  )

  if (relevantLabels.length > 0) {
    analysisParts.push(`Product type: ${relevantLabels.join(', ')}`)
  }

  // Color analysis
  if (colors.length > 0) {
    analysisParts.push(`Dominant colors: ${colors.join(', ')}`)
  }

  // Text detection
  if (text) {
    analysisParts.push(`Text found: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
  }

  // Craftsmanship indicators
  const craftsmanshipIndicators = labels.filter(label => 
    label.toLowerCase().includes('handmade') ||
    label.toLowerCase().includes('traditional') ||
    label.toLowerCase().includes('artisan') ||
    label.toLowerCase().includes('craft') ||
    label.toLowerCase().includes('vintage') ||
    label.toLowerCase().includes('antique')
  )

  if (craftsmanshipIndicators.length > 0) {
    analysisParts.push(`Craftsmanship indicators: ${craftsmanshipIndicators.join(', ')}`)
  }

  // Return analysis or empty if no indicators found
  if (analysisParts.length === 0) {
    return "No specific product indicators detected in the image."
  }

  return analysisParts.join('. ') + '.'
}
