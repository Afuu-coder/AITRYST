import { NextRequest, NextResponse } from 'next/server'
import { recommendAdCampaignContent } from '@/ai/flows/recommend-ad-campaign-content'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { craftType, targetAudience, campaignGoal, pastCampaignPerformance, preferredPlatform, examplePosts, language } = body

    if (!craftType || !targetAudience || !campaignGoal || !preferredPlatform || !language) {
      return NextResponse.json(
        { error: 'Craft type, target audience, campaign goal, platform, and language are required' },
        { status: 400 }
      )
    }

    const result = await recommendAdCampaignContent({
      craftType,
      targetAudience,
      campaignGoal,
      pastCampaignPerformance,
      preferredPlatform,
      examplePosts,
      language,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Ad campaign content error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate campaign content' },
      { status: 500 }
    )
  }
}
