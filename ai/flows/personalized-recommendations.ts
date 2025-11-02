'use server';

/**
 * @fileOverview Personalized recommendation flow for artisans.
 *
 * This flow provides personalized recommendations based on the artisan's past
 * interactions and interests.
 *
 * @interface PersonalizedRecommendationsInput - Input for the personalized recommendations flow.
 * @interface PersonalizedRecommendationsOutput - Output of the personalized recommendations flow.
 * @function getPersonalizedRecommendations - Main function to retrieve personalized recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  artisanProfile: z
    .string()
    .describe(
      'Description of the artisan profile, including their craft, skills, and interests.'
    ),
  pastInteractions: z
    .string()
    .describe(
      'Summary of the artisans past interactions with the system, including queries, feedback, and preferences.'
    ),
  regionalTrends: z
    .string()
    .describe(
      'Description of regional trends related to the artisans craft and location.'
    ),
  language: z.string().describe('The language for the response (e.g., English, Hindi, Odia).'),
});

export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'Personalized recommendations for the artisan, including market trends, design improvements, social media strategies, and content ideas.'
    ),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  model: 'googleai/gemini-2.0-flash-exp',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI mentor providing personalized recommendations to artisans.

  Based on the artisan's profile, past interactions, and regional trends, provide tailored recommendations to help them improve their craft and grow their business.

  Artisan Profile: {{{artisanProfile}}}
  Past Interactions: {{{pastInteractions}}}
  Regional Trends: {{{regionalTrends}}}

  Provide clear and actionable recommendations covering:
  - Market trends and profitable opportunities
  - Design improvements and modernization ideas
  - Social media strategies and content suggestions
  - Digital presentation and marketing tips

  Respond in a warm, simple, and encouraging tone, in the requested language: {{{language}}}.
  
  Provide your recommendations in a well-formatted, easy-to-read text format with clear sections and bullet points.
  Include sections for:
  - Market Trends and Profitable Opportunities
  - Design Improvements and Modernization Ideas
  - Social Media Strategies and Content Suggestions
  - Digital Presentation and Marketing Tips
  
  End with a helpful follow-up question to encourage further interaction.
  
  DO NOT return JSON format. Return plain text with proper formatting, sections, and bullet points.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
