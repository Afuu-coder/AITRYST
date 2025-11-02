'use server';

/**
 * @fileOverview Recommends content ideas for social media ad campaigns to help artisans reach a wider audience and drive sales.
 *
 * - recommendAdCampaignContent - A function that recommends content ideas for social media ad campaigns.
 * - RecommendAdCampaignContentInput - The input type for the recommendAdCampaignContent function.
 * - RecommendAdCampaignContentOutput - The return type for the recommendAdCampaignContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendAdCampaignContentInputSchema = z.object({
  craftType: z.string().describe('The type of craft the artisan specializes in (e.g., pottery, weaving, jewelry).'),
  targetAudience: z.string().describe('The target audience for the ad campaign (e.g., young adults, tourists, collectors).'),
  campaignGoal: z.string().describe('The goal of the ad campaign (e.g., increase sales, brand awareness, website traffic).'),
  pastCampaignPerformance: z.string().optional().describe('A summary of past ad campaign performance, if available.'),
  preferredPlatform: z.string().describe('The social media platform for the ad campaign (e.g., Instagram, Facebook, YouTube).'),
  examplePosts: z.string().optional().describe('Examples of artisan posts'),
  language: z.string().describe('The language for the response (e.g., English, Hindi, Odia).'),
});
export type RecommendAdCampaignContentInput = z.infer<typeof RecommendAdCampaignContentInputSchema>;

const RecommendAdCampaignContentOutputSchema = z.object({
  contentIdeas: z.array(z.string()).describe('A list of content ideas for the social media ad campaign.'),
  captionSuggestions: z.array(z.string()).describe('A list of caption suggestions for the content ideas.'),
  hashtagSuggestions: z.array(z.string()).describe('A list of relevant hashtag suggestions.'),
});
export type RecommendAdCampaignContentOutput = z.infer<typeof RecommendAdCampaignContentOutputSchema>;

export async function recommendAdCampaignContent(
  input: RecommendAdCampaignContentInput
): Promise<RecommendAdCampaignContentOutput> {
  return recommendAdCampaignContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendAdCampaignContentPrompt',
  model: 'googleai/gemini-2.0-flash-exp',
  input: {schema: RecommendAdCampaignContentInputSchema},
  output: {schema: RecommendAdCampaignContentOutputSchema},
  prompt: `You are an AI assistant helping artisans create effective social media ad campaigns.

  Based on the artisan's craft, target audience, campaign goal, and preferred platform, generate content ideas, caption suggestions, and hashtag suggestions.

  Craft Type: {{{craftType}}}
  Target Audience: {{{targetAudience}}}
  Campaign Goal: {{{campaignGoal}}}
  Past Campaign Performance: {{{pastCampaignPerformance}}}
  Preferred Platform: {{{preferredPlatform}}}
  Example Posts: {{{examplePosts}}}

  Provide creative and engaging content ideas that will resonate with the target audience and help achieve the campaign goal.
  Suggest captions that are attention-grabbing and encourage interaction.
  Include relevant hashtags to increase the reach of the ad campaign.
  Always use language that is warm and encouraging.
  Respond in the requested language: {{{language}}}.

  Format your response as a JSON object with the following structure:
  {
    "contentIdeas": ["idea 1", "idea 2", "idea 3"],
    "captionSuggestions": ["caption 1", "caption 2", "caption 3"],
    "hashtagSuggestions": ["#hashtag1", "#hashtag2", "#hashtag3"]
  }
  `,
});

const recommendAdCampaignContentFlow = ai.defineFlow(
  {
    name: 'recommendAdCampaignContentFlow',
    inputSchema: RecommendAdCampaignContentInputSchema,
    outputSchema: RecommendAdCampaignContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
