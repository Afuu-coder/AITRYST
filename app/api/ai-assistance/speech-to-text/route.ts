import { NextRequest, NextResponse } from 'next/server'
import { speechToText } from '@/ai/flows/speech-to-text'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audio } = body

    if (!audio) {
      return NextResponse.json(
        { error: 'Audio is required' },
        { status: 400 }
      )
    }

    const result = await speechToText({
      audio,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Speech-to-text error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
