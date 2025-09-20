"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, Copy, Check, Loader2, Gift, Star } from "lucide-react"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"

interface FestivalCampaignsProps {
  productData: any
  updateProductData: (data: any) => void
  onNext: () => void
}

// Simplified to only include Diwali and Holi as requested
const festivals = [
  {
    id: "diwali",
    name: "Diwali",
    emoji: "🪔",
    color: "bg-yellow-500",
    date: "November 12, 2024",
    theme: "Festival of Lights",
  },
  {
    id: "holi",
    name: "Holi",
    emoji: "🎨",
    color: "bg-pink-500",
    date: "March 14, 2025",
    theme: "Festival of Colors",
  },
]

export function FestivalCampaigns({ productData, updateProductData, onNext }: FestivalCampaignsProps) {
  const [selectedFestival, setSelectedFestival] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const { generateContent } = useBackendContext()

  const generateCampaign = async () => {
    if (!selectedFestival) {
      toast.error("Please select a festival")
      return
    }

    setIsGenerating(true)

    try {
      // Generate festival-specific content using backend service
      const festival = festivals.find((f) => f.id === selectedFestival)
      
      // Generate content for different platforms
      const socialContent = await generateContent(
        `Create a social media post for ${festival?.name} festival to promote handcrafted products`,
        "en"
      )
      
      const whatsappContent = await generateContent(
        `Create a WhatsApp message for ${festival?.name} festival to promote handcrafted products`,
        "en"
      )
      
      const emailContent = await generateContent(
        `Create an email subject line for ${festival?.name} festival to promote handcrafted products`,
        "en"
      )

      const campaigns = {
        [selectedFestival]: {
          festival: festival?.name,
          theme: festival?.theme,
          emoji: festival?.emoji,
          content: {
            headline: `${festival?.emoji} Special ${festival?.name} Collection ${festival?.emoji}`,
            description: `Celebrate ${festival?.name} with our exclusive handcrafted pottery collection. Each piece is specially curated to bring prosperity and joy to your festivities.`,
            offer: `🎁 ${festival?.name} Special: 25% OFF + Free Gift Wrapping`,
            socialPost: socialContent?.socialPost || `Celebrate ${festival?.name} with our special collection!`,
            whatsappMessage: whatsappContent?.whatsappMessage || `Special ${festival?.name} offer on our handcrafted products!`,
            emailSubject: emailContent?.headline || `Special ${festival?.name} Collection`,
            countdown: {
              days: Math.floor(Math.random() * 30) + 1,
              hours: Math.floor(Math.random() * 24),
              minutes: Math.floor(Math.random() * 60),
            },
          },
        },
      }

      updateProductData({
        campaigns: {
          ...productData.campaigns,
          ...campaigns,
        },
      })

      toast.success(`${festival?.name} campaign generated successfully!`)
    } catch (error) {
      toast.error("Failed to generate campaign")
      console.error("Campaign generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set([...prev, itemId]))
      toast.success("Copied to clipboard!")

      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const currentCampaign = selectedFestival ? productData.campaigns?.[selectedFestival] : null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Festival Campaigns</h2>
        <p className="text-muted-foreground">Create festival-specific marketing content to boost sales</p>
      </div>

      {/* Festival Selection - Only Diwali and Holi */}
      <Card className="p-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Select Festival</label>
          <Select value={selectedFestival} onValueChange={setSelectedFestival}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a festival" />
            </SelectTrigger>
            <SelectContent>
              {festivals.map((festival) => (
                <SelectItem key={festival.id} value={festival.id}>
                  <div className="flex items-center gap-2">
                    <span>{festival.emoji}</span>
                    <span>{festival.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {festival.date}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedFestival && (
            <Button onClick={generateCampaign} disabled={isGenerating} className="w-full bg-accent hover:bg-accent/90">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 pottery-spinner" />
                  Generating Campaign...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {festivals.find((f) => f.id === selectedFestival)?.name} Campaign
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Generated Campaign */}
      {currentCampaign && (
        <div className="space-y-4">
          {/* Campaign Header */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="text-center space-y-2">
              <div className="text-3xl">{currentCampaign.emoji}</div>
              <h3 className="text-xl font-bold">{currentCampaign.content.headline}</h3>
              <p className="text-sm text-muted-foreground">{currentCampaign.theme}</p>

              {/* Countdown Timer */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentCampaign.content.countdown.days}</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentCampaign.content.countdown.hours}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentCampaign.content.countdown.minutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Special Offer */}
          <Card className="p-4 bg-accent/5 border-accent/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Gift className="w-4 h-4 text-accent" />
                Special Offer
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(currentCampaign.content.offer, "offer")}
              >
                {copiedItems.has("offer") ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-accent font-medium">{currentCampaign.content.offer}</p>
          </Card>

          {/* Social Media Post */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Social Media Post
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(currentCampaign.content.socialPost, "social")}
              >
                {copiedItems.has("social") ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line bg-muted p-3 rounded">
              {currentCampaign.content.socialPost}
            </p>
          </Card>

          {/* WhatsApp Message */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                WhatsApp Campaign
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(currentCampaign.content.whatsappMessage, "whatsapp")}
              >
                {copiedItems.has("whatsapp") ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm leading-relaxed whitespace-pre-line">{currentCampaign.content.whatsappMessage}</p>
            </div>
          </Card>

          {/* Email Subject */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Email Subject Line</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(currentCampaign.content.emailSubject, "email")}
              >
                {copiedItems.has("email") ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm font-medium bg-muted p-2 rounded">{currentCampaign.content.emailSubject}</p>
          </Card>
        </div>
      )}

      {/* Completion */}
      <Card className="p-6 bg-primary/5 border-primary/20 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-primary">Congratulations!</h3>
          <p className="text-sm text-muted-foreground">
            You've successfully created a complete AI-powered marketing suite for your handcrafted products.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge variant="secondary">✅ Enhanced Images</Badge>
            <Badge variant="secondary">✅ Voice Transcription</Badge>
            <Badge variant="secondary">✅ Content Generation</Badge>
            <Badge variant="secondary">✅ Smart Pricing</Badge>
            <Badge variant="secondary">✅ QR Microsite</Badge>
            <Badge variant="secondary">✅ Festival Campaigns</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}