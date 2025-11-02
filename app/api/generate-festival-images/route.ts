import { NextRequest, NextResponse } from 'next/server'
import { generateFestivalImagesVertex, type FestivalImageInput } from '@/app/studio/festival-campaigns/actions/generate-festival-images'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { photoDataUri, productName, artisanName, festival, language } = body

    console.log('[API] Festival Image Generation Request:', {
      productName,
      festival,
      language,
      hasImage: !!photoDataUri
    })

    if (!photoDataUri || !productName || !festival) {
      return NextResponse.json(
        { error: 'Missing required fields: photoDataUri, productName, festival' },
        { status: 400 }
      )
    }

    const input: FestivalImageInput = {
      photoDataUri,
      productName,
      artisanName: artisanName || 'Artisan',
      festival,
      language: language || 'en'
    }

    console.log('[API] Calling Vertex AI Imagen 3 generator...')
    const result = await generateFestivalImagesVertex(input)

    if (!result.success) {
      console.error('[API] Image generation failed:', result.error)
      return NextResponse.json(
        { 
          error: 'Failed to generate images',
          details: result.error 
        },
        { status: 500 }
      )
    }

    console.log(`[API] Successfully generated ${result.images.length} images`)

    return NextResponse.json({
      success: true,
      images: result.images,
      festival,
      language
    })

  } catch (error) {
    console.error('[API] Festival image generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate festival images',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
