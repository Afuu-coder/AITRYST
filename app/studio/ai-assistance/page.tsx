"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, Loader2, TrendingUp, MessageSquare, Megaphone, 
  Palette, Mic, Volume2, Brain, Copy, Check 
} from "lucide-react"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

type FeatureType = 'recommendations' | 'trends' | 'captions' | 'campaigns' | 'design' | 'tts' | 'stt'

export default function AIAssistance() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('recommendations')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  
  // Common fields
  const [language, setLanguage] = useState("English")
  
  // Personalized Recommendations fields
  const [artisanProfile, setArtisanProfile] = useState("")
  const [pastInteractions, setPastInteractions] = useState("")
  const [regionalTrends, setRegionalTrends] = useState("")
  
  // Market Trends fields
  const [craft, setCraft] = useState("")
  const [region, setRegion] = useState("")
  
  // Social Media Captions fields
  const [productName, setProductName] = useState("")
  const [craftType, setCraftType] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [targetPlatform, setTargetPlatform] = useState<'Instagram' | 'Facebook' | 'YouTube' | 'LinkedIn'>('Instagram')
  const [tone, setTone] = useState("")
  
  // Ad Campaign fields
  const [targetAudience, setTargetAudience] = useState("")
  const [campaignGoal, setCampaignGoal] = useState("")
  const [pastCampaignPerformance, setPastCampaignPerformance] = useState("")
  const [preferredPlatform, setPreferredPlatform] = useState("")
  const [examplePosts, setExamplePosts] = useState("")
  
  // Design Improvement fields
  const [designDescription, setDesignDescription] = useState("")
  const [targetAudienceDesign, setTargetAudienceDesign] = useState("")
  const [preferredStyle, setPreferredStyle] = useState("")
  const [designGoals, setDesignGoals] = useState("")
  const [exampleImage, setExampleImage] = useState<string | null>(null)
  
  // Text-to-Speech fields
  const [textToConvert, setTextToConvert] = useState("")
  const [audioResult, setAudioResult] = useState<string | null>(null)
  
  // Speech-to-Text fields
  const [audioToTranscribe, setAudioToTranscribe] = useState<string | null>(null)

  const features = [
    { id: 'recommendations' as FeatureType, name: 'Personalized Recommendations', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'trends' as FeatureType, name: 'Market Trends', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
    { id: 'captions' as FeatureType, name: 'Social Media Captions', icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
    { id: 'campaigns' as FeatureType, name: 'Ad Campaign Ideas', icon: Megaphone, color: 'from-orange-500 to-red-500' },
    { id: 'design' as FeatureType, name: 'Design Improvements', icon: Palette, color: 'from-indigo-500 to-purple-500' },
    { id: 'tts' as FeatureType, name: 'Text to Speech', icon: Volume2, color: 'from-pink-500 to-rose-500' },
    { id: 'stt' as FeatureType, name: 'Speech to Text', icon: Mic, color: 'from-teal-500 to-cyan-500' },
  ]

  const languages = ['English', 'Hindi', 'Odia', 'Bengali', 'Malayalam', 'Telugu', 'Tamil', 'Kannada']

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setExampleImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAudioToTranscribe(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    console.log('Generate button clicked, activeFeature:', activeFeature)
    setIsGenerating(true)
    setResult(null)
    setAudioResult(null)

    try {
      let endpoint = ''
      let body: any = {}

      switch (activeFeature) {
        case 'recommendations':
          endpoint = '/api/ai-assistance/personalized-recommendations'
          body = { artisanProfile, pastInteractions, regionalTrends, language }
          console.log('Sending request to:', endpoint, 'with body:', body)
          break
        case 'trends':
          endpoint = '/api/ai-assistance/market-trends'
          body = { craft, region, language }
          break
        case 'captions':
          endpoint = '/api/ai-assistance/social-media-captions'
          body = { productName, craftType, productDescription, targetPlatform, tone, language }
          break
        case 'campaigns':
          endpoint = '/api/ai-assistance/ad-campaigns'
          body = { craftType, targetAudience, campaignGoal, pastCampaignPerformance, preferredPlatform, examplePosts, language }
          break
        case 'design':
          endpoint = '/api/ai-assistance/design-improvements'
          body = { designDescription, targetAudience: targetAudienceDesign, preferredStyle, designGoals, exampleImage, language }
          break
        case 'tts':
          endpoint = '/api/ai-assistance/text-to-speech'
          body = { text: textToConvert, language }
          break
        case 'stt':
          endpoint = '/api/ai-assistance/speech-to-text'
          body = { audio: audioToTranscribe }
          break
      }

      console.log('Fetching from endpoint:', endpoint)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('API Error:', error)
        throw new Error(error.error || 'Failed to generate')
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (activeFeature === 'tts') {
        setAudioResult(data.audio)
        toast.success('Audio generated successfully!')
      } else {
        setResult(data)
        toast.success('Generated successfully!')
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate')
    } finally {
      setIsGenerating(false)
    }
  }

  const renderFeatureForm = () => {
    switch (activeFeature) {
      case 'recommendations':
        return (
          <div className="space-y-4">
            <div>
              <Label>Artisan Profile</Label>
              <Textarea
                placeholder="Describe your craft, skills, and interests..."
                value={artisanProfile}
                onChange={(e) => setArtisanProfile(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Past Interactions</Label>
              <Textarea
                placeholder="Summary of your past queries, feedback, and preferences..."
                value={pastInteractions}
                onChange={(e) => setPastInteractions(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Regional Trends</Label>
              <Textarea
                placeholder="Describe regional trends related to your craft..."
                value={regionalTrends}
                onChange={(e) => setRegionalTrends(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case 'trends':
        return (
          <div className="space-y-4">
            <div>
              <Label>Craft Type</Label>
              <input
                type="text"
                placeholder="e.g., pottery, weaving, jewelry"
                value={craft}
                onChange={(e) => setCraft(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Region</Label>
              <input
                type="text"
                placeholder="e.g., Odisha, West Bengal, India"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        )

      case 'captions':
        return (
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <input
                type="text"
                placeholder="e.g., Handwoven Silk Sari"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Craft Type</Label>
              <input
                type="text"
                placeholder="e.g., pottery, weaving, jewelry"
                value={craftType}
                onChange={(e) => setCraftType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Product Description</Label>
              <Textarea
                placeholder="Describe materials, techniques, and inspiration..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Target Platform</Label>
              <Select value={targetPlatform} onValueChange={(v: any) => setTargetPlatform(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tone (Optional)</Label>
              <input
                type="text"
                placeholder="e.g., warm, professional, humorous"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        )

      case 'campaigns':
        return (
          <div className="space-y-4">
            <div>
              <Label>Craft Type</Label>
              <input
                type="text"
                placeholder="e.g., pottery, weaving, jewelry"
                value={craftType}
                onChange={(e) => setCraftType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Target Audience</Label>
              <input
                type="text"
                placeholder="e.g., young adults, tourists, collectors"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Campaign Goal</Label>
              <input
                type="text"
                placeholder="e.g., increase sales, brand awareness"
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Preferred Platform</Label>
              <input
                type="text"
                placeholder="e.g., Instagram, Facebook, YouTube"
                value={preferredPlatform}
                onChange={(e) => setPreferredPlatform(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Past Campaign Performance (Optional)</Label>
              <Textarea
                placeholder="Summary of past campaign results..."
                value={pastCampaignPerformance}
                onChange={(e) => setPastCampaignPerformance(e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Example Posts (Optional)</Label>
              <Textarea
                placeholder="Examples of your previous posts..."
                value={examplePosts}
                onChange={(e) => setExamplePosts(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )

      case 'design':
        return (
          <div className="space-y-4">
            <div>
              <Label>Design Description</Label>
              <Textarea
                placeholder="Detailed description of your design..."
                value={designDescription}
                onChange={(e) => setDesignDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Target Audience (Optional)</Label>
              <input
                type="text"
                placeholder="e.g., young professionals, traditional buyers"
                value={targetAudienceDesign}
                onChange={(e) => setTargetAudienceDesign(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Preferred Style (Optional)</Label>
              <input
                type="text"
                placeholder="e.g., modern, traditional, minimalist"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Design Goals (Optional)</Label>
              <input
                type="text"
                placeholder="e.g., increase appeal, modernize, stand out"
                value={designGoals}
                onChange={(e) => setDesignGoals(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <Label>Example Image (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {exampleImage ? (
                  <div className="space-y-2">
                    <img src={exampleImage} alt="Design" className="max-h-48 mx-auto rounded" />
                    <Button variant="outline" size="sm" onClick={() => setExampleImage(null)}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Palette className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload design image</p>
                  </label>
                )}
              </div>
            </div>
          </div>
        )

      case 'tts':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text to Convert</Label>
              <Textarea
                placeholder="Enter text to convert to speech..."
                value={textToConvert}
                onChange={(e) => setTextToConvert(e.target.value)}
                rows={5}
              />
            </div>
          </div>
        )

      case 'stt':
        return (
          <div className="space-y-4">
            <div>
              <Label>Audio File</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {audioToTranscribe ? (
                  <div className="space-y-2">
                    <audio src={audioToTranscribe} controls className="w-full" />
                    <Button variant="outline" size="sm" onClick={() => setAudioToTranscribe(null)}>
                      Remove Audio
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block text-center">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    <Mic className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload audio file</p>
                  </label>
                )}
              </div>
            </div>
          </div>
        )
    }
  }

  const renderResult = () => {
    if (!result && !audioResult) return null

    if (activeFeature === 'tts' && audioResult) {
      return (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Audio</h3>
          <audio src={audioResult} controls className="w-full" />
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              const link = document.createElement('a')
              link.href = audioResult
              link.download = 'speech.wav'
              link.click()
            }}
          >
            Download Audio
          </Button>
        </Card>
      )
    }

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Results</h3>
        <div className="space-y-4">
          {activeFeature === 'recommendations' && (
            <div>
              <Label className="text-sm font-medium">Recommendations</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {result.recommendations}
              </div>
            </div>
          )}

          {activeFeature === 'trends' && (
            <>
              <div>
                <Label className="text-sm font-medium">Trend Summary</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {result.trendSummary}
                </div>
              </div>
              {result.seasonalIdeas && (
                <div>
                  <Label className="text-sm font-medium">Seasonal Ideas</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {result.seasonalIdeas}
                  </div>
                </div>
              )}
            </>
          )}

          {activeFeature === 'captions' && (
            <>
              <div>
                <Label className="text-sm font-medium">Caption</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg relative">
                  <p className="whitespace-pre-wrap">{result.caption}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(result.caption, 'caption')}
                  >
                    {copiedItem === 'caption' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Hashtags</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg relative">
                  <p className="whitespace-pre-wrap">{result.hashtags}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(result.hashtags, 'hashtags')}
                  >
                    {copiedItem === 'hashtags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeFeature === 'campaigns' && (
            <>
              <div>
                <Label className="text-sm font-medium">Content Ideas</Label>
                <ul className="mt-2 space-y-2">
                  {result.contentIdeas?.map((idea: string, i: number) => (
                    <li key={i} className="p-3 bg-gray-50 rounded-lg">• {idea}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium">Caption Suggestions</Label>
                <ul className="mt-2 space-y-2">
                  {result.captionSuggestions?.map((caption: string, i: number) => (
                    <li key={i} className="p-3 bg-gray-50 rounded-lg">• {caption}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium">Hashtag Suggestions</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  {result.hashtagSuggestions?.join(' ')}
                </div>
              </div>
            </>
          )}

          {activeFeature === 'design' && (
            <>
              <div>
                <Label className="text-sm font-medium">Suggestions</Label>
                <ul className="mt-2 space-y-2">
                  {result.suggestions?.map((suggestion: string, i: number) => (
                    <li key={i} className="p-3 bg-gray-50 rounded-lg">• {suggestion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium">Reasoning</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {result.reasoning}
                </div>
              </div>
            </>
          )}

          {activeFeature === 'stt' && (
            <div>
              <Label className="text-sm font-medium">Transcribed Text</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap relative">
                <p>{result.text}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(result.text, 'transcription')}
                >
                  {copiedItem === 'transcription' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <h1 className="text-5xl font-heading text-craft-primary">AI Assistance</h1>
            </div>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Powerful AI tools to help you grow your craft business
            </p>
          </div>

          {/* Feature Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    activeFeature === feature.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => {
                    setActiveFeature(feature.id)
                    setResult(null)
                    setAudioResult(null)
                  }}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-xs">{feature.name}</h3>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-heading text-craft-primary mb-6">
                {features.find(f => f.id === activeFeature)?.name}
              </h2>

              <div className="space-y-6">
                {renderFeatureForm()}

                {/* Language Selector (except for STT) */}
                {activeFeature !== 'stt' && (
                  <div>
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Results */}
            <div>
              {(result || audioResult) ? (
                renderResult()
              ) : (
                <Card className="p-8">
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <h2 className="text-2xl font-heading text-craft-primary mb-3">
                      Ready to Assist
                    </h2>
                    <p className="text-foreground/70 max-w-md mx-auto">
                      Fill in the form and click Generate to get AI-powered assistance
                    </p>
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
