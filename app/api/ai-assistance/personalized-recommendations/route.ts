import { NextRequest, NextResponse } from 'next/server'
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artisanProfile, pastInteractions, regionalTrends, language } = body

    if (!artisanProfile || !language) {
      return NextResponse.json(
        { error: 'Artisan profile and language are required' },
        { status: 400 }
      )
    }

    const result = await getPersonalizedRecommendations({
      artisanProfile,
      pastInteractions: pastInteractions || 'No past interactions',
      regionalTrends: regionalTrends || 'No specific regional trends',
      language,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Personalized recommendations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
