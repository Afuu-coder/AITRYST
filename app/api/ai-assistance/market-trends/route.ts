import { NextRequest, NextResponse } from 'next/server'
import { marketTrendSummary } from '@/ai/flows/market-trend-summary'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { craft, region, language } = body

    if (!craft || !region || !language) {
      return NextResponse.json(
        { error: 'Craft, region, and language are required' },
        { status: 400 }
      )
    }

    const result = await marketTrendSummary({
      craft,
      region,
      language,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Market trends error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate market trends' },
      { status: 500 }
    )
  }
}
