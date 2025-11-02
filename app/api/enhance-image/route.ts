/**
 * @fileOverview API route for enhancing product images for artisans.
 * 
 * - POST /api/enhance-image - Handles the image enhancement process, returning three variations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhanceImage } from '@/ai/flows/enhance-image';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Image Enhancement API called');
    
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error('FormData parsing error:', error);
      return NextResponse.json({ 
        error: 'Failed to parse form data',
        message: 'Failed to parse body as FormData.'
      }, { status: 400 });
    }
    
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    console.log('📸 Processing image:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
    });

    // Convert file to buffer and then to data URI
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Check image size (limit to 7MB for Gemini)
    if (imageBuffer.length > 7 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Image too large', 
        message: 'Image size exceeds 7MB limit. Please use a smaller image.' 
      }, { status: 400 });
    }
    
    const photoDataUri = `data:${imageFile.type};base64,${imageBuffer.toString('base64')}`;

    // Use the new Genkit-based enhancement
    const result = await enhanceImage({ photoDataUri });

    console.log('✅ Image enhancement completed successfully');
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error in image enhancement:', error);
    return NextResponse.json(
      { 
        error: 'Failed to enhance image',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}