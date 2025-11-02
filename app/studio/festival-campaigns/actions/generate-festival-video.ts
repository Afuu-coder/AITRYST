'use server';

/**
 * @fileOverview Enhanced AI agent for generating festival-themed marketing videos
 * 
 * Features:
 * - Product photo analysis with Gemini Vision API
 * - Text description support for better accuracy
 * - Festival-specific video generation with Veo 3.0
 * - Product consistency maintenance in generated videos
 * - Multi-modal input support (photo + text)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
);

// Initialize Gemini Vision model for image analysis
const visionModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

export interface VideoGenerationInput {
  // Product identification
  productPhoto?: string; // Base64 or data URI of product photo
  productDescription?: string; // Text description of product
  productName: string;
  artisanName: string;
  
  // Festival and styling
  festival: string;
  aspectRatio: '9:16' | '16:9';
  duration?: number;
  
  // Additional customization
  colorScheme?: string[];
  brandingText?: string;
  callToAction?: string;
}

export interface ProductAnalysis {
  visualDescription: string;
  category: string;
  colors: string[];
  materials: string[];
  culturalElements: string[];
  keyFeatures: string[];
  suggestedStyling: string;
}

export interface VideoGenerationOutput {
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  productAnalysis?: ProductAnalysis;
  generatedPrompt?: string;
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Main function to generate festival marketing video
 */
export async function generateFestivalVideo(
  input: VideoGenerationInput
): Promise<VideoGenerationOutput> {
  try {
    console.log(`[Video Generator] Starting generation for ${input.festival}`);
    
    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
      return {
        success: false,
        error: 'VALIDATION_ERROR',
        message: validation.message
      };
    }

    // Analyze product if photo is provided
    let productAnalysis: ProductAnalysis | undefined;
    if (input.productPhoto) {
      console.log('[Video Generator] Analyzing product photo...');
      productAnalysis = await analyzeProductImage(
        input.productPhoto,
        input.productDescription,
        input.festival
      );
    }

    // Generate enhanced prompt based on all inputs
    const enhancedPrompt = await generateEnhancedPrompt(
      input,
      productAnalysis
    );

    // Generate video with Veo 3.0
    const videoResult = await generateVideoWithVeo(
      input,
      enhancedPrompt,
      productAnalysis
    );

    return {
      ...videoResult,
      productAnalysis,
      generatedPrompt: enhancedPrompt,
    };

  } catch (error) {
    console.error('[Video Generator] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate video'
    };
  }
}

/**
 * Validate user input
 */
function validateInput(input: VideoGenerationInput): { valid: boolean; message?: string } {
  if (!input.productPhoto && !input.productDescription) {
    return {
      valid: false,
      message: 'Please provide either a product photo or description (or both for best results)'
    };
  }

  if (!input.productName || input.productName.trim() === '') {
    return {
      valid: false,
      message: 'Product name is required'
    };
  }

  if (!input.artisanName || input.artisanName.trim() === '') {
    return {
      valid: false,
      message: 'Artisan name is required'
    };
  }

  if (!input.festival) {
    return {
      valid: false,
      message: 'Please select a festival'
    };
  }

  // Validate image format if provided
  if (input.productPhoto) {
    const isValidImage = validateImageFormat(input.productPhoto);
    if (!isValidImage) {
      return {
        valid: false,
        message: 'Invalid image format. Please upload a valid image file'
      };
    }
  }

  return { valid: true };
}

/**
 * Validate image format
 */
function validateImageFormat(imageData: string): boolean {
  // Check if it's a valid data URI or base64
  const dataUriRegex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  
  return dataUriRegex.test(imageData) || base64Regex.test(imageData);
}

/**
 * Analyze product image using Gemini Vision API
 */
async function analyzeProductImage(
  photoDataUri: string,
  textDescription?: string,
  festival?: string
): Promise<ProductAnalysis> {
  try {
    // Prepare image for Gemini Vision
    const imageData = prepareImageData(photoDataUri);
    
    // Create analysis prompt
    const analysisPrompt = `Analyze this product image for creating a festival marketing video.
${textDescription ? `Additional context: ${textDescription}` : ''}
${festival ? `This will be used for ${festival} marketing.` : ''}

Please provide:
1. Detailed visual description of the product
2. Product category/type
3. Dominant colors (list up to 5)
4. Materials/textures visible
5. Any cultural or traditional elements
6. Key features that should be highlighted
7. Suggested styling for video presentation

Format your response as JSON with these exact keys:
{
  "visualDescription": "detailed description",
  "category": "product category",
  "colors": ["color1", "color2"],
  "materials": ["material1", "material2"],
  "culturalElements": ["element1", "element2"],
  "keyFeatures": ["feature1", "feature2"],
  "suggestedStyling": "styling suggestions"
}`;

    // Generate content with vision model
    const result = await visionModel.generateContent([
      analysisPrompt,
      {
        inlineData: {
          mimeType: getMimeType(photoDataUri),
          data: imageData
        }
      }
    ]);

    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
    }

    // Fallback to structured extraction
    return extractStructuredData(text);

  } catch (error) {
    console.error('Product analysis error:', error);
    // Return default analysis on error
    return {
      visualDescription: textDescription || 'Product for festival marketing',
      category: 'Artisan Product',
      colors: ['traditional'],
      materials: ['handcrafted'],
      culturalElements: ['festive'],
      keyFeatures: ['authentic', 'handmade'],
      suggestedStyling: 'Traditional festive presentation'
    };
  }
}

/**
 * Prepare image data for API
 */
function prepareImageData(photoDataUri: string): string {
  // Remove data URI prefix if present
  const base64Match = photoDataUri.match(/base64,(.+)/);
  if (base64Match) {
    return base64Match[1];
  }
  // Assume it's already base64 if no prefix
  return photoDataUri;
}

/**
 * Get MIME type from data URI
 */
function getMimeType(dataUri: string): string {
  const match = dataUri.match(/data:(.+?);/);
  return match ? match[1] : 'image/jpeg';
}

/**
 * Extract structured data from text response
 */
function extractStructuredData(text: string): ProductAnalysis {
  // Implement basic text parsing as fallback
  return {
    visualDescription: extractSection(text, 'description') || 'Artisan product',
    category: extractSection(text, 'category') || 'Handcrafted item',
    colors: extractList(text, 'colors') || ['traditional'],
    materials: extractList(text, 'materials') || ['natural'],
    culturalElements: extractList(text, 'cultural') || ['festive'],
    keyFeatures: extractList(text, 'features') || ['handmade'],
    suggestedStyling: extractSection(text, 'styling') || 'Elegant presentation'
  };
}

function extractSection(text: string, keyword: string): string {
  const regex = new RegExp(`${keyword}[:\s]+(.+?)(?:
|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractList(text: string, keyword: string): string[] {
  const section = extractSection(text, keyword);
  return section ? section.split(',').map(s => s.trim()).filter(s => s) : [];
}

/**
 * Generate enhanced prompt combining all inputs
 */
async function generateEnhancedPrompt(
  input: VideoGenerationInput,
  productAnalysis?: ProductAnalysis
): Promise<string> {
  const { productName, artisanName, festival, duration = 8, callToAction } = input;
  
  // Get base festival prompt
  let prompt = createFestivalPrompt(festival, productName, artisanName, duration);
  
  // Enhance with product analysis if available
  if (productAnalysis) {
    prompt += `

PRODUCT SPECIFICATIONS (MAINTAIN EXACT APPEARANCE):
- Visual Reference: ${productAnalysis.visualDescription}
- Category: ${productAnalysis.category}
- Color Palette: ${productAnalysis.colors.join(', ')}
- Materials/Textures: ${productAnalysis.materials.join(', ')}
- Cultural Elements: ${productAnalysis.culturalElements.join(', ')}
- Key Features to Highlight: ${productAnalysis.keyFeatures.join(', ')}
- Presentation Style: ${productAnalysis.suggestedStyling}

IMPORTANT: The product shown in the video MUST match the exact appearance from the uploaded photo. 
Do not alter or substitute the product design. Maintain visual consistency throughout.`;
  }
  
  // Add text description if provided
  if (input.productDescription) {
    prompt += `

PRODUCT DESCRIPTION:
${input.productDescription}`;
  }
  
  // Add custom branding if provided
  if (input.brandingText) {
    prompt += `

BRANDING:
Include this text in the video: "${input.brandingText}"`;
  }
  
  // Add call to action if provided
  if (callToAction) {
    prompt += `

CALL TO ACTION:
End with: "${callToAction}"`;
  }
  
  // Add color scheme if specified
  if (input.colorScheme && input.colorScheme.length > 0) {
    prompt += `

CUSTOM COLOR SCHEME:
Incorporate these colors: ${input.colorScheme.join(', ')}`;
  }
  
  // Add technical specifications
  prompt += `

TECHNICAL SPECIFICATIONS:
- Aspect Ratio: ${input.aspectRatio}
- Duration: ${duration} seconds
- Quality: High definition, professional grade
- Style: Cinematic with smooth transitions
- Product Focus: Maintain product as central element throughout`;
  
  return prompt;
}

/**
 * Sanitize prompt to prevent injection attacks
 */
function sanitizePrompt(prompt: string): string {
  // Remove potentially harmful characters and limit length
  return prompt
    .replace(/[<>]/g, '') // Remove HTML-like tags
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 2000) // Limit prompt length
    .trim();
}

/**
 * Generate video using Veo 3.1 Fast API
 */
async function generateVideoWithVeo(
  input: VideoGenerationInput,
  prompt: string,
  productAnalysis?: ProductAnalysis
): Promise<VideoGenerationOutput> {
  try {
    // Sanitize the prompt for security
    const sanitizedPrompt = sanitizePrompt(prompt);
    
    console.log('[Veo Generator] Generating video with Veo 3.1 Fast...');
    console.log('[Veo Generator] Prompt length:', sanitizedPrompt.length);
    
    // Call the API route which handles the actual Veo API call
    const response = await fetch('/api/generate-festival-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        festival: input.festival,
        productName: input.productName,
        artisanName: input.artisanName,
        productDescription: input.productDescription,
        productPhoto: input.productPhoto,
        aspectRatio: input.aspectRatio,
        durationSeconds: String(input.duration || 8)
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to generate video');
    }

    const result = await response.json();
    
    // Check if video was generated successfully
    if (result.success && result.response?.predictions?.[0]) {
      const videoData = result.response.predictions[0];
      
      return {
        success: true,
        videoUrl: videoData.bytesBase64Encoded ? 
          `data:video/mp4;base64,${videoData.bytesBase64Encoded}` : 
          videoData.gcsUri,
        duration: input.duration || 8,
        productAnalysis,
        generatedPrompt: sanitizedPrompt,
        message: 'Video generated successfully!'
      };
    } else {
      return {
        success: false,
        error: result.error || 'VIDEO_GENERATION_FAILED',
        message: result.message || 'Failed to generate video',
        productAnalysis,
        generatedPrompt: sanitizedPrompt
      };
    }
  } catch (error) {
    console.error('[Veo Generator] Error:', error);
    return {
      success: false,
      error: 'VIDEO_GENERATION_ERROR',
      message: error instanceof Error ? error.message : 'Failed to generate video',
      productAnalysis,
      generatedPrompt: prompt
    };
  }
}

/**
 * Festival-specific prompt templates
 */
function createFestivalPrompt(
  festival: string,
  productName: string,
  artisanName: string,
  duration: number = 8
): string {
  const festivalPrompts: Record<string, string> = {
    'Diwali': `Generate a ${duration}-second cinematic Diwali marketing video.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Golden hour lighting with diya-inspired warm glows
- Particle effects: floating embers, sparkles, light bokeh
- Color palette: deep oranges, golds, rich reds, warm yellows
- Background elements: diyas, rangoli patterns, marigold flowers
- Camera work: Slow zoom-ins, elegant product rotations, focus pulls

SCENE PROGRESSION:
1. Opening (0-2s): Darkness slowly illuminated by diyas
2. Product reveal (2-4s): Gentle light reveals product with glow effect
3. Detail shots (4-6s): Close-ups of craftsmanship with festive elements
4. Celebration shot (6-7s): Product in full festive setting
5. Closing (7-8s): Brand message with sparkle effects

ATMOSPHERE: Warm, prosperous, celebratory, elegant, traditional yet modern`,

    'Holi': `Generate a ${duration}-second vibrant Holi marketing video.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Explosive color powder effects and splashes
- Color palette: vivid pink, yellow, green, blue, orange
- Dynamic particle systems for color dust
- High-energy camera movements: quick pans, dynamic zooms
- Slow-motion color splash moments

SCENE PROGRESSION:
1. Opening (0-1s): White/neutral scene
2. Color explosion (1-3s): Colors burst revealing product
3. Dynamic showcase (3-5s): Product with swirling colors
4. Celebration (5-7s): Multiple color splashes with product focus
5. Closing (7-8s): Product clear shot with color settling

ATMOSPHERE: Joyful, energetic, playful, vibrant, celebratory`,

    'Raksha Bandhan': `Generate a ${duration}-second emotional Raksha Bandhan video.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Soft, natural lighting with golden hour warmth
- Color palette: saffron, red, gold, white
- Subtle particle effects: floating threads, gentle sparkles
- Smooth, emotional camera movements
- Bokeh background with traditional elements

SCENE PROGRESSION:
1. Opening (0-2s): Rakhi thread or sibling hands
2. Gift reveal (2-4s): Product presented as perfect gift
3. Emotional moment (4-6s): Product details with warmth
4. Connection (6-7s): Product with rakhi elements
5. Closing (7-8s): Heartfelt message

ATMOSPHERE: Emotional, warm, traditional, caring, precious`,

    'Eid': `Generate a ${duration}-second elegant Eid marketing video.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Soft moonlight-inspired lighting
- Color palette: emerald green, white, gold, silver
- Crescent moon and star motifs as overlays
- Graceful camera movements with gentle arcs
- Islamic geometric patterns in background

SCENE PROGRESSION:
1. Opening (0-2s): Crescent moon transition
2. Elegant reveal (2-4s): Product with soft lighting
3. Detail appreciation (4-6s): Craftsmanship focus
4. Celebration setting (6-7s): Product with Eid elements
5. Closing (7-8s): Eid Mubarak message

ATMOSPHERE: Peaceful, blessed, elegant, spiritual, joyous`,

    'Christmas': `Generate a ${duration}-second magical Christmas marketing video.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Warm indoor lighting with twinkling effects
- Color palette: deep red, forest green, gold, snow white
- Particle effects: snow, sparkles, light trails
- Cozy camera work with gentle movements
- Bokeh from Christmas lights throughout

SCENE PROGRESSION:
1. Opening (0-2s): Twinkling lights fade in
2. Gift reveal (2-4s): Product as perfect gift
3. Festive showcase (4-6s): Product with decorations
4. Warmth moment (6-7s): Product in Christmas setting
5. Closing (7-8s): Holiday wishes message

ATMOSPHERE: Warm, magical, cozy, generous, joyful`,

    'Navratri': `Generate a ${duration}-second energetic Navratri marketing video.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Vibrant lighting with color transitions (9 colors)
- Dynamic garba-inspired movement patterns
- Traditional decorative elements
- Fast-paced yet elegant camera work
- Festive particle effects

SCENE PROGRESSION:
1. Opening (0-2s): Swirling colors/fabrics
2. Energy reveal (2-4s): Product with movement
3. Traditional showcase (4-6s): Product with cultural elements
4. Dance of colors (6-7s): Dynamic color transitions
5. Closing (7-8s): Festive message

ATMOSPHERE: Energetic, devotional, colorful, traditional, celebratory`,
  };

  return festivalPrompts[festival] || createGenericFestivalPrompt(
    festival,
    productName,
    artisanName,
    duration
  );
}

/**
 * Generic festival prompt for unlisted festivals
 */
function createGenericFestivalPrompt(
  festival: string,
  productName: string,
  artisanName: string,
  duration: number
): string {
  return `Generate a ${duration}-second festive marketing video for ${festival}.
Product: "${productName}" by artisan "${artisanName}"

VISUAL REQUIREMENTS:
- Professional cinematic quality
- Festival-appropriate color palette
- Cultural authenticity and respect
- Elegant camera movements
- Appropriate particle effects and overlays

SCENE PROGRESSION:
1. Opening: Festival atmosphere introduction
2. Product reveal: Elegant presentation
3. Detail showcase: Craftsmanship focus
4. Cultural context: Festival elements
5. Closing: Compelling message

ATMOSPHERE: Festive, authentic, celebratory, respectful, engaging`;
}

/**
 * Batch process multiple products
 */
export async function batchGenerateVideos(
  products: VideoGenerationInput[]
): Promise<VideoGenerationOutput[]> {
  const results: VideoGenerationOutput[] = [];
  
  for (const product of products) {
    console.log(`[Batch Generator] Processing ${product.productName}...`);
    const result = await generateFestivalVideo(product);
    results.push(result);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

/**
 * Get video generation status (for async processing)
 */
export async function getVideoStatus(
  videoId: string
): Promise<{ status: string; progress?: number; result?: VideoGenerationOutput }> {
  // Implement status checking for async video generation
  // This would connect to your video processing queue
  return {
    status: 'pending',
    progress: 0,
  };
}
