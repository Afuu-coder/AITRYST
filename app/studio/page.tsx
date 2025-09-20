"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AppShell from "@/components/app-shell"
import { 
  Camera, 
  Mic, 
  FileText, 
  Calculator, 
  QrCode, 
  Calendar,
  ArrowRight,
  Languages
} from "lucide-react"
import { useRouter } from "next/navigation"

const features = [
  {
    id: "image-enhancer",
    title: "Image Enhancement",
    description: "Upload and enhance product images with AI-powered tools",
    icon: Camera,
    path: "/studio/image-enhancer",
    color: "bg-blue-500"
  },
  {
    id: "voice-recording",
    title: "Voice Recording",
    description: "Record product descriptions in your preferred language",
    icon: Mic,
    path: "/studio/voice-recording",
    color: "bg-green-500"
  },
  {
    id: "ai-content",
    title: "AI Content Studio",
    description: "Generate marketing content for different platforms",
    icon: FileText,
    path: "/studio/ai-content",
    color: "bg-purple-500"
  },
  {
    id: "smart-pricing",
    title: "Smart Pricing",
    description: "Calculate optimal pricing for your products",
    icon: Calculator,
    path: "/studio/smart-pricing",
    color: "bg-yellow-500"
  },
  {
    id: "qr-microsite",
    title: "QR Microsite",
    description: "Create instant product webpages with QR codes",
    icon: QrCode,
    path: "/studio/qr-microsite",
    color: "bg-pink-500"
  },
  {
    id: "festival-campaigns",
    title: "Festival Campaigns",
    description: "Generate festival-specific marketing campaigns",
    icon: Calendar,
    path: "/studio/festival-campaigns",
    color: "bg-red-500"
  }
]

export default function Studio() {
  const [currentLanguage, setCurrentLanguage] = useState('en') // 'en' for English, 'hi' for Hindi
  const router = useRouter()

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  return (
    <AppShell currentPage="studio" showSidebar={false}>
      {/* Language Toggle Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button 
          onClick={toggleLanguage} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
        >
          <Languages className="w-4 h-4" />
          {currentLanguage === 'en' ? 'हिं' : 'EN'}
        </Button>
      </div>

      <div className="container-craft section-spacing">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading text-craft-primary mb-4">
            {currentLanguage === 'en' ? 'Artisan Studio' : 'शिल्पकार स्टूडियो'}
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {currentLanguage === 'en' 
              ? 'All the tools you need to showcase and sell your handcrafted products' 
              : 'अपने हस्तनिर्मित उत्पादों को प्रदर्शित और बेचने के लिए आपको जो कुछ भी उपकरण चाहिए'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card 
                key={feature.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 border border-muted/50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${feature.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-heading text-craft-primary">
                      {currentLanguage === 'en' ? feature.title : getHindiTitle(feature.id)}
                    </h3>
                  </div>
                  
                  <p className="text-foreground/70 mb-6 flex-grow">
                    {currentLanguage === 'en' ? feature.description : getHindiDescription(feature.id)}
                  </p>
                  
                  <Button 
                    onClick={() => router.push(feature.path)}
                    className="w-full bg-primary hover:bg-primary/90 group"
                  >
                    {currentLanguage === 'en' ? 'Open Tool' : 'उपकरण खोलें'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5">
            <h2 className="text-2xl font-heading text-craft-primary mb-4">
              {currentLanguage === 'en' ? 'How It Works' : 'यह कैसे काम करता है'}
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
              {currentLanguage === 'en' 
                ? 'Use any tool independently to enhance your products. All tools are connected to powerful AI services that help you create professional marketing materials.' 
                : 'अपने उत्पादों को बढ़ाने के लिए किसी भी उपकरण का स्वतंत्र रूप से उपयोग करें। सभी उपकरण शक्तिशाली एआई सेवाओं से जुड़े हुए हैं जो आपको पेशेवर विपणन सामग्री बनाने में मदद करते हैं।'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm">{currentLanguage === 'en' ? 'AI-Powered' : 'एआई-संचालित'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-sm">{currentLanguage === 'en' ? 'Multilingual Support' : 'बहुभाषी समर्थन'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-terracotta rounded-full"></div>
                <span className="text-sm">{currentLanguage === 'en' ? 'Easy to Use' : 'उपयोग में आसान'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

// Helper functions for Hindi translations
function getHindiTitle(featureId: string) {
  const titles: Record<string, string> = {
    "image-enhancer": "छवि सुधार",
    "voice-recording": "आवाज रिकॉर्डिंग",
    "ai-content": "एआई सामग्री स्टूडियो",
    "smart-pricing": "स्मार्ट मूल्य निर्धारण",
    "qr-microsite": "क्यूआर माइक्रोसाइट",
    "festival-campaigns": "त्योहार अभियान"
  }
  return titles[featureId] || featureId
}

function getHindiDescription(featureId: string) {
  const descriptions: Record<string, string> = {
    "image-enhancer": "एआई-संचालित उपकरणों के साथ उत्पाद छवियों को अपलोड और बढ़ाएं",
    "voice-recording": "अपनी पसंदीदा भाषा में उत्पाद विवरण रिकॉर्ड करें",
    "ai-content": "विभिन्न प्लेटफार्मों के लिए विपणन सामग्री उत्पन्न करें",
    "smart-pricing": "अपने उत्पादों के लिए इष्टतम मूल्य निर्धारण की गणना करें",
    "qr-microsite": "क्यूआर कोड के साथ तुरंत उत्पाद वेबपेज बनाएं",
    "festival-campaigns": "त्योहार-विशिष्ट विपणन अभियान उत्पन्न करें"
  }
  return descriptions[featureId] || ""
}