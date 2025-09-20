"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Loader2, Instagram, MessageCircle, ShoppingBag, Hash } from "lucide-react"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"

interface ContentGeneratorProps {
  productData: any
  updateProductData: (data: any) => void
  onNext: () => void
}

export function ContentGenerator({ productData, updateProductData, onNext }: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const { generateContent } = useBackendContext()

  useEffect(() => {
    if (productData.transcription && !productData.content.instagram) {
      generateContentFromTranscription()
    }
  }, [productData.transcription])

  const generateContentFromTranscription = async () => {
    setIsGenerating(true)

    try {
      // Generate content for different platforms
      const instagramContent = await generateContent(
        `Create an Instagram caption for a handcrafted product with this description: ${productData.transcription}`,
        productData.language === "english" ? "en" : "hi"
      )
      
      const whatsappContent = await generateContent(
        `Create a WhatsApp message for a handcrafted product with this description: ${productData.transcription}`,
        productData.language === "english" ? "en" : "hi"
      )
      
      const amazonContent = await generateContent(
        `Create an Amazon product listing for a handcrafted product with this description: ${productData.transcription}`,
        productData.language === "english" ? "en" : "hi"
      )

      const content = {
        instagram: {
          caption: instagramContent?.description || "Default Instagram caption",
          hashtags: instagramContent?.socialPost || "#HandmadeInIndia #Crafts"
        },
        whatsapp: {
          message: whatsappContent?.whatsappMessage || "Default WhatsApp message"
        },
        amazon: {
          title: amazonContent?.headline || "Default product title",
          description: amazonContent?.description || "Default product description",
          bulletPoints: [
            "High-quality handcrafted product",
            "Made with traditional techniques",
            "Supports local artisans",
            "Unique and authentic design"
          ]
        }
      }

      updateProductData({ content })
      toast.success("Content generated successfully!")
    } catch (error) {
      toast.error("Failed to generate content")
      console.error("Content generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set([...prev, itemId]))
      toast.success("Copied to clipboard!")

      // Reset copied state after 2 seconds
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

  if (isGenerating) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-heading text-craft-primary mb-2 lg:mb-4 warli-stroke">
            Generating Content
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base">AI is creating platform-specific content...</p>
        </div>

        <Card className="craft-card card-spacing">
          <div className="text-center space-y-4 lg:space-y-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto festival-glow">
              <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 text-primary pottery-spinner" />
            </div>
            <div className="space-y-2 lg:space-y-3">
              <p className="font-medium text-sm lg:text-base">Creating engaging content...</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs lg:text-sm text-muted-foreground">
                <span>Instagram captions</span>
                <span className="hidden sm:inline">•</span>
                <span>WhatsApp messages</span>
                <span className="hidden sm:inline">•</span>
                <span>Amazon listings</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-heading text-craft-primary mb-2 lg:mb-4 warli-stroke">
          Generated Content
        </h2>
        <p className="text-muted-foreground text-sm lg:text-base">AI-generated content for different platforms</p>
      </div>

      <Tabs defaultValue="instagram" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="instagram"
            className="flex items-center gap-2 text-xs lg:text-sm py-2 lg:py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-craft-primary"
          >
            <Instagram className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Instagram</span>
            <span className="sm:hidden">IG</span>
          </TabsTrigger>
          <TabsTrigger
            value="whatsapp"
            className="flex items-center gap-2 text-xs lg:text-sm py-2 lg:py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-craft-primary"
          >
            <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">WA</span>
          </TabsTrigger>
          <TabsTrigger
            value="amazon"
            className="flex items-center gap-2 text-xs lg:text-sm py-2 lg:py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-craft-primary"
          >
            <ShoppingBag className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Amazon</span>
            <span className="sm:hidden">AMZ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instagram" className="space-y-4 lg:space-y-6 mt-6">
          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-medium text-sm lg:text-base flex items-center gap-2">
                <Instagram className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                Instagram Caption
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-xs lg:text-sm bg-transparent"
                onClick={() => copyToClipboard(productData.content?.instagram?.caption || "", "instagram-caption")}
              >
                {copiedItems.has("instagram-caption") ? (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {productData.content?.instagram?.caption}
            </p>
          </Card>

          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-medium text-sm lg:text-base flex items-center gap-2">
                <Hash className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                Hashtags
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-xs lg:text-sm bg-transparent"
                onClick={() => copyToClipboard(productData.content?.instagram?.hashtags || "", "instagram-hashtags")}
              >
                {copiedItems.has("instagram-hashtags") ? (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs lg:text-sm text-blue-600 break-all">{productData.content?.instagram?.hashtags}</p>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4 lg:space-y-6 mt-6">
          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-medium text-sm lg:text-base flex items-center gap-2">
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                WhatsApp Message
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-xs lg:text-sm bg-transparent"
                onClick={() => copyToClipboard(productData.content?.whatsapp?.message || "", "whatsapp-message")}
              >
                {copiedItems.has("whatsapp-message") ? (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Button>
            </div>
            <div className="bg-peepal-green/10 border border-peepal-green/20 rounded-lg p-3 lg:p-4">
              <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-line">
                {productData.content?.whatsapp?.message}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="amazon" className="space-y-4 lg:space-y-6 mt-6">
          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-medium text-sm lg:text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />
                Product Title
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-xs lg:text-sm bg-transparent"
                onClick={() => copyToClipboard(productData.content?.amazon?.title || "", "amazon-title")}
              >
                {copiedItems.has("amazon-title") ? (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs lg:text-sm font-medium text-muted-foreground">{productData.content?.amazon?.title}</p>
          </Card>

          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-medium text-sm lg:text-base">Product Description</h3>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-xs lg:text-sm bg-transparent"
                onClick={() => copyToClipboard(productData.content?.amazon?.description || "", "amazon-description")}
              >
                {copiedItems.has("amazon-description") ? (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {productData.content?.amazon?.description}
            </p>
          </Card>

          <Card className="craft-card p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-medium text-sm lg:text-base">Bullet Points</h3>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 text-xs lg:text-sm bg-transparent"
                onClick={() =>
                  copyToClipboard(productData.content?.amazon?.bulletPoints?.join("\n") || "", "amazon-bullets")
                }
              >
                {copiedItems.has("amazon-bullets") ? (
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Button>
            </div>
            <ul className="text-xs lg:text-sm space-y-1 lg:space-y-2">
              {productData.content?.amazon?.bulletPoints?.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-craft-primary mt-1">•</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>

      <Button
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 lg:py-3 text-sm lg:text-base festival-glow"
      >
        Continue to Pricing Calculator
      </Button>
    </div>
  )
}