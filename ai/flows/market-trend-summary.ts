'use server';

/**
 * @fileOverview Summarizes market trends for artisans.
 *
 * - marketTrendSummary - A function that provides a summary of trending colors, materials, and designs.
 * - MarketTrendSummaryInput - The input type for the marketTrendSummary function.
 * - MarketTrendSummaryOutput - The return type for the marketTrendSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketTrendSummaryInputSchema = z.object({
  craft: z.string().describe('The specific craft of the artisan (e.g., handicrafts, handloom, jewelry, pottery, textiles, home decor).'),
  region: z.string().describe('The local or national region the artisan is interested in.'),
  language: z.string().describe('The language for the response (e.g., English, Hindi, Odia).'),
});
export type MarketTrendSummaryInput = z.infer<typeof MarketTrendSummaryInputSchema>;

const MarketTrendSummaryOutputSchema = z.object({
  trendSummary: z.string().describe('A summary of trending colors, materials, and designs relevant to the specified craft and region.'),
  seasonalIdeas: z.string().optional().describe('Seasonal or festival-based product and design ideas.'),
});
export type MarketTrendSummaryOutput = z.infer<typeof MarketTrendSummaryOutputSchema>;

export async function marketTrendSummary(input: MarketTrendSummaryInput): Promise<MarketTrendSummaryOutput> {
  return marketTrendSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketTrendSummaryPrompt',
  model: 'googleai/gemini-2.0-flash-exp',
  input: {schema: MarketTrendSummaryInputSchema},
  output: {schema: MarketTrendSummaryOutputSchema},
  prompt: `You are an AI mentor for local artisans in India. Your goal is to provide summaries of market trends so that the artisan can make informed decisions about their products.

  Provide a summary of trending colors, materials, and designs relevant to the artisan's craft and region.

  Craft: {{{craft}}}
  Region: {{{region}}}

  Also, offer seasonal or festival-based product and design ideas related to their craft and region, if applicable.

  Keep the communication warm, simple, and encouraging, like a local mentor.
  Respond in the requested language: {{{language}}}.
  Be culturally respectful and value traditional art, language, and heritage.
  
  Format your response as JSON with "trendSummary" and "seasonalIdeas" fields.
`,
});

const marketTrendSummaryFlow = ai.defineFlow(
  {
    name: 'marketTrendSummaryFlow',
    inputSchema: MarketTrendSummaryInputSchema,
    outputSchema: MarketTrendSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
