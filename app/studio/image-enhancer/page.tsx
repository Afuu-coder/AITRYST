"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Upload, 
  Download, 
  Sparkles, 
  Loader2, 
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Wand2,
  ImageIcon
} from "lucide-react"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

interface EnhancementResult {
  originalUrl: string
  enhancedUrl: string
  analysis: string
  improvements: string[]
}

export default function ImageEnhancer() {
  // State management
  const [isUploading, setIsUploading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [enhancementResult, setEnhancementResult] = useState<EnhancementResult | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string>("clean-background")
  const [showComparison, setShowComparison] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const presets = [
    { id: "clean-background", name: "Clean Background", description: "Remove background, add white/transparent background" },
    { id: "natural-lighting", name: "Natural Lighting", description: "Enhance with bright, natural lighting" },
    { id: "high-resolution", name: "High Resolution", description: "Upscale image to higher resolution, make it sharper" },
    { id: "add-shadow", name: "Add Shadow", description: "Add realistic drop shadow to make product stand out" }
  ]

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB")
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
      setEnhancementResult(null)
    }
    reader.readAsDataURL(file)
    
    toast.success("Image uploaded successfully!")
  }, [])

  const removeImage = useCallback(() => {
    setImageFile(null)
    setImagePreview(null)
    setEnhancementResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleEnhanceImage = useCallback(async () => {
    if (!imageFile) {
      toast.error("Please upload an image first")
      return
    }

    setIsEnhancing(true)
    setEnhancementResult(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('preset', selectedPreset)

      const response = await fetch('/api/enhance-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setEnhancementResult(result)
      toast.success("Image enhanced successfully with Google Cloud AI!")
      
    } catch (error) {
      console.error('Enhancement error:', error)
      toast.error("Failed to enhance image. Please try again.")
    } finally {
      setIsEnhancing(false)
    }
  }, [imageFile, selectedPreset])

  const downloadEnhancedImage = useCallback(() => {
    if (!enhancementResult?.enhancedUrl) return
    
    const link = document.createElement('a')
    link.href = enhancementResult.enhancedUrl
    link.download = `enhanced_${imageFile?.name || 'image.png'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Enhanced image downloaded!")
  }, [enhancementResult, imageFile])

  const resetAll = useCallback(() => {
    setImageFile(null)
    setImagePreview(null)
    setEnhancementResult(null)
    setSelectedPreset("clean-background")
    setShowComparison(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-blue-500" />
            <h1 className="text-5xl font-heading text-craft-primary">Image Enhancer</h1>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-6">
            Transform your product photos into professional, eye-catching images with AI-powered enhancement. Perfect for e-commerce, social media, and marketing.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2">
              🎨 AI Enhancement
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
              📸 Professional Quality
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2">
              ⚡ Instant Results
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Side - Image Upload & Settings */}
          <Card className="p-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <Upload className="w-6 h-6 text-blue-500" />
                Upload & Enhance
              </h2>

              {/* Image Upload */}
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
                      <p className="text-sm text-foreground/70">
                        {imageFile?.name} ({(imageFile?.size ? (imageFile.size / 1024 / 1024).toFixed(2) : '0')} MB)
                      </p>
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

              {/* Enhancement Presets */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Enhancement Style</Label>
                <div className="grid grid-cols-2 gap-3">
                  {presets.map((preset) => (
                    <Card 
                      key={preset.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedPreset === preset.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPreset(preset.id)}
                    >
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">{preset.name}</h3>
                        <p className="text-xs text-foreground/70">{preset.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Enhance Button */}
              <Button
                onClick={handleEnhanceImage}
                disabled={!imageFile || isEnhancing}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Enhancing Image...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6 mr-3" />
                    Enhance Image
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
                Enhanced Result
              </h2>

              {!enhancementResult ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Camera className="w-12 h-12 text-blue-500" />
                    <h2 className="text-3xl font-heading text-craft-primary">Ready for Enhancement</h2>
                    <Sparkles className="w-12 h-12 text-purple-500" />
                  </div>
                  <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
                    Upload your product image and watch AI transform it into a professional, eye-catching photo perfect for marketing and sales.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="text-4xl mb-3" suppressHydrationWarning>🎨</div>
                      <h3 className="font-semibold text-blue-700 mb-2">AI Enhancement</h3>
                      <p className="text-sm text-blue-600">Advanced AI algorithms improve lighting, colors, and composition</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="text-4xl mb-3" suppressHydrationWarning>📸</div>
                      <h3 className="font-semibold text-green-700 mb-2">Professional Quality</h3>
                      <p className="text-sm text-green-600">Transform basic photos into professional marketing images</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                      <div className="text-4xl mb-3" suppressHydrationWarning>⚡</div>
                      <h3 className="font-semibold text-purple-700 mb-2">Instant Results</h3>
                      <p className="text-sm text-purple-600">Get enhanced images in seconds with Google Cloud AI</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-3">How it works:</h3>
                    <div className="flex justify-center gap-8 text-sm text-blue-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>1</div>
                        <span>Upload product image</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>2</div>
                        <span>AI analyzes & enhances</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>3</div>
                        <span>Download result</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Comparison */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Enhanced Image</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowComparison(!showComparison)}
                        >
                          {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showComparison ? 'Hide' : 'Show'} Comparison
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetAll}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Start Over
                        </Button>
                      </div>
                    </div>

                    {showComparison ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-center">Original</p>
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={imagePreview || ''} 
                              alt="Original" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-center">Enhanced</p>
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {enhancementResult.enhancedUrl ? (
                              <img 
                                src={enhancementResult.enhancedUrl} 
                                alt="Enhanced" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-red-500">
                                <div className="text-center">
                                  <p className="text-sm font-medium">Enhancement Failed</p>
                                  <p className="text-xs text-gray-500">Check Google Cloud configuration</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {enhancementResult.enhancedUrl ? (
                          <img 
                            src={enhancementResult.enhancedUrl} 
                            alt="Enhanced product" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-red-500">
                            <div className="text-center">
                              <p className="text-sm font-medium">Enhancement Failed</p>
                              <p className="text-xs text-gray-500">Check Google Cloud configuration</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* AI Analysis */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">AI Analysis</h4>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <p className="text-sm leading-relaxed">{enhancementResult.analysis}</p>
                    </div>
                  </div>

                  {/* Improvements Applied */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Improvements Applied</h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancementResult.improvements && Array.isArray(enhancementResult.improvements) ? 
                        enhancementResult.improvements.map((improvement, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                            {improvement}
                          </Badge>
                        )) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            No improvements data available
                          </Badge>
                        )
                      }
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadEnhancedImage}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Enhanced Image
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}