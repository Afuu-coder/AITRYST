'use server';

/**
 * @fileOverview A social media caption generator for artisans.
 *
 * - generateSocialMediaCaptions - A function that generates social media captions and hashtags.
 * - GenerateSocialMediaCaptionsInput - The input type for the generateSocialMediaCaptions function.
 * - GenerateSocialMediaCaptionsOutput - The return type for the generateSocialMediaCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaCaptionsInputSchema = z.object({
  productName: z.string().describe('The name of the artisan product.'),
  craftType: z.string().describe('The type of craft (e.g., pottery, weaving, jewelry).'),
  productDescription: z.string().describe('A detailed description of the product, including materials, techniques, and inspiration.'),
  targetPlatform: z.enum(['Instagram', 'Facebook', 'YouTube', 'LinkedIn']).describe('The social media platform for which the caption is intended.'),
  tone: z.string().optional().describe('The desired tone of the caption (e.g., warm, professional, humorous).'),
  language: z.string().describe('The language for the caption (e.g., English, Hindi, Odia).'),
});
export type GenerateSocialMediaCaptionsInput = z.infer<typeof GenerateSocialMediaCaptionsInputSchema>;

const GenerateSocialMediaCaptionsOutputSchema = z.object({
  caption: z.string().describe('An engaging social media caption for the product.'),
  hashtags: z.string().describe('Relevant hashtags to increase visibility.'),
});
export type GenerateSocialMediaCaptionsOutput = z.infer<typeof GenerateSocialMediaCaptionsOutputSchema>;

export async function generateSocialMediaCaptions(input: GenerateSocialMediaCaptionsInput): Promise<GenerateSocialMediaCaptionsOutput> {
  return generateSocialMediaCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaCaptionsPrompt',
  model: 'googleai/gemini-2.0-flash-exp',
  input: {schema: GenerateSocialMediaCaptionsInputSchema},
  output: {schema: GenerateSocialMediaCaptionsOutputSchema},
  prompt: `You are an AI assistant helping artisans generate engaging social media captions and hashtags.

  Given the following information about the artisan's product, create a caption and a list of hashtags suitable for the specified social media platform and language.

  Product Name: {{{productName}}}
  Craft Type: {{{craftType}}}
  Product Description: {{{productDescription}}}
  Target Platform: {{{targetPlatform}}}
  Tone: {{{tone}}}
  Language: {{{language}}}

  Generate an engaging caption and relevant hashtags for this product.
  Format your response as JSON with "caption" and "hashtags" fields.`, 
});

const generateSocialMediaCaptionsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaCaptionsFlow',
    inputSchema: GenerateSocialMediaCaptionsInputSchema,
    outputSchema: GenerateSocialMediaCaptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
