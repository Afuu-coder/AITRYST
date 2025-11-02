'use server';
/**
 * @fileOverview An AI agent for enhancing product images for artisans.
 * 
 * - enhanceImage - A function that handles the image enhancement process, returning three variations.
 * - EnhanceImageInput - The input type for the enhanceImage function.
 * - EnhanceImageOutput - The return type for the enhanceImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const EnhanceImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceImageInput = z.infer<typeof EnhanceImageInputSchema>;

const ImageVariationSchema = z.object({
    variation: z.enum(['natural', 'white_background', 'high_resolution']),
    url: z.string().describe("The enhanced photo as a data URI."),
    description: z.string().describe("A user-friendly description of the enhancement done."),
});

const EnhanceImageOutputSchema = z.object({
    images: z.array(ImageVariationSchema),
});
export type EnhanceImageOutput = z.infer<typeof EnhanceImageOutputSchema>;

export async function enhanceImage(
  input: EnhanceImageInput
): Promise<EnhanceImageOutput> {
  return enhanceImageFlow(input);
}

const enhancementPrompts = [
    {
        variation: 'natural' as const,
        prompt: "Enhance this product photo with bright, natural studio lighting. Adjust exposure, contrast, and white balance to make it look clean and professional. Add soft shadows. Do not change the background. Keep the product's original colors and texture.",
        description: "Lighting and colors were adjusted for a bright, natural look."
    },
    {
        variation: 'white_background' as const,
        prompt: "Carefully cut out the product from its background and place it on a solid, pure white background (#FFFFFF). Ensure the edges are smooth and natural. The product itself should not be distorted or cropped. This is for an e-commerce product listing.",
        description: "Background removed and replaced with a clean white canvas for e-commerce."
    },
    {
        variation: 'high_resolution' as const,
        prompt: "Denoise and upscale this image to 2x its original resolution (max 2048px). Sharpen the product's edges and enhance its fine textures to make it look high-resolution and detailed. Preserve the original colors.",
        description: "Image upscaled and details sharpened for a high-resolution view."
    }
];


const enhanceImageFlow = ai.defineFlow(
  {
    name: 'enhanceImageFlow',
    inputSchema: EnhanceImageInputSchema,
    outputSchema: EnhanceImageOutputSchema,
  },
  async ({ photoDataUri }) => {
    
    const enhancementPromises = enhancementPrompts.map(async ({ variation, prompt, description }) => {
        try {
            const { media } = await ai.generate({
                model: googleAI.model('gemini-2.5-flash-image-preview'),
                prompt: [
                    { media: { url: photoDataUri } },
                    { text: prompt },
                ],
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                },
            });

            if (!media?.url) {
                throw new Error(`Image generation failed for variation: ${variation}`);
            }

            return {
                variation,
                url: media.url,
                description,
            };
        } catch (error) {
             // If a specific enhancement fails, we can fall back to a default enhancement
            console.warn(`Enhancement for '${variation}' failed. Falling back. Error:`, error);
            const { media } = await ai.generate({
                model: googleAI.model('gemini-2.5-flash-image-preview'),
                prompt: [
                    { media: { url: photoDataUri } },
                    { text: 'Slightly improve brightness and sharpness of the image. Do not change anything else.' },
                ],
                config: { responseModalities: ['TEXT', 'IMAGE'] },
            });
             return {
                variation,
                url: media?.url || photoDataUri, // return original if fallback fails
                description: "Brightness & sharpness enhanced.",
            };
        }
    });

    const images = await Promise.all(enhancementPromises);
    
    return { images };
  }
);
