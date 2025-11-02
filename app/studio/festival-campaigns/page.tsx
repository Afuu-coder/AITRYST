"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, Copy, Check, Loader2, Gift, Users, MessageSquare, Mail, Camera, Share2 } from "lucide-react"
import { useBackendContext } from "@/components/BackendProvider"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

export default function FestivalCampaigns() {
  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content')
  const [selectedFestival, setSelectedFestival] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [productInfo, setProductInfo] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [campaignData, setCampaignData] = useState<any>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  
  // Image generation states
  const [productImage, setProductImage] = useState<string | null>(null)
  const [productName, setProductName] = useState("")
  const [artisanName, setArtisanName] = useState("")
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  
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
        content: result.content,
        caption: result.caption,
        hashtags: result.hashtags,
        discountText: result.discountText
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateImages = async () => {
    if (!selectedFestival || !productImage || !productName) {
      toast.error("Please select a festival, upload a product image, and enter product name")
      return
    }

    setIsGeneratingImages(true)
    try {
      const festival = festivals.find((f) => f.id === selectedFestival)
      if (!festival) {
        toast.error("Invalid festival selection")
        return
      }

      const response = await fetch('/api/generate-festival-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoDataUri: productImage,
          productName,
          artisanName: artisanName || 'Your Shop',
          festival: festival.name
          // Language is optional for images - defaults to English
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate images')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate images')
      }

      setGeneratedImages(result.images || [])
      toast.success(`${festival.name} images generated successfully!`)
    } catch (error: any) {
      toast.error(error.message || "Failed to generate images")
      console.error("Image generation error:", error)
    } finally {
      setIsGeneratingImages(false)
    }
  }

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12 px-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading text-craft-primary">Festival Campaigns</h1>
              <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-6 px-4">
              Create culturally relevant marketing campaigns for festivals and boost your sales with AI-powered content
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 px-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                🎉 Festival Selection
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                🌍 Multi-Language
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                📱 All Platforms
              </Badge>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8 px-4">
              <Button
                onClick={() => setActiveTab('content')}
                variant={activeTab === 'content' ? 'default' : 'outline'}
                className={`w-full sm:w-auto ${activeTab === 'content' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Content Generation</span>
                <span className="sm:hidden">Content</span>
              </Button>
              <Button
                onClick={() => setActiveTab('images')}
                variant={activeTab === 'images' ? 'default' : 'outline'}
                className={`w-full sm:w-auto ${activeTab === 'images' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              >
                <Camera className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Image Generation</span>
                <span className="sm:hidden">Images</span>
              </Button>
            </div>
          </div>

          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left Side - Input Form */}
              <div className="space-y-6">
                <Card className="p-4 sm:p-6 md:p-8">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3">
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

                    {/* Campaign Summary */}
                    {(campaignData.caption || campaignData.hashtags || campaignData.discountText) && (
                      <div className="space-y-4">
                        {campaignData.caption && (
                          <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                            <Label className="text-sm font-semibold text-orange-700 mb-2 block">Campaign Caption</Label>
                            <p className="text-sm text-orange-900">{campaignData.caption}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(campaignData.caption, 'caption')}
                              className="mt-2 text-orange-700 hover:text-orange-800"
                            >
                              {copiedItems.has('caption') ? (
                                <><Check className="w-4 h-4 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-4 h-4 mr-1" /> Copy Caption</>
                              )}
                            </Button>
                          </Card>
                        )}
                        
                        {campaignData.hashtags && campaignData.hashtags.length > 0 && (
                          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                            <Label className="text-sm font-semibold text-blue-700 mb-2 block">Hashtags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {campaignData.hashtags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(campaignData.hashtags.join(' '), 'hashtags')}
                              className="text-blue-700 hover:text-blue-800"
                            >
                              {copiedItems.has('hashtags') ? (
                                <><Check className="w-4 h-4 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-4 h-4 mr-1" /> Copy All Hashtags</>
                              )}
                            </Button>
                          </Card>
                        )}
                        
                        {campaignData.discountText && (
                          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                            <Label className="text-sm font-semibold text-green-700 mb-2 block">Special Offer</Label>
                            <p className="text-sm text-green-900">{campaignData.discountText}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(campaignData.discountText, 'discount')}
                              className="mt-2 text-green-700 hover:text-green-800"
                            >
                              {copiedItems.has('discount') ? (
                                <><Check className="w-4 h-4 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-4 h-4 mr-1" /> Copy Offer</>
                              )}
                            </Button>
                          </Card>
                        )}
                      </div>
                    )}

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
          )}

          {activeTab === 'images' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Image Generation Form */}
              <div className="space-y-6">
                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-heading text-craft-primary mb-2">
                        Image Generation
                      </h2>
                      <p className="text-foreground/70">
                        Upload product image and generate festival marketing visuals
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
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Product Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Upload Product Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                        {productImage ? (
                          <div className="space-y-3">
                            <img src={productImage} alt="Product" className="max-h-48 mx-auto rounded" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setProductImage(null)}
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload product image</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Product Name</Label>
                      <input
                        type="text"
                        placeholder="e.g., Handwoven Blue Jamdani Sari"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Artisan/Shop Name (Optional)</Label>
                      <input
                        type="text"
                        placeholder="e.g., Your Shop Name"
                        value={artisanName}
                        onChange={(e) => setArtisanName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerateImages}
                      disabled={isGeneratingImages || !selectedFestival || !productImage || !productName}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
                    >
                      {isGeneratingImages ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Images...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Generate Festival Images
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Image Results */}
              <div className="space-y-6">
                {generatedImages.length > 0 ? (
                  <Card className="p-8">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-heading text-craft-primary mb-2">
                          Generated Images
                        </h2>
                        <p className="text-foreground/70">
                          {generatedImages.length} variations generated
                        </p>
                      </div>

                      <div className="space-y-4">
                        {generatedImages.map((image, idx) => (
                          <Card key={idx} className="p-4">
                            <h3 className="font-medium mb-3">{image.variation}</h3>
                            <img 
                              src={image.url} 
                              alt={image.variation} 
                              className="w-full rounded-lg border border-gray-200"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3 w-full"
                              onClick={() => {
                                // Download image
                                const link = document.createElement('a')
                                link.href = image.url
                                link.download = `${image.variation.replace(/ /g, '_')}.png`
                                link.click()
                              }}
                            >
                              Download Image
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                      <h2 className="text-2xl font-heading text-craft-primary mb-3">
                        Ready to Generate Festival Images
                      </h2>
                      <p className="text-foreground/70 max-w-md mx-auto mb-6">
                        Upload a product image, select a festival, and let AI create stunning marketing visuals
                      </p>
                      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <div className="text-3xl mb-2">🎨</div>
                          <p className="text-sm text-orange-700 font-medium">3 Variations</p>
                          <p className="text-xs text-orange-600">Different styles</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl mb-2">🌍</div>
                          <p className="text-sm text-blue-700 font-medium">Multi-Language</p>
                          <p className="text-xs text-blue-600">English & Hindi</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl mb-2">📱</div>
                          <p className="text-sm text-green-700 font-medium">Social Ready</p>
                          <p className="text-xs text-green-600">Instagram optimized</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}