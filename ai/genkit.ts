/**
 * @fileOverview Genkit AI configuration for the AITRYST application.
 * 
 * This file configures the Genkit AI instance with Google AI plugins
 * and other necessary configurations.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit with Google AI
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    }),
  ],
});
