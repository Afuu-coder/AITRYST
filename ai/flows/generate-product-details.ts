'use server';

/**
 * @fileOverview A comprehensive AI agent for generating a full marketing kit for artisan products.
 * 
 * - generateProductDetails - A function that handles the full generation process.
 * - GenerateProductDetailsInput - The input type for the function.
 * - GenerateProductDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateProductDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
  voiceNoteDataUri: z
    .string()
    .optional()
    .describe(
      'An optional voice note from the artisan describing the product.'
    ),
  language: z.enum(['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'pa', 'ml', 'kn']).describe('The base language for the generated content.'),
  productCategory: z.string().describe('The category of the product (e.g., "pottery", "textile").'),
  platform: z.enum(['instagram', 'whatsapp', 'facebook', 'etsy']).describe('The target social media platform.'),
  brandTone: z.enum(['traditional', 'royal', 'eco-friendly', 'luxury', 'playful', 'minimal-modern']).describe('The desired brand tone.'),
});
export type GenerateProductDetailsInput = z.infer<typeof GenerateProductDetailsInputSchema>;

// This is the schema for the text generation part of the AI model.
const AITextResponseSchema = z.object({
  productTitle: z.string().describe('A short, attractive title (<=10 words).'),
  description_en: z.string().describe('A storytelling product description in English (<=100 words), mentioning craft process and cultural significance.'),
  description_hi: z.string().describe('A storytelling product description in Hindi (<=100 words).'),
  marketingCaption: z.string().describe('A platform-optimized, bilingual marketing caption with a call-to-action.'),
  hashtags: z.array(z.string()).describe('A list of 8-10 relevant hashtags (mixing English and local language).'),
  suggestedPlatforms: z.array(z.string()).describe('An array of other suitable platforms to sell on.'),
  engagementScore: z.number().min(1).max(10).describe('A predicted engagement score from 1-10.'),
});

// This is the final output schema for the entire flow, adapted for the UI.
const GenerateProductDetailsOutputSchema = z.object({
  productTitle: z.string(),
  descriptionEn: z.string(),
  descriptionHi: z.string(),
  marketingCaption: z.string(),
  hashtags: z.array(z.string()),
  suggestedPlatforms: z.array(z.string()),
  engagementScore: z.number(),
  imageMockups: z.array(z.object({
    variation: z.enum(['lifestyle', 'human_interaction', 'poster']),
    url: z.string(),
  })),
});
export type GenerateProductDetailsOutput = z.infer<typeof GenerateProductDetailsOutputSchema>;

export async function generateProductDetails(
  input: GenerateProductDetailsInput
): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}


const generateTextPrompt = ai.definePrompt({
  name: 'generateProductTextPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: z.object({
    transcript: z.string().optional(),
    language: z.enum(['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'pa', 'ml', 'kn']),
    productCategory: z.string(),
    platform: z.enum(['instagram', 'whatsapp', 'facebook', 'etsy']),
    brandTone: z.enum(['traditional', 'royal', 'eco-friendly', 'luxury', 'playful', 'minimal-modern']),
    photo: z.string(), // data URI
  })},
  output: {schema: AITextResponseSchema},
  config: {
    temperature: 0.5,
  },
  prompt: `You are KalaSahayak, an advanced AI content engine for Indian artisans. Your goal is to help them market their products with beautiful, culturally relevant content. Your tone should be authentic, warm, and human.

Analyze the user's input (image, category, tone) and generate a complete marketing kit.

USER INPUT:
- Image: {{media url=photo}}
- Artisan's Voice Note Transcript: "{{transcript}}"
- Product Category: "{{productCategory}}"
- Target Platform: "{{platform}}"
- Desired Brand Tone: "{{brandTone}}"
- Language: "{{language}}"

TASK:
Based on the input, generate a JSON object that includes:
1. \`productTitle\`: A short, attractive title (max 10 words).
2. \`description_en\`: An engaging, storytelling description in English (max 100 words), covering the craft process, materials, and cultural significance.
3. \`description_hi\`: A natural translation of the English description into Hindi.
4. \`marketingCaption\`: A bilingual (Romanized Hindi + English) caption optimized for the specified platform. It should have a conversational tone and a call-to-action (e.g., "DM to buy", "Shop handmade with love ❤️").
5. \`hashtags\`: A list of 8-10 SEO-optimized hashtags, mixing English and Hindi.
6. \`suggestedPlatforms\`: 2-3 other platforms where this product might sell well.
7. \`engagementScore\`: Predict the engagement potential of the content on a scale of 1-10.

Return ONLY the valid JSON object.
`,
});

const imageEnhancementPrompts = [
    {
        variation: 'lifestyle' as const,
        prompt: "Create a realistic lifestyle mockup. Place the product in a natural, real-world setting where it would be used. For example, pottery on a dining table, a lamp in a cozy room, or jewelry on a styled surface. Lighting and shadows must be realistic and warm. Do not change the product itself."
    },
    {
        variation: 'human_interaction' as const,
        prompt: "Create a mockup showing human interaction with the product. For example, a person wearing the jewelry, a family using the home decor item, or hands holding the craft. Ensure the depiction is culturally relevant and respectful. The focus should remain on the product. Do not change the product itself."
    },
    {
        variation: 'poster' as const,
        prompt: "Create a clean, minimalist marketing poster. Place the product on a solid neutral or complementary colored background. Add a simple, elegant text overlay with a short, relevant tagline like 'Crafted with Love' or 'Handmade in India'. The product should be the hero. Do not change the product itself."
    }
];

const transcribeAudioFlow = ai.defineFlow(
  {name: 'transcribeAudioFlow', inputSchema: z.string(), outputSchema: z.string()},
  async (audioDataUri) => {
    const {text} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Transcribe the audio: {{media url=audioDataUri}}`,
    });
    return text;
  }
);


const generateProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFlow',
    inputSchema: GenerateProductDetailsInputSchema,
    outputSchema: GenerateProductDetailsOutputSchema,
  },
  async (input) => {
    
    // Step 1: Transcribe audio if it exists
    let transcript: string | undefined;
    if (input.voiceNoteDataUri) {
        transcript = await transcribeAudioFlow(input.voiceNoteDataUri);
    }
    
    // Step 2: Generate all text content in parallel
    const textGenerationPromise = generateTextPrompt({
      transcript: transcript,
      language: input.language,
      productCategory: input.productCategory,
      platform: input.platform,
      brandTone: input.brandTone,
      photo: input.photoDataUri,
    });

    // Step 3: Generate all image mockups in parallel
    const imageGenerationPromises = imageEnhancementPrompts.map(async ({ variation, prompt }) => {
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-image-preview'),
            prompt: [
                { media: { url: input.photoDataUri } },
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
        };
    });

    // Step 4: Await all parallel tasks
    const [textResult, imageResults] = await Promise.all([
        textGenerationPromise,
        Promise.all(imageGenerationPromises),
    ]);

    const { output: textOutput } = textResult;
    if (!textOutput) {
      throw new Error('Failed to generate product text details.');
    }

    // Step 5: Format the final output for the UI
    
    return {
      productTitle: textOutput.productTitle,
      descriptionEn: textOutput.description_en,
      descriptionHi: textOutput.description_hi,
      marketingCaption: textOutput.marketingCaption,
      hashtags: textOutput.hashtags,
      suggestedPlatforms: textOutput.suggestedPlatforms,
      engagementScore: textOutput.engagementScore,
      imageMockups: imageResults,
    };
  }
);
