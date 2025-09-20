import { NextResponse } from 'next/server';
import { transcribeAudioWithVertex } from '@/lib/vertexAIServer';
import { Buffer } from 'buffer';

export async function POST(request: Request) {
  try {
    console.log('🎤 Transcription API called');
    
    // Get the audio file and language from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const language = formData.get('language') as string | null;
    
    if (!audioFile) {
      console.log('❌ No audio file provided');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    console.log('📁 Audio file received:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      language: language || 'en-US'
    });
    
    // Convert the file to a Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    
    // Get the MIME type
    const mimeType = audioFile.type || 'audio/wav';
    
    // Transcribe the audio using Google Cloud Speech-to-Text
    console.log('🔄 Starting transcription...');
    const transcription = await transcribeAudioWithVertex(audioBuffer, mimeType, language);
    
    console.log('✅ Transcription completed:', transcription.substring(0, 100) + '...');
    
    return NextResponse.json({ 
      transcription,
      language: language || 'en-US',
      success: true 
    });
  } catch (error) {
    console.error('❌ Error transcribing audio:', error);
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}