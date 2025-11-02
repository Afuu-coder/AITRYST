import { NextRequest, NextResponse } from 'next/server'
import { getDesignImprovementSuggestions } from '@/ai/flows/design-improvement-suggestions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { designDescription, targetAudience, preferredStyle, designGoals, exampleImage, language } = body

    if (!designDescription || !language) {
      return NextResponse.json(
        { error: 'Design description and language are required' },
        { status: 400 }
      )
    }

    const result = await getDesignImprovementSuggestions({
      designDescription,
      targetAudience,
      preferredStyle,
      designGoals,
      exampleImage,
      language,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Design improvements error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate design improvements' },
      { status: 500 }
    )
  }
}
