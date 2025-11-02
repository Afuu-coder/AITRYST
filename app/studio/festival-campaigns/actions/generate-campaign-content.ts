'use server';

/**
 * @fileOverview An enhanced AI agent for generating comprehensive festival campaign content.
 * 
 * - generateCampaignContent - Main function that handles multi-platform campaign generation
 * - CampaignInput - Input type with product details and platform specifications
 * - CampaignOutput - Output type with platform-optimized content
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
);

export interface CampaignInput {
  productTitle: string;
  productDescription?: string;
  festival: string;
  festivalDetails?: {
    theme?: string;
    date?: string;
    description?: string;
  };
  language?: string;
  platforms: string[];
}

export interface PlatformContent {
  instagram?: string;
  whatsapp?: string;
  email?: {
    subject: string;
    body: string;
  };
  facebook?: string;
  twitter?: string;
}

export interface CampaignOutput {
  caption: string;
  hashtags: string[];
  discountText: string;
  platformContent: PlatformContent;
  success: boolean;
  error?: string;
}

export async function generateCampaignContent(
  input: CampaignInput
): Promise<CampaignOutput> {
  try {
    console.log('[Campaign Generator] Starting generation for:', input.festival);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
      },
    });

    const prompt = buildEnhancedPrompt(input);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log('[Campaign Generator] Raw response received');
    
    // Clean up response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const campaignData = JSON.parse(text);
    
    console.log('[Campaign Generator] Successfully generated content');
    
    return {
      ...campaignData,
      success: true,
    };
  } catch (error) {
    console.error('[Campaign Generator] Error:', error);
    return {
      caption: '',
      hashtags: [],
      discountText: '',
      platformContent: {},
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate campaign',
    };
  }
}

function buildEnhancedPrompt(input: CampaignInput): string {
  const { productTitle, productDescription, festival, festivalDetails, language, platforms } = input;
  
  // Language instruction mapping
  const languageInstructions: Record<string, string> = {
    'Hindi': 'CRITICAL: You MUST write ALL content in HINDI language only. Use Devanagari script. Do NOT use English except for hashtags.',
    'Bengali': 'CRITICAL: You MUST write ALL content in BENGALI language only. Use Bengali script. Do NOT use English except for hashtags.',
    'Telugu': 'CRITICAL: You MUST write ALL content in TELUGU language only. Use Telugu script. Do NOT use English except for hashtags.',
    'English': 'Write all content in English language.'
  };
  
  const languageInstruction = languageInstructions[language || 'English'] || languageInstructions['English'];
  
  return `SYSTEM: You are an expert festival marketing copywriter specializing in Indian handcrafted goods and artisan products. Your expertise includes:
- Deep understanding of Indian festivals, traditions, and cultural significance
- Crafting emotionally resonant, culturally appropriate messaging
- Creating platform-optimized content (Instagram, WhatsApp, Email, Facebook, Twitter)
- Using appropriate emojis, hashtags, and formatting for each platform
- Connecting products to festival celebrations in authentic, meaningful ways

${languageInstruction}

USER INPUT:
- Product: "{{productTitle}}"
{{#if productDescription}}
- Description: "{{productDescription}}"
{{/if}}
- Festival: "{{festival}}"
{{#if language}}
- Language: "{{language}}"
{{/if}}
{{#if platforms}}
- Platforms: {{platforms}}
{{/if}}

TASK:
${language && language !== 'English' ? `REMEMBER: Write ALL content in ${language} language. This is mandatory!` : ''}
1. Write an engaging, culturally relevant caption (max 200 characters) that connects the product to the festival's spirit and traditions ${language && language !== 'English' ? `in ${language} language` : ''}
2. Generate 7-10 relevant hashtags mixing English, regional language terms, and trending festival tags
3. Suggest a creative, compelling discount or promotional offer that feels special for the festival ${language && language !== 'English' ? `in ${language} language` : ''}
4. If specific platforms are requested, create optimized content for each ${language && language !== 'English' ? `in ${language} language` : ''}:
   - Instagram: Visual storytelling with emojis, line breaks, engaging copy
   - WhatsApp: Personal, direct message with clear CTA and WhatsApp formatting
   - Email: Professional subject line and warm body content with structure
   - Facebook: Community-focused, shareable content perfect for discussions
   - Twitter/X: Concise, impactful message optimized for character limits
5. Use authentic cultural references and avoid stereotypes
6. Include festival-specific emojis and symbols
7. Make the tone celebratory, warm, and persuasive
8. Add compelling calls-to-action appropriate to each platform

EXAMPLE OUTPUT for Diwali:
{
  "caption": "Light up your Diwali with our Handwoven Blue Jamdani Sari! ✨ Graceful, elegant, and timeless—perfect for your festive celebrations. #SariLove",
  "hashtags": ["#DiwaliSari", "#Jamdani", "#FestivalFashion", "#HandloomLove", "#दिवाली", "#DiwaliCollection", "#IndianHandloom", "#FestiveWear", "#ArtisanCraft", "#CelebrateDiwali"],
  "discountText": "Illuminate your celebrations! Get a free set of handcrafted terracotta diyas + 15% off on all sarees this Diwali 🪔",
  "instagramPost": "✨ This Diwali, wear tradition with pride! ✨\\n\\n🪔 Introducing our exquisite Handwoven Blue Jamdani Sari\\n\\nCrafted by master weavers, each thread tells a story of heritage and artistry. The intricate patterns shimmer like diyas in the night, making you the center of attention at every celebration.\\n\\n🎁 DIWALI SPECIAL:\\n• 15% OFF on all sarees\\n• FREE terracotta diya set with purchase\\n• Express delivery before Diwali\\n\\nDM us to order or visit link in bio!\\n\\n#DiwaliSari #Jamdani #FestivalFashion #HandloomLove #दिवाली #DiwaliCollection #IndianHandloom #FestiveWear #ArtisanCraft #CelebrateDiwali",
  "whatsappMessage": "🪔 *Diwali Special Offer!* 🪔\\n\\nNamaste! ✨\\n\\nMake this Diwali truly special with our *Handwoven Blue Jamdani Sari*\\n\\n✅ Authentic handloom craftsmanship\\n✅ Perfect for festive occasions\\n✅ Limited pieces available\\n\\n🎁 *EXCLUSIVE DIWALI DEAL:*\\n• 15% Discount\\n• FREE Terracotta Diya Set\\n• Express Delivery\\n\\n💬 Reply *INTERESTED* to place your order\\n\\nHappy Diwali! 🪔✨",
  "emailContent": {
    "subject": "✨ Diwali Special: Handwoven Jamdani Sarees + FREE Diyas 🪔",
    "body": "Dear Valued Customer,\\n\\nWishing you and your family a Happy and Prosperous Diwali! 🪔✨\\n\\nThis festival of lights, we're celebrating with you by offering our exquisite collection of Handwoven Jamdani Sarees.\\n\\n✨ WHY CHOOSE OUR JAMDANI SAREES?\\n\\n• Authentic handloom craftsmanship by master weavers\\n• Intricate traditional patterns that shine like diyas\\n• Premium quality fabric for lasting elegance\\n• Perfect for Diwali celebrations and gifting\\n\\n🎁 SPECIAL DIWALI OFFER:\\n\\n✓ 15% OFF on entire saree collection\\n✓ FREE handcrafted terracotta diya set with every purchase\\n✓ Express delivery before Diwali\\n✓ Gift wrapping available\\n\\nDon't miss this limited-time offer! Shop now and make this Diwali unforgettable.\\n\\n[Shop Now Button]\\n\\nWith warm festive wishes,\\nThe Artisan Team\\n\\nP.S. Offer valid until [date]. Limited stock available!"
  },
  "facebookPost": "✨ Diwali is here! Time to shine in tradition! ✨\\n\\n🪔 Presenting our stunning Handwoven Blue Jamdani Sari - where craftsmanship meets celebration!\\n\\nEach saree is lovingly handwoven by skilled artisans, featuring intricate patterns that dance like flames of a diya. Perfect for your Diwali parties, puja ceremonies, or as a thoughtful gift for your loved ones.\\n\\n🎁 DIWALI BONANZA:\\n→ 15% OFF on all sarees\\n→ FREE terracotta diya set\\n→ Fast delivery before Diwali\\n\\n👉 Comment 'INTERESTED' or DM us to order!\\n👉 Tag someone who would love this!\\n\\nLet's celebrate the festival of lights in handcrafted elegance! 🪔✨\\n\\n#DiwaliSari #Jamdani #FestivalFashion #HandloomLove #दिवाली #ArtisanCraft #CelebrateDiwali #IndianHandloom #FestiveWear #DiwaliCollection",
  "twitterPost": "✨ Diwali Special Alert! 🪔\\n\\nHandwoven Blue Jamdani Sari\\n✅ 15% OFF\\n✅ FREE Diya Set\\n✅ Fast Delivery\\n\\nShine in tradition this Diwali!\\n\\n#DiwaliSari #Jamdani #FestivalFashion #दिवाली #HandloomLove\\n\\n[Link]"
}

NOW, based on the user's input, generate comprehensive, culturally authentic festival campaign content that will help artisans connect with customers and boost sales during this special celebration.

USER INPUT:
- Product: "${productTitle}"
${productDescription ? `- Description: "${productDescription}"` : ''}
- Festival: "${festival}"
${festivalDetails?.theme ? `- Festival Theme: "${festivalDetails.theme}"` : ''}
${festivalDetails?.date ? `- Festival Date: "${festivalDetails.date}"` : ''}
${festivalDetails?.description ? `- Festival Context: "${festivalDetails.description}"` : ''}
${language ? `- Language: "${language}"` : ''}
- Platforms: ${platforms.join(', ')}

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "caption": "<200 char festive caption>",
  "hashtags": ["#hashtag1", "#hashtag2", ... 7-10 tags],
  "discountText": "<creative offer text>",
  "platformContent": {
    ${platforms.includes('instagram') ? '"instagram": "<formatted post>",' : ''}
    ${platforms.includes('whatsapp') ? '"whatsapp": "<formatted message>",' : ''}
    ${platforms.includes('email') ? '"email": { "subject": "<subject>", "body": "<body>" },' : ''}
    ${platforms.includes('facebook') ? '"facebook": "<formatted post>",' : ''}
    ${platforms.includes('twitter') ? '"twitter": "<formatted tweet>"' : ''}
  }
}`;
}
