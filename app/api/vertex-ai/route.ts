import { NextResponse } from 'next/server';
import { generateAIContentWithVertex } from '@/lib/vertexAIServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, language } = body;

    // Generate content using Vertex AI
    const result = await generateAIContentWithVertex(prompt, language);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}
