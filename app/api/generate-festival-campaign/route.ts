import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import path from 'path'

// Set up Google Cloud credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(process.cwd(), 'service-account-key.json')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIzaSyAqLdB8aCkCdmK7EsiqGR0ERDPu48y5bHQ')

export async function POST(request: NextRequest) {
  try {
    const { festival, productInfo, language, platforms } = await request.json()

    console.log('Festival Campaign Generation Request:', {
      festival,
      language,
      platforms,
      productInfoLength: productInfo?.length
    })

    if (!festival || !productInfo || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: festival, productInfo, and platforms' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Create platform-specific prompts
    const platformPrompts = platforms.map((platform: string) => {
      switch (platform) {
        case 'instagram':
          return `Instagram: Create a visually appealing post with emojis, hashtags, and engaging copy. Focus on aesthetics and visual storytelling.`
        case 'whatsapp':
          return `WhatsApp: Create a direct, personal message with clear call-to-action. Use formatting for emphasis.`
        case 'email':
          return `Email: Create both subject line and body content. Professional yet warm tone, clear value proposition.`
        case 'facebook':
          return `Facebook: Create community-focused content with engaging copy, perfect for sharing and comments.`
        case 'twitter':
          return `Twitter: Create concise, impactful content within character limits. Use trending hashtags.`
        default:
          return `${platform}: Create platform-appropriate content.`
      }
    }).join('\n')

    const prompt = `Create a comprehensive ${festival.name} festival marketing campaign for handcrafted products.

FESTIVAL DETAILS:
- Name: ${festival.name} (${festival.emoji})
- Theme: ${festival.theme}
- Date: ${festival.date}
- Description: ${festival.description}

PRODUCT INFORMATION:
${productInfo}

LANGUAGE: ${language.name} (${language.flag})

PLATFORMS TO GENERATE CONTENT FOR:
${platformPrompts}

REQUIREMENTS:
1. Create culturally relevant content that honors the festival's significance
2. Connect the product to festival traditions and celebrations
3. Use appropriate tone and style for each platform
4. Include festival-specific hashtags and emojis
5. Add compelling call-to-action for each platform
6. Make content engaging and shareable
7. Consider the target audience for each platform

OUTPUT FORMAT:
Return a JSON object with separate content for each platform. For email, include both subject and body. For other platforms, return the complete content as a string.

Example structure:
{
  "instagram": "Complete Instagram post content...",
  "whatsapp": "Complete WhatsApp message...",
  "email": {
    "subject": "Email subject line",
    "body": "Complete email body content..."
  },
  "facebook": "Complete Facebook post...",
  "twitter": "Complete Twitter post..."
}

Generate content that will help artisans connect with their customers during this special festival time.`

    console.log('Sending prompt to Gemini...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    console.log('Raw AI Response:', text)

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let campaignContent
    try {
      campaignContent = JSON.parse(text)
      console.log('Parsed campaign content:', campaignContent)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.log('Cleaned text:', text)
      
      // Fallback: create structured content from the text
      campaignContent = {
        instagram: `🎉 ${festival.emoji} ${festival.name} Special Collection! ${festival.emoji}\n\n${productInfo}\n\n✨ Celebrate this ${festival.theme.toLowerCase()} with our handcrafted treasures!\n\n#${festival.name} #HandcraftedWithLove #FestivalVibes #ArtisanMade`,
        whatsapp: `🎉 *${festival.name} Special Offer!* 🎉\n\n${festival.emoji} Celebrate ${festival.name} with our exclusive handcrafted collection!\n\n${productInfo}\n\n✨ *Special Festival Discount: 25% OFF*\n🎁 *Free Gift Wrapping*\n\nDM us to place your order!`,
        email: {
          subject: `🎉 ${festival.name} Special: Handcrafted Gifts for Your Loved Ones`,
          body: `Dear Valued Customer,\n\nWishing you and your family a very Happy ${festival.name}! 🎉\n\nWe're celebrating this ${festival.theme.toLowerCase()} with our exclusive collection of handcrafted products that embody the spirit of ${festival.name}.\n\n${productInfo}\n\n🎁 *Special Festival Offer:*\n• 25% OFF on all products\n• Free Gift Wrapping\n• Express Delivery Available\n\nShop now and make this ${festival.name} extra special!\n\nWarm regards,\nYour Artisan Team`
        },
        facebook: `🎉 ${festival.name} is here! 🎉\n\n${festival.emoji} Celebrate this ${festival.theme.toLowerCase()} with our beautiful handcrafted collection!\n\n${productInfo}\n\n✨ Special Festival Offer: 25% OFF + Free Gift Wrapping\n\nPerfect for gifting your loved ones this ${festival.name}! 🎁\n\n#${festival.name} #HandcraftedWithLove #FestivalVibes`,
        twitter: `🎉 ${festival.name} Special Collection! ${festival.emoji}\n\n${productInfo}\n\n✨ 25% OFF + Free Gift Wrapping\n🎁 Perfect for festival gifting!\n\n#${festival.name} #HandcraftedWithLove #FestivalVibes`
      }
    }

    // Ensure all requested platforms have content
    const finalContent: any = {}
    platforms.forEach((platform: string) => {
      if (campaignContent[platform]) {
        finalContent[platform] = campaignContent[platform]
      } else {
        // Generate fallback content for missing platforms
        switch (platform) {
          case 'instagram':
            finalContent[platform] = `🎉 ${festival.emoji} ${festival.name} Special Collection! ${festival.emoji}\n\n${productInfo}\n\n✨ Celebrate this ${festival.theme.toLowerCase()} with our handcrafted treasures!\n\n#${festival.name} #HandcraftedWithLove #FestivalVibes #ArtisanMade`
            break
          case 'whatsapp':
            finalContent[platform] = `🎉 *${festival.name} Special Offer!* 🎉\n\n${festival.emoji} Celebrate ${festival.name} with our exclusive handcrafted collection!\n\n${productInfo}\n\n✨ *Special Festival Discount: 25% OFF*\n🎁 *Free Gift Wrapping*\n\nDM us to place your order!`
            break
          case 'email':
            finalContent[platform] = {
              subject: `🎉 ${festival.name} Special: Handcrafted Gifts for Your Loved Ones`,
              body: `Dear Valued Customer,\n\nWishing you and your family a very Happy ${festival.name}! 🎉\n\nWe're celebrating this ${festival.theme.toLowerCase()} with our exclusive collection of handcrafted products that embody the spirit of ${festival.name}.\n\n${productInfo}\n\n🎁 *Special Festival Offer:*\n• 25% OFF on all products\n• Free Gift Wrapping\n• Express Delivery Available\n\nShop now and make this ${festival.name} extra special!\n\nWarm regards,\nYour Artisan Team`
            }
            break
          case 'facebook':
            finalContent[platform] = `🎉 ${festival.name} is here! 🎉\n\n${festival.emoji} Celebrate this ${festival.theme.toLowerCase()} with our beautiful handcrafted collection!\n\n${productInfo}\n\n✨ Special Festival Offer: 25% OFF + Free Gift Wrapping\n\nPerfect for gifting your loved ones this ${festival.name}! 🎁\n\n#${festival.name} #HandcraftedWithLove #FestivalVibes`
            break
          case 'twitter':
            finalContent[platform] = `🎉 ${festival.name} Special Collection! ${festival.emoji}\n\n${productInfo}\n\n✨ 25% OFF + Free Gift Wrapping\n🎁 Perfect for festival gifting!\n\n#${festival.name} #HandcraftedWithLove #FestivalVibes`
            break
        }
      }
    })

    console.log('Final campaign content:', finalContent)

    return NextResponse.json({
      success: true,
      content: finalContent,
      festival: festival.name,
      language: language.name,
      platforms: platforms
    })

  } catch (error) {
    console.error('Festival campaign generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate festival campaign',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
