'use server';

/**
 * @fileOverview An AI agent for generating festival-themed marketing images for products.
 * 
 * - generateFestivalImages - A function that handles the image generation process.
 * - GenerateFestivalImagesInput - The input type for the generateFestivalImages function.
 * - GenerateFestivalImagesOutput - The return type for the generateFestivalImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateFestivalImagesInputSchema = z.object({
  photoDataUri: z.string().describe(
    "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  productName: z.string().describe('The name of the product.'),
  artisanName: z.string().describe('The name of the artisan or shop.'),
  festival: z.string().describe('The festival for the campaign.'),
  language: z.enum(['en', 'hi']).optional().describe('The language for text overlays.'),
});
export type GenerateFestivalImagesInput = z.infer<typeof GenerateFestivalImagesInputSchema>;

const GenerateFestivalImagesOutputSchema = z.object({
  images: z.array(z.object({
    url: z.string().describe("The generated image as a data URI."),
    variation: z.string().describe("The name of the variation (e.g., 'Festive Background')."),
  })),
});
export type GenerateFestivalImagesOutput = z.infer<typeof GenerateFestivalImagesOutputSchema>;

// Legacy export types for compatibility
export type FestivalImageInput = GenerateFestivalImagesInput;
export type ImageVariation = { url: string; variation: string; prompt: string };
export type FestivalImageOutput = { images: ImageVariation[]; success: boolean; error?: string; };

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

function getPrompts(input: FestivalImageInput) {
  const { productName, artisanName, festival, language } = input;
  const slogan = festivalSlogans[festival]?.[language || 'en'] || `Celebrate ${festival}!`;
  const decor = festivalDecor[festival] || 'festive decorations';

  return [
    {
      variation: 'Festive Background',
      prompt: `Product image: ${productName} on ${festival} themed background. Background: ${decor}, festive atmosphere, warm lighting. Style: professional product photography, e-commerce quality, 4K`
    },
    {
      variation: 'Lifestyle Scene',
      prompt: `Product image: ${productName} displayed in ${festival} celebration setup. Surroundings: ${decor}, home setting, natural lighting. Style: lifestyle product photography, 4K`
    },
    {
      variation: 'Minimal Poster',
      prompt: `Product image: ${productName} on clean background. Subtle ${festival} decorative elements (${decor}, faded). Style: minimalist e-commerce poster, clean design, 4K`
    }
  ];
}

export async function generateFestivalImagesVertex(input: FestivalImageInput): Promise<FestivalImageOutput> {
  try {
    console.log(`[Imagen] Starting generation for ${input.festival}`);
    
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    
    if (!projectId) {
      throw new Error('GOOGLE_CLOUD_PROJECT_ID not set in environment');
    }

    // Use explicit path to service account key file
    // This overrides any system environment variable
    const path = require('path');
    const keyfilePath = path.join(process.cwd(), 'service-account-key.json');
    
    console.log('[Imagen] Using credentials from:', keyfilePath);

    // Initialize Google Auth
    const auth = new GoogleAuth({
      keyFilename: keyfilePath,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }

    const prompts = getPrompts(input);
    const images: ImageVariation[] = [];
    // Use standard Imagen 3 fast model
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-fast-generate-001:predict`;

    // Extract base64 image data
    const base64Image = input.photoDataUri.includes('base64,')
      ? input.photoDataUri.split('base64,')[1]
      : input.photoDataUri;

    for (const { variation, prompt } of prompts) {
      try {
        console.log(`[Imagen] Generating ${variation} with control image`);
        
        // Enhanced prompt to preserve product appearance
        const enhancedPrompt = `${prompt}. IMPORTANT: The main product/object from the reference image must remain visually identical - same shape, color, size, and details. Only modify the surrounding environment and background.`;
        
        const requestBody = {
          instances: [{
            prompt: enhancedPrompt,
            image: {
              bytesBase64Encoded: base64Image
            }
          }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            addWatermark: false,
            safetySetting: 'block_some',
            personGeneration: 'allow_adult',
            // Higher negative prompt weight to avoid changing the product
            negativePrompt: 'different product, changed object, modified appearance, different color, different shape'
          }
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Imagen] API Error for ${variation}:`, errorText);
          throw new Error(`Imagen API error: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.predictions && result.predictions[0]) {
          const imageBytes = result.predictions[0].bytesBase64Encoded;
          const mimeType = result.predictions[0].mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${imageBytes}`;
          
          images.push({
            url: imageUrl,
            variation,
            prompt
          });
          
          console.log(`[Imagen] Successfully generated ${variation}`);
        } else {
          throw new Error(`No image data in response for ${variation}`);
        }
        
      } catch (varError) {
        console.error(`[Imagen] Error generating ${variation}:`, varError);
        // Continue with other variations
      }
    }

    if (images.length === 0) {
      throw new Error('Failed to generate any images. Check API access and quotas.');
    }

    return { success: true, images };

  } catch (error) {
    console.error('[Imagen] Error:', error);
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : 'Failed to generate images'
    };
  }
}
