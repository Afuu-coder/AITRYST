import { NextRequest, NextResponse } from 'next/server'
import { generateSocialMediaCaptions } from '@/ai/flows/generate-social-media-captions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, craftType, productDescription, targetPlatform, tone, language } = body

    if (!productName || !craftType || !productDescription || !targetPlatform || !language) {
      return NextResponse.json(
        { error: 'Product name, craft type, description, platform, and language are required' },
        { status: 400 }
      )
    }

    const result = await generateSocialMediaCaptions({
      productName,
      craftType,
      productDescription,
      targetPlatform,
      tone,
      language,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Social media captions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate captions' },
      { status: 500 }
    )
  }
}
