'use server';

/**
 * @fileOverview A design improvement suggestion AI agent.
 *
 * - getDesignImprovementSuggestions - A function that suggests improvements for existing designs.
 * - DesignImprovementInput - The input type for the getDesignImprovementSuggestions function.
 * - DesignImprovementOutput - The return type for the getDesignImprovementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DesignImprovementInputSchema = z.object({
  designDescription: z
    .string()
    .describe('A detailed description of the existing design.'),
  targetAudience: z
    .string()
    .optional()
    .describe('The target audience for the design.'),
  preferredStyle: z
    .string()
    .optional()
    .describe('The preferred style or aesthetic of the design.'),
  designGoals: z
    .string()
    .optional()
    .describe('The goals or purpose of the design.'),
  exampleImage: z
    .string()
    .optional()
    .describe(
      "An example image of the design, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the response (e.g., English, Hindi, Odia).'),
});
export type DesignImprovementInput = z.infer<typeof DesignImprovementInputSchema>;

const DesignImprovementOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of AI-driven suggestions to improve the existing design.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested improvements.'),
});
export type DesignImprovementOutput = z.infer<typeof DesignImprovementOutputSchema>;

export async function getDesignImprovementSuggestions(
  input: DesignImprovementInput
): Promise<DesignImprovementOutput> {
  return designImprovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'designImprovementPrompt',
  model: 'googleai/gemini-2.0-flash-exp',
  input: {schema: DesignImprovementInputSchema},
  output: {schema: DesignImprovementOutputSchema},
  prompt: `You are an AI design assistant helping artisans improve their existing designs.

  Analyze the design based on the following information:
  Description: {{{designDescription}}}
  Target Audience: {{#if targetAudience}}{{{targetAudience}}}{{else}}Not specified{{/if}}
  Preferred Style: {{#if preferredStyle}}{{{preferredStyle}}}{{else}}Not specified{{/if}}
  Design Goals: {{#if designGoals}}{{{designGoals}}}{{else}}Not specified{{/if}}
  {{#if exampleImage}}Example Image: {{media url=exampleImage}}{{/if}}

  Provide a list of specific and actionable suggestions to improve the design, considering color palette, composition, uniqueness, and alignment with current market trends.
  Explain your reasoning behind each suggestion.

  Format your response as a JSON object with "suggestions" (an array of strings) and "reasoning" (a string).
  Respond in the requested language: {{{language}}}.
  `,
});

const designImprovementFlow = ai.defineFlow(
  {
    name: 'designImprovementFlow',
    inputSchema: DesignImprovementInputSchema,
    outputSchema: DesignImprovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
