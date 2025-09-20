"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Copy, Check, Loader2, MessageCircle, Share2, Languages } from "lucide-react"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"

interface QRMicrositeProps {
  productData: any
  updateProductData: (data: any) => void
  onNext: () => void
}

export function QRMicrosite({ productData, updateProductData, onNext }: QRMicrositeProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareSupported, setShareSupported] = useState(false)
  const [showSuccessTimeline, setShowSuccessTimeline] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en') // 'en' for English, 'hi' for Hindi
  const { generateProductQRCode } = useBackendContext()

  useEffect(() => {
    // Check if Web Share API is supported
    setShareSupported('share' in navigator)
    
    if (productData.pricing && !productData.microsite.url) {
      generateMicrosite()
    }
  }, [productData.pricing])

  const generateMicrosite = async () => {
    setIsGenerating(true)

    try {
      // Generate QR code using backend service
      const micrositeId = Math.random().toString(36).substring(7)
      const qrCodeUrl = await generateProductQRCode(micrositeId)
      
      if (!qrCodeUrl) {
        throw new Error("Failed to generate QR code")
      }

      const microsite = {
        url: `https://aitrystt.vercel.app/product/${micrositeId}`,
        qrCode: qrCodeUrl,
        whatsappLink: `https://wa.me/919876543210?text=Hi! I'm interested in your ${productData.content?.amazon?.title || "handcrafted product"}. Price: ₹${productData.pricing?.suggestedPrice}`,
        features: [
          "Mobile-optimized product page",
          "High-quality product images",
          "Detailed product description",
          "Direct WhatsApp ordering",
          "Secure payment options",
          "Customer reviews section",
        ],
      }

      updateProductData({ microsite })
      setShowSuccessTimeline(true)
      toast.success("QR microsite generated successfully!")
    } catch (error) {
      toast.error("Failed to generate microsite")
      console.error("Microsite generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Link copied to clipboard!")

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const shareViaWhatsApp = () => {
    const message = `Check out my handcrafted product: ${productData.microsite.url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const shareViaNative = async () => {
    if (!shareSupported) {
      shareViaWhatsApp()
      return
    }

    try {
      await navigator.share({
        title: productData.content?.amazon?.title || "Check out my handcrafted product",
        text: `I'm selling this beautiful handcrafted product. Check it out!`,
        url: productData.microsite?.url || ""
      })
    } catch (error) {
      // Fallback to WhatsApp if sharing fails or is cancelled
      shareViaWhatsApp()
    }
  }

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Creating QR Microsite</h2>
          <p className="text-foreground/70">Generating your instant product webpage...</p>
        </div>

        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-primary pottery-spinner" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Building your microsite...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                <span>Product page</span>
                <span>•</span>
                <span>QR code</span>
                <span>•</span>
                <span>WhatsApp integration</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          {currentLanguage === 'en' ? 'QR Microsite' : 'क्यूआर माइक्रोसाइट'}
        </h2>
        <p className="text-foreground/70">
          {currentLanguage === 'en' 
            ? 'Instant product webpage with QR code for easy sharing' 
            : 'आसान साझाकरण के लिए क्यूआर कोड के साथ तुरंत उत्पाद वेबपेज'}
        </p>
      </div>

      {/* Language Toggle Button */}
      <div className="flex justify-end">
        <Button 
          onClick={toggleLanguage} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Languages className="w-4 h-4" />
          {currentLanguage === 'en' ? 'HI' : 'EN'}
        </Button>
      </div>

      {/* Success Timeline Animation */}
      {showSuccessTimeline && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-primary/5 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-green-800 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              {currentLanguage === 'en' 
                ? 'Success! Your product is ready to sell' 
                : 'सफलता! आपका उत्पाद बेचने के लिए तैयार है'}
            </h3>
          </div>
          
          <div className="flex items-center justify-between relative py-2">
            {/* Timeline steps with animation */}
            <div className="flex-1 text-center relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white text-xs animate-pulse">
                📷
              </div>
              <span className="text-xs text-green-700">
                {currentLanguage === 'en' ? 'Photo' : 'फोटो'}
              </span>
            </div>
            
            <div className="flex-1 text-center relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white text-xs animate-pulse" style={{ animationDelay: '0.2s' }}>
                🎙️
              </div>
              <span className="text-xs text-green-700">
                {currentLanguage === 'en' ? 'Voice' : 'आवाज'}
              </span>
            </div>
            
            <div className="flex-1 text-center relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white text-xs animate-pulse" style={{ animationDelay: '0.4s' }}>
                ✍️
              </div>
              <span className="text-xs text-green-700">
                {currentLanguage === 'en' ? 'Content' : 'सामग्री'}
              </span>
            </div>
            
            <div className="flex-1 text-center relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white text-xs animate-pulse" style={{ animationDelay: '0.6s' }}>
                💰
              </div>
              <span className="text-xs text-green-700">
                {currentLanguage === 'en' ? 'Price' : 'कीमत'}
              </span>
            </div>
            
            <div className="flex-1 text-center relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white text-xs animate-pulse" style={{ animationDelay: '0.8s' }}>
                📱
              </div>
              <span className="text-xs text-green-700">
                {currentLanguage === 'en' ? 'QR' : 'क्यूआर'}
              </span>
            </div>
            
            <div className="flex-1 text-center relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-1 text-white text-xs animate-bounce">
                🎉
              </div>
              <span className="text-xs text-primary font-medium">
                {currentLanguage === 'en' ? 'Live!' : 'लाइव!'}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-green-700 text-center mt-3">
            {currentLanguage === 'en' 
              ? 'Your microsite is now live and ready to share with customers!' 
              : 'आपका माइक्रोसाइट अब लाइव है और ग्राहकों के साथ साझा करने के लिए तैयार है!'}
          </p>
        </Card>
      )}

      {/* QR Code */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
            <img 
              src={productData.microsite?.qrCode || ""} 
              alt="QR Code" 
              width={200} 
              height={200} 
              className="w-48 h-48"
            />
          </div>
          <div>
            <h3 className="font-medium mb-1">
              {currentLanguage === 'en' ? 'Scan to View Product' : 'उत्पाद देखने के लिए स्कैन करें'}
            </h3>
            <p className="text-sm text-foreground/60">
              {currentLanguage === 'en' 
                ? 'Customers can scan this QR code to see your product page' 
                : 'ग्राहक आपके उत्पाद पृष्ठ को देखने के लिए इस क्यूआर कोड को स्कैन कर सकते हैं'}
            </p>
          </div>
        </div>
      </Card>

      {/* Microsite URL */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {currentLanguage === 'en' ? 'Product Page URL' : 'उत्पाद पृष्ठ URL'}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-muted p-2 rounded text-sm font-mono break-all">
              {productData.microsite?.url}
            </div>
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(productData.microsite?.url || "")}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* WhatsApp Integration */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">
              {currentLanguage === 'en' ? 'WhatsApp Order Button' : 'व्हाट्सएप ऑर्डर बटन'}
            </span>
          </div>

          <p className="text-sm text-green-700">
            {currentLanguage === 'en' 
              ? 'Your microsite includes a WhatsApp order button that customers can use to contact you directly.' 
              : 'आपके माइक्रोसाइट में एक व्हाट्सएप ऑर्डर बटन शामिल है जिसका उपयोग ग्राहक आपसे सीधे संपर्क करने के लिए कर सकते हैं।'}
          </p>

          <Button
            onClick={() => window.open(productData.microsite?.whatsappLink, "_blank")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {currentLanguage === 'en' ? 'Preview WhatsApp Order' : 'व्हाट्सएप ऑर्डर का पूर्वावलोकन करें'}
          </Button>
        </div>
      </Card>

      {/* Features */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">
          {currentLanguage === 'en' ? 'Microsite Features' : 'माइक्रोसाइट सुविधाएँ'}
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {productData.microsite?.features?.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          onClick={shareViaNative} 
          variant="outline" 
          className="w-full bg-transparent"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {shareSupported 
            ? (currentLanguage === 'en' ? 'One-Tap Share' : 'वन-टैप शेयर') 
            : (currentLanguage === 'en' ? 'Share via WhatsApp' : 'व्हाट्सएप के माध्यम से साझा करें')}
        </Button>

        <Button onClick={onNext} className="w-full bg-primary hover:bg-primary/90">
          {currentLanguage === 'en' ? 'Continue to Festival Campaigns' : 'त्योहार अभियानों पर जारी रखें'}
        </Button>
      </div>
    </div>
  )
}