"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Loader2, Sparkles, Download, Instagram, ShoppingBag, Wand2 } from "lucide-react"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"
import { 
  createEnhancementStyles, 
  validateEnhancementOptions,
  getEnhancementStatusMessage,
  type EnhancementOptions
} from "@/lib/imageEnhancement"

interface ImageUploaderProps {
  productData: any
  updateProductData: (data: any) => void
  onNext: () => void
}

export function ImageUploader({ productData, updateProductData, onNext }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    removeBackground: true,
    enhanceQuality: true,
    stylize: false,
    contrast: 100,
    brightness: 100
  })
  const { uploadImageFile, enhanceImageFile } = useBackendContext()

  // Debugging: Log when component mounts and when props change
  useEffect(() => {
    console.log("ImageUploader mounted with productData:", productData)
  }, [])

  useEffect(() => {
    console.log("ProductData updated:", productData)
  }, [productData])

  useEffect(() => {
    console.log("Enhancement options updated:", enhancementOptions)
  }, [enhancementOptions])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      console.log("File dropped:", file)
      setIsUploading(true)

      try {
        // Upload image to Firebase Storage
        const imagePath = `products/${Date.now()}_${file.name}`
        const imageUrl = await uploadImageFile(file, imagePath)
        
        if (!imageUrl) {
          throw new Error("Failed to upload image")
        }
        
        console.log("Image uploaded:", imageUrl)
        updateProductData({ imageUrl })

        // Enhance image using AI with specified options
        setIsEnhancing(true)
        console.log("Enhancing image with options:", enhancementOptions)
        const enhancedImageUrl = await enhanceImageFile(imageUrl, enhancementOptions)
        
        if (!enhancedImageUrl) {
          throw new Error("Failed to enhance image")
        }
        
        console.log("Image enhanced:", enhancedImageUrl)
        updateProductData({ enhancedImageUrl })

        toast.success("Image uploaded and enhanced successfully!")
      } catch (error) {
        toast.error("Failed to process image")
        console.error("Image processing error:", error)
      } finally {
        setIsUploading(false)
        setIsEnhancing(false)
      }
    },
    [updateProductData, uploadImageFile, enhanceImageFile, enhancementOptions],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  })

  const handleEnhanceAgain = async () => {
    if (!productData.imageUrl) return;
    
    // Validate enhancement options
    const validationErrors = validateEnhancementOptions(enhancementOptions)
    if (validationErrors.length > 0) {
      toast.error("Invalid enhancement options: " + validationErrors.join(", "))
      return
    }
    
    console.log("Re-enhancing image with options:", enhancementOptions)
    setIsEnhancing(true)
    try {
      const enhancedImageUrl = await enhanceImageFile(productData.imageUrl, enhancementOptions)
      if (!enhancedImageUrl) {
        throw new Error("Failed to enhance image")
      }
      console.log("Image re-enhanced:", enhancedImageUrl)
      updateProductData({ enhancedImageUrl })
      
      // Show success message with enhancement details
      const statusMessage = getEnhancementStatusMessage(enhancementOptions)
      toast.success(`Image enhanced successfully! ${statusMessage}`)
    } catch (error) {
      toast.error("Failed to enhance image")
      console.error("Image enhancement error:", error)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-heading text-craft-primary mb-2 lg:mb-4 warli-stroke">
          Image Enhancement
        </h2>
        <p className="text-foreground/70 text-sm lg:text-base">
          Transform your product photos with AI-powered enhancement
        </p>
      </div>

      {!productData.imageUrl ? (
        <Card
          {...getRootProps()}
          className={`craft-card border-2 border-dashed p-6 lg:p-12 text-center cursor-pointer transition-all duration-300 ajrakh-pattern ${
            isDragActive
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4 lg:gap-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full flex items-center justify-center festival-glow">
              {isUploading ? (
                <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 text-primary pottery-spinner" />
              ) : (
                <Upload className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium text-base lg:text-lg mb-2">
                {isDragActive ? "Drop your image here" : "Drop photos or tap to choose"}
              </p>
              <p className="text-xs lg:text-sm text-foreground/60">Support JPG, PNG, WebP up to 10MB</p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm text-foreground/60 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                <span>Use natural lighting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo rounded-full"></div>
                <span>Clean background</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-marigold rounded-full"></div>
                <span>Multiple angles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-peepal-green rounded-full"></div>
                <span>High resolution</span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Original Image */}
            <Card className="craft-card p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 lg:w-5 lg:h-5 text-foreground/60" />
                  <span className="font-medium text-sm lg:text-base">Original</span>
                </div>
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  Before
                </Badge>
              </div>
              <img
                src={productData.imageUrl || "/placeholder-image.jpg"}
                alt="Original product"
                className="w-full h-48 lg:h-64 object-cover rounded-lg"
              />
            </Card>

            {/* Enhanced Image */}
            {isEnhancing ? (
              <Card className="craft-card p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-3 lg:mb-4">
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary pottery-spinner" />
                  <span className="font-medium text-sm lg:text-base">Enhancing...</span>
                </div>
                <div className="w-full h-48 lg:h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 festival-glow">
                      <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-primary pottery-spinner" />
                    </div>
                    <p className="text-xs lg:text-sm text-foreground/60">Shaping your content...</p>
                  </div>
                </div>
              </Card>
            ) : productData.enhancedImageUrl ? (
              <Card className="craft-card p-4 lg:p-6 pulse-glow border-accent/50">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
                    <span className="font-medium text-sm lg:text-base">AI Enhanced</span>
                  </div>
                  <Badge className="bg-accent text-xs lg:text-sm">After</Badge>
                </div>
                <div className="relative">
                  <img
                    src={productData.enhancedImageUrl || "/placeholder-image.jpg"}
                    alt="Enhanced product"
                    className="w-full h-48 lg:h-64 object-cover rounded-lg"
                    style={createEnhancementStyles(enhancementOptions)}
                  />
                  {enhancementOptions.removeBackground && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      🎯 BG Removed
                    </div>
                  )}
                </div>
              </Card>
            ) : null}
          </div>

          {/* Enhancement Options - Always render when we have an image */}
          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="font-medium text-sm lg:text-base flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Enhancement Options
              </h3>
              <div className="text-right">
                <div className="text-xs lg:text-sm text-foreground/60">
                  {getEnhancementStatusMessage(enhancementOptions)}
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remove-bg" className="text-sm">Remove Background</Label>
                  <Switch
                    id="remove-bg"
                    checked={enhancementOptions.removeBackground}
                    onCheckedChange={(checked) => {
                      console.log("Remove background toggle:", checked)
                      setEnhancementOptions(prev => ({...prev, removeBackground: checked}))
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enhance-quality" className="text-sm">Enhance Quality</Label>
                  <Switch
                    id="enhance-quality"
                    checked={enhancementOptions.enhanceQuality}
                    onCheckedChange={(checked) => {
                      console.log("Enhance quality toggle:", checked)
                      setEnhancementOptions(prev => ({...prev, enhanceQuality: checked}))
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="stylize" className="text-sm">Artisan Style</Label>
                  <Switch
                    id="stylize"
                    checked={enhancementOptions.stylize}
                    onCheckedChange={(checked) => {
                      console.log("Stylize toggle:", checked)
                      setEnhancementOptions(prev => ({...prev, stylize: checked}))
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 lg:mb-3">
                  <Label htmlFor="contrast" className="text-xs lg:text-sm font-medium">Contrast</Label>
                  <span className="text-xs lg:text-sm text-foreground/60">{enhancementOptions.contrast}%</span>
                </div>
                <Slider
                  id="contrast"
                  value={[enhancementOptions.contrast]}
                  onValueChange={(value) => {
                    console.log("Contrast slider value:", value)
                    setEnhancementOptions(prev => ({...prev, contrast: value[0]}))
                  }}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 lg:mb-3">
                  <Label htmlFor="brightness" className="text-xs lg:text-sm font-medium">Brightness</Label>
                  <span className="text-xs lg:text-sm text-foreground/60">{enhancementOptions.brightness}%</span>
                </div>
                <Slider
                  id="brightness"
                  value={[enhancementOptions.brightness]}
                  onValueChange={(value) => {
                    console.log("Brightness slider value:", value)
                    setEnhancementOptions(prev => ({...prev, brightness: value[0]}))
                  }}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleEnhanceAgain}
                disabled={isEnhancing}
                className="w-full flex items-center gap-2"
              >
                {isEnhancing ? (
                  <Loader2 className="w-4 h-4 pottery-spinner" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {isEnhancing ? "Enhancing..." : "Apply Enhancements"}
              </Button>
            </div>
          </Card>

          {productData.enhancedImageUrl && (
            <Card className="craft-card p-4 lg:p-6">
              <h3 className="font-medium text-sm lg:text-base mb-4 lg:mb-6">Export Options</h3>
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary/20 bg-transparent text-xs lg:text-sm py-2 lg:py-3"
                >
                  <Instagram className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                  <span className="hidden sm:inline">Export for </span>Instagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary/20 bg-transparent text-xs lg:text-sm py-2 lg:py-3"
                >
                  <ShoppingBag className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                  <span className="hidden sm:inline">Export for </span>Amazon
                </Button>
                <Button variant="outline" size="sm" className="border-primary/20 bg-transparent sm:flex-none">
                  <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Button
              variant="outline"
              onClick={() => updateProductData({ imageUrl: "", enhancedImageUrl: "" })}
              className="flex-1 border-primary/20 bg-transparent text-sm lg:text-base py-2 lg:py-3"
            >
              Upload Different Photo
            </Button>
            <Button
              onClick={onNext}
              className="flex-1 bg-primary hover:bg-primary/90 text-sm lg:text-base py-2 lg:py-3 festival-glow"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}