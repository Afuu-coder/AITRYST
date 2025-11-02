import { NextResponse } from 'next/server';
import { transcribeAudioWithVertex, generateProductContentFromTranscription } from '@/lib/vertexAIServer';
import { Buffer } from 'buffer';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
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
    console.log('🎧 Incoming audio details:', { mimeType, size: audioFile.size });
    
    // Transcribe the audio using Google Cloud Speech-to-Text
    console.log('🔄 Starting transcription...');
    let transcription: string = '';
    try {
      transcription = await transcribeAudioWithVertex(audioBuffer, mimeType, language || undefined);
      console.log('✅ Transcription completed:', transcription.substring(0, 100) + '...');
    } catch (sttError) {
      console.warn('⚠️ STT failed, using fallback transcription:', sttError);
      // Minimal fallback to allow flow to continue
      const lang = (language || 'en-US').toLowerCase();
      if (lang.startsWith('hi')) {
        transcription = 'यह एक डेमो ट्रांसक्रिप्शन है। कृपया वास्तविक ऑडियो रिकॉर्ड करें।';
      } else if (lang.startsWith('bn')) {
        transcription = 'এটি একটি ডেমো ট্রান্সক্রিপশন। অনুগ্রহ করে আসল অডিও রেকর্ড করুন।';
      } else if (lang.startsWith('te')) {
        transcription = 'ఇది డెమో ట్రాన్స్క్రిప్షన్. దయచేసి అసలు ఆడియోను రికార్డ్ చేయండి.';
      } else {
        transcription = 'This is a demo transcription. Please record real audio.';
      }
    }
    
    // Generate product content from transcription
    console.log('🔄 Generating product content...');
    
    // Map the language code to the correct language for content generation
    let contentLanguage: 'en' | 'hi' | 'bn' | 'te' = 'en';
    if (language) {
      if (language.includes('hi')) {
        contentLanguage = 'hi';
      } else if (language.includes('bn')) {
        contentLanguage = 'bn';
      } else if (language.includes('te')) {
        contentLanguage = 'te';
      } else {
        contentLanguage = 'en';
      }
    }
    
    console.log('🌐 Content generation language:', contentLanguage, 'for transcription language:', language);
    let productContent: any;
    try {
      productContent = await generateProductContentFromTranscription(transcription, contentLanguage);
      console.log('✅ Product content generated successfully');
    } catch (genError) {
      console.warn('⚠️ Product content generation failed, using fallback:', genError);
      // Simple fallback content
      productContent = {
        title: contentLanguage === 'hi' ? 'हस्तनिर्मित उत्पाद' : contentLanguage === 'bn' ? 'হ্যান্ডক্রাফটেড পণ্য' : contentLanguage === 'te' ? 'హ్యాండ్‌క్రాఫ్ట్ ఉత్పత్తి' : 'Handcrafted Product',
        description: `${transcription}\n\n` + (contentLanguage === 'hi'
          ? 'यह एक स्वचालित रूप से बनाई गई सामग्री है।'
          : contentLanguage === 'bn'
          ? 'এটি স্বয়ংক্রিয়ভাবে তৈরি করা কন্টেন্ট।'
          : contentLanguage === 'te'
          ? 'ఇది స్వయంచాలకంగా రూపొందించిన కంటెంట్.'
          : 'This is auto-generated content.')
      };
    }
    
    return NextResponse.json({ 
      transcription,
      productContent,
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