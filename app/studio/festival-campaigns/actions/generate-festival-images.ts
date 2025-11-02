'use server';

/**
 * @fileOverview An AI agent for generating festival-themed marketing images for products.
 * 
 * - generateFestivalImages - A function that handles the image generation process.
 * - GenerateFestivalImagesInput - The input type for the generateFestivalImages function.
 * - GenerateFestivalImagesOutput - The return type for the generateFestivalImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateFestivalImagesInputSchema = z.object({
  photoDataUri: z.string().describe(
    "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  productName: z.string().describe('The name of the product.'),
  artisanName: z.string().describe('The name of the artisan or shop.'),
  festival: z.string().describe('The festival for the campaign.'),
  language: z.enum(['en', 'hi']).optional().describe('The language for text overlays.'),
});
export type GenerateFestivalImagesInput = z.infer<typeof GenerateFestivalImagesInputSchema>;

const GenerateFestivalImagesOutputSchema = z.object({
  images: z.array(z.object({
    url: z.string().describe("The generated image as a data URI."),
    variation: z.string().describe("The name of the variation (e.g., 'Festive Background')."),
  })),
});
export type GenerateFestivalImagesOutput = z.infer<typeof GenerateFestivalImagesOutputSchema>;

// Legacy export types for compatibility
export type FestivalImageInput = GenerateFestivalImagesInput;
export type ImageVariation = { url: string; variation: string; prompt?: string };
export type FestivalImageOutput = { images: ImageVariation[]; success: boolean; error?: string; };

const festivalSlogans: Record<string, {en: string, hi: string}> = {
  'Diwali': { en: 'Light up your home with handmade elegance!', hi: 'इस दिवाली अपने घर को हाथ से बनी सुंदरता से रोशन करें!' },
  'Holi': { en: 'Add colors of creativity to your celebrations!', hi: 'अपने त्योहारों में रचनात्मकता के रंग जोड़ें!' },
  'Eid': { en: 'Celebrate the spirit of togetherness with artisanal beauty.', hi: 'शिल्प सौंदर्य के साथ एकता की भावना का जश्न मनाएं।' },
  'Christmas': { en: 'Bring home handcrafted warmth this Christmas.', hi: 'इस क्रिसमस घर में दस्तकारी की गर्माहट लाएं।' },
  'Raksha Bandhan': { en: 'A perfect handcrafted gift of love for your sibling.', hi: 'अपने भाई-बहन के लिए प्यार का एक आदर्श हस्तनिर्मित उपहार।' },
  'Navratri': { en: 'Celebrate Navratri with vibrant, traditional crafts.', hi: 'नवरात्रि का जश्न मनाएं, जीवंत, पारंपरिक शिल्पों के साथ।' },
  'Onam': { en: 'Grace your home with traditional artistry this Onam.', hi: 'इस ओणम पर अपने घर को पारंपरिक कला से सजाएं।' },
  'Pongal': { en: 'Celebrate Pongal with the richness of tradition.', hi: 'पोंगल को परंपरा की समृद्धि के साथ मनाएं।' },
  'Makar Sankranti': { en: 'Soar high with handcrafted treasures this Makar Sankranti.', hi: 'इस मकर संक्रांति पर हाथ से बने खजानों के साथ ऊंची उड़ान भरें।' },
  'Baisakhi': { en: 'Celebrate the harvest of happiness with Baisakhi.', hi: 'बैसाखी के साथ खुशियों की फसल का जश्न मनाएं।' },
  'Durga Puja': { en: 'Embrace divine artistry this Durga Puja.', hi: 'इस दुर्गा पूजा में दिव्य कला को अपनाएं।' },
  'Ganesh Chaturthi': { en: 'Welcome home blessings with handcrafted devotion.', hi: 'हस्तनिर्मित भक्ति के साथ घर में आशीर्वाद का स्वागत करें।' },
  'Janmashtami': { en: 'Celebrate the divine play with timeless crafts.', hi: 'कालातीत शिल्पों के साथ दिव्य लीला का जश्न मनाएं।' },
  'Lohri': { en: 'Ignite the warmth of tradition this Lohri.', hi: 'इस लोहड़ी परंपरा की गर्माहट जलाएं।' },
  'Independence Day': { en: 'Celebrate freedom with the spirit of Indian craftsmanship.', hi: 'भारतीय शिल्प कौशल की भावना के साथ स्वतंत्रता का जश्न मनाएं।' },
  'Republic Day': { en: 'Honor the nation with the pride of Indian artistry.', hi: 'भारतीय कला के गौरव के साथ राष्ट्र का सम्मान करें।' },
  'Karwa Chauth': { en: 'A token of love, handcrafted for your special one.', hi: 'प्यार का प्रतीक, आपके खास के लिए दस्तकारी।' },
  'Guru Nanak Jayanti': { en: 'Reflect and rejoice with handcrafted serenity.', hi: 'हस्तनिर्मित शांति के साथ चिंतन और आनंद मनाएं।' },
  'Default': { en: `Celebrate with a touch of handmade elegance.`, hi: `त्योहार हस्तनिर्मित सुंदरता के स्पर्श के साथ मनाएं।` }
};

const festivalDecor: Record<string, string> = {
  'Diwali': 'warm lighting, diyas, marigold, gold tones',
  'Holi': 'colorful powder splashes, bright hues, joy & playfulness',
  'Raksha Bandhan': 'rakhis, threads, gifts, siblings imagery, pastel tones',
  'Eid': 'crescent moon, lanterns, stars, green-gold palette',
  'Christmas': 'twinkling lights, pine leaves, snow, red-green palette',
  'Onam': 'pookalam floral carpets, Kerala flowers, traditional motifs',
  'Ganesh Chaturthi': 'Lord Ganesha icons, modak plates, festive orange tones',
  'Navratri': 'dandiya sticks, goddess motifs, vibrant pinks and purples',
  'Baisakhi': 'wheat fields, Punjabi dhol, traditional orange-yellow theme',
  'Default': 'subtle cultural patterns, celebratory feel'
};

function getVariationPrompts(input: GenerateFestivalImagesInput): { variation: string; prompt: string }[] {
  const { productName, artisanName, festival, language } = input;

  const slogan = (festivalSlogans[festival] || festivalSlogans['Default'])[language || 'en'];
  const decor = festivalDecor[festival] || festivalDecor['Default'];

  const prompts = {
    'Festive Background': `Photorealistic poster of the product. Background has ${decor}. Warm color palette. Tasteful text overlay in ${language || 'en'} with top text = '${slogan}'. Watermark: 'by ${artisanName}' bottom-left.`,
    'Mockup Scene': `Product placed in a simple, elegant living room mockup decorated for ${festival} using elements like ${decor}. Add a small watermark 'Handcrafted by ${artisanName}' in a bottom corner.`,
    'Clean Product Poster': `Minimal background with a decorative ${festival} motif (like a rangoli pattern for Diwali or stars for Eid). Product is centered. Large, bold text for '${productName}'. Include shop/WhatsApp CTA button area and watermark 'by ${artisanName}'.`
  };

  return [
      { variation: 'Festive Background', prompt: prompts['Festive Background'] },
      { variation: 'Mockup Scene', prompt: prompts['Mockup Scene'] },
      { variation: 'Clean Product Poster', prompt: prompts['Clean Product Poster'] }
  ];
}

export async function generateFestivalImages(
  input: GenerateFestivalImagesInput
): Promise<GenerateFestivalImagesOutput> {
  return generateFestivalImagesFlow(input);
}

const generateFestivalImagesFlow = ai.defineFlow(
  {
    name: 'generateFestivalImagesFlow',
    inputSchema: GenerateFestivalImagesInputSchema,
    outputSchema: GenerateFestivalImagesOutputSchema,
  },
  async (input) => {
    const variationPrompts = getVariationPrompts(input);

    const imageGenerationPromises = variationPrompts.map(async ({ variation, prompt }) => {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-image-preview'),
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: `SYSTEM: You are an expert marketing art director. Create a photorealistic composite for a social media post. Always generate visuals, color palette, and decorations based strictly on the selected festival name. Never reuse elements from other festivals. Maintain natural product texture; do not distort the product. USER: ${prompt}` },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error(`Image generation failed for variation: ${variation}`);
      }
      
      return {
        url: media.url,
        variation: variation,
      };
    });

    const generatedImages = await Promise.all(imageGenerationPromises);

    return {
      images: generatedImages,
    };
  }
);

// Wrapper for legacy API compatibility
export async function generateFestivalImagesVertex(input: FestivalImageInput): Promise<FestivalImageOutput> {
  try {
    const result = await generateFestivalImages(input);
    return {
      success: true,
      images: result.images.map(img => ({ ...img, prompt: '' }))
    };
  } catch (error) {
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : 'Failed to generate images'
    };
  }
}
