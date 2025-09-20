import { NextResponse } from 'next/server';
import { transcribeAudioWithVertex } from '@/lib/vertexAIServer';
import { Buffer } from 'buffer';

export async function POST(request: Request) {
  try {
    // Get the audio file from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    // Convert the file to a Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    
    // Get the MIME type
    const mimeType = audioFile.type || 'audio/wav';
    
    // Transcribe the audio using Google Cloud Speech-to-Text
    const transcription = await transcribeAudioWithVertex(audioBuffer, mimeType);
    
    return NextResponse.json({ transcription });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}