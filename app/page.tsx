"use client"
import AppShell from "@/components/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Camera,
  Mic,
  FileText,
  Calculator,
  QrCode,
  Calendar,
  Play,
  Wand2,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Palette,
  Sparkles,
  Gift,
  Languages
} from "lucide-react"
import { useState } from "react"
import { LanguageToggle } from "@/components/language-toggle"

export default function ArtisanHomepage() {
  const [currentLanguage, setCurrentLanguage] = useState('en') // 'en' for English, 'hi' for Hindi

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  return (
    <AppShell currentPage="home">
      <section className="section-spacing festival-bg-gradient">
        <div className="container-craft">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div className="space-y-4 lg:space-y-6">
                <div className="inline-flex items-center gap-2 bg-diwali-gold text-charcoal px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium festival-badge">
                  <Gift className="w-3 h-3 lg:w-4 lg:h-4" />
                  {currentLanguage === 'en' ? 'Festival Season Special - Diwali Edition' : 'त्योहार मौसम विशेष - दिवाली संस्करण'}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-heading leading-tight text-balance">
                  {currentLanguage === 'en' ? (
                    <>
                      Showcase Your <span className="text-diwali-gold">Handcrafted</span>
                      <br />
                      Products with AI
                    </>
                  ) : (
                    <>
                      अपने <span className="text-diwali-gold">हस्तनिर्मित</span> उत्पादों
                      <br />
                      को AI के साथ प्रदर्शित करें
                    </>
                  )}
                </h1>

                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                  {currentLanguage === 'en' 
                    ? 'Transform your beautiful pottery, textiles, jewelry, and handicrafts into compelling stories. Generate multilingual descriptions, professional photos, and marketing materials that honor your artisan heritage while reaching customers worldwide.'
                    : 'अपने सुंदर मिट्टी के बर्तन, कपड़े, गहने और हस्तशिल्प को प्रभावशाली कहानियों में बदलें। बहुभाषी विवरण, पेशेवर तस्वीरें और विपणन सामग्री तैयार करें जो आपकी शिल्पकार विरासत का सम्मान करते हुए दुनिया भर के ग्राहकों तक पहुंचती हैं।'}
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-diwali-gold hover:bg-diwali-gold/90 text-charcoal font-semibold text-lg px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                  onClick={() => (window.location.href = "/studio")}
                >
                  <Wand2 className="w-6 h-6 mr-3" />
                  {currentLanguage === 'en' ? 'Try Studio Free' : 'स्टूडियो मुफ्त में आज़माएं'}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-2 lg:pt-4">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-diwali-gold" />
                  <span className="text-xs lg:text-sm text-muted-foreground">
                    {currentLanguage === 'en' ? '1,000+ artisans' : '1,000+ शिल्पकार'}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-diwali-gold" />
                  <span className="text-xs lg:text-sm text-muted-foreground">
                    {currentLanguage === 'en' ? '300% sales boost' : '300% बिक्री वृद्धि'}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 text-marigold" />
                  <span className="text-xs lg:text-sm text-muted-foreground">
                    {currentLanguage === 'en' ? '4.9/5 rating' : '4.9/5 रेटिंग'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="space-y-3 lg:space-y-4">
                  <img
                    src="/enhanced-pottery-vase-with-better-lighting-and-bac.jpg"
                    alt={currentLanguage === 'en' ? "Beautiful handcrafted pottery vase with enhanced lighting" : "सुंदर हस्तनिर्मित मिट्टी का बर्तन बेहतर रोशनी के साथ"}
                    className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-xl shadow-lg float-animation festival-border"
                  />
                  <Card className="p-3 lg:p-4 craft-card festival-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-terracotta" />
                      <span className="text-xs lg:text-sm font-medium">
                        {currentLanguage === 'en' ? 'Pottery' : 'मिट्टी के बर्तन'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentLanguage === 'en' ? 'Handcrafted ceramic vase with traditional patterns' : 'पारंपरिक पैटर्न के साथ हस्तनिर्मित सीरेमिक बर्तन'}
                    </p>
                  </Card>
                </div>
                <div className="space-y-3 lg:space-y-4 mt-6 lg:mt-8">
                  <Card className="p-3 lg:p-4 craft-card festival-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo" />
                      <span className="text-xs lg:text-sm font-medium">
                        {currentLanguage === 'en' ? 'Textiles' : 'कपड़े'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentLanguage === 'en' ? 'Block-printed fabrics with natural dyes' : 'प्राकृतिक रंगों के साथ ब्लॉक-प्रिंटेड कपड़े'}
                    </p>
                  </Card>
                  <img
                    src="/artisan-uploading-product-photos.jpg"
                    alt={currentLanguage === 'en' ? "Artisan showcasing handmade jewelry and crafts" : "शिल्पकार हस्तनिर्मित गहनों और शिल्पों को प्रदर्शित कर रहे हैं"}
                    className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-xl shadow-lg float-animation festival-border"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl diwali-pattern opacity-20 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Toggle Button */}
      <div className="fixed top-20 right-4 z-50">
        <LanguageToggle 
          currentLanguage={currentLanguage}
          onToggle={toggleLanguage}
        />
      </div>

      <section className="section-spacing bg-gradient-to-br from-indigo/5 via-marigold/5 to-terracotta/5">
        <div className="container-craft">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading mb-4 lg:mb-6 text-balance">
              {currentLanguage === 'en' ? (
                <>
                  AI-Powered <span className="text-craft-primary">Studio</span>
                </>
              ) : (
                <>
                  AI-संचालित <span className="text-craft-primary">स्टूडियो</span>
                </>
              )}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
              {currentLanguage === 'en' 
                ? 'Everything you need to showcase and sell your handcrafted products with professional marketing materials'
                : 'पेशेवर विपणन सामग्री के साथ अपने हस्तनिर्मित उत्पादों को प्रदर्शित और बेचने के लिए आपको जो कुछ भी चाहिए'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Camera,
                title: currentLanguage === 'en' ? "Smart Image Enhancement" : "स्मार्ट छवि सुधार",
                description: currentLanguage === 'en' 
                  ? "AI transforms your product photos with perfect lighting, backgrounds, and professional styling"
                  : "AI आपकी उत्पाद तस्वीरों को सही रोशनी, पृष्ठभूमि और पेशेवर स्टाइलिंग के साथ बदल देता है",
                color: "terracotta",
              },
              {
                icon: Mic,
                title: currentLanguage === 'en' ? "Voice-to-Content Magic" : "आवाज से सामग्री जादू",
                description: currentLanguage === 'en' 
                  ? "Speak in Hindi, Bengali, Telugu, or English - AI creates compelling product stories"
                  : "हिंदी, बंगाली, तेलुगू या अंग्रेजी में बोलें - AI प्रभावशाली उत्पाद कहानियाँ बनाता है",
                color: "indigo",
              },
              {
                icon: FileText,
                title: currentLanguage === 'en' ? "Platform-Ready Content" : "प्लेटफॉर्म-तैयार सामग्री",
                description: currentLanguage === 'en' 
                  ? "Generate optimized descriptions for Instagram, WhatsApp Business, Amazon, and more"
                  : "Instagram, WhatsApp Business, Amazon और अधिक के लिए अनुकूलित विवरण तैयार करें",
                color: "marigold",
              },
              {
                icon: Calculator,
                title: currentLanguage === 'en' ? "Smart Pricing Calculator" : "स्मार्ट मूल्य निर्धारण कैलकुलेटर",
                description: currentLanguage === 'en' 
                  ? "AI analyzes materials, time, and market rates to suggest fair, profitable pricing"
                  : "AI सामग्री, समय और बाजार दरों का विश्लेषण करके निष्पक्ष, लाभदायक मूल्य निर्धारण का सुझाव देता है",
                color: "peepal-green",
              },
              {
                icon: QrCode,
                title: currentLanguage === 'en' ? "Instant QR Microsites" : "तुरंत QR माइक्रोसाइट्स",
                description: currentLanguage === 'en' 
                  ? "Create beautiful product pages with WhatsApp ordering in seconds"
                  : "सेकंडों में WhatsApp ऑर्डरिंग के साथ सुंदर उत्पाद पृष्ठ बनाएं",
                color: "terracotta",
              },
              {
                icon: Calendar,
                title: currentLanguage === 'en' ? "Festival Campaign Generator" : "त्योहार अभियान जेनरेटर",
                description: currentLanguage === 'en' 
                  ? "Seasonal marketing content for Diwali, Holi, Eid, and regional celebrations"
                  : "दिवाली, होली, ईद और क्षेत्रीय पर्वों के लिए मौसमी विपणन सामग्री",
                color: "indigo",
              },
            ].map((feature, index) => (
              <Card key={index} className="craft-card card-spacing group festival-feature-card">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                </div>
                <h3 className="text-lg lg:text-xl font-heading mb-3 lg:mb-4 warli-stroke">{feature.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-pretty">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-craft">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading mb-4 lg:mb-6 text-balance">
              {currentLanguage === 'en' ? (
                <>
                  How It <span className="text-craft-primary">Works</span>
                </>
              ) : (
                <>
                  यह कैसे <span className="text-craft-primary">काम करता है</span>
                </>
              )}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
              {currentLanguage === 'en' 
                ? 'Three simple steps to transform your craft showcase and reach customers worldwide'
                : 'आपके शिल्प प्रदर्शन को बदलने और दुनिया भर के ग्राहकों तक पहुंचने के लिए तीन सरल चरण'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "1",
                title: currentLanguage === 'en' ? "Upload or Record" : "अपलोड या रिकॉर्ड करें",
                description: currentLanguage === 'en' 
                  ? "Add photos of your handcrafted items or simply describe them using voice recording in your preferred language."
                  : "अपने हस्तनिर्मित वस्तुओं की तस्वीरें जोड़ें या बस अपनी पसंदीदा भाषा में वॉयस रिकॉर्डिंग का उपयोग करके उनका वर्णन करें।",
                image: "/artisan-uploading-product-photos.jpg",
                action: currentLanguage === 'en' ? "Upload & Describe" : "अपलोड और वर्णन करें",
              },
              {
                step: "2",
                title: currentLanguage === 'en' ? "AI Magic Happens" : "AI जादू होता है",
                description: currentLanguage === 'en' 
                  ? "Our AI analyzes your products, enhances images, and generates compelling multilingual content automatically."
                  : "हमारा AI आपके उत्पादों का विश्लेषण करता है, छवियों को बढ़ाता है, और स्वचालित रूप साथ प्रभावशाली बहुभाषी सामग्री उत्पन्न करता है।",
                image: "/ai-processing-artisan-products-with-magical-effect.jpg",
                action: currentLanguage === 'en' ? "AI Processing" : "AI प्रसंस्करण",
              },
              {
                step: "3",
                title: currentLanguage === 'en' ? "Publish & Share" : "प्रकाशित और साझा करें",
                description: currentLanguage === 'en' 
                  ? "Use generated content across platforms, create QR microsites, and start selling with professional marketing materials."
                  : "उत्पन्न सामग्री का उपयोग प्लेटफार्मों में करें, QR माइक्रोसाइट्स बनाएं, और पेशेवर विपणन सामग्री के साथ बेचना शुरू करें।",
                image: "/social-media-sharing-handcrafted-products.jpg",
                action: currentLanguage === 'en' ? "Share & Sell" : "साझा और बेचें",
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4 lg:space-y-6 group">
                <div className="relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 lg:h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow festival-border"
                  />
                  <div className="absolute -top-4 lg:-top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-diwali-gold text-charcoal rounded-2xl flex items-center justify-center text-lg lg:text-2xl font-bold shadow-lg festival-glow">
                      {step.step}
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl craft-texture opacity-10 pointer-events-none"></div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-xl lg:text-2xl font-heading warli-stroke">{step.title}</h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-pretty px-2">
                    {step.description}
                  </p>
                  <Button variant="outline" size="sm" className="border-primary/20 bg-transparent">
                    {step.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gradient-to-br from-indigo/5 via-marigold/5 to-terracotta/5">
        <div className="container-craft">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading mb-4 lg:mb-6 text-balance">
              {currentLanguage === 'en' ? (
                <>
                  Festival <span className="text-craft-primary">Campaigns</span>
                </>
              ) : (
                <>
                  <span className="text-craft-primary">त्योहार</span> अभियान
                </>
              )}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
              {currentLanguage === 'en' 
                ? 'Create seasonal marketing content that resonates with your customers during special occasions'
                : 'विशेष अवसरों के दौरान अपने ग्राहकों के साथ प्रतिध्वनित होने वाली मौसमी विपणन सामग्री बनाएं'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Calendar,
                title: currentLanguage === 'en' ? "Diwali Campaigns" : "दिवाली अभियान",
                description: currentLanguage === 'en' 
                  ? "Create festive marketing content for Diwali celebrations with traditional Indian aesthetics"
                  : "पारंपरिक भारतीय सौंदर्यशास्त्र के साथ दिवाली उत्सव के लिए त्योहारी विपणन सामग्री बनाएं",
                color: "diwali-gold",
              },
              {
                icon: Calendar,
                title: currentLanguage === 'en' ? "Holi Campaigns" : "होली अभियान",
                description: currentLanguage === 'en' 
                  ? "Vibrant marketing content for Holi festival with colorful and joyful themes"
                  : "रंगीन और आनंदमय थीम के साथ होली त्योहार के लिए जीवंत विपणन सामग्री",
                color: "marigold",
              },
              {
                icon: Calendar,
                title: currentLanguage === 'en' ? "Regional Festivals" : "क्षेत्रीय त्योहार",
                description: currentLanguage === 'en' 
                  ? "Customized campaigns for regional festivals like Eid, Durga Puja, and local celebrations"
                  : "ईद, दुर्गा पूजा और स्थानीय उत्सवों जैसे क्षेत्रीय त्योहारों के लिए अनुकूलित अभियान",
                color: "indigo",
              },
            ].map((campaign, index) => (
              <Card key={index} className="craft-card card-spacing group festival-feature-card">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
                  <campaign.icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                </div>
                <h3 className="text-lg lg:text-xl font-heading mb-3 lg:mb-4 warli-stroke">{campaign.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-pretty">
                  {campaign.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-craft">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading text-balance">
                  {currentLanguage === 'en' ? (
                    <>
                      Speak Your <span className="text-craft-primary">Language</span>
                    </>
                  ) : (
                    <>
                      अपनी <span className="text-craft-primary">भाषा</span> बोलें
                    </>
                  )}
                </h2>

                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                  {currentLanguage === 'en' 
                    ? "Express yourself naturally in Hindi, Bengali, Telugu, or English. Our AI understands cultural context and creates authentic content that connects with your audience."
                    : "हिंदी, बंगाली, तेलुगू या अंग्रेजी में प्राकृतिक रूप से अपने आपको व्यक्त करें। हमारा AI सांस्कृतिक संदर्भ को समझता है और ऐसी प्रामाणिक सामग्री बनाता है जो आपके दर्शकों से जुड़ती है।"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { lang: "हिंदी", name: currentLanguage === 'en' ? "Hindi" : "हिंदी", speakers: currentLanguage === 'en' ? "500M+" : "50 करोड़+" },
                  { lang: "বাংলা", name: currentLanguage === 'en' ? "Bengali" : "বাংলা", speakers: currentLanguage === 'en' ? "300M+" : "30 करोड़+" },
                  { lang: "తెలుగు", name: currentLanguage === 'en' ? "Telugu" : "తెలుగు", speakers: currentLanguage === 'en' ? "80M+" : "8 करोड़+" },
                  { lang: "English", name: currentLanguage === 'en' ? "English" : "अंग्रेज़ी", speakers: currentLanguage === 'en' ? "Global" : "वैश्विक" },
                ].map((language, index) => (
                  <Card key={index} className="craft-card p-3 lg:p-4 text-center language-card">
                    <div className="text-xl lg:text-2xl font-heading mb-2">{language.lang}</div>
                    <div className="text-xs lg:text-sm text-muted-foreground">{language.name}</div>
                    <div className="text-xs text-muted-foreground">{language.speakers} {currentLanguage === 'en' ? 'speakers' : 'वक्ता'}</div>
                  </Card>
                ))}
              </div>

              <Button size="lg" variant="outline" className="border-primary/20 bg-transparent w-full sm:w-auto">
                <Mic className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                {currentLanguage === 'en' ? 'Try Voice Recording' : 'वॉयस रिकॉर्डिंग आज़माएं'}
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-900 via-orange-600 to-emerald-500 rounded-3xl flex items-center justify-center p-8 relative overflow-hidden">
                {/* Floating speech bubbles */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float">
                  <span className="text-indigo-900 font-bold text-sm">नमस्ते</span>
                </div>
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                  <span className="text-emerald-500 font-bold text-sm">Hello</span>
                </div>
                <div className="absolute bottom-8 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <span className="text-orange-600 font-bold text-sm">హలో</span>
                </div>
                <div className="absolute bottom-6 right-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                  <span className="text-white font-bold text-sm">হ্যালো</span>
                </div>
                
                {/* Minimal AI circuit pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-white rounded-sm"></div>
                  <div className="absolute top-1/3 right-1/3 w-8 h-8 border-2 border-white rounded-sm"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-12 h-12 border-2 border-white rounded-sm"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-10 h-10 border-2 border-white rounded-sm"></div>
                  {/* Connecting lines */}
                  <div className="absolute top-1/4 left-1/4 w-24 h-0.5 bg-white ml-16 mt-8"></div>
                  <div className="absolute top-1/3 right-1/3 w-0.5 h-16 bg-white mr-4 mb-8"></div>
                </div>
                
                {/* Central tagline */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl lg:text-3xl font-heading text-white drop-shadow-lg">
                    {currentLanguage === 'en' ? 'Speak Your Language' : 'अपनी भाषा बोलें'}
                  </h3>
                  <p className="text-white/90 mt-2 text-sm lg:text-base drop-shadow-md">
                    {currentLanguage === 'en' ? 'AI understands your cultural context' : 'AI आपके सांस्कृतिक संदर्भ को समझता है'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gradient-to-r from-diwali-gold to-marigold text-charcoal">
        <div className="container-craft text-center">

        </div>
      </section>
    </AppShell>
  )
}