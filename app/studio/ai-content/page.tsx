"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Loader2, Instagram, MessageCircle, ShoppingBag, Mail, Facebook, Twitter, Upload, Image as ImageIcon, FileText, X, Sparkles, Check, RefreshCw, Zap } from "lucide-react"
import { useBackendContext } from "@/components/BackendProvider"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

export default function AIContentStudio() {
  const [inputText, setInputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [editableContent, setEditableContent] = useState<{
    instagram: string;
    whatsapp: string;
    amazon: string;
    emailSubject: string;
    emailBody: string;
    facebook: string;
    twitter: string;
  } | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | "bn" | "te">("en")
  const [inputType, setInputType] = useState<"text" | "image" | "mixed">("text")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<string>("")
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { generateContent } = useBackendContext()

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "text-green-500" },
    { id: "amazon", name: "Amazon", icon: ShoppingBag, color: "text-orange-500" },
    { id: "email", name: "Email", icon: Mail, color: "text-blue-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-sky-500" },
  ]

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  ]

  const inputTypes = [
    { id: "text", name: "Text Description", icon: FileText, description: "Describe your product in words" },
    { id: "image", name: "Product Image", icon: ImageIcon, description: "Upload a photo of your product" },
    { id: "mixed", name: "Image + Text", icon: Upload, description: "Best results with both image and description" },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    setImageAnalysis("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeImage = async (imageFile: File) => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        setImageAnalysis(data.analysis)
        return data.analysis
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Image analysis failed')
      }
    } catch (error) {
      console.error('Image analysis error:', error)
      toast.error(`Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }

  const handleGenerateContent = async () => {
    if (inputType === "text" && !inputText.trim()) {
      toast.error("Please enter some text to generate content")
      return
    }
    
    if (inputType === "image" && !uploadedImage) {
      toast.error("Please upload an image to generate content")
      return
    }
    
    if (inputType === "mixed" && !inputText.trim() && !uploadedImage) {
      toast.error("Please provide both text description and image")
      return
    }

    setIsGenerating(true)
    try {
      let finalDescription = inputText
      
      // Analyze image if provided
      if (uploadedImage) {
        try {
          const analysis = await analyzeImage(uploadedImage)
          if (analysis) {
            finalDescription = inputType === "mixed" 
              ? `${inputText}\n\nImage Analysis: ${analysis}`
              : `Product Image Analysis: ${analysis}`
          }
        } catch (error) {
          // If image analysis fails, stop the process
          setIsGenerating(false)
          return
        }
      }

      const selectedLang = languages.find(lang => lang.code === selectedLanguage)
      const languageName = selectedLang?.name || "English"
      
      // Create a more specific prompt for better results
      const prompt = `Create comprehensive marketing content for a handcrafted product with this description: "${finalDescription}". The content should be engaging and suitable for artisans selling their products online in ${languageName}.
      
Focus on:
1. Highlighting the craftsmanship and uniqueness of the product
2. Connecting with the cultural significance of handcrafted items
3. Appealing to customers who value authenticity and tradition
4. Creating content that converts browsers into buyers
5. Using appropriate cultural context for ${languageName} speaking customers

Format your response as JSON with the following structure:
{
  "headline": "A catchy headline",
  "description": "A detailed product description",
  "instagram": "Instagram caption with hashtags",
  "whatsapp": "WhatsApp message for customers",
  "amazon": "Amazon product description",
  "emailSubject": "Email subject line",
  "emailBody": "Email body content",
  "facebook": "Facebook post content",
  "twitter": "Twitter post (under 280 characters)"
}`

      // Call the generate-platform-content API
      const response = await fetch('/api/generate-platform-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: finalDescription,
          language: selectedLanguage,
          platforms: ['instagram', 'whatsapp', 'amazon', 'email', 'facebook', 'twitter']
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const content = await response.json()
      console.log('Received content from API:', content)
      
      // Ensure content is properly parsed and not a string
      let parsedContent = content
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content)
        } catch (e) {
          console.error('Failed to parse content as JSON:', e)
          throw new Error('Invalid content format received')
        }
      }
      
      // Check if content has the expected structure
      if (parsedContent && typeof parsedContent === 'object' && (parsedContent.headline || parsedContent.description)) {
        console.log('Content structure is valid:', parsedContent)
        
        setGeneratedContent(parsedContent)
        setEditableContent({
          instagram: parsedContent.instagram || "",
          whatsapp: parsedContent.whatsapp || "",
          amazon: parsedContent.amazon || "",
          emailSubject: parsedContent.emailSubject || "Discover Our Handcrafted Collection",
          emailBody: parsedContent.emailBody || "",
          facebook: parsedContent.facebook || "",
          twitter: parsedContent.twitter || ""
        })
        
        console.log('Set editable content:', {
          instagram: parsedContent.instagram || "",
          whatsapp: parsedContent.whatsapp || "",
          amazon: parsedContent.amazon || "",
          emailSubject: parsedContent.emailSubject || "Discover Our Handcrafted Collection",
          emailBody: parsedContent.emailBody || "",
          facebook: parsedContent.facebook || "",
          twitter: parsedContent.twitter || ""
        })
        
        toast.success("Content generated successfully!")
      } else {
        console.error('Invalid content structure:', parsedContent)
        throw new Error("Failed to generate meaningful content")
      }
    } catch (error) {
      toast.error("Failed to generate content. Please check your Google Cloud configuration and try again.")
      console.error("Content generation error:", error)
      setGeneratedContent(null)
      setEditableContent(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(platform))
      toast.success(`${platform} content copied!`)
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(platform)
          return newSet
        })
      }, 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const resetAll = () => {
    setGeneratedContent(null)
    setEditableContent(null)
    setInputText("")
    setUploadedImage(null)
    setImagePreview(null)
    setImageAnalysis("")
    setCopiedItems(new Set())
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading text-craft-primary mb-4">AI Content Studio</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Transform your product ideas into compelling marketing content for all platforms using AI
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Side - Input */}
            <Card className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  Product Input
                </h2>

                {/* Input Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Choose Input Method</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {inputTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <Card 
                          key={type.id}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            inputType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setInputType(type.id as "text" | "image" | "mixed")}
                        >
                          <div className="flex items-center space-x-4">
                            <Icon className="w-6 h-6 text-blue-500" />
                            <div>
                              <h3 className="font-medium text-lg">{type.name}</h3>
                              <p className="text-sm text-foreground/70">{type.description}</p>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Target Language</Label>
                  <Select value={selectedLanguage} onValueChange={(value: "en" | "hi" | "bn" | "te") => setSelectedLanguage(value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Input */}
                {(inputType === "text" || inputType === "mixed") && (
                  <div className="space-y-3">
                    <Label className="text-lg font-medium">Product Description</Label>
                    <Textarea
                      placeholder="Enter your product description or paste transcription from voice recording..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={6}
                      className="text-base"
                    />
                  </div>
                )}

                {/* Image Upload */}
                {(inputType === "image" || inputType === "mixed") && (
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Product Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Product preview" 
                              className="max-w-full h-48 object-contain rounded-lg"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2"
                              onClick={removeImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {imageAnalysis && (
                            <div className="text-sm text-foreground/70 bg-muted p-3 rounded">
                              <strong>AI Analysis:</strong> {imageAnalysis}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-xl font-medium">Upload Product Image</p>
                            <p className="text-sm text-foreground/70">Drag and drop or click to browse</p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            className="h-12 px-6"
                          >
                            Choose Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3" />
                      Generate AI Content
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Right Side - Results */}
            <Card className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-green-500" />
                  Generated Content
                </h2>

                {!generatedContent ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <FileText className="w-12 h-12 text-blue-500" />
                      <h2 className="text-3xl font-heading text-craft-primary">Ready for Magic</h2>
                      <Sparkles className="w-12 h-12 text-purple-500" />
                    </div>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
                      Describe your product or upload an image and watch AI transform it into compelling content for all platforms with advanced AI technology.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>📝</div>
                        <h3 className="font-semibold text-blue-700 mb-2">Text Input</h3>
                        <p className="text-sm text-blue-600">Enter product descriptions or paste transcriptions from voice recording</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>🖼️</div>
                        <h3 className="font-semibold text-green-700 mb-2">Image Analysis</h3>
                        <p className="text-sm text-green-600">Upload product images for AI-powered visual analysis and content generation</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>🚀</div>
                        <h3 className="font-semibold text-purple-700 mb-2">Multi-Platform</h3>
                        <p className="text-sm text-purple-600">Generate content optimized for Instagram, WhatsApp, Amazon, Facebook, and more</p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-700 mb-3">How it works:</h3>
                      <div className="flex justify-center gap-8 text-sm text-blue-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>1</div>
                          <span>Choose input method</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>2</div>
                          <span>AI analyzes content</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>3</div>
                          <span>Generate platform content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Product Overview */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium">Product Overview</Label>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <h3 className="font-semibold text-lg mb-2">{generatedContent.headline}</h3>
                        <p className="text-sm leading-relaxed">{generatedContent.description}</p>
                      </div>
                    </div>

                    {/* Platform Content */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Platform Content</h3>
                        <Button variant="outline" size="sm" onClick={resetAll}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Start Over
                        </Button>
                      </div>

                      {/* Instagram Section */}
                      <Card className="p-4 border-l-4 border-l-pink-500">
                        <div className="flex items-center gap-2 mb-3">
                          <Instagram className="w-5 h-5 text-pink-500" />
                          <Label className="font-semibold text-lg">Instagram</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(editableContent?.instagram || "", 'Instagram')}
                          >
                            {copiedItems.has('Instagram') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-pink-50 p-3 rounded-lg">
                          <Textarea
                            value={editableContent?.instagram || ""}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, instagram: e.target.value} : null)}
                            className="min-h-[100px] resize-none border-0 bg-transparent"
                            placeholder="Instagram caption will appear here..."
                          />
                        </div>
                      </Card>

                      {/* WhatsApp Section */}
                      <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageCircle className="w-5 h-5 text-green-500" />
                          <Label className="font-semibold text-lg">WhatsApp</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(editableContent?.whatsapp || "", 'WhatsApp')}
                          >
                            {copiedItems.has('WhatsApp') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <Textarea
                            value={editableContent?.whatsapp || ""}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, whatsapp: e.target.value} : null)}
                            className="min-h-[100px] resize-none border-0 bg-transparent"
                            placeholder="WhatsApp message will appear here..."
                          />
                        </div>
                      </Card>

                      {/* Amazon Section */}
                      <Card className="p-4 border-l-4 border-l-orange-500">
                        <div className="flex items-center gap-2 mb-3">
                          <ShoppingBag className="w-5 h-5 text-orange-500" />
                          <Label className="font-semibold text-lg">Amazon</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(editableContent?.amazon || "", 'Amazon')}
                          >
                            {copiedItems.has('Amazon') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <Textarea
                            value={editableContent?.amazon || ""}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, amazon: e.target.value} : null)}
                            className="min-h-[100px] resize-none border-0 bg-transparent"
                            placeholder="Amazon listing will appear here..."
                          />
                        </div>
                      </Card>

                      {/* Email Section */}
                      <Card className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2 mb-3">
                          <Mail className="w-5 h-5 text-blue-500" />
                          <Label className="font-semibold text-lg">Email</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${editableContent?.emailSubject || ""}\n\n${editableContent?.emailBody || ""}`, 'Email')}
                          >
                            {copiedItems.has('Email') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-blue-700">Subject:</Label>
                            <Textarea
                              value={editableContent?.emailSubject || ""}
                              onChange={(e) => setEditableContent(prev => prev ? {...prev, emailSubject: e.target.value} : null)}
                              className="min-h-[50px] resize-none border-0 bg-transparent mt-1"
                              placeholder="Email subject will appear here..."
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-blue-700">Body:</Label>
                            <Textarea
                              value={editableContent?.emailBody || ""}
                              onChange={(e) => setEditableContent(prev => prev ? {...prev, emailBody: e.target.value} : null)}
                              className="min-h-[100px] resize-none border-0 bg-transparent mt-1"
                              placeholder="Email body will appear here..."
                            />
                          </div>
                        </div>
                      </Card>

                      {/* Facebook Section */}
                      <Card className="p-4 border-l-4 border-l-blue-600">
                        <div className="flex items-center gap-2 mb-3">
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <Label className="font-semibold text-lg">Facebook</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(editableContent?.facebook || "", 'Facebook')}
                          >
                            {copiedItems.has('Facebook') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <Textarea
                            value={editableContent?.facebook || ""}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, facebook: e.target.value} : null)}
                            className="min-h-[100px] resize-none border-0 bg-transparent"
                            placeholder="Facebook post will appear here..."
                          />
                        </div>
                      </Card>

                      {/* Twitter Section */}
                      <Card className="p-4 border-l-4 border-l-sky-500">
                        <div className="flex items-center gap-2 mb-3">
                          <Twitter className="w-5 h-5 text-sky-500" />
                          <Label className="font-semibold text-lg">Twitter</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(editableContent?.twitter || "", 'Twitter')}
                          >
                            {copiedItems.has('Twitter') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-sky-50 p-3 rounded-lg">
                          <Textarea
                            value={editableContent?.twitter || ""}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, twitter: e.target.value} : null)}
                            className="min-h-[80px] resize-none border-0 bg-transparent"
                            placeholder="Twitter post will appear here..."
                          />
                          <div className="text-right mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {(editableContent?.twitter || "").length}/280
                            </Badge>
                          </div>
                        </div>
                      </Card>

                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}