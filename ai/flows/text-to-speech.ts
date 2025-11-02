'use server';

/**
 * @fileOverview A text-to-speech flow using Google Cloud Text-to-Speech API.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {z} from 'zod';
import {TextToSpeechClient} from '@google-cloud/text-to-speech';

const TextToSpeechInputSchema = z.object({
  text: z.string(),
  language: z.string().optional(),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('The audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

// Map language to Google Cloud TTS voice
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

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  try {
    // Initialize Google Cloud TTS client
    const client = new TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Get voice configuration for selected language
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

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Convert audio content to base64
    if (!response.audioContent) {
      throw new Error('No audio content returned from Google Cloud TTS');
    }

    const audioBase64 = Buffer.from(response.audioContent).toString('base64');
    const audioDataUri = `data:audio/mp3;base64,${audioBase64}`;

    return { audio: audioDataUri };
  } catch (error: any) {
    console.error('Google Cloud TTS Error:', error);
    throw new Error(`Failed to generate speech: ${error.message}`);
  }
}
