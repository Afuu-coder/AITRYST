import { NextRequest, NextResponse } from 'next/server'
import { generateCampaignContent, type CampaignInput } from '@/app/studio/festival-campaigns/actions/generate-campaign-content'

export async function POST(request: NextRequest) {
  try {
    const { festival, productInfo, language, platforms } = await request.json()

    console.log('[API] Festival Campaign Generation Request:', {
      festival: festival?.name,
      language: language?.name,
      platforms,
      productInfoLength: productInfo?.length
    })

    if (!festival || !productInfo || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: festival, productInfo, and platforms' },
        { status: 400 }
      )
    }

    // Prepare input for the enhanced campaign generator
    const campaignInput: CampaignInput = {
      productTitle: festival.name + ' Special Collection',
      productDescription: productInfo,
      festival: festival.name,
      festivalDetails: {
        theme: festival.theme,
        date: festival.date,
        description: festival.description,
      },
      language: language?.name || 'English',
      platforms: platforms,
    }

    console.log('[API] Calling enhanced campaign generator...')
    const result = await generateCampaignContent(campaignInput)

    if (!result.success) {
      console.error('[API] Campaign generation failed:', result.error)
      return NextResponse.json(
        { 
          error: 'Failed to generate campaign content',
          details: result.error 
        },
        { status: 500 }
      )
    }

    console.log('[API] Campaign generated successfully')

    return NextResponse.json({
      success: true,
      content: result.platformContent,
      caption: result.caption,
      hashtags: result.hashtags,
      discountText: result.discountText,
      festival: festival.name,
      language: language?.name || 'English',
      platforms: platforms
    })

  } catch (error) {
    console.error('Festival campaign generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate festival campaign',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
