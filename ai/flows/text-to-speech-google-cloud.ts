'use server';

/**
 * @fileOverview Text-to-Speech using Google Cloud Text-to-Speech API
 * 
 * This is an alternative implementation using Google Cloud TTS instead of Gemini TTS.
 * Requires Google Cloud Project and Text-to-Speech API enabled.
 */

import { z } from 'genkit';

const TextToSpeechInputSchema = z.object({
  text: z.string(),
  language: z.string().optional(),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('The audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeechGoogleCloud(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
  
  // Initialize client
  const client = new TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  // Map language to voice
  const languageToVoice: Record<string, { languageCode: string; name: string }> = {
    English: { languageCode: 'en-US', name: 'en-US-Neural2-D' },
    Hindi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
    Odia: { languageCode: 'or-IN', name: 'or-IN-Standard-A' },
    Bengali: { languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A' },
    Malayalam: { languageCode: 'ml-IN', name: 'ml-IN-Wavenet-A' },
    Telugu: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
    Tamil: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' },
    Kannada: { languageCode: 'kn-IN', name: 'kn-IN-Wavenet-A' },
  };

  const voice = (input.language && languageToVoice[input.language]) || languageToVoice['English'];

  // Construct the request
  const request = {
    input: { text: input.text },
    voice: {
      languageCode: voice.languageCode,
      name: voice.name,
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: 1.0,
      pitch: 0.0,
    },
  };

  try {
    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Convert audio content to base64
    const audioBase64 = response.audioContent.toString('base64');
    const audioDataUri = `data:audio/mp3;base64,${audioBase64}`;

    return { audio: audioDataUri };
  } catch (error) {
    console.error('Google Cloud TTS Error:', error);
    throw new Error('Failed to generate speech using Google Cloud TTS');
  }
}
