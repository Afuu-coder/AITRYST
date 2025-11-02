import { NextRequest, NextResponse } from 'next/server';
import { generateProductDetails } from '@/ai/flows/generate-product-details';

export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🎨 Generating product details...');
    console.log('Language:', body.language);
    console.log('Category:', body.productCategory);
    console.log('Platform:', body.platform);
    console.log('Brand Tone:', body.brandTone);
    
    // Call the Genkit flow
    const result = await generateProductDetails({
      photoDataUri: body.photoDataUri,
      voiceNoteDataUri: body.voiceNoteDataUri,
      language: body.language,
      productCategory: body.productCategory,
      platform: body.platform,
      brandTone: body.brandTone,
    });
    
    console.log('✅ Product details generated successfully');
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error generating product details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate product details',
        message: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
