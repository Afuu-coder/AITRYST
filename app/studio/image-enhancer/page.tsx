"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Download, 
  Loader2, 
  Image as ImageIcon,
  Sparkles,
  Eye,
  RefreshCw,
  Check,
  X
} from "lucide-react"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"
import { enhanceImage, type EnhanceImageOutput } from '@/ai/flows/enhance-image'

interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  duration?: number
}

type EnhancementType = 'natural' | 'white_background' | 'high_resolution'

export default function ImageEnhancerPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedEnhancement, setSelectedEnhancement] = useState<EnhancementType>('natural')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file")
      return
    }

    // Validate file size (max 7MB for Gemini)
    if (file.size > 7 * 1024 * 1024) {
      toast.error("Image file size must be less than 7MB")
      return
    }

    const url = URL.createObjectURL(file)
    setSelectedImage(file)
    setImageUrl(url)
    
    // Reset previous results
    setEnhancedImage(null)
    setProcessingSteps([])
    setCurrentStep(0)
    
    toast.success("Image uploaded successfully!")
  }

  const enhanceImageProcess = useCallback(async () => {
    if (!selectedImage) {
      toast.error("No image selected")
      return
    }

    // Initialize processing steps
    const steps: ProcessingStep[] = [
      { id: 'upload', name: 'Processing Image', status: 'processing' },
      { id: 'enhance', name: 'AI Enhancement', status: 'pending' },
      { id: 'complete', name: 'Finalizing', status: 'pending' }
    ]
    setProcessingSteps(steps)
    setIsEnhancing(true)
    setCurrentStep(0)

    try {
      // Convert image to data URI
      const reader = new FileReader()
      reader.onload = async (e) => {
        const photoDataUri = e.target?.result as string
        
        // Update step 1
        setProcessingSteps(prev => prev.map((step, idx) => 
          idx === 0 ? { ...step, status: 'completed' } : step
        ))
        setCurrentStep(1)

        // Update step 2
        setProcessingSteps(prev => prev.map((step, idx) => 
          idx === 1 ? { ...step, status: 'processing' } : step
        ))

        try {
          // Call the enhancement API
          const result = await enhanceImage({ photoDataUri })
          
          // Update step 2
          setProcessingSteps(prev => prev.map((step, idx) => 
            idx === 1 ? { ...step, status: 'completed' } : step
          ))
          setCurrentStep(2)

          // Update step 3
          setProcessingSteps(prev => prev.map((step, idx) => 
            idx === 2 ? { ...step, status: 'processing' } : step
          ))

          // Get only the selected enhancement type
          const selectedResult = result.images.find(img => img.variation === selectedEnhancement)
          if (selectedResult) {
            setEnhancedImage(selectedResult.url)
          }

          // Complete step 3
          setProcessingSteps(prev => prev.map((step, idx) => 
            idx === 2 ? { ...step, status: 'completed' } : step
          ))

          toast.success("🎨 Image enhancement completed!")
        } catch (error) {
          console.error('Enhancement error:', error)
          setProcessingSteps(prev => prev.map((step, idx) => 
            idx === currentStep ? { ...step, status: 'error' } : step
          ))
          toast.error("Enhancement failed. Please try again.")
        }
      }
      reader.readAsDataURL(selectedImage)
    } catch (error) {
      console.error('Processing error:', error)
      toast.error("Failed to process image")
    } finally {
      setIsEnhancing(false)
    }
  }, [selectedImage, selectedEnhancement, currentStep])

  const downloadImage = () => {
    if (!enhancedImage) return
    const link = document.createElement('a')
    link.href = enhancedImage
    link.download = `enhanced-${selectedEnhancement}-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloaded ${selectedEnhancement} version!`)
  }

  const resetAll = () => {
    setSelectedImage(null)
    setImageUrl("")
    setEnhancedImage(null)
    setProcessingSteps([])
    setCurrentStep(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const enhancementOptions = [
    { value: 'natural' as const, label: 'Natural Lighting', description: 'Bright studio lighting with natural colors' },
    { value: 'white_background' as const, label: 'White Background', description: 'Clean white background for e-commerce' },
    { value: 'high_resolution' as const, label: 'High Resolution', description: 'Upscaled with enhanced details' },
  ]

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🎨 Image to Enhanced Product Photos ✨</h1>
          <p className="text-muted-foreground">
            Upload your product image and watch AI transform it into professional photos
          </p>
        </div>

        {/* Two Panel Layout */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">

          {/* LEFT PANEL - Upload & Select */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Upload Your Product Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhancement Type Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Select Enhancement Type</label>
                <div className="space-y-2">
                  {enhancementOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedEnhancement(option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedEnhancement === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          selectedEnhancement === option.value
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedEnhancement === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Area */}
              <div>
                <label className="text-sm font-medium mb-3 block">Upload Image</label>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imageUrl ? (
                    <div className="space-y-3">
                      <div className="w-full aspect-square max-w-xs mx-auto rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={imageUrl} 
                          alt="Uploaded product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Image Ready</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedImage?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((selectedImage?.size || 0) / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Click to upload image</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports JPG, PNG, WebP (max 7MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="mt-4">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imageUrl ? 'Change Image' : 'Upload Image File'}
                  </Button>
                </div>
              </div>

              {/* Enhance Button */}
              {selectedImage && !isEnhancing && (
                <Button 
                  onClick={enhanceImageProcess}
                  className="w-full"
                  size="lg"
                  disabled={isEnhancing}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Enhance Image
                </Button>
              )}
            </CardContent>
          </Card>

          {/* RIGHT PANEL - Processing & Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Enhanced Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!imageUrl && !isEnhancing && !enhancedImage && (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <ImageIcon className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">Ready for Magic ✨</h3>
                    </div>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload your product image and watch AI transform it into professional photos
                    </p>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium text-sm mb-1">Natural Lighting</p>
                      <p className="text-xs text-muted-foreground">
                        Bright studio lighting with natural colors
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-medium text-sm mb-1">White Background</p>
                      <p className="text-xs text-muted-foreground">
                        Clean white background for e-commerce
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="font-medium text-sm mb-1">High Resolution</p>
                      <p className="text-xs text-muted-foreground">
                        Upscaled with enhanced details
                      </p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="bg-primary/5 rounded-lg p-4 mt-6">
                    <p className="font-medium text-sm mb-3">How it works:</p>
                    <div className="flex items-center justify-center gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <span className="text-muted-foreground">Select enhancement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <span className="text-muted-foreground">Upload image</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <span className="text-muted-foreground">Get enhanced photo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Steps */}
              {processingSteps.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium flex items-center gap-2">
                    <Loader2 className={`h-4 w-4 ${isEnhancing ? 'animate-spin' : ''}`} />
                    Processing Status
                  </h3>
                  <div className="space-y-3">
                    {processingSteps.map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {step.status === 'completed' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                          {step.status === 'processing' && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Loader2 className="h-4 w-4 text-white animate-spin" />
                            </div>
                          )}
                          {step.status === 'pending' && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full" />
                          )}
                          {step.status === 'error' && (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <X className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.name}</p>
                        </div>
                        <Badge variant={
                          step.status === 'completed' ? 'default' :
                          step.status === 'processing' ? 'secondary' :
                          step.status === 'error' ? 'destructive' : 'outline'
                        } className="text-xs">
                          {step.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Comparison */}
              {enhancedImage && imageUrl && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-center">Original</p>
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2">
                        <img 
                          src={imageUrl} 
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Enhanced Image */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-center">Enhanced</p>
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-primary">
                        <img 
                          src={enhancedImage} 
                          alt="Enhanced"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhancement Info */}
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {enhancementOptions.find(opt => opt.value === selectedEnhancement)?.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {enhancementOptions.find(opt => opt.value === selectedEnhancement)?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={downloadImage}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Enhanced
                    </Button>
                    <Button 
                      onClick={resetAll}
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      New Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
