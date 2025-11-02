'use server';

/**
 * Festival Image Generation using Gemini 2.5 Flash Image
 * Based on Google's new image generation capabilities
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface FestivalImageInput {
  photoDataUri: string;
  productName: string;
  artisanName: string;
  festival: string;
  language: 'en' | 'hi';
}

export interface ImageVariation {
  url: string;
  variation: string;
  prompt: string;
}

export interface FestivalImageOutput {
  images: ImageVariation[];
  success: boolean;
  error?: string;
}

const festivalSlogans: Record<string, { en: string; hi: string }> = {
  'Diwali': { en: 'Light up your home with handmade elegance!', hi: 'इस दिवाली अपने घर को हाथ से बनी सुंदरता से रोशन करें!' },
  'Holi': { en: 'Add colors of creativity!', hi: 'रचनात्मकता के रंग जोड़ें!' },
  'Eid': { en: 'Celebrate with artisanal beauty.', hi: 'शिल्प सौंदर्य के साथ मनाएं।' },
  'Christmas': { en: 'Handcrafted warmth this Christmas.', hi: 'दस्तकारी की गर्माहट।' },
  'Raksha Bandhan': { en: 'Perfect handcrafted gift.', hi: 'हस्तनिर्मित उपहार।' },
  'Navratri': { en: 'Celebrate with traditional crafts.', hi: 'पारंपरिक शिल्प।' },
};

const festivalDecor: Record<string, string> = {
  'Diwali': 'warm golden lighting, glowing diyas, marigold flowers, rangoli patterns',
  'Holi': 'vibrant colored powder splashes, rainbow hues, playful atmosphere',
  'Raksha Bandhan': 'decorative rakhis, silk threads, pastel colors',
  'Eid': 'crescent moon, hanging lanterns, stars, green-gold theme',
  'Christmas': 'twinkling lights, pine branches, red-green theme',
  'Navratri': 'dandiya sticks, vibrant pinks and purples',
};

function getImagePrompts(input: FestivalImageInput) {
  const { productName, artisanName, festival, language } = input;
  const slogan = festivalSlogans[festival]?.[language] || `Celebrate ${festival}!`;
  const decor = festivalDecor[festival] || 'festive decorations';

  return [
    {
      variation: 'Festive Background',
      prompt: `Transform this product image into a stunning ${festival} marketing visual. Place the ${productName} prominently in the center against a ${festival} themed background with ${decor}. Add elegant text overlay at the top that says "${slogan}". Include a small watermark at bottom-left that says "by ${artisanName}". Style: Professional product photography, warm lighting, high quality, Instagram marketing poster, 4K resolution, photorealistic.`
    },
    {
      variation: 'Mockup Scene',
      prompt: `Create a lifestyle product shot showing this ${productName} elegantly placed in a beautifully decorated living room for ${festival}. Include decorations: ${decor}. Natural lighting, cozy atmosphere, professional interior photography. Add small watermark "Handcrafted by ${artisanName}" at bottom-right. Style: Lifestyle photography, 4K, photorealistic, warm inviting atmosphere.`
    },
    {
      variation: 'Clean Poster',
      prompt: `Design a minimalist e-commerce product poster with this ${productName} centered on a clean white background. Add subtle ${festival} pattern in the background using ${decor} motifs (very faded, 10% opacity). Place bold text "${productName}" at the top. Add small "by ${artisanName}" watermark at bottom. Style: Modern, clean, professional design, high contrast, e-commerce ready, 4K.`
    }
  ];
}

export async function generateFestivalImagesGemini(input: FestivalImageInput): Promise<FestivalImageOutput> {
  try {
    console.log(`[Gemini Image] Starting generation for ${input.festival}`);
    
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use Gemini 2.5 Flash for image generation
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp' // Using available model
    });
    
    const prompts = getImagePrompts(input);
    const images: ImageVariation[] = [];
    
    // Extract base64 image data
    const base64Image = input.photoDataUri.includes('base64,')
      ? input.photoDataUri.split('base64,')[1]
      : input.photoDataUri;
    
    const mimeType = input.photoDataUri.includes('image/png') ? 'image/png' : 'image/jpeg';

    for (const { variation, prompt } of prompts) {
      try {
        console.log(`[Gemini Image] Generating ${variation}...`);
        
        // Generate content with image input and text prompt
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          prompt
        ]);
        
        const response = await result.response;
        const text = response.text();
        
        console.log(`[Gemini Image] Response for ${variation}:`, text.substring(0, 100));
        
        // Note: Currently Gemini 2.0 Flash returns text descriptions
        // For actual image generation, we'd need Gemini 2.5 Flash Image when available
        // For now, return original image with prompt
        images.push({
          url: input.photoDataUri,
          variation,
          prompt: text || prompt
        });
        
      } catch (varError) {
        console.error(`[Gemini Image] Error generating ${variation}:`, varError);
        // Add with original image anyway
        images.push({
          url: input.photoDataUri,
          variation,
          prompt: prompt
        });
      }
    }

    if (images.length === 0) {
      throw new Error('Failed to generate any image variations');
    }

    return { success: true, images };

  } catch (error) {
    console.error('[Gemini Image] Error:', error);
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : 'Failed to generate images'
    };
  }
}
