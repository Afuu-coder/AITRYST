"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, Copy, Check, Loader2, Gift, Globe, Users, MessageSquare, Mail, Camera, Share2 } from "lucide-react"
import { useBackendContext } from "@/components/BackendProvider"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

export default function FestivalCampaigns() {
  const [selectedFestival, setSelectedFestival] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [productInfo, setProductInfo] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [campaignData, setCampaignData] = useState<any>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const { generateContent } = useBackendContext()

  const festivals = [
    {
      id: "diwali",
      name: "Diwali",
      emoji: "🪔",
      date: "November 1, 2025",
      theme: "Festival of Lights",
      description: "Celebrate the triumph of light over darkness"
    },
    {
      id: "holi",
      name: "Holi",
      emoji: "🎨",
      date: "March 14, 2025",
      theme: "Festival of Colors",
      description: "Welcome spring with vibrant colors and joy"
    },
    {
      id: "eid",
      name: "Eid",
      emoji: "🌙",
      date: "March 30, 2025",
      theme: "Festival of Breaking Fast",
      description: "Celebrate the end of Ramadan with family and friends"
    },
    {
      id: "christmas",
      name: "Christmas",
      emoji: "🎄",
      date: "December 25, 2025",
      theme: "Festival of Joy",
      description: "Spread love and joy during the festive season"
    },
    {
      id: "navratri",
      name: "Navratri",
      emoji: "🕉️",
      date: "September 22, 2025",
      theme: "Nine Nights of Devotion",
      description: "Celebrate the divine feminine energy"
    },
    {
      id: "raksha-bandhan",
      name: "Raksha Bandhan",
      emoji: "🎀",
      date: "August 9, 2025",
      theme: "Bond of Protection",
      description: "Celebrate the sacred bond between siblings"
    }
  ]

  const languages = [
    { id: "en", name: "English", flag: "🇺🇸" },
    { id: "hi", name: "Hindi", flag: "🇮🇳" },
    { id: "bn", name: "Bengali", flag: "🇧🇩" },
    { id: "te", name: "Telugu", flag: "🇮🇳" }
  ]

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Camera, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageSquare, color: "bg-gradient-to-r from-green-500 to-green-600" },
    { id: "email", name: "Email", icon: Mail, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { id: "facebook", name: "Facebook", icon: Users, color: "bg-gradient-to-r from-blue-600 to-blue-700" },
    { id: "twitter", name: "Twitter/X", icon: Share2, color: "bg-gradient-to-r from-gray-800 to-gray-900" }
  ]

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleGenerateCampaign = async () => {
    if (!selectedFestival || !productInfo || selectedPlatforms.length === 0) {
      toast.error("Please select a festival, enter product information, and choose at least one platform")
      return
    }

    setIsGenerating(true)
    try {
      const festival = festivals.find((f) => f.id === selectedFestival)
      const language = languages.find((l) => l.id === selectedLanguage)
      
      if (!festival || !language) {
        toast.error("Invalid festival or language selection")
        return
      }

      // Call the new festival campaign API
      const response = await fetch('/api/generate-festival-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          festival,
          productInfo,
          language,
          platforms: selectedPlatforms
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate campaign')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate campaign')
      }

      // Structure the campaign data
      const campaign = {
        festival: festival.name,
        emoji: festival.emoji,
        theme: festival.theme,
        date: festival.date,
        language: language.name,
        platforms: selectedPlatforms,
        content: result.content
      }

      setCampaignData(campaign)
      toast.success(`${festival.name} campaign generated successfully!`)
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


  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-orange-500" />
              <h1 className="text-5xl font-heading text-craft-primary">Festival Campaigns</h1>
              <Gift className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-6">
              Create culturally relevant marketing campaigns for festivals and boost your sales with AI-powered content
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
                🎉 Festival Selection
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2">
                🌍 Multi-Language
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
                📱 All Platforms
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Side - Input Form */}
            <div className="space-y-6">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-heading text-craft-primary mb-2">
                      Campaign Setup
                    </h2>
                    <p className="text-foreground/70">
                      Select festival, language, and platforms for your campaign
                    </p>
                  </div>

                  {/* Festival Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Select Festival</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {festivals.map((festival) => (
                        <Card
                          key={festival.id}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            selectedFestival === festival.id
                              ? 'ring-2 ring-orange-500 bg-orange-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedFestival(festival.id)}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2" suppressHydrationWarning>{festival.emoji}</div>
                            <h3 className="font-medium text-sm">{festival.name}</h3>
                            <p className="text-xs text-foreground/60 mt-1">{festival.date}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Select Language</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map((language) => (
                        <Card
                          key={language.id}
                          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                            selectedLanguage === language.id
                              ? 'ring-2 ring-orange-500 bg-orange-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedLanguage(language.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl" suppressHydrationWarning>{language.flag}</span>
                            <span className="font-medium">{language.name}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Select Platforms</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {platforms.map((platform) => {
                        const IconComponent = platform.icon
                        return (
                          <Card
                            key={platform.id}
                            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                              selectedPlatforms.includes(platform.id)
                                ? 'ring-2 ring-orange-500 bg-orange-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handlePlatformToggle(platform.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{platform.name}</h3>
                                <p className="text-sm text-foreground/60">
                                  {platform.id === 'instagram' && 'Visual posts and stories'}
                                  {platform.id === 'whatsapp' && 'Direct customer messages'}
                                  {platform.id === 'email' && 'Newsletter and promotions'}
                                  {platform.id === 'facebook' && 'Community posts and ads'}
                                  {platform.id === 'twitter' && 'Quick updates and trends'}
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded border-2 ${
                                selectedPlatforms.includes(platform.id)
                                  ? 'bg-orange-500 border-orange-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedPlatforms.includes(platform.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Product Information</Label>
                    <Textarea
                      placeholder="Describe your product or paste description from AI Content Studio..."
                      value={productInfo}
                      onChange={(e) => setProductInfo(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateCampaign}
                    disabled={isGenerating || !selectedFestival || !productInfo || selectedPlatforms.length === 0}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Campaign...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Festival Campaign
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Side - Results */}
            <div className="space-y-6">
              {campaignData ? (
                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3" suppressHydrationWarning>{campaignData.emoji}</div>
                      <h2 className="text-2xl font-heading text-craft-primary mb-2">
                        {campaignData.festival} Campaign
                      </h2>
                      <p className="text-foreground/70">
                        Generated content for {campaignData.platforms.length} platform(s) in {campaignData.language}
                      </p>
                    </div>

                    {/* Platform Content Cards */}
                    <div className="space-y-4">
                      {selectedPlatforms.map((platformId) => {
                        const platform = platforms.find(p => p.id === platformId)
                        const IconComponent = platform?.icon
                        const content = campaignData.content[platformId]
                        
                        return (
                          <Card key={platformId} className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`w-8 h-8 rounded-lg ${platform?.color} flex items-center justify-center`}>
                                {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
                              </div>
                              <h3 className="font-medium text-lg">{platform?.name}</h3>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(
                                  typeof content === 'object' ? content.body || content.subject : content,
                                  platformId
                                )}
                                className="ml-auto"
                              >
                                {copiedItems.has(platformId) ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            
                            {typeof content === 'object' && content.subject ? (
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium text-foreground/70">Subject</Label>
                                  <p className="text-sm bg-muted p-2 rounded mt-1">{content.subject}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-foreground/70">Body</Label>
                                  <div className="text-sm bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                                    {content.body}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                                {content}
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8">
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Sparkles className="w-12 h-12 text-orange-500" />
                      <h2 className="text-3xl font-heading text-craft-primary">Ready for Festival Magic</h2>
                      <Gift className="w-12 h-12 text-red-500" />
                    </div>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
                      Select a festival, choose your language and platforms, describe your product, and watch AI create culturally relevant marketing campaigns that resonate with your audience.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>🎉</div>
                        <h3 className="font-semibold text-orange-700 mb-2">Festival Selection</h3>
                        <p className="text-sm text-orange-600">Choose from major festivals with cultural context</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>🌍</div>
                        <h3 className="font-semibold text-blue-700 mb-2">Multi-Language</h3>
                        <p className="text-sm text-blue-600">Support for Hindi, English, Bengali, and Telugu</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>📱</div>
                        <h3 className="font-semibold text-green-700 mb-2">All Platforms</h3>
                        <p className="text-sm text-green-600">Content optimized for Instagram, WhatsApp, Email, Facebook, Twitter</p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                      <h3 className="font-semibold text-orange-700 mb-3">How it works:</h3>
                      <div className="flex justify-center gap-8 text-sm text-orange-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>1</div>
                          <span>Select festival & language</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>2</div>
                          <span>Choose platforms & describe product</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>3</div>
                          <span>Generate & copy content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}