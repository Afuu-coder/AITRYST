# Festival Campaigns - Enhanced Edition

## Overview
AI-powered festival campaign generator that creates culturally relevant, multi-platform marketing content for Indian handcrafted goods and artisan products.

## Features

### ✨ Enhanced Campaign Generation
- **Comprehensive Content**: Generate caption, hashtags, discount offers, and platform-specific content
- **Multi-Platform Support**: Instagram, WhatsApp, Email, Facebook, Twitter/X
- **Cultural Authenticity**: Deep understanding of Indian festivals and traditions
- **Multi-Language**: Support for English, Hindi, Bengali, Telugu
- **Smart Formatting**: Platform-optimized content with emojis and proper formatting

### 🎨 Festival Image Generation (NEW!)
- **3 Image Variations**: Festive Background, Mockup Scene, Clean Product Poster
- **Festival-Specific Styling**: Authentic visual elements for each festival
- **Multi-Language Text**: Support for English and Hindi text overlays
- **Product-Focused**: Maintains product integrity while adding festive atmosphere
- **Social Media Ready**: Instagram-optimized marketing visuals
- **Multiple Festivals**: Diwali, Holi, Eid, Christmas, Navratri, Raksha Bandhan, and more

### 🎉 Supported Festivals
- **Diwali** (Festival of Lights)
- **Holi** (Festival of Colors)
- **Eid** (Festival of Breaking Fast)
- **Christmas** (Festival of Joy)
- **Navratri** (Nine Nights of Devotion)
- **Raksha Bandhan** (Bond of Protection)

## Project Structure

```
app/studio/festival-campaigns/
├── page.tsx                    # Main UI component with tabs
├── actions/
│   ├── generate-campaign-content.ts   # Enhanced campaign content generator
│   ├── generate-festival-video.ts     # Video generation (requires Veo 3.0 setup)
│   └── generate-festival-images.ts    # Festival image generation (NEW!)
└── README.md                   # This file

app/api/
├── generate-festival-campaign/
│   └── route.ts                # Campaign content API endpoint
└── generate-festival-images/
    └── route.ts                # Image generation API endpoint (NEW!)

ai/
└── genkit.ts                   # Genkit AI configuration (optional)
```

## How It Works

### 1. Campaign Content Generation

The `generate-campaign-content.ts` action creates:
- **Caption**: Short, festive caption (<= 200 characters)
- **Hashtags**: 7-10 relevant hashtags mixing English and regional languages
- **Discount Text**: Creative promotional offer text
- **Platform Content**: Optimized content for each selected platform

**Example Output:**
```json
{
  "caption": "Light up your Diwali with our Handwoven Blue Jamdani Sari! ✨",
  "hashtags": ["#DiwaliSari", "#Jamdani", "#FestivalFashion", "#HandloomLove", "#दिवाली"],
  "discountText": "Get 15% OFF + FREE terracotta diya set with every sari!",
  "platformContent": {
    "instagram": "✨ Full Instagram post with emojis and formatting...",
    "whatsapp": "🪔 *Diwali Special Offer!* 🪔\n\nPersonal message...",
    "email": {
      "subject": "✨ Diwali Special: Handwoven Jamdani Sarees + FREE Diyas 🪔",
      "body": "Dear Valued Customer,\n\nEmail content..."
    },
    "facebook": "Community-focused post...",
    "twitter": "Concise tweet within character limits..."
  }
}
```

### 2. Festival Image Generation (NEW!)

The `generate-festival-images.ts` action creates 3 image variations:

**1. Festive Background**
- Product prominently displayed with festival-themed background
- Decorative elements specific to the festival (diyas for Diwali, colors for Holi)
- Text overlay with festival slogan
- Watermark with artisan name

**2. Mockup Scene**
- Product placed in a decorated living room setting
- Authentic festival decorations
- Lifestyle photography style
- Natural integration of product

**3. Clean Product Poster**
- Minimal design with product as centerpiece
- Subtle festival motif background
- Bold product name
- Call-to-action area
- Professional e-commerce ready

**Features:**
- Multi-language text (English/Hindi)
- Festival-specific color palettes
- Cultural authenticity
- Instagram-ready dimensions
- **Note**: Requires Imagen API setup (currently returns configuration message)

### 3. Video Generation (Optional)

The `generate-festival-video.ts` action provides:
- Festival-specific video prompts for Veo 3.0
- Customizable aspect ratios (9:16 for mobile, 16:9 for desktop)
- Culturally authentic visual storytelling
- **Note**: Requires Veo 3.0 API setup (currently returns configuration message)

## Usage

### Basic Campaign Generation

```typescript
import { generateCampaignContent } from '@/app/studio/festival-campaigns/actions/generate-campaign-content'

const result = await generateCampaignContent({
  productTitle: 'Handwoven Blue Jamdani Sari',
  productDescription: 'Authentic handloom craftsmanship by master weavers...',
  festival: 'Diwali',
  festivalDetails: {
    theme: 'Festival of Lights',
    date: 'November 1, 2025',
    description: 'Celebrate the triumph of light over darkness'
  },
  language: 'English',
  platforms: ['instagram', 'whatsapp', 'email']
})

if (result.success) {
  console.log('Caption:', result.caption)
  console.log('Hashtags:', result.hashtags)
  console.log('Offer:', result.discountText)
  console.log('Platform Content:', result.platformContent)
}
```

### Via API Endpoint

```javascript
const response = await fetch('/api/generate-festival-campaign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    festival: {
      name: 'Diwali',
      emoji: '🪔',
      theme: 'Festival of Lights',
      date: 'November 1, 2025',
      description: 'Celebrate the triumph of light over darkness'
    },
    productInfo: 'Your product description...',
    language: { name: 'English' },
    platforms: ['instagram', 'whatsapp', 'facebook']
  })
})

const result = await response.json()
```

### Image Generation

```typescript
import { generateFestivalImages } from '@/app/studio/festival-campaigns/actions/generate-festival-images'

const result = await generateFestivalImages({
  photoDataUri: 'data:image/jpeg;base64,...', // Base64 encoded image
  productName: 'Handwoven Blue Jamdani Sari',
  artisanName: 'Artisan Shop Name',
  festival: 'Diwali',
  language: 'en' // or 'hi' for Hindi
})

if (result.success) {
  result.images.forEach(image => {
    console.log(`${image.variation}: ${image.url}`)
  })
}
```

### Via Image API Endpoint

```javascript
// First, convert image file to base64
const fileToBase64 = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.readAsDataURL(file)
})

const imageDataUri = await fileToBase64(imageFile)

const response = await fetch('/api/generate-festival-images', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    photoDataUri: imageDataUri,
    productName: 'Your Product Name',
    artisanName: 'Your Shop',
    festival: 'Diwali',
    language: 'en'
  })
})

const result = await response.json()
if (result.success) {
  // result.images contains 3 variations
  console.log(result.images)
}
```

## Configuration

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
# or
GOOGLE_API_KEY=your_google_api_key_here
```

### Model Configuration

The campaign generator uses:
- **Model**: `gemini-2.0-flash`
- **Temperature**: 0.85 (creative but consistent)
- **Top P**: 0.95
- **Top K**: 40

## Platform-Specific Features

### Instagram
- Visual storytelling with line breaks
- Emoji-rich content
- Multiple relevant hashtags
- Story-friendly formatting

### WhatsApp
- WhatsApp markdown (*bold*, _italic_)
- Personal, direct tone
- Clear call-to-action
- Mobile-optimized formatting

### Email
- Professional subject lines
- Structured body content
- Warm, personal tone
- Clear value proposition

### Facebook
- Community-focused messaging
- Shareable content format
- Engagement-optimized
- Tag-friendly

### Twitter/X
- Character-limit optimized
- Trending hashtags
- Concise, impactful messaging
- Link-friendly format

## Best Practices

1. **Product Description**: Provide detailed product information for better content
2. **Festival Context**: Include festival-specific details for authentic messaging
3. **Platform Selection**: Choose platforms based on your target audience
4. **Language Choice**: Match language to your primary customer base
5. **Review & Edit**: Always review generated content before publishing

## Customization

### Adding New Festivals

Edit `page.tsx` to add more festivals:

```typescript
const festivals = [
  // ... existing festivals
  {
    id: "new-festival",
    name: "New Festival",
    emoji: "🎊",
    date: "Date",
    theme: "Festival Theme",
    description: "Festival description"
  }
]
```

### Adding Platform Support

1. Add platform to `platforms` array in `page.tsx`
2. Update prompt in `generate-campaign-content.ts` to include platform guidelines
3. Add platform-specific formatting rules

## Troubleshooting

### Issue: No content generated
- **Check**: API key is set in environment variables
- **Check**: Network connectivity
- **Check**: All required fields are provided

### Issue: Content not culturally relevant
- **Solution**: Provide more festival context in `festivalDetails`
- **Solution**: Include specific cultural references in product description

### Issue: Platform content missing
- **Check**: Platform is included in the `platforms` array
- **Check**: API response includes all requested platforms

## Future Enhancements

- [ ] Video generation with Veo 3.0 integration
- [ ] Image generation for posts
- [ ] A/B testing for campaigns
- [ ] Analytics integration
- [ ] Scheduling functionality
- [ ] Multi-language content in same campaign
- [ ] Regional festival support
- [ ] Custom template builder

## Technical Details

### Dependencies
- `@google/generative-ai`: Google's Generative AI SDK
- `next`: Next.js framework
- `react`: React library

### Performance
- Average generation time: 3-5 seconds
- Supports concurrent requests
- Optimized prompt engineering for consistent results

### Security
- Server-side only (`'use server'` directive)
- API key protected via environment variables
- Input validation on all endpoints

## Support

For issues or questions:
1. Check this README
2. Review console logs for error messages
3. Verify environment configuration
4. Check API key permissions

---

**Version**: 2.0.0 (Enhanced Edition)  
**Last Updated**: October 2025  
**Author**: AITRYST Team
